import { useEffect, useState } from 'react';
import api from '../api';

const today = () => new Date().toISOString().slice(0,10);
const empty = { RecordNumber: '', AmountPaid: '', PaymentDate: today() };

export default function Payments() {
  const [rows, setRows] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(empty);
  const [bill, setBill] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/payments').then(r => setRows(r.data));
  useEffect(() => {
    load();
    api.get('/servicepackages').then(r => setRecords(r.data));
  }, []);

  const onRecord = (rn) => {
    const rec = records.find(r => String(r.RecordNumber) === String(rn));
    setForm({ ...form, RecordNumber: rn, AmountPaid: rec ? rec.PackagePrice : '' });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setBill(null);
    try {
      const r = await api.post('/payments', form);
      setBill(r.data.bill);
      setForm(empty);
      load();
    } catch (e) { setMsg(e.response?.data?.error || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Payment</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-3">
        <select required className="border rounded p-2"
          value={form.RecordNumber} onChange={e=>onRecord(e.target.value)}>
          <option value="">-- Service Record --</option>
          {records.map(r => (
            <option key={r.RecordNumber} value={r.RecordNumber}>
              #{r.RecordNumber} — {r.PlateNumber} — {r.PackageName}
            </option>
          ))}
        </select>
        <input required type="number" placeholder="Amount Paid" className="border rounded p-2"
          value={form.AmountPaid} onChange={e=>setForm({...form,AmountPaid:e.target.value})} />
        <input required type="date" className="border rounded p-2"
          value={form.PaymentDate} onChange={e=>setForm({...form,PaymentDate:e.target.value})} />
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Pay & Generate Bill</button>
        {msg && <div className="md:col-span-4 text-sm text-red-600">{msg}</div>}
      </form>

      {bill && (
        <div className="bg-white p-6 rounded shadow border-2 border-blue-600 max-w-md">
          <h2 className="text-xl font-bold text-blue-700 mb-2">SmartPark — Bill</h2>
          <div className="text-sm space-y-1">
            <div><b>Receipt #:</b> {bill.PaymentNumber}</div>
            <div><b>Date:</b> {String(bill.PaymentDate).slice(0,10)}</div>
            <hr className="my-2" />
            <div><b>Driver:</b> {bill.DriverName} ({bill.PhoneNumber})</div>
            <div><b>Plate:</b> {bill.PlateNumber} — {bill.CarType} / {bill.CarSize}</div>
            <div><b>Service:</b> {bill.PackageName} — {bill.PackageDescription}</div>
            <hr className="my-2" />
            <div className="text-lg"><b>Amount Paid:</b> {Number(bill.AmountPaid).toLocaleString()} RWF</div>
          </div>
          <button onClick={()=>window.print()} className="mt-4 px-4 py-2 bg-slate-700 text-white rounded">Print</button>
        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-2 text-left">Payment#</th><th className="p-2 text-left">Record#</th>
            <th className="p-2 text-left">Plate</th><th className="p-2 text-left">Package</th>
            <th className="p-2 text-left">Amount</th><th className="p-2 text-left">Date</th>
          </tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.PaymentNumber} className="border-t">
                <td className="p-2">{p.PaymentNumber}</td>
                <td className="p-2">{p.RecordNumber}</td>
                <td className="p-2">{p.PlateNumber}</td>
                <td className="p-2">{p.PackageName}</td>
                <td className="p-2">{Number(p.AmountPaid).toLocaleString()}</td>
                <td className="p-2">{String(p.PaymentDate).slice(0,10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
