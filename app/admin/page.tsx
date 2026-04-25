import db from '@/lib/db';
import { redirect } from 'next/navigation';

export default function AdminDashboard() {
  const users = db.prepare('SELECT * FROM users').all() as any[];
  const parkingTx = db.prepare('SELECT p.*, v.number_plate FROM parking_transactions p JOIN vehicle_entries v ON p.vehicle_id = v.id').all() as any[];
  const tyreTx = db.prepare('SELECT * FROM tyre_service_transactions').all() as any[];
  const batteryTx = db.prepare('SELECT * FROM battery_transactions').all() as any[];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black">Admin Dashboard</h1>
      
      <section className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Parking Transactions</h2>
        <table className="w-full text-left">
            <thead><tr className="text-slate-500 text-sm"><th className="pb-2">Receipt</th><th className="pb-2">Plate</th><th className="pb-2">Amount</th></tr></thead>
            <tbody>{parkingTx.map(tx => <tr key={tx.id} className="border-t border-slate-800"><td className="py-2">{tx.receipt_number}</td><td className="py-2">{tx.number_plate}</td><td className="py-2">UGX {tx.amount}</td></tr>)}</tbody>
        </table>
      </section>

      <section className="grid grid-cols-2 gap-8">
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Tyre Transactions</h2>
            <table className="w-full text-left">
                <thead><tr className="text-slate-500 text-sm"><th className="pb-2">Customer</th><th className="pb-2">Amount</th></tr></thead>
                <tbody>{tyreTx.map(tx => <tr key={tx.id} className="border-t border-slate-800"><td className="py-2">{tx.customer_name}</td><td className="py-2">UGX {tx.amount}</td></tr>)}</tbody>
            </table>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Battery Transactions</h2>
            <table className="w-full text-left">
                <thead><tr className="text-slate-500 text-sm"><th className="pb-2">Customer</th><th className="pb-2">Amount</th></tr></thead>
                <tbody>{batteryTx.map(tx => <tr key={tx.id} className="border-t border-slate-800"><td className="py-2">{tx.customer_name}</td><td className="py-2">UGX {tx.amount}</td></tr>)}</tbody>
            </table>
        </div>
      </section>
    </div>
  );
}
