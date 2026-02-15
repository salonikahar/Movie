import React from 'react'
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
   <>
    <AdminNavbar />
    <div className='flex '>
        <AdminSidebar />
        <div className='flex-1 px-6 py-8 md:px-12 lg:px-16 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50'>
            <div className='max-w-7xl mx-auto'>
                <Outlet />
            </div>
        </div>
    </div>
   </>
  )
}

export default Layout
