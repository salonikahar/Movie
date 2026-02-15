import { ArrowRight, SearchIcon, SlidersHorizontal } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'

const FeaturedSection = ({
  movies = [],
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  genres = [],
  selectedGenre,
  onGenreChange
}) => {
  const navigate = useNavigate()
  return (

    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>

        <div className='relative flex items-center justify-between pt-16 pb-8'> 
            <BlurCircle top='0' right='-80px' />
            <p className='text-slate-800 font-semibold text-xl bms-section-title'>Now Showing</p>
            <button onClick={()=> navigate('/movies') }className='group flex items-center 
            gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer'>
                View All 
                <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' /> </button>
        </div>

        <div className='flex flex-col gap-4 bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-sm'>
            <div className='flex flex-col md:flex-row gap-4 md:items-center'>
                <div className='flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 flex-1'>
                    <SearchIcon className='w-4 h-4 text-slate-500' />
                    <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder='Search by movie or genre'
                        className='bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400'
                    />
                </div>
                <div className='flex gap-3 flex-col sm:flex-row'>
                    <div className='flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2'>
                        <SlidersHorizontal className='w-4 h-4 text-slate-500' />
                        <select
                            value={selectedGenre}
                            onChange={(e) => onGenreChange(e.target.value)}
                            className='bg-transparent text-sm text-slate-700 outline-none'
                        >
                            <option value='all'>All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2'>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value)}
                            className='bg-transparent text-sm text-slate-700 outline-none'
                        >
                            <option value='top'>Top Rated</option>
                            <option value='newest'>Newest</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {movies.length > 0 ? (
            <div className='flex flex-wrap max-sm:justify-center gap-8 mt-8'>
                {movies.slice(0, 8).map((show)=>(
                    <MovieCard key={show._id} movie={show} />
                ))}
            </div>
        ) : (
            <div className='mt-10 text-center text-slate-500'>
                No movies match your filters.
            </div>
        )}

        <div className='flex justify-center mt-20'>
            <button onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition
             rounded-md text-white font-semibold cursor-pointer'>Show More</button>
        </div>
    </div>
  )
}

export default FeaturedSection
