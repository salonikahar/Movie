import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import timeFormat from '../lib/timeFormat'

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const resolveImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${IMAGE_BASE_URL}${path}`;
};

const MovieCard = ({ movie }) => {

  const navigate = useNavigate()
  const primaryImage = resolveImageUrl(movie.poster_path) || "";
  const fallbackImage = resolveImageUrl(movie.backdrop_path) || "";
  const placeholderImage = "https://via.placeholder.com/500x750?text=No+Image";
  const imageSrc = primaryImage || fallbackImage || placeholderImage;


  return (
    <div className='flex flex-col justify-between p-3 bg-white border border-slate-200 rounded-2xl 
    hover:-translate-y-1 transition duration-300 w-60 shadow-sm'>

      <img onClick={() => { navigate(`/movies/${movie._id}`); scrollTo(0, 0) }}
        src={imageSrc}
        onError={(e) => {
          const nextSrc = e.target.src === primaryImage && fallbackImage
            ? fallbackImage
            : placeholderImage;
          e.target.onerror = null;
          e.target.src = nextSrc;
        }}
        alt={movie.title} className='rounded-xl h-72 w-full object-cover 
       object-top cursor-pointer'/>

      <p className='font-semibold mt-3 text-slate-900 truncate'>{movie.title}</p>

      <p className='text-sm text-slate-500 mt-2'>
        {new Date(movie.release_date).getFullYear()} | {movie.genres.slice(0, 2).
          map(genre => genre.name).join(" | ")} | {timeFormat(movie.runtime)}
      </p>

      <div className='flex items-center justify-between mt-4 pb-3'>
        <button onClick={() => { navigate(`/movies/${movie._id}/theater`); scrollTo(0, 0) }} className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition
            rounded-full text-white font-semibold cursor-pointer'>Book</button>

        <p className='flex items-center gap-1 text-sm text-slate-500 mt-1 pr-1'>
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
