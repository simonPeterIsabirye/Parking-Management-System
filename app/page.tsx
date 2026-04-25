import db from '@/lib/db';
import Link from 'next/link';

export default function Dashboard() {
  const activeCount: number = (db.prepare('SELECT COUNT(*) as count FROM vehicle_entries WHERE is_signed_out = 0').get() as {count: number}).count;
  const parkingTotal: number = ((db.prepare('SELECT SUM(amount) as total FROM parking_transactions').get() as {total: number | null})?.total || 0);
  const tyreTotal: number = ((db.prepare('SELECT SUM(amount) as total FROM tyre_service_transactions').get() as {total: number | null})?.total || 0);
  const batteryTotal: number = ((db.prepare('SELECT SUM(amount) as total FROM battery_transactions').get() as {total: number | null})?.total || 0);
  
  const activeVehicles = db.prepare('SELECT * FROM vehicle_entries WHERE is_signed_out = 0').all() as any[];

  return (
    <div className="space-y-6">
      <section className="bg-[#16161E] rounded-3xl p-8 border border-slate-800">
        <h1 className="text-3xl font-black tracking-tight">Operations Dashboard</h1>
        <p className="text-slate-500 mt-2">Monitor parking activity, section revenue, and daily movement.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Active Vehicles</h3>
          <strong className="text-4xl mt-3 block">{activeCount}</strong>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Parking Revenue</h3>
          <strong className="text-4xl mt-3 block text-emerald-400">UGX {parkingTotal}</strong>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Tyre Revenue</h3>
          <strong className="text-4xl mt-3 block text-emerald-400">UGX {tyreTotal}</strong>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Battery Revenue</h3>
          <strong className="text-4xl mt-3 block text-emerald-400">UGX {batteryTotal}</strong>
        </div>
      </section>
      
      <section className="bg-[#16161E] rounded-3xl p-8 border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Active Vehicles</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-sm">
              <th className="pb-4">Plate</th>
              <th className="pb-4">Driver</th>
              <th className="pb-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeVehicles.map((v: any) => (
              <tr key={v.id} className="border-t border-slate-800">
                <td className="py-4">{v.number_plate}</td>
                <td className="py-4">{v.driver_name}</td>
                <td className="py-4">
                  <Link href={`/sign-out/${v.id}`} className="bg-emerald-600 text-white rounded-lg px-3 py-1 text-sm font-bold hover:bg-emerald-500">Sign Out</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <Link href="/register" className="inline-flex items-center justify-center bg-blue-600 text-white rounded-xl px-6 py-3 font-bold hover:bg-blue-500 transition-all">
          Register New Vehicle
        </Link>
      </section>
    </div>
  );
}
