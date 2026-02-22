import React, { useEffect, useState } from 'react'
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title.jsx';
import { CheckIcon, DeleteIcon, SearchIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import toast from 'react-hot-toast';
import { MOVIE_POSTER_PLACEHOLDER, resolveMovieImageUrl } from '../../lib/imageUrl';

const AddShows = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('theater1');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

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

    const fetchNowPlayingMovies = async () => {
        try {
            const response = await fetch('/api/admin/movies')
            const result = await response.json()
            if (result.success) {
                setNowPlayingMovies(result.movies)
            } else {
                toast.error('Failed to fetch movies')
                setNowPlayingMovies([])
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch movies')
            setNowPlayingMovies([])
        }
    };

    const buildDateTimeSelection = (inputValue, prevSelection) => {
        if (!inputValue) return prevSelection;
        const [date, time] = inputValue.split("T");
        if (!date || !time) return prevSelection;

        const times = prevSelection[date] || [];
        if (times.includes(time)) return prevSelection;
        return { ...prevSelection, [date]: [...times, time] };
    };

    const handleDateTimeAdd = () => {
        setDateTimeSelection(prev => buildDateTimeSelection(dateTimeInput, prev));
    };

    const handleDateTimeRemove = (date, time) => {
        setDateTimeSelection(prev => {
            const times = prev[date].filter(t => t !== time);
            if (times.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: times,
            };
        });
    };

    const handleAddShow = async () => {
        if (!selectedMovie) {
            toast.error('Please select a movie');
            return;
        }
        if (!showPrice || showPrice <= 0) {
            toast.error('Please enter a valid show price');
            return;
        }
        let nextDateTimeSelection = dateTimeSelection;
        if (Object.keys(nextDateTimeSelection).length === 0 && dateTimeInput) {
            nextDateTimeSelection = buildDateTimeSelection(dateTimeInput, nextDateTimeSelection);
            setDateTimeSelection(nextDateTimeSelection);
        }
        if (Object.keys(nextDateTimeSelection).length === 0) {
            toast.error('Please select at least one date and time');
            return;
        }

        try {
            // First, ensure the movie exists in the database
            const selectedMovieData = nowPlayingMovies.find(movie => movie._id === selectedMovie);
            if (!selectedMovieData) {
                toast.error('Selected movie not found');
                return;
            }

            const movieId = selectedMovie;

            // Now add the shows
            const showPromises = [];

            for (const [date, times] of Object.entries(nextDateTimeSelection)) {
                for (const time of times) {
                    const showDateTime = new Date(`${date}T${time}`);
                    const showData = {
                        movie: movieId,
                        showDateTime,
                        showPrice: parseFloat(showPrice)
                    };
                    showPromises.push(fetch('/api/admin/shows', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...showData,
                            theater: selectedTheater
                        })
                    }));
                }
            }

            const responses = await Promise.all(showPromises);
            const results = await Promise.all(responses.map(r => r.json()));

            const successCount = results.filter(r => r.success).length;
            const errorCount = results.length - successCount;

            if (successCount > 0) {
                toast.success(`${successCount} show(s) added successfully`);
                // Reset form
                setSelectedMovie(null);
                setDateTimeSelection({});
                setDateTimeInput("");
                setShowPrice("");
            }
            if (errorCount > 0) {
                toast.error(`${errorCount} show(s) failed to add`);
            }
        } catch (error) {
            toast.error('Failed to add shows');
            console.error(error);
        }
    };

    useEffect(() => {
        fetchNowPlayingMovies();
        // fetch available theaters
        (async () => {
            try {
                const res = await fetch('/api/theaters')
                const data = await res.json()
                if (data.success) {
                    setTheaters(data.theaters || [])
                    if (data.theaters && data.theaters.length > 0) {
                        setSelectedTheater(data.theaters[0]._id)
                        if (data.theaters[0].city) {
                            setSelectedCity(data.theaters[0].city)
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch theaters', err)
            }
        })()
    }, []);

    const filteredTheaters = selectedCity === 'All Cities'
        ? theaters
        : theaters.filter(th => th.city === selectedCity);

    useEffect(() => {
        if (filteredTheaters.length > 0 && !filteredTheaters.some(th => th._id === selectedTheater)) {
            setSelectedTheater(filteredTheaters[0]._id);
        }
    }, [filteredTheaters, selectedTheater]);

    const filteredMovies = nowPlayingMovies.filter(movie => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        const titleMatch = movie.title?.toLowerCase().includes(query);
        const genreMatch = (movie.genres || []).some(g => {
            const name = typeof g === 'string' ? g : g?.name;
            return name?.toLowerCase().includes(query);
        });
        return titleMatch || genreMatch;
    });

    const totalPages = Math.max(1, Math.ceil(filteredMovies.length / pageSize));
    const pageStart = (currentPage - 1) * pageSize;
    const pageMovies = filteredMovies.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const selectedMovieData = nowPlayingMovies.find(movie => movie._id === selectedMovie);

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Shows" />
            <div className='mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8'>
                <div className='bg-white border border-slate-200 rounded-xl p-6'>
                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <p className='text-lg font-medium'>Select Movie</p>
                        <div className='flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 w-full md:w-80'>
                            <SearchIcon className='w-4 h-4 text-slate-500' />
                            <input
                                type='text'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder='Search by movie or genre'
                                className='bg-transparent outline-none text-sm w-full text-gray-200 placeholder:text-gray-500'
                            />
                        </div>
                    </div>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6'>
                        {filteredMovies.length > 0 ? (
                            pageMovies.map((movie) => (
                                <button
                                    type='button'
                                    key={movie._id}
                                    onClick={() => setSelectedMovie(movie._id)}
                                    className={`relative text-left rounded-lg overflow-hidden border transition hover:-translate-y-1 ${
                                        selectedMovie === movie._id
                                            ? 'border-primary ring-2 ring-primary/30'
                                            : 'border-transparent'
                                    }`}
                                >
                                    <div className='relative'>
                                        <img
                                            src={resolveMovieImageUrl(movie.poster_path) || MOVIE_POSTER_PLACEHOLDER}
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.src = MOVIE_POSTER_PLACEHOLDER
                                            }}
                                            alt={movie.title}
                                            className='w-full h-52 object-cover brightness-90'
                                        />
                                        <div className='text-xs flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                                            <p className='flex items-center gap-1 text-slate-600'>
                                                <StarIcon className='w-3.5 h-3.5 text-primary fill-primary' />
                                                {movie.vote_average.toFixed(1)}
                                            </p>
                                            <p className='text-slate-600'>{kConverter(movie.vote_count)} Votes</p>
                                        </div>
                                    </div>
                                    {selectedMovie === movie._id && (
                                        <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                                            <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                                        </div>
                                    )}
                                    <div className='p-2'>
                                        <p className='font-medium text-sm truncate'>{movie.title}</p>
                                        <p className='text-slate-500 text-xs'>{movie.release_date}</p>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className='col-span-full text-center text-slate-500 py-8'>
                                No movies match your search.
                            </div>
                        )}
                    </div>
                    {filteredMovies.length > 0 && (
                        <div className='flex items-center justify-between mt-6 text-sm text-slate-500'>
                            <span>Showing {pageStart + 1}-{Math.min(pageStart + pageSize, filteredMovies.length)} of {filteredMovies.length}</span>
                            <span>Page {currentPage} of {totalPages}</span>
                        </div>
                    )}
                    {filteredMovies.length > 0 && (
                        <div className='flex items-center justify-center gap-2 mt-4'>
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className='px-3 py-2 rounded-md bg-gray-800 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                First
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className='px-3 py-2 rounded-md bg-gray-800 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Prev
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className='px-3 py-2 rounded-md bg-gray-800 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Next
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className='px-3 py-2 rounded-md bg-gray-800 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Last
                            </button>
                        </div>
                    )}
                </div>

                <div className='bg-white border border-slate-200 rounded-xl p-6 space-y-6'>
                    <div>
                        <p className='text-lg font-medium'>Show Details</p>
                        {selectedMovieData ? (
                            <div className='mt-4 flex gap-4'>
                                <img
                                    src={resolveMovieImageUrl(selectedMovieData.poster_path) || MOVIE_POSTER_PLACEHOLDER}
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = MOVIE_POSTER_PLACEHOLDER
                                    }}
                                    alt={selectedMovieData.title}
                                    className='w-20 h-28 rounded-md object-cover'
                                />
                                <div>
                                    <p className='font-semibold'>{selectedMovieData.title}</p>
                                    <p className='text-sm text-slate-500'>{selectedMovieData.release_date}</p>
                                    <p className='text-xs text-gray-500 mt-2 line-clamp-3'>{selectedMovieData.overview}</p>
                                </div>
                            </div>
                        ) : (
                            <p className='text-sm text-slate-500 mt-2'>Pick a movie from the list to continue.</p>
                        )}
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Select City</label>
                        <select
                            value={selectedCity}
                            onChange={e => setSelectedCity(e.target.value)}
                            className='border border-slate-200 bg-white p-2 rounded w-full'
                        >
                            <option value="All Cities">All Cities</option>
                            {indianCities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Select Theater</label>
                        <select value={selectedTheater} onChange={e => setSelectedTheater(e.target.value)} className='border border-slate-200 bg-white p-2 rounded w-full'>
                            {filteredTheaters.map(th => (
                                <option key={th._id} value={th._id}>{th.name} ({th.city || 'N/A'})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Show Price</label>
                        <div className='inline-flex items-center gap-2 border border-slate-200 bg-white px-3 py-2 rounded-md w-full'>
                            <p className='text-slate-500 text-sm'>{currency}</p>
                            <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} 
                            placeholder="Enter show price" className='outline-none bg-transparent w-full' />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm font-medium mb-2'>Select Date & Time</label>
                        <div className='flex flex-col sm:flex-row gap-3 border border-slate-200 bg-white p-2 rounded-lg'>
                            <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} 
                            className='outline-none rounded-md bg-transparent flex-1'/>
                            <button onClick={handleDateTimeAdd} className='bg-primary/80 text-white px-3 py-2 text-sm 
                            rounded-lg hover:bg-primary cursor-pointer'> 
                                Add Time 
                            </button>
                        </div>    
                    </div>

                    {Object.keys(dateTimeSelection).length > 0 && (
                        <div>
                            <h2 className='mb-2 text-sm font-medium'>Selected Date-Time</h2>
                            <ul className='space-y-3 text-sm'>
                                {Object.entries(dateTimeSelection).map(([date, times]) => (
                                    <li key={date}>
                                        <div className='font-medium'>{date}</div>
                                        <div className='flex flex-wrap gap-3 mt-1'>
                                            {times.map((time) => (
                                                <div key={time} className='border border-primary/40 px-2 py-1 flex items-center rounded'>
                                                    <span>{time}</span>
                                                    <DeleteIcon onClick={() => handleDateTimeRemove(date, time)} className='ml-2 text-red-500 hover:text-red-700 cursor-pointer'/>
                                                </div>
                                            ))}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button onClick={handleAddShow} className='bg-primary text-white px-8 py-2 rounded hover:bg-primary/90 transition-all cursor-pointer w-full'>
                        Add Show
                    </button>
                </div>
            </div>

        </>
    ) : <Loading />
}

export default AddShows;

