import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoNavbar from '../../assets/logo-navbar.png'

const AdminNavbar = () => {
  const navigate = useNavigate()

  const handleAdminLogout = () => {
    sessionStorage.removeItem('adminLoggedIn')
    navigate('/admin/login')
  }

  return (
    <div className='flex items-center justify-between px-6 md:px-10 h-16 border-b border-slate-200 bg-white/95 backdrop-blur'>
        <Link to="/">
        <img src={logoNavbar} alt="logo" className="h-10 w-auto object-contain"/>
        </Link>
        <button
          onClick={handleAdminLogout}
          className='px-4 py-2 text-sm rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50'
        >
          Logout
        </button>
    </div>
  )
}

export default AdminNavbar
