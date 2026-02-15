import React from 'react'
import { assets } from '../../assets/assets'
import { LayoutDashboardIcon, ListCollapseIcon, ListIcon, PlusSquareIcon, FilmIcon, UserIcon, MapPinIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {

    const user = {
        firstName: 'Admin',
        lastName: 'User',
        imageUrl: assets.profile,
    }

    const adminNavlinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
        { name: 'Movies', path: '/admin/list-movies', icon: FilmIcon },
        // { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
        { name: 'Shows', path: '/admin/list-shows', icon: ListIcon },
        { name: 'Theaters', path: '/admin/list-theaters', icon: MapPinIcon },
        { name: 'Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
        { name: 'Users', path: '/admin/list-users', icon: UserIcon },
    ]

    return (
        <div className='h-[calc(100vh-64px)] md:flex flex-col items-center pt-8 max-w-13 
            md:max-w-60 w-full border-r border-slate-200 text-sm bg-white'>
            <img className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto' src={user.imageUrl} alt="sidebar" />
            <p className='mt-2 text-base max-md:hidden text-slate-900'>{user.firstName} {user.lastName}</p>
            <div className='w-full'>
                {adminNavlinks.map((link, index) => (
                    <NavLink
                        key={index}
                        to={link.path} end 
                        className={({ isActive }) => `relative flex items-center 
                        max-md:justify-center gap-2 w-full py-2.5 min-md:pl-10 first:mt-6 text-slate-500
                        ${isActive ? 'bg-primary/10 text-primary group' : 'hover:text-slate-900'}`}
                    >
                        {({ isActive }) => (
                            <>
                                <link.icon className="w-5 h-5" />
                                <p className="max-md:hidden">{link.name}</p>
                                <span className={`w-1.5 h-10 rounded-1 right-0 absolute 
                                    ${isActive ? 'bg-primary' : ''}`} />
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default AdminSidebar
