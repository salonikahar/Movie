import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dummyShowsData, assets } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import DateSelect from '../components/DateSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'
import { isFavorite, toggleFavorite } from '../lib/favorites'
import toast from 'react-hot-toast'
import { MOVIE_POSTER_PLACEHOLDER, resolveMovieImageUrl } from '../lib/imageUrl'

const MovieDetails = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [show, setShow] = useState(null)
  const [favorite, setFavorite] = useState(false)

  const getShow = async ()=>{
    try {
      const response = await fetch('/api/movies');
      const data = await response.json();
      if (data.success) {
        const movie = data.movies.find(m => m._id === id);
        if (movie) {
          // Fetch shows for dateTime
          const showResponse = await fetch('/api/shows');
          const showData = await showResponse.json();
          if (showData.success) {
            const shows = showData.shows.filter(show => {
              // show.movie may be populated (object) or be a string id -- normalize to id string
              const movieId = typeof show.movie === 'string' ? show.movie : show.movie?._id;
              return movieId === id;
            });
            const dateTimeObj = {};
            shows.forEach(show => {
              const date = new Date(show.showDateTime).toLocaleDateString('sv-SE');
              if (!dateTimeObj[date]) dateTimeObj[date] = [];
              dateTimeObj[date].push({
                time: show.showDateTime,
                showId: show._id,
                theaterId: show.theater
              });
            });
            setShow({
              movie: movie,
              dateTime: dateTimeObj
            });
            setFavorite(isFavorite(movie._id))
          } else {
            setShow({
              movie: movie,
              dateTime: {} // No shows available
            });
            setFavorite(isFavorite(movie._id))
          }
        }
      }
    } catch (error) {
      console.error('Error fetching movie or shows:', error);
    }
  }

useEffect(()=>{
  getShow()
},[id])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-32 md:pt-36'>
      <div className='flex flex-col md:flex-row gap-8 max-w-6xl mx-auto'>
        <img
          src={resolveMovieImageUrl(show.movie.poster_path) || MOVIE_POSTER_PLACEHOLDER}
          onError={(e) => {
            e.target.onerror = null
            e.target.src = MOVIE_POSTER_PLACEHOLDER
          }}
          alt=""
          className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover shadow-sm'
        />

        <div className='relative flex flex-col gap-3'>
          <BlurCircle top="-100px" left="-100px" />
          <p className='text-primary text-sm font-semibold uppercase tracking-wide'>English</p>
          <h1 className='text-4xl font-semibold max-w-96 text-balance text-slate-900'>{show.movie.title}</h1>
          <div className='flex items-center gap-2 text-slate-600'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {show.movie.vote_average.toFixed(1)} User Rating 
          </div>
          <p className='text-slate-500 mt-2 text-sm leading-tight max-w-xl'>{show.movie.overview}</p>

          <p className='text-slate-600'>
            {timeFormat(show.movie.runtime)} | {show.movie.genres.map(genres => genres.name)
            .join(", ")} | {show.movie.release_date.split("-")[0]}
          </p>
          <div className='flex items-center flex-wrap gap-4 mt-4'>
            <button className='flex items-center gap-2 px-7 py-3 text-sm border border-slate-300 text-slate-700 
            hover:border-primary/50 hover:text-slate-900 transition rounded-md font-medium cursor-pointer active:scale-95 bg-white'>
              <PlayCircleIcon className="w-5 h-5"/>
              Watch Trailer
              </button>
            <button onClick={() => navigate(`/movies/${id}/theater`)} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md text-white font-semibold cursor-pointer active:scale-95'>Buy Tickets</button>
            <button
              onClick={() => {
                const updated = toggleFavorite(id)
                const nowFavorite = updated.includes(id)
                setFavorite(nowFavorite)
                toast.success(nowFavorite ? 'Added to favorites' : 'Removed from favorites')
              }}
              className='bg-slate-100 p-2.5 rounded-full transition cursor-pointer active:scale-95 border border-slate-200 hover:border-primary/40'
            >
              <Heart className={`w-5 h-5 ${favorite ? 'text-primary fill-primary' : 'text-slate-500'}`}/> 
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-semibold mt-16 text-slate-900'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
              {show.movie.casts.slice(0,12).map((cast,index)=>(
                <div key={index} className='flex flex-col items-center text-center'>
                  <img
                    src={resolveMovieImageUrl(cast.profile_path, 'w185') || assets.profile}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = assets.profile
                    }}
                    alt=""
                    className='rounded-full h-20 md:h-20 aspect-square object-cover'
                  />
                  <p className='font-medium text-xs mt-3'>{cast.name}</p>
                </div>
              ))}
        </div>
      </div>
      
      <DateSelect dateTime={show.dateTime} id={id} onDateSelect={(date) => navigate(`/movies/${id}/theater`)} />

      <p className='text-lg font-semibold mt-16 mb-8 text-slate-900'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {dummyShowsData.slice(0,4).map((movie, index)=>(
          <MovieCard key={index} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-20'>
        <button  onClick={()=> {navigate('/movies'); scrollTo(0,0)}} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md 
        text-white font-semibold cursor-pointer'>
          Show more
        </button>
      </div>
    </div>
  ) : <Loading />
}

export default MovieDetails
