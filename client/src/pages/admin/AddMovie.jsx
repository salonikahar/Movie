import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Title from '../../components/admin/Title'
import toast from 'react-hot-toast'
import Loading from '../../components/Loading'

const AddMovie = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        overview: '',
        poster_path: '',
        backdrop_path: '',
        release_date: '',
        original_language: 'en',
        tagline: '',
        genres: [],
        casts: [],
        crew: [],
        vote_average: 0,
        vote_count: 0,
        runtime: 0
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'vote_average' || name === 'vote_count' || name === 'runtime' 
                ? parseFloat(value) || 0 
                : value
        }))
    }

    const handleGenresChange = (e) => {
        const genres = e.target.value.split(',').map(g => ({ name: g.trim() })).filter(g => g.name)
        setFormData(prev => ({ ...prev, genres }))
    }

    const handleCastsChange = (e) => {
        const casts = e.target.value.split(',').map(c => {
            const [name, profile_path] = c.split('|').map(s => s.trim())
            return { name, profile_path: profile_path || '' }
        }).filter(c => c.name)
        setFormData(prev => ({ ...prev, casts }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Generate ID if not provided
        if (!formData._id) {
            formData._id = `movie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }

        // Validate required fields
        if (!formData.title || !formData.overview || !formData.poster_path || !formData.backdrop_path || !formData.release_date) {
            toast.error('Please fill all required fields')
            return
        }

        setLoading(true)
        try {
            const response = await fetch('/api/admin/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (data.success) {
                toast.success('Movie added successfully!')
                navigate('/admin/list-movies')
            } else {
                toast.error(data.message || 'Failed to add movie')
            }
        } catch (error) {
            console.error(error)
            toast.error('An error occurred while adding movie')
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading />

    return (
        <>
            <Title text1="Add" text2="Movie" />
            <form onSubmit={handleSubmit} className="mt-6 space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Movie ID (optional)</label>
                        <input
                            type="text"
                            name="_id"
                            value={formData._id}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Auto-generated if empty"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Poster URL *</label>
                        <input
                            type="url"
                            name="poster_path"
                            value={formData.poster_path}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Backdrop URL *</label>
                        <input
                            type="url"
                            name="backdrop_path"
                            value={formData.backdrop_path}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Release Date *</label>
                        <input
                            type="date"
                            name="release_date"
                            value={formData.release_date}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Runtime (minutes) *</label>
                        <input
                            type="number"
                            name="runtime"
                            value={formData.runtime}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        <input
                            type="number"
                            name="vote_average"
                            value={formData.vote_average}
                            onChange={handleChange}
                            min="0"
                            max="10"
                            step="0.1"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Vote Count</label>
                        <input
                            type="number"
                            name="vote_count"
                            value={formData.vote_count}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Overview *</label>
                    <textarea
                        name="overview"
                        value={formData.overview}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Genres (comma-separated)</label>
                    <input
                        type="text"
                        value={formData.genres.map(g => g.name).join(', ')}
                        onChange={handleGenresChange}
                        placeholder="Action, Drama, Comedy"
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Casts (format: Name|ImageURL, Name|ImageURL)</label>
                    <textarea
                        value={formData.casts.map(c => `${c.name}${c.profile_path ? '|' + c.profile_path : ''}`).join(', ')}
                        onChange={handleCastsChange}
                        placeholder="John Doe|https://image.url, Jane Smith"
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Tagline</label>
                    <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-800/50 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary hover:bg-primary-dull rounded-md transition font-medium"
                    >
                        Add Movie
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/list-movies')}
                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddMovie
