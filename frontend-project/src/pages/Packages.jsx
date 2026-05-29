import { useEffect, useState } from 'react';
import api from '../api';

const empty = { PackageName: '', PackageDescription: '', PackagePrice: '' };

export default function Packages() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/packages').then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try { await api.post('/packages', form); setForm(empty); setMsg('Package saved'); load(); }
    catch (e) { setMsg(e.response?.data?.error || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Packages</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-3">
        <input required placeholder="PackageName" className="border rounded p-2"
          value={form.PackageName} onChange={e=>setForm({...form,PackageName:e.target.value})} />
        <input required placeholder="PackageDescription" className="border rounded p-2"
          value={form.PackageDescription} onChange={e=>setForm({...form,PackageDescription:e.target.value})} />
        <input required type="number" placeholder="PackagePrice" className="border rounded p-2"
          value={form.PackagePrice} onChange={e=>setForm({...form,PackagePrice:e.target.value})} />
        <button className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Package</button>
        {msg && <div className="md:col-span-3 text-sm">{msg}</div>}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-2 text-left">#</th><th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Description</th><th className="p-2 text-left">Price (RWF)</th>
          </tr></thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.PackageNumber} className="border-t">
                <td className="p-2">{p.PackageNumber}</td>
                <td className="p-2">{p.PackageName}</td>
                <td className="p-2">{p.PackageDescription}</td>
                <td className="p-2">{Number(p.PackagePrice).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
