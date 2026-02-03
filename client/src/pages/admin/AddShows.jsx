import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title.jsx';
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react';
import { kConverter } from '../../lib/kConverter';
import toast from 'react-hot-toast';

const AddShows = () => {
    const currency = import.meta.env.VITE_CURRENCY
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("");
    const [showPrice, setShowPrice] = useState("");
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('theater1');

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

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return;
        const [date, time] = dateTimeInput.split("T");
        if(!date || !time) return;

        setDateTimeSelection(prev => {
            const times = prev[date] || [];
            if (!times.includes(time)) {
                return { ...prev, [date]: [...times, time] };
            }
            return prev;
        });
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
        if (Object.keys(dateTimeSelection).length === 0) {
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

            for (const [date, times] of Object.entries(dateTimeSelection)) {
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
                    }
                }
            } catch (err) {
                console.error('Failed to fetch theaters', err)
            }
        })()
    }, []);

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Shows" />
            <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
            <div className='overflow-x-auto pb-4'>
                <div className='group flex flex-wrap gap-4 mt-4 w-max'>
                    {nowPlayingMovies.map((movie) => (
                        <div key={movie._id} className={`relative max-w-40 cursor-pointer group-hover:opacity-40 hover:-translate-y-1 transition-all duration-300`} onClick={() => setSelectedMovie(movie._id)}>
                            <div className='relative rounded-lg overflow-hidden'>
                                <img src={movie.poster_path} alt="" className='w-full object-cover brightness-90' />
                                <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                                    <p className='flex items-center gap-1 text-gray-400'>
                                        <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                    <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
                                </div>
                            </div>
                            {selectedMovie === movie._id && (
                                <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                                    <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                                </div>
                            )}
                            <p className='font-medium truncate'>{movie.title}</p>
                            <p className='text-gray-400 text-sm'>{movie.release_date}</p>

                        </div>
                    ))}
                </div>
            </div>

            {/* show price input */}
            <div className='mt-8'>
                <label className='block text-sm font-medium mb-2'>Show Price</label>
                <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
                    <p className='text-gray-400 text-sm'>{currency}</p>
                    <input min={0} type="number" value={showPrice} onChange={(e) => setShowPrice(e.target.value)} 
                    placeholder="Enter show price" className='outline-none' />
                </div>
            </div>

            {/* date and time selection */}
            <div className='mt-6'>
                    <label className='block text-sm font-medium mb-2'>Select Date & Time</label>
                    <div className='inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg'>
                        <input type="datetime-local" value={dateTimeInput} onChange={(e) => setDateTimeInput(e.target.value)} 
                        className='outline-none rounded-md'/>
                        <button onClick={handleDateTimeAdd} className='bg-primary/80 text-white px-3 py-2 text-sm 
                        rounded-lg hover:bg-primary cursor-pointer'> 
                            Add Time 
                        </button>
                    </div>    
            </div>   

            {/* Display selected times */}
            {Object.keys(dateTimeSelection).length > 0 && (
                <div className='mt-6'>
                    <h2 className='mb-2'> Selected Date-Time</h2>
                    <ul className='space-y-3'>
                        {Object.entries(dateTimeSelection).map(([date, times]) => (
                            <li key={date}>
                                <div className='font-medium'>{date}</div>
                                <div className='flex flex-wrap gap-3 mt-1 text-sm'>
                                    {times.map((time) => (
                                        <div key={time} className='border border-primary px-2 py-1 flex items-center rounded'>
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
            <button onClick={handleAddShow} className='bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer'>
            Add Show
            </button>

            {/* Theater selection (admin) */}
            <div className='mt-6'>
                <label className='block text-sm font-medium mb-2'>Select Theater</label>
                <select value={selectedTheater} onChange={e => setSelectedTheater(e.target.value)} className='border p-2 rounded'>
                    {theaters.map(th => (
                        <option key={th._id} value={th._id}>{th.name} ({th._id})</option>
                    ))}
                </select>
            </div>

        </>
    ) : <Loading />
}

export default AddShows;
