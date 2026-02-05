const STORAGE_KEY = 'favoriteMovieIds'

export const getFavoriteIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export const isFavorite = (movieId) => {
  if (!movieId) return false
  return getFavoriteIds().includes(movieId)
}

export const toggleFavorite = (movieId) => {
  if (!movieId) return []
  const current = new Set(getFavoriteIds())
  if (current.has(movieId)) {
    current.delete(movieId)
  } else {
    current.add(movieId)
  }
  const updated = Array.from(current)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
