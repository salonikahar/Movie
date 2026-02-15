import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Theater from './pages/Theater'
import Theaters from './pages/Theaters'
import SeatLayout from './pages/SeatLayout'
import Checkout from './pages/Checkout'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'
import Invoice from './pages/Invoice'
import Favorite from './pages/favorite'
import Releases from './pages/Releases'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddMovie from './pages/admin/AddMovie'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import ListMovies from './pages/admin/ListMovies'
import EditMovie from './pages/admin/EditMovie'
import EditShow from './pages/admin/EditShow'
import ListUsers from './pages/admin/ListUsers'
import AdminLogin from './pages/admin/AdminLogin'
import ListTheaters from './pages/admin/ListTheaters'
import ProtectedRoute from './components/ProtectedRoute'
import UserProtectedRoute from './components/UserProtectedRoute'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isAdminLogin = location.pathname === '/admin/login'

  return (
    <>
    <Toaster />
      {!isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SignIn/>} />
        <Route path='/sign-up' element={<SignUp/>} />
        <Route path='/movies' element={<Movies/>} />
        <Route path='/movies/:id' element={<MovieDetails/>} />
        <Route path='/movies/:id/theater' element={<Theater/>} />
        <Route path='/movies/:id/:date/:theaterId' element={
          <UserProtectedRoute>
            <SeatLayout/>
          </UserProtectedRoute>
        } />
        <Route path='/checkout' element={
          <UserProtectedRoute>
            <Checkout/>
          </UserProtectedRoute>
        } />
        <Route path='/theaters' element={<Theaters/>} />
        <Route path='/releases' element={<Releases/>} />
        <Route path='/my-bookings' element={
          <UserProtectedRoute>
            <MyBookings/>
          </UserProtectedRoute>
        } />
        <Route path='/profile' element={
          <UserProtectedRoute>
            <Profile/>
          </UserProtectedRoute>
        } />
        <Route path='/invoice/:bookingId' element={
          <UserProtectedRoute>
            <Invoice/>
          </UserProtectedRoute>
        } />
        <Route path='/favorite' element={<Favorite/>} />
        <Route path='/admin/login' element={<AdminLogin/>} />
        <Route path='/admin/*' element={
          <ProtectedRoute>
            <Layout/>
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard/>} />
          <Route path="add-movie" element={<AddMovie/>} />
          <Route path="list-movies" element={<ListMovies/>} />
          <Route path="edit-movie/:id" element={<EditMovie/>} />
          <Route path="edit-show/:id" element={<EditShow/>} />
          <Route path="add-shows" element={<AddShows/>} />
          <Route path="list-shows" element={<ListShows/>} />
          <Route path="list-theaters" element={<ListTheaters/>} />
          <Route path="list-bookings" element={<ListBookings/>} />
          <Route path="list-users" element={<ListUsers/>} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer/>}
    </>
  )
}
export default App 
