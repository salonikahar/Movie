import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { EditIcon, TrashIcon, StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ListMovies = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 9;

    const getAllMovies = async () => {
        try {
            const response = await fetch('/api/admin/movies');
            const result = await response.json();
            if (result.success) {
                setMovies(result.movies);
            } else {
                setMovies([]);
                toast.error(result.message || 'Failed to fetch movies');
            }
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch movies');
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/movies/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Movie deleted successfully');
                getAllMovies();
            } else {
                toast.error(result.message || 'Failed to delete movie');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete movie');
        }
    }

    const handleToggleActive = async (movie) => {
        try {
            const response = await fetch(`/api/admin/movies/${movie._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !movie.isActive })
            });
            const result = await response.json();
            if (result.success) {
                setMovies(prev =>
                    prev.map(m => (m._id === movie._id ? { ...m, isActive: !movie.isActive } : m))
                );
                toast.success(`Movie ${movie.isActive ? 'deactivated' : 'activated'} successfully`);
            } else {
                toast.error(result.message || 'Failed to update movie');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to update movie');
        }
    }

    useEffect(() => {
        getAllMovies();
    }, []);

    const totalPages = Math.max(1, Math.ceil(movies.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const pageMovies = movies.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return !loading ? (
        <>
            <Title text1="List" text2="Movies" />
            <div className='mt-6'>
                <button 
                    onClick={() => navigate('/admin/add-movie')}
                    className='bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition mb-4'
                >
                    Add New Movie
                </button>
            </div>
            <div className='max-w-6xl mt-6 overflow-x-auto'>
                {movies.length > 0 ? (
                    <>
                        <div className='flex items-center justify-between text-sm text-gray-400 mb-4'>
                            <span>Showing {pageStart + 1}-{Math.min(pageStart + pageSize, movies.length)} of {movies.length}</span>
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {pageMovies.map((movie) => (
                            <div key={movie._id} className='bg-primary/10 border border-primary/20 rounded-lg overflow-hidden hover:shadow-lg transition'>
                                <div className='relative'>
                                    <img 
                                        src={movie.poster_path} 
                                        alt={movie.title} 
                                        className='w-full h-80 object-cover'
                                    />
                                    <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${
                                        movie.isActive ? 'bg-emerald-500/80 text-white' : 'bg-gray-600/80 text-white'
                                    }`}>
                                        {movie.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <div className='absolute top-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded'>
                                        <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                        <span className='text-white text-sm'>{movie.vote_average.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className='p-4'>
                                    <h3 className='font-semibold text-lg truncate'>{movie.title}</h3>
                                    <p className='text-sm text-gray-400 mt-1'>{new Date(movie.release_date).getFullYear()}</p>
                                    <p className='text-sm text-gray-300 mt-2 line-clamp-2'>{movie.overview}</p>
                                    <div className='flex items-center gap-2 mt-4'>
                                        <button
                                            onClick={() => handleToggleActive(movie)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md transition flex-1 justify-center ${
                                                movie.isActive
                                                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                            }`}
                                        >
                                            {movie.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                                            className='flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-md hover:bg-primary/30 transition flex-1 justify-center'
                                        >
                                            <EditIcon className='w-4 h-4' />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(movie._id)}
                                            className='flex items-center gap-2 bg-red-500/20 text-red-500 px-4 py-2 rounded-md hover:bg-red-500/30 transition flex-1 justify-center'
                                        >
                                            <TrashIcon className='w-4 h-4' />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className='flex items-center justify-center gap-2 mt-8'>
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
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-gray-400 text-lg'>No movies found</p>
                        <button 
                            onClick={() => navigate('/admin/add-movie')}
                            className='mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition'
                        >
                            Add Your First Movie
                        </button>
                    </div>
                )}
            </div>
        </>
    ) : <Loading />
}

export default ListMovies


