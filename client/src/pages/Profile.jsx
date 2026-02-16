import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from '../components/BlurCircle'
import Loading from '../components/Loading'
import { User, Mail, Phone, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { assets } from '../assets/assets'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/sign-in')
    }
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    toast.success('Logged out successfully')
    navigate('/')
    window.location.reload()
  }

  if (loading) return <Loading />

  if (!user) {
    return null
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-40 pt-32 md:pt-36 min-h-[80vh]'>
      <BlurCircle top="100px" left="100px" />
      <BlurCircle bottom="0px" right="200px" />
      
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-semibold mb-8 text-slate-900'>My Profile</h1>
        
        <div className='bg-white border border-slate-200 rounded-2xl p-8 shadow-sm'>
          <div className='flex items-center gap-6 mb-8'>
            {user.image ? (
              <img
                src={user.image}
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = assets.profile
                }}
                alt={user.name}
                className='w-24 h-24 rounded-full object-cover'
              />
            ) : (
              <div className='w-24 h-24 rounded-full bg-primary flex items-center justify-center'>
                <User className='w-12 h-12 text-white' />
              </div>
            )}
            <div>
              <h2 className='text-2xl font-semibold text-slate-900'>{user.name}</h2>
              <p className='text-slate-500'>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg'>
              <Mail className='w-5 h-5 text-primary' />
              <div>
                <p className='text-sm text-slate-500'>Email</p>
                <p className='text-slate-900'>{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className='flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg'>
                <Phone className='w-5 h-5 text-primary' />
                <div>
                  <p className='text-sm text-slate-500'>Phone</p>
                  <p className='text-slate-900'>{user.phone}</p>
                </div>
              </div>
            )}

            <div className='flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg'>
              <User className='w-5 h-5 text-primary' />
              <div>
                <p className='text-sm text-slate-500'>User ID</p>
                <p className='text-slate-900 text-sm font-mono'>{user._id}</p>
              </div>
            </div>
          </div>

          <div className='mt-8 flex gap-4'>
            <button
              onClick={() => navigate('/my-bookings')}
              className='flex-1 px-6 py-3 bg-primary hover:bg-primary-dull rounded-md transition text-white font-semibold'
            >
              My Bookings
            </button>
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-md transition font-semibold border border-red-200'
            >
              <LogOut className='w-5 h-5' />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile



