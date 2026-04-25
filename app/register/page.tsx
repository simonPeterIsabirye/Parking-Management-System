import db from '@/lib/db';
import { redirect } from 'next/navigation';

async function registerVehicle(formData: FormData) {
  'use server';
  const driver = formData.get('driver_name') as string;
  const plate = formData.get('number_plate') as string;
  const model = formData.get('vehicle_model') as string;
  const color = formData.get('vehicle_color') as string;
  const phone = formData.get('phone_number') as string;
  const parkingType = formData.get('parking_type') as string;

  db.prepare(`
    INSERT INTO vehicle_entries (driver_name, number_plate, vehicle_model, vehicle_color, phone_number, parking_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(driver, plate, model, color, phone, parkingType);

  redirect('/');
}

export default function RegisterVehicle() {
  return (
    <div className="bg-[#16161E] rounded-3xl p-8 border border-slate-800">
      <h1 className="text-3xl font-black mb-6">Register Arrival</h1>
      <form action={registerVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="driver_name" placeholder="Driver Name" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <input name="number_plate" placeholder="Number Plate (e.g., UAX 123A)" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <input name="vehicle_model" placeholder="Model" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" />
        <input name="vehicle_color" placeholder="Color" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" />
        <input name="phone_number" placeholder="Phone Number" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" />
        <select name="parking_type" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white text-slate-400">
          <option value="hourly">Hourly (UGX 2000 / 2h)</option>
          <option value="daily">Daily (UGX 20000 / day)</option>
        </select>
        <button type="submit" className="col-span-full bg-blue-600 text-white rounded-xl p-4 font-bold hover:bg-blue-500">Register</button>
      </form>
    </div>
  );
}
