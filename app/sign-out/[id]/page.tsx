import db from '@/lib/db';
import { redirect } from 'next/navigation';

async function performSignOut(formData: FormData) {
  'use server';
  const vehicleId = parseInt(formData.get('vehicle_id') as string);
  const receiver = formData.get('receiver_name') as string;
  const phoneNumber = formData.get('phone_number') as string;
  const amount = parseFloat(formData.get('amount') as string);
  const receipt = `REC-${Date.now()}`;

  const signOut = db.transaction(() => {
    db.prepare('UPDATE vehicle_entries SET is_signed_out = 1 WHERE id = ?').run(vehicleId);
    db.prepare('INSERT INTO vehicle_sign_outs (vehicle_id, receipt_number, receiver_name, phone_number) VALUES (?, ?, ?, ?)').run(vehicleId, receipt, receiver, phoneNumber);
    db.prepare('INSERT INTO parking_transactions (receipt_number, vehicle_id, amount) VALUES (?, ?, ?)').run(receipt, vehicleId, amount);
  });

  signOut();
  redirect('/');
}

export default async function SignOutVehicle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = db.prepare('SELECT * FROM vehicle_entries WHERE id = ?').get(id) as any;
  
  if (!vehicle || vehicle.is_signed_out) redirect('/');

  const startTime = new Date(vehicle.arrival_time).getTime();
  const now = new Date().getTime();
  const hours = (now - startTime) / (1000 * 60 * 60);
  
  let fee = 0;
  if (vehicle.parking_type === 'daily') {
    const days = Math.max(1, Math.ceil(hours / 24));
    fee = days * 20000;
  } else {
    const intervals = Math.max(1, Math.ceil(hours / 2));
    fee = intervals * 2000;
  }

  return (
    <div className="bg-[#16161E] rounded-3xl p-8 border border-slate-800">
      <h1 className="text-3xl font-black mb-6">Sign Out {vehicle.number_plate}</h1>
      <p className="mb-4">Calculated Fee: <strong className="text-emerald-400 text-xl">UGX {fee}</strong> ({vehicle.parking_type})</p>
      <form action={performSignOut} className="grid grid-cols-1 gap-6">
        <input type="hidden" name="vehicle_id" value={vehicle.id} />
        <input type="hidden" name="amount" value={fee} />
        <input name="receiver_name" placeholder="Receiver Name" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <input name="phone_number" placeholder="Receiver Phone" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" />
        <button type="submit" className="bg-emerald-600 text-white rounded-xl p-4 font-bold hover:bg-emerald-500">Confirm & Print Receipt</button>
      </form>
      <script dangerouslySetInnerHTML={{__html: `
        document.querySelector('form').addEventListener('submit', () => {
          setTimeout(() => window.print(), 1000);
        });
      `}} />
    </div>
  );
}
