import db from '@/lib/db';
import { redirect } from 'next/navigation';

async function recordService(formData: FormData) {
  'use server';
  const type = formData.get('type') as 'tyre' | 'battery';
  const customer = formData.get('customer_name') as string;
  const name = formData.get('item_name') as string;
  const amount = parseFloat(formData.get('amount') as string);

  if (type === 'tyre') {
    db.prepare('INSERT INTO tyre_service_transactions (customer_name, tyre_model, amount) VALUES (?, ?, ?)').run(customer, name, amount);
  } else {
    db.prepare('INSERT INTO battery_transactions (customer_name, battery_name, amount) VALUES (?, ?, ?)').run(customer, name, amount);
  }

  redirect('/');
}

export default async function RecordService({ params }: { params: Promise<{ type: 'tyre' | 'battery' }> }) {
  const { type } = await params;
  const isTyre = type === 'tyre';
  
  return (
    <div className="bg-[#16161E] rounded-3xl p-8 border border-slate-800">
      <h1 className="text-3xl font-black mb-6 capitalize">{type} Service Transaction</h1>
      <form action={recordService} className="grid grid-cols-1 gap-6">
        <input type="hidden" name="type" value={type} />
        <input name="customer_name" placeholder="Customer Name" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <input name="item_name" placeholder={isTyre ? "Tyre Model" : "Battery Name"} className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <input type="number" name="amount" placeholder="Amount (UGX)" className="bg-[#1C1C24] border border-slate-700 rounded-xl p-4 text-white" required />
        <button type="submit" className="bg-blue-600 text-white rounded-xl p-4 font-bold hover:bg-blue-500">Record Transaction</button>
      </form>
    </div>
  );
}
