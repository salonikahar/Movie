import React, { useEffect, useMemo, useState } from 'react'
import Title from '../../components/admin/Title'

const ListTheaters = () => {
    const [theaters, setTheaters] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCity, setSelectedCity] = useState('All Cities')
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [theaterToDelete, setTheaterToDelete] = useState(null)
    const [editData, setEditData] = useState({
        _id: '',
        name: '',
        city: 'Mumbai',
        location: '',
        screens: '',
        facilities: ''
    })
    const [formData, setFormData] = useState({
        name: '',
        city: 'Mumbai',
        location: '',
        screens: '',
        facilities: ''
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

    const fetchTheaters = async () => {
        try {
            const response = await fetch('/api/admin/theaters')
            const result = await response.json()
            if (result.success) {
                setTheaters(result.theaters || [])
            } else {
            window.alert(result.message || 'Failed to fetch theaters')
            }
        } catch (error) {
            console.error(error)
        window.alert('Failed to fetch theaters')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTheaters()
    }, [])

    const filteredTheaters = useMemo(() => {
        if (selectedCity === 'All Cities') return theaters
        return theaters.filter(theater => theater.city === selectedCity)
    }, [theaters, selectedCity])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAddTheater = async (e) => {
        e.preventDefault()
        if (!formData.name || !formData.city || !formData.location) {
            window.alert('Name, city, and location are required')
            return
        }
        try {
            const response = await fetch('/api/admin/theaters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    city: formData.city,
                    location: formData.location,
                    screens: Number(formData.screens || 1),
                    facilities: formData.facilities
                })
            })
            let result
            try {
                result = await response.json()
            } catch (parseError) {
                result = null
            }

            if (!response.ok) {
                const message = result?.message || `Request failed (${response.status})`
                window.alert(message)
                return
            }

            if (result && result.success) {
                window.alert('Theater added successfully')
                setFormData({
                    name: '',
                    city: formData.city,
                    location: '',
                    screens: '',
                    facilities: ''
                })
                fetchTheaters()
            } else {
                window.alert(result?.message || 'Failed to add theater')
            }
        } catch (error) {
            console.error(error)
            window.alert('Failed to add theater (network error)')
        }
    }

    const handleDelete = async (id) => {
        if (!id) return
        try {
            const response = await fetch(`/api/admin/theaters/${id}`, { method: 'DELETE' })
            const result = await response.json()
            if (result.success) {
                window.alert('Theater deleted')
                fetchTheaters()
                setShowDeleteModal(false)
                setTheaterToDelete(null)
            } else {
                window.alert(result.message || 'Failed to delete theater')
            }
        } catch (error) {
            console.error(error)
            window.alert('Failed to delete theater')
        }
    }

    const requestDelete = (theater) => {
        setTheaterToDelete(theater)
        setShowDeleteModal(true)
    }

    const requestEdit = (theater) => {
        setEditData({
            _id: theater._id,
            name: theater.name || '',
            city: theater.city || 'Mumbai',
            location: theater.location || '',
            screens: theater.screens || '',
            facilities: Array.isArray(theater.facilities) ? theater.facilities.join(', ') : (theater.facilities || '')
        })
        setShowEditModal(true)
    }

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditData(prev => ({ ...prev, [name]: value }))
    }

    const handleUpdateTheater = async (e) => {
        e.preventDefault()
        if (!editData._id || !editData.name || !editData.city || !editData.location) {
            window.alert('Name, city, and location are required')
            return
        }
        try {
            const response = await fetch(`/api/admin/theaters/${editData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editData.name,
                    city: editData.city,
                    location: editData.location,
                    screens: Number(editData.screens || 1),
                    facilities: editData.facilities
                })
            })
            const result = await response.json()
            if (result.success) {
                window.alert('Theater updated')
                fetchTheaters()
                setShowEditModal(false)
            } else {
                window.alert(result.message || 'Failed to update theater')
            }
        } catch (error) {
            console.error(error)
            window.alert('Failed to update theater')
        }
    }

    return (
        <>
            <Title text1="List" text2="Theaters" />

            <div className='mt-6 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8'>
                <div className='bg-white border border-slate-200 rounded-xl p-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <p className='text-lg font-medium'>Theaters</p>
                        <div className='flex items-center gap-3'>
                            <label className='text-sm text-slate-500'>City</label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className='px-3 py-2 rounded-md bg-white text-slate-700 border border-slate-200'
                            >
                                <option value="All Cities">All Cities</option>
                                {indianCities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className='text-center py-12 text-slate-500'>Loading theaters...</div>
                    ) : filteredTheaters.length > 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                            {filteredTheaters.map((theater) => (
                                <div key={theater._id} className='bg-white border border-slate-200 rounded-lg p-4 shadow-sm'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div>
                                            <h3 className='text-lg font-semibold'>{theater.name}</h3>
                                            <p className='text-sm text-slate-500'>{theater.city}</p>
                                            <p className='text-sm text-slate-500'>{theater.location}</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => requestEdit(theater)}
                                                className='px-3 py-1 text-xs rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => requestDelete(theater)}
                                                className='px-3 py-1 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200'
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className='mt-3 text-sm text-slate-500'>
                                        Screens: {theater.screens}
                                    </div>
                                    {Array.isArray(theater.facilities) && theater.facilities.length > 0 && (
                                        <div className='flex flex-wrap gap-2 mt-3'>
                                            {theater.facilities.map((facility) => (
                                                <span key={facility} className='text-xs bg-primary/10 text-primary px-2 py-1 rounded'>
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12 text-slate-500'>No theaters found.</div>
                    )}
                </div>

                <form onSubmit={handleAddTheater} className='bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm'>
                    <p className='text-lg font-medium'>Add Theater</p>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Theater Name *</label>
                        <input
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className='w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900'
                            placeholder='e.g. PVR Icon'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>City *</label>
                        <select
                            name='city'
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className='w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900'
                        >
                            {indianCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Location *</label>
                        <input
                            name='location'
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className='w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900'
                            placeholder='e.g. Phoenix Mall, Lower Parel'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Screens</label>
                        <input
                            name='screens'
                            type='number'
                            min='1'
                            value={formData.screens}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900'
                            placeholder='e.g. 6'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium mb-2'>Facilities (comma separated)</label>
                        <input
                            name='facilities'
                            value={formData.facilities}
                            onChange={handleChange}
                            className='w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900'
                            placeholder='Dolby Atmos, IMAX, Parking'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition'
                    >
                        Add Theater
                    </button>
                </form>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900">Delete Theater</h3>
                        <p className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete
                            {theaterToDelete?.name ? ` “${theaterToDelete.name}”` : ' this theater'}?
                        </p>
                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setTheaterToDelete(null)
                                }}
                                className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(theaterToDelete?._id)}
                                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h3 className="text-lg font-semibold text-slate-900">Edit Theater</h3>
                        <form onSubmit={handleUpdateTheater} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Theater Name *</label>
                                <input
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">City *</label>
                                <select
                                    name="city"
                                    value={editData.city}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900"
                                >
                                    {indianCities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Location *</label>
                                <input
                                    name="location"
                                    value={editData.location}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Screens</label>
                                <input
                                    name="screens"
                                    type="number"
                                    min="1"
                                    value={editData.screens}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Facilities (comma separated)</label>
                                <input
                                    name="facilities"
                                    value={editData.facilities}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-md text-slate-900"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default ListTheaters
