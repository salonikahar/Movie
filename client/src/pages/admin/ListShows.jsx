import React, { useEffect } from 'react'
import { useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormat';
import { EditIcon, TrashIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY
    const navigate = useNavigate();

    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const getAllShows = async () =>{
        try {
            const response = await fetch('/api/admin/shows')
            const result = await response.json()
            if (result.success) {
                setShows(result.shows)
            } else {
                setShows([])
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this show?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/shows/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Show deleted successfully');
                getAllShows();
            } else {
                toast.error(result.message || 'Failed to delete show');
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to delete show');
        }
    }

    useEffect(() => {
        getAllShows();
    }, []);

    const totalPages = Math.max(1, Math.ceil(shows.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const pageShows = shows.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

  return !loading ? (
    <>
    <Title text1="List" text2="Shows" />
    <div className='mt-6'>
        <button
            onClick={() => navigate('/admin/add-shows')}
            className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition mb-4'
        >
            Add New Show
        </button>
    </div>
    <div className='max-w-4xl mt-6 overflow-x-auto'>
        {shows.length > 0 && (
            <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                <span>Showing {pageStart + 1}-{Math.min(pageStart + pageSize, shows.length)} of {shows.length}</span>
                <span>Page {currentPage} of {totalPages}</span>
            </div>
        )}
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
            <thead>
                <tr className='bg-primary/20 text-left text-white'>
                    <th className='p-2 font-medium pl-5'>Movie Name</th>
                    <th className='p-2 font-medium'>Show Time</th>
                    <th className='p-2 font-medium'>Total Bookings</th>
                    <th className='p-2 font-medium'>Earnings</th>
                    <th className='p-2 font-medium'>Actions</th>
                </tr>
            </thead>
            <tbody className='text-sm font-light'>
                {pageShows.map((show, index) => (
                    <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                        <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                        <td className='p-2'>{dateFormat(show.showDateTime)}</td>
                        <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                        <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                        <td className='p-2'>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => navigate(`/admin/edit-show/${show._id}`)}
                                    className='flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-md hover:bg-primary/30 transition'
                                >
                                    <EditIcon className='w-4 h-4' />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(show._id)}
                                    className='flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-md hover:bg-red-500/30 transition'
                                >
                                    <TrashIcon className='w-4 h-4' />
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {shows.length > 0 && (
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
        )}

    </div>
    </>
  ) : <Loading />
}

export default ListShows
