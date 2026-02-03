import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import { User, Mail, Phone, Calendar } from 'lucide-react'

const ListUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const getAllUsers = async () => {
        try {
            const response = await fetch('/api/admin/users')
            const result = await response.json()
            if (result.success) {
                setUsers(result.users)
            } else {
                setUsers([])
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return !loading ? (
        <>
            <Title text1="List" text2="Users" />
            <div className='max-w-6xl mt-6'>
                {users.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {users.map((user) => (
                            <div key={user._id} className='bg-primary/10 border border-primary/20 rounded-lg p-6'>
                                <div className='flex items-center gap-4 mb-4'>
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className='w-16 h-16 rounded-full object-cover' />
                                    ) : (
                                        <div className='w-16 h-16 rounded-full bg-primary flex items-center justify-center'>
                                            <User className='w-8 h-8 text-white' />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className='font-semibold text-lg'>{user.name}</h3>
                                        <p className='text-sm text-gray-400'>{user._id}</p>
                                    </div>
                                </div>
                                <div className='space-y-2'>
                                    <div className='flex items-center gap-2 text-sm'>
                                        <Mail className='w-4 h-4 text-primary' />
                                        <span className='text-gray-300'>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div className='flex items-center gap-2 text-sm'>
                                            <Phone className='w-4 h-4 text-primary' />
                                            <span className='text-gray-300'>{user.phone}</span>
                                        </div>
                                    )}
                                    <div className='flex items-center gap-2 text-sm'>
                                        <Calendar className='w-4 h-4 text-primary' />
                                        <span className='text-gray-300'>
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-gray-400 text-lg'>No users found</p>
                    </div>
                )}
            </div>
        </>
    ) : <Loading />
}

export default ListUsers



