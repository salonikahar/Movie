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
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

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

    const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const pageBookings = bookings.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

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
            <>
                <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                    <span>Showing {pageStart + 1}-{Math.min(pageStart + pageSize, bookings.length)} of {bookings.length}</span>
                    <span>Page {currentPage} of {totalPages}</span>
                </div>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/20 text-left text-dark'>
                            <th className='p-2 font-medium pl-5'>User Name</th>
                            <th className='p-2 font-medium'>Movie Name</th>
                            <th className='p-2 font-medium'>Show Time</th>
                            <th className='p-2 font-medium'>Seats</th>
                            <th className='p-2 font-medium'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-dark'>
                        {pageBookings.map((item, index) => (
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
                <div className='flex items-center justify-center gap-2 mt-6'>
                    <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className='px-3 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        First
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className='px-3 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className='px-3 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className='px-3 py-2 rounded-md bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        Last
                    </button>
                </div>
            </>
        )}
     </div>   
   </>
  ) : <Loading />
}

export default ListBookings
