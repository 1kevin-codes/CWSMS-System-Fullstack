import { NavLink } from 'react-router-dom';

const link = ({ isActive }) =>
  `px-3 py-2 rounded text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-200'}`;

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2 p-3">
        <div className="font-bold text-blue-700 mr-4">CWSMS — SmartPark</div>
        <NavLink to="/cars" className={link}>Car</NavLink>
        <NavLink to="/packages" className={link}>Packages</NavLink>
        <NavLink to="/servicepackages" className={link}>ServicePackage</NavLink>
        <NavLink to="/payments" className={link}>Payment</NavLink>
        <NavLink to="/reports" className={link}>Reports</NavLink>
        <button onClick={onLogout} className="ml-auto px-3 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
}
