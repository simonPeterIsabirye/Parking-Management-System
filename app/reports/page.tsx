import db from '@/lib/db';

export default function Reports() {
  const signOuts = db.prepare('SELECT s.*, v.number_plate FROM vehicle_sign_outs s JOIN vehicle_entries v ON s.vehicle_id = v.id').all() as any[];
  const parkingTotal = (db.prepare('SELECT SUM(amount) as total FROM parking_transactions').get() as any)?.total || 0;
  const tyreTotal = (db.prepare('SELECT SUM(amount) as total FROM tyre_service_transactions').get() as any)?.total || 0;
  const batteryTotal = (db.prepare('SELECT SUM(amount) as total FROM battery_transactions').get() as any)?.total || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Daily Report</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500">Parking</h3>
          <strong className="text-2xl text-emerald-400">UGX {parkingTotal}</strong>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500">Tyre</h3>
          <strong className="text-2xl text-emerald-400">UGX {tyreTotal}</strong>
        </div>
        <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase text-slate-500">Battery</h3>
          <strong className="text-2xl text-emerald-400">UGX {batteryTotal}</strong>
        </div>
      </div>
      <div className="bg-[#16161E] p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-bold mb-4">Signed-Out Vehicles</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="text-slate-500 text-sm">
              <th className="pb-4">Plate</th>
              <th className="pb-4">Receiver</th>
              <th className="pb-4">Time</th>
            </tr>
          </thead>
          <tbody>
            {signOuts.map((s: any) => (
              <tr key={s.id} className="border-t border-slate-800">
                <td className="py-4">{s.number_plate}</td>
                <td className="py-4">{s.receiver_name}</td>
                <td className="py-4">{s.sign_out_time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
