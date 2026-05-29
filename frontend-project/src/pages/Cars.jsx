import { useEffect, useState } from 'react';
import api from '../api';

const empty = { PlateNumber: '', CarType: '', CarSize: '', DriverName: '', PhoneNumber: '' };

export default function Cars() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/cars').then(r => setRows(r.data));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try { await api.post('/cars', form); setForm(empty); setMsg('Car saved'); load(); }
    catch (e) { setMsg(e.response?.data?.error || 'Error'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Car</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-3">
        {Object.keys(empty).map(k => (
          <input key={k} required placeholder={k} className="border rounded p-2"
            value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} />
        ))}
        <button className="md:col-span-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save Car</button>
        {msg && <div className="md:col-span-3 text-sm text-slate-700">{msg}</div>}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-100"><tr>
            {Object.keys(empty).map(k => <th key={k} className="p-2 text-left">{k}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.PlateNumber} className="border-t">
                {Object.keys(empty).map(k => <td key={k} className="p-2">{r[k]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
