import { useEffect, useState } from 'react';
import api from '../api';

const empty = { ServiceDate: new Date().toISOString().slice(0,10), PlateNumber: '', PackageNumber: '' };

export default function ServicePackages() {
  const [rows, setRows] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/servicepackages').then(r => setRows(r.data));
  useEffect(() => {
    load();
    api.get('/cars').then(r => setCars(r.data));
    api.get('/packages').then(r => setPackages(r.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editId) {
        await api.put(`/servicepackages/${editId}`, form);
        setMsg('Updated');
      } else {
        await api.post('/servicepackages', form);
        setMsg('Saved');
      }
      setForm(empty); setEditId(null); load();
    } catch (e) { setMsg(e.response?.data?.error || 'Error'); }
  };

  const edit = (r) => {
    setEditId(r.RecordNumber);
    setForm({ ServiceDate: String(r.ServiceDate).slice(0,10), PlateNumber: r.PlateNumber, PackageNumber: r.PackageNumber });
  };

  const remove = async (id) => {
    if (!confirm('Delete record #' + id + '?')) return;
    await api.delete(`/servicepackages/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Service Package</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-3">
        <input required type="date" className="border rounded p-2"
          value={form.ServiceDate} onChange={e=>setForm({...form,ServiceDate:e.target.value})} />
        <select required className="border rounded p-2"
          value={form.PlateNumber} onChange={e=>setForm({...form,PlateNumber:e.target.value})}>
          <option value="">-- Plate Number --</option>
          {cars.map(c => <option key={c.PlateNumber} value={c.PlateNumber}>{c.PlateNumber} — {c.DriverName}</option>)}
        </select>
        <select required className="border rounded p-2"
          value={form.PackageNumber} onChange={e=>setForm({...form,PackageNumber:e.target.value})}>
          <option value="">-- Package --</option>
          {packages.map(p => <option key={p.PackageNumber} value={p.PackageNumber}>{p.PackageName}</option>)}
        </select>
        <button className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {editId ? 'Update' : 'Save'}
        </button>
        {editId && (
          <button type="button" onClick={()=>{setEditId(null);setForm(empty);}}
            className="md:col-span-4 text-sm text-slate-600 underline">Cancel edit</button>
        )}
        {msg && <div className="md:col-span-4 text-sm">{msg}</div>}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            <th className="p-2 text-left">Record#</th><th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Plate</th><th className="p-2 text-left">Driver</th>
            <th className="p-2 text-left">Package</th><th className="p-2 text-left">Price</th>
            <th className="p-2">Actions</th>
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.RecordNumber} className="border-t">
                <td className="p-2">{r.RecordNumber}</td>
                <td className="p-2">{String(r.ServiceDate).slice(0,10)}</td>
                <td className="p-2">{r.PlateNumber}</td>
                <td className="p-2">{r.DriverName}</td>
                <td className="p-2">{r.PackageName}</td>
                <td className="p-2">{Number(r.PackagePrice).toLocaleString()}</td>
                <td className="p-2 space-x-2 whitespace-nowrap">
                  <button onClick={()=>edit(r)} className="px-2 py-1 bg-amber-500 text-white rounded">Edit</button>
                  <button onClick={()=>remove(r.RecordNumber)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
