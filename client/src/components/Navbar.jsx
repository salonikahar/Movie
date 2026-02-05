import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        
        // Refresh user data on storage change (for login/logout from other tabs)
        const handleStorageChange = () => {
            const updatedUserData = localStorage.getItem('userData')
            if (updatedUserData) {
                setUser(JSON.parse(updatedUserData))
            } else {
                setUser(null)
            }
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.relative')) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showUserMenu])

    const handleLogout = () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        setUser(null)
        setShowUserMenu(false)
        toast.success('Logged out successfully')
        navigate('/')
    }
    return (
        <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6
        md:px-16 lg:px-36 py-5'>
        <Link to='/' className='max-md:flex-1'>
            <img src={assets.logo} alt="" className='w-36 h-auto'/>
        </Link>

        <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium 
        max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 
        py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border 
        border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

            <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=> setIsOpen(!isOpen)} />

            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/movies'>Movies</Link>
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/theaters'>Theaters</Link>
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/releases'>Releases</Link>
            <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/favorite'>Favorites</Link>
        </div>

        <div className='flex items-center gap-8'> 
            <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer'/>
            {
                !user ? (
                    <button onClick={() => navigate('/sign-in')} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull
                    transition rounded-full font-medium cursor-pointer'>Login</button>
                ) : (
                    <div className='relative'>
                        <button 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className='flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-full transition'
                        >
                            {user.image ? (
                                <img src={user.image} alt={user.name} className='w-8 h-8 rounded-full' />
                            ) : (
                                <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
                                    <User className='w-5 h-5 text-white' />
                                </div>
                            )}
                            <span className='max-md:hidden'>{user.name}</span>
                        </button>
                        {showUserMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-gray-800 border border-primary/20 rounded-lg shadow-lg z-50'>
                                <div className='p-2'>
                                    <div className='px-3 py-2 border-b border-gray-700'>
                                        <p className='text-sm font-medium text-white'>{user.name}</p>
                                        <p className='text-xs text-gray-400'>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/my-bookings')
                                            setShowUserMenu(false)
                                        }}
                                        className='w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-primary/20 rounded transition'
                                    >
                                        <TicketPlus className='w-4 h-4' />
                                        My Bookings
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/profile')
                                            setShowUserMenu(false)
                                        }}
                                        className='w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-primary/20 rounded transition'
                                    >
                                        <User className='w-4 h-4' />
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className='w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-primary/20 rounded transition'
                                    >
                                        <LogOut className='w-4 h-4' />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </div>

        <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=> setIsOpen(!isOpen)} />

    </div>
  )
}

export default Navbar
