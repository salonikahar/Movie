import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [selectedCity, setSelectedCity] = useState('Mumbai')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity')
    if (storedCity) setSelectedCity(storedCity)
    const userData = localStorage.getItem('userData')
    if (userData) setUser(JSON.parse(userData))

    const handleStorage = () => {
      const nextCity = localStorage.getItem('selectedCity')
      if (nextCity) setSelectedCity(nextCity)
      const updatedUserData = localStorage.getItem('userData')
      if (updatedUserData) setUser(JSON.parse(updatedUserData))
      else setUser(null)
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatusMessage('Please enter a valid email.')
      return
    }

    try {
      const existing = JSON.parse(localStorage.getItem('newsletterSubs') || '[]')
      const next = Array.from(new Set([...existing, email.trim().toLowerCase()]))
      localStorage.setItem('newsletterSubs', JSON.stringify(next))
      setStatusMessage('Subscribed! Check your inbox for updates.')
      setEmail('')
    } catch (error) {
      setStatusMessage('Subscription failed. Please try again.')
    }
  }

  return (
    <footer className="mt-24 w-full bg-[#111827] text-slate-200">
            <div className="px-6 md:px-16 lg:px-36 py-16">
                <div className="rounded-2xl bg-gradient-to-r from-[#1f2937] via-[#0f172a] to-[#1f2937] p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm border border-white/10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Stay in the loop</p>
                        <h2 className="text-2xl font-semibold text-white mt-2">Get premiere alerts and exclusive deals</h2>
                        <p className="text-slate-400 mt-2 max-w-xl">
                            Movie drops, early screenings, and last-minute seat openings. Delivered weekly.
                        </p>
                        <p className="text-sm text-slate-400 mt-3">
                            City: <span className="text-white">{selectedCity}</span>
                            {user ? (
                              <span className="ml-2 text-slate-300">| Signed in as {user.name}</span>
                            ) : (
                              <span className="ml-2 text-slate-400">| Guest</span>
                            )}
                        </p>
                    </div>
                    <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="px-4 py-3 rounded-md bg-white/10 border border-white/10 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-primary"
                        />
                        <button type="submit" className="px-6 py-3 rounded-md bg-primary hover:bg-primary-dull text-white text-sm font-semibold">
                            Subscribe
                        </button>
                        {statusMessage && (
                          <p className="text-sm text-slate-300 mt-1 sm:mt-0">{statusMessage}</p>
                        )}
                    </form>
                </div>
            </div>

            <div className="px-6 md:px-16 lg:px-36 pb-12 border-b border-white/10">
                <div className="flex flex-col md:flex-row justify-between w-full gap-12">
                    <div className="md:max-w-96">
                        <img alt="logo" className='w-36 h-auto' src={assets.logo} />
                        <p className="mt-6 text-sm text-slate-400">
                            Your destination for blockbuster nights, curated premieres, and seamless seat booking.
                        </p>
                        <div className="flex items-center gap-2 mt-4">
                            <img src={assets.googlePlay} alt="google play" className="h-9 w-auto" />
                            <img src={assets.appStore} alt="app store" className="h-9 w-auto " />
                        </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h2 className="font-semibold mb-4">Explore</h2>
                            <ul className="text-sm space-y-2 text-slate-400">
                                <li><Link to="/movies" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Movies</Link></li>
                                <li><Link to="/theaters" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Theaters</Link></li>
                                <li><Link to="/releases" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Releases</Link></li>
                                <li><Link to="/favorite" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Favorites</Link></li>
                            </ul>
                        </div>
                        {/* <div>
                            <h2 className="font-semibold mb-4">Company</h2>
                            <ul className="text-sm space-y-2 text-slate-400">
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">About us</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Careers</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Privacy policy</Link></li>
                                <li><Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Terms</Link></li>
                            </ul>
                        </div> */}
                        <div>
                            <h2 className="font-semibold mb-4">Support</h2>
                            <div className="text-sm space-y-2 text-slate-400">
                                <p>+91 9825178630</p>
                                <p>bookmyscreen@gmail.com</p>
                                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Help Center</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-6 md:px-16 lg:px-36 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                <p>Copyright {new Date().getFullYear()}@Book My Screen. All Right Reserved By Saloni Kahar.</p>
                <div className="flex items-center gap-4">
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                      <Facebook className="w-4 h-4" /> Facebook
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                      <Instagram className="w-4 h-4" /> Instagram
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                      <Twitter className="w-4 h-4" /> Twitter
                    </a>
                </div>
            </div>
        </footer>
  )
}

export default Footer
