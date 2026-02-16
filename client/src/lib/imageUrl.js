export const MOVIE_POSTER_PLACEHOLDER = 'https://via.placeholder.com/500x750?text=No+Image'
export const MOVIE_BACKDROP_PLACEHOLDER = 'https://via.placeholder.com/1280x720?text=No+Image'

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const resolveMovieImageUrl = (path, size = 'w500') => {
  if (!path || typeof path !== 'string') return ''

  const trimmedPath = path.trim()
  if (!trimmedPath) return ''

  if (trimmedPath.startsWith('http://') || trimmedPath.startsWith('https://')) return trimmedPath
  if (trimmedPath.startsWith('//')) return `https:${trimmedPath}`

  const normalizedPath = trimmedPath.startsWith('/') ? trimmedPath : `/${trimmedPath}`
  return `${TMDB_IMAGE_BASE_URL}/${size}${normalizedPath}`
}
