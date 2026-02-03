import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import dateFormat from '../../lib/dateFormat';
import toast from 'react-hot-toast';

const ListBookings = () => {

const currency = import.meta.env.VITE_CURRENCY

    const [bookings, setBookings] = useState([]);
    const [isloading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllBookings = async () => {
        try {
            const response = await fetch('/api/admin/bookings')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json()
            if (result.success) {
                setBookings(result.bookings || [])
                setError(null)
            } else {
                setBookings([])
                setError(result.message || 'Failed to fetch bookings')
                toast.error(result.message || 'Failed to fetch bookings')
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error fetching bookings:', error)
            setError(error.message || 'Failed to fetch bookings')
            toast.error(error.message || 'Failed to fetch bookings')
            setBookings([])
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getAllBookings();

        // Poll admin bookings every 10 seconds so admin can see new bookings without refresh
        const interval = setInterval(() => {
            getAllBookings();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

  return !isloading ? (
   <>
   <Title text1="List" text2="Bookings" />
    <div className='max-w-4xl mt-6 overflow-x-auto'>
        {error ? (
            <div className='bg-red-500/10 border border-red-500/50 rounded-md p-4 text-red-400'>
                <p className='font-medium'>Error: {error}</p>
                <button 
                    onClick={getAllBookings}
                    className='mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80'
                >
                    Retry
                </button>
            </div>
        ) : bookings.length === 0 ? (
            <div className='text-center py-8 text-gray-400'>
                <p>No bookings found</p>
            </div>
        ) : (
            <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                <thead>
                    <tr className='bg-primary/20 text-left text-white'>
                        <th className='p-2 font-medium pl-5'>User Name</th>
                        <th className='p-2 font-medium'>Movie Name</th>
                        <th className='p-2 font-medium'>Show Time</th>
                        <th className='p-2 font-medium'>Seats</th>
                        <th className='p-2 font-medium'>Amount</th>
                    </tr>
                </thead>
                <tbody className='text-sm font-light'>
                    {bookings.map((item, index) => (
                        <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10'>
                            <td className='p-2 min-w-45 pl-5'>{item.user?.name || 'N/A'}</td>
                            <td className='p-2'>{item.show?.movie?.title || 'N/A'}</td>
                            <td className='p-2'>{item.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'N/A'}</td>
                            <td className='p-2'>{Array.isArray(item.bookedSeats) ? item.bookedSeats.join(", ") : 'N/A'}</td>
                            <td className='p-2'>{currency} {item.amount || 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
     </div>   
   </>
  ) : <Loading />
}

export default ListBookings