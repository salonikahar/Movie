import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Title from '../../components/admin/Title'
import toast from 'react-hot-toast'
import Loading from '../../components/Loading'

const EditShow = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [movies, setMovies] = useState([])
    const [theaters, setTheaters] = useState([])
    const [selectedCity, setSelectedCity] = useState('All Cities')
    const [formData, setFormData] = useState({
        movie: '',
        showDateTime: '',
        showPrice: '',
        theater: ''
    })

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
        const fetchData = async () => {
            try {
                // Fetch show data
                const showResponse = await fetch(`/api/admin/shows`)
                const showResult = await showResponse.json()
                if (showResult.success) {
                    const show = showResult.shows.find(s => s._id === id)
                    if (show) {
                        setFormData({
                            movie: show.movie._id,
                            showDateTime: new Date(show.showDateTime).toISOString().slice(0, 16),
                            showPrice: show.showPrice,
                            theater: show.theater
                        })
                    } else {
                        toast.error('Show not found')
                        navigate('/admin/list-shows')
                    }
                } else {
                    toast.error('Failed to fetch show')
                    navigate('/admin/list-shows')
                }

                // Fetch movies
                const movieResponse = await fetch('/api/admin/movies')
                const movieResult = await movieResponse.json()
                if (movieResult.success) {
                    setMovies(movieResult.movies)
                }

                // Fetch theaters
                const theaterResponse = await fetch('/api/theaters')
                const theaterResult = await theaterResponse.json()
                if (theaterResult.success) {
                    setTheaters(theaterResult.theaters)
                    if (theaterResult.theaters.length > 0 && theaterResult.theaters[0].city) {
                        setSelectedCity(theaterResult.theaters[0].city)
                    }
                }
            } catch (error) {
                console.error(error)
                toast.error('Failed to fetch data')
            } finally {
                setLoading(false)
            }
        }
        if (id) {
            fetchData()
        }
    }, [id, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'showPrice' ? parseFloat(value) || 0 : value
        }))
    }

    const filteredTheaters = selectedCity === 'All Cities'
        ? theaters
        : theaters.filter(theater => theater.city === selectedCity)

    useEffect(() => {
        if (formData.theater && theaters.length > 0) {
            const match = theaters.find(t => t._id === formData.theater)
            if (match && match.city) {
                setSelectedCity(match.city)
            }
        }
    }, [formData.theater, theaters])

    useEffect(() => {
        if (filteredTheaters.length > 0 && !filteredTheaters.some(t => t._id === formData.theater)) {
            setFormData(prev => ({ ...prev, theater: filteredTheaters[0]._id }))
        }
    }, [filteredTheaters, formData.theater])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const response = await fetch(`/api/admin/shows/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    showDateTime: new Date(formData.showDateTime)
                })
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Show updated successfully!')
                navigate('/admin/list-shows')
            } else {
                toast.error(data.message || 'Failed to update show')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred while updating show')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <Loading />

    return (
        <>
            <Title text1="Edit" text2="Show" />
            <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Movie *</label>
                        <select
                            name="movie"
                            value={formData.movie}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900 focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Select a movie</option>
                            {movies.map(movie => (
                                <option key={movie._id} value={movie._id}>{movie.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Show Date & Time *</label>
                        <input
                            type="datetime-local"
                            name="showDateTime"
                            value={formData.showDateTime}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Show Price *</label>
                        <div className='inline-flex items-center gap-2 border border-slate-200 px-3 py-2 rounded-md w-full'>
                            <p className='text-slate-500 text-sm'>{currency}</p>
                            <input
                                type="number"
                                name="showPrice"
                                value={formData.showPrice}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className='outline-none flex-1'
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900 focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="All Cities">All Cities</option>
                            {indianCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Theater *</label>
                        <select
                            name="theater"
                            value={formData.theater}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900 focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="">Select a theater</option>
                            {filteredTheaters.map(theater => (
                                <option key={theater._id} value={theater._id}>{theater.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-primary hover:bg-primary-dull rounded-md transition font-medium disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Update Show'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/list-shows')}
                        className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-md transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default EditShow

