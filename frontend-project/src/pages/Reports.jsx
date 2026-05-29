import { useEffect, useState } from 'react';
import api from '../api';

export default function Reports() {
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [rows, setRows] = useState([]);

  const load = (d) => api.get('/reports/daily', { params: { date: d } }).then(r => setRows(r.data.rows));
  useEffect(() => { load(date); }, []);

  const onChange = (d) => { setDate(d); load(d); };

  const total = rows.reduce((s,r)=>s+Number(r.AmountPaid),0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Daily Report</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">Date:</label>
        <input type="date" value={date} onChange={e=>onChange(e.target.value)} className="border rounded p-2" />
        <button onClick={()=>window.print()} className="ml-auto px-3 py-2 bg-slate-700 text-white rounded">Print</button>
      </div>
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-2 text-left">PlateNumber</th>
            <th className="p-2 text-left">PackageName</th>
            <th className="p-2 text-left">PackageDescription</th>
            <th className="p-2 text-left">AmountPaid</th>
            <th className="p-2 text-left">PaymentDate</th>
          </tr></thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{r.PlateNumber}</td>
                <td className="p-2">{r.PackageName}</td>
                <td className="p-2">{r.PackageDescription}</td>
                <td className="p-2">{Number(r.AmountPaid).toLocaleString()}</td>
                <td className="p-2">{String(r.PaymentDate).slice(0,10)}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan="5" className="p-4 text-center text-slate-500">No payments for this date</td></tr>}
          </tbody>
          {rows.length > 0 && (
            <tfoot><tr className="border-t bg-slate-50 font-semibold">
              <td className="p-2" colSpan="3">Total</td>
              <td className="p-2">{total.toLocaleString()} RWF</td>
              <td></td>
            </tr></tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
