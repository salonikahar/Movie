import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import logoNavbar from '../assets/logo-navbar.png'
import { MenuIcon, SearchIcon, TicketPlus, XIcon, LogOut, User } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showCityMenu, setShowCityMenu] = useState(false)
    const [selectedCity, setSelectedCity] = useState('Mumbai')
    const navigate = useNavigate()
    const userMenuRef = useRef(null)
    const cityMenuRefDesktop = useRef(null)
    const cityMenuRefMobile = useRef(null)

    const indianCities = [
        'Mumbai',
        'Delhi-NCR',
        'Bengaluru',
        'Hyderabad',
        'Chennai',
        'Pune',
        'Kolkata',
        'Ahmedabad',
        'Jaipur',
        'Chandigarh',
        'Lucknow',
        'Kochi',
        'Indore',
        'Surat',
        'Nagpur',
        'Bhopal',
        'Patna',
        'Bhubaneswar',
        'Guwahati',
        'Dehradun',
        'Vadodara',
        'Coimbatore',
        'Visakhapatnam',
        'Raipur',
        'Ranchi',
        'Agra',
        'Amritsar',
        'Jodhpur',
        'Madurai',
        'Thiruvananthapuram'
    ]

    useEffect(() => {
        const userData = localStorage.getItem('userData')
        if (userData) {
            setUser(JSON.parse(userData))
        }
        const storedCity = localStorage.getItem('selectedCity')
        if (storedCity) {
            setSelectedCity(storedCity)
        }
        
        // Refresh user data on storage change (for login/logout from other tabs)
        const handleStorageChange = () => {
            const nextCity = localStorage.getItem('selectedCity')
            if (nextCity) {
                setSelectedCity(nextCity)
            }
            const updatedUserData = localStorage.getItem('userData')
            if (updatedUserData) {
                setUser(JSON.parse(updatedUserData))
            } else {
                setUser(null)
            }
        }
        const handleCityChanged = (event) => {
            const nextCity = event.detail?.city || localStorage.getItem('selectedCity')
            if (nextCity) {
                setSelectedCity(nextCity)
            }
        }
        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('cityChanged', handleCityChanged)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('cityChanged', handleCityChanged)
        }
    }, [])

    useEffect(() => {
        // Close menus when clicking outside
        const handleClickOutside = (event) => {
            const userMenuEl = userMenuRef.current
            const cityMenuElDesktop = cityMenuRefDesktop.current
            const cityMenuElMobile = cityMenuRefMobile.current
            if (showUserMenu && userMenuEl && !userMenuEl.contains(event.target)) {
                setShowUserMenu(false)
            }
            if (
                showCityMenu &&
                !(
                    (cityMenuElDesktop && cityMenuElDesktop.contains(event.target)) ||
                    (cityMenuElMobile && cityMenuElMobile.contains(event.target))
                )
            ) {
                setShowCityMenu(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showUserMenu, showCityMenu])

    const handleCitySelect = (city) => {
        setSelectedCity(city)
        localStorage.setItem('selectedCity', city)
        window.dispatchEvent(new CustomEvent('cityChanged', { detail: { city } }))
        setShowCityMenu(false)
    }

    const handleLogout = () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userData')
        setUser(null)
        setShowUserMenu(false)
        toast.success('Logged out successfully')
        navigate('/')
    }
    return (
        <header className='sticky top-0 left-0 z-50 w-full bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm'>
            <div className='flex items-center justify-between px-6 md:px-16 lg:px-36 py-3'>
                <Link to='/' className='flex items-center gap-2'>
                    <img
                        src={logoNavbar}
                        alt="BookMyScreen"
                        className='h-10 md:h-12 w-auto object-contain'
                    />
                </Link>

                <div className='relative hidden md:flex' ref={cityMenuRefDesktop}>
                    <button
                        onClick={() => setShowCityMenu(!showCityMenu)}
                        className='flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-full text-sm text-slate-700 hover:border-primary/40 transition bg-white'
                    >
                        <span className='font-medium'>{selectedCity}</span>
                        <span className='text-slate-400'>▼</span>
                    </button>
                    {showCityMenu && (
                        <div className='absolute left-0 top-12 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto'>
                            {indianCities.map((city) => (
                                <button
                                    key={city}
                                    onClick={() => handleCitySelect(city)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                                        selectedCity === city ? 'text-primary font-semibold' : 'text-slate-700'
                                    }`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className='hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6'>
                    <div className='flex items-center gap-2 w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2'>
                        <SearchIcon className='w-4 h-4 text-slate-500' />
                        <input
                            type='text'
                            placeholder='Search for movies, events, plays...'
                            className='w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    {
                        !user ? (
                            <button onClick={() => navigate('/sign-in')} className='px-4 py-2 sm:px-6 bg-primary hover:bg-primary-dull
                            transition rounded-md text-white text-sm font-semibold cursor-pointer'>Sign in</button>
                        ) : (
                            <div className='relative' ref={userMenuRef}>
                                <button 
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className='flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-full transition'
                                >
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = assets.profile
                                            }}
                                            alt={user.name}
                                            className='w-8 h-8 rounded-full'
                                        />
                                    ) : (
                                        <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
                                            <User className='w-5 h-5 text-white' />
                                        </div>
                                    )}
                                    <span className='max-md:hidden text-sm text-slate-700'>{user.name}</span>
                                </button>
                                {showUserMenu && (
                                    <div className='absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50'>
                                        <div className='p-2'>
                                            <div className='px-3 py-2 border-b border-slate-200'>
                                                <p className='text-sm font-semibold text-slate-900'>{user.name}</p>
                                                <p className='text-xs text-slate-500'>{user.email}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigate('/my-bookings')
                                                    setShowUserMenu(false)
                                                }}
                                                className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition'
                                            >
                                                <TicketPlus className='w-4 h-4' />
                                                My Bookings
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigate('/profile')
                                                    setShowUserMenu(false)
                                                }}
                                                className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition'
                                            >
                                                <User className='w-4 h-4' />
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className='w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded transition'
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
                    <MenuIcon className='md:hidden w-7 h-7 text-slate-700 cursor-pointer' onClick={()=> setIsOpen(!isOpen)} />
                </div>
            </div>

            <div className='hidden md:flex items-center gap-6 px-6 md:px-16 lg:px-36 pb-3 text-sm text-slate-600'>
                <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/' className='hover:text-slate-900'>Home</Link>
                <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/movies' className='hover:text-slate-900'>Movies</Link>
                <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/theaters' className='hover:text-slate-900'>Theaters</Link>
                <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/releases' className='hover:text-slate-900'>Releases</Link>
                <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/favorite' className='hover:text-slate-900'>Favorites</Link>
            </div>

            <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className='px-6 pb-6 space-y-4'>
                    <div className='flex items-center gap-2'>
                        <span className='text-xs uppercase tracking-wide text-slate-400'>City</span>
                        <div className='relative' ref={cityMenuRefMobile}>
                            <button
                                onClick={() => setShowCityMenu(!showCityMenu)}
                                className='flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-full text-sm text-slate-700 hover:border-primary/40 transition bg-white'
                            >
                                <span className='font-medium'>{selectedCity}</span>
                                <span className='text-slate-400'>▼</span>
                            </button>
                            {showCityMenu && (
                                <div className='absolute left-0 top-12 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto'>
                                    {indianCities.map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => handleCitySelect(city)}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 ${
                                                selectedCity === city ? 'text-primary font-semibold' : 'text-slate-700'
                                            }`}
                                        >
                                            {city}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2'>
                        <SearchIcon className='w-4 h-4 text-slate-500' />
                        <input
                            type='text'
                            placeholder='Search movies, events...'
                            className='w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400'
                        />
                    </div>
                    <div className='flex flex-col gap-3 text-sm text-slate-700 font-medium'>
                        <XIcon className='self-end w-6 h-6 cursor-pointer text-slate-600' onClick={()=> setIsOpen(!isOpen)} />
                        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}} to='/'>Home</Link>
                        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/movies'>Movies</Link>
                        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/theaters'>Theaters</Link>
                        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/releases'>Releases</Link>
                        <Link onClick={()=> {scrollTo(0,0); setIsOpen(false)}}to='/favorite'>Favorites</Link>
                    </div>
                </div>
            </div>
        </header>
    )
  }

export default Navbar
