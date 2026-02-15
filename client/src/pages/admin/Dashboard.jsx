import { ChartLineIcon, IndianRupeeIcon, PlayCircleIcon, StarIcon, UsersIcon, CalendarClock } from 'lucide-react';
import { useEffect } from 'react';
import Title from '../../components/admin/Title';
import { useState } from 'react';
import Loading from '../../components/Loading';
import BlurCircle from '../../components/BlurCircle';
import { dateFormat } from '../../lib/dateFormat';
import toast from 'react-hot-toast';



const Dashboard = () => {


    const currency = import.meta.env.VITE_CURRENCY


    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        activeShows: [],
        totalUser: 0,
        totalMovies: 0,
        activeMovies: 0,
        inactiveMovies: 0,
        upcomingMovies: 0,
        releasedMovies: 0
    });
    const [loading, setLoading] = useState(true);

    const dashboardCard = [
        { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon, accent: 'from-emerald-500/30 to-emerald-500/5' },
        { title: "Total Revenue", value: `${currency} ${dashboardData.totalRevenue || 0}`, icon: IndianRupeeIcon, accent: 'from-amber-500/30 to-amber-500/5' },
        { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon, accent: 'from-sky-500/30 to-sky-500/5' },
        { title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon, accent: 'from-fuchsia-500/30 to-fuchsia-500/5' },
    ]


    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard')
            const result = await response.json()
            if (result.success) {
                setDashboardData({
                    totalBookings: result.stats.totalBookings,
                    totalRevenue: result.stats.totalRevenue,
                    activeShows: result.stats.activeShows,
                    totalUser: result.stats.totalUsers,
                    totalMovies: result.stats.totalMovies,
                    activeMovies: result.stats.activeMovies,
                    inactiveMovies: result.stats.inactiveMovies,
                    upcomingMovies: result.stats.upcomingMovies,
                    releasedMovies: result.stats.releasedMovies
                })
            } else {
                toast.error('Failed to fetch dashboard data')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to fetch dashboard data')
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        fetchDashboardData();
    }, []);


    return !loading ? (
        <>
            <Title text1="Admin" text2="Dashboard" />

            <div className='relative flex flex-wrap gap-4 mt-6'>
                <BlurCircle top="-100px" left="0px" />
                <div className='flex flex-wrap gap-4 w-full'>
                    {dashboardCard.map((card, index) => (
                        <div key={index} className={`flex items-center justify-between px-4 
                        py-4 bg-primary/10 border border-primary/20 rounded-md max-w-60 w-full bg-gradient-to-br ${card.accent}`}>
                            <div>
                                <h1 className='text-sm '>{card.title}</h1>
                                <p className='text-2xl font-semibold mt-1'>{card.value}</p>
                            </div>
                            <div className='w-11 h-11 rounded-full bg-black/30 flex items-center justify-center'>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 max-w-5xl'>
                <div className='bg-primary/10 border border-primary/20 rounded-xl p-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <p className='font-medium'>Movie Status</p>
                        <p className='text-sm text-gray-800'>Total: {dashboardData.totalMovies}</p>
                    </div>
                    {dashboardData.totalMovies > 0 ? (
                        <div className='space-y-4'>
                            <div>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                    <span>Active</span>
                                    <span>{dashboardData.activeMovies}</span>
                                </div>
                                <div className='h-2 rounded-full bg-gray-800 mt-2 overflow-hidden'>
                                    <div
                                        className='h-full bg-emerald-500'
                                        style={{
                                            width: `${Math.round((dashboardData.activeMovies / dashboardData.totalMovies) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                    <span>Inactive</span>
                                    <span>{dashboardData.inactiveMovies}</span>
                                </div>
                                <div className='h-2 rounded-full bg-gray-800 mt-2 overflow-hidden'>
                                    <div
                                        className='h-full bg-gray-500'
                                        style={{
                                            width: `${Math.round((dashboardData.inactiveMovies / dashboardData.totalMovies) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm text-gray-600'>No movies available.</p>
                    )}
                </div>

                <div className='bg-primary/10 border border-primary/20 rounded-xl p-5'>
                    <div className='flex items-center justify-between mb-4'>
                        <p className='font-medium'>Releases</p>
                        <p className='text-sm text-gray-600'>Today & future</p>
                    </div>
                    {(dashboardData.upcomingMovies + dashboardData.releasedMovies) > 0 ? (
                        <div className='space-y-4'>
                            <div>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                    <span>Upcoming</span>
                                    <span>{dashboardData.upcomingMovies}</span>
                                </div>
                                <div className='h-2 rounded-full bg-gray-800 mt-2 overflow-hidden'>
                                    <div
                                        className='h-full bg-sky-500'
                                        style={{
                                            width: `${Math.round((dashboardData.upcomingMovies / Math.max(1, dashboardData.totalMovies)) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className='flex items-center justify-between text-sm text-gray-600'>
                                    <span>Released</span>
                                    <span>{dashboardData.releasedMovies}</span>
                                </div>
                                <div className='h-2 rounded-full bg-gray-800 mt-2 overflow-hidden'>
                                    <div
                                        className='h-full bg-amber-500'
                                        style={{
                                            width: `${Math.round((dashboardData.releasedMovies / Math.max(1, dashboardData.totalMovies)) * 100)}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm text-gray-400'>No release data yet.</p>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between mt-10'>
                <p className='text-lg font-medium'>Active Shows</p>
                <div className='flex items-center gap-2 text-sm text-gray-400'>
                    <CalendarClock className='w-4 h-4' />
                    Updated just now
                </div>
            </div>

            <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl'>
                <BlurCircle top="100px" left="-100px" />
                {dashboardData.activeShows.length > 0 ? (
                    dashboardData.activeShows.map((show) => (
                        <div key={show._id} className='w-55 rounded-lg overflow-hidden h-full 
                        pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
                            <img src={show.movie.poster_path} alt='' className='h-60 w-full object-cover' />
                            <p className='font-medium p-2 truncate'>{show.movie.title}</p>
                            <div className='flex items-center justify-between px-2'>
                                <p className='text-lg font-medium'>{currency} {show.showPrice}</p>
                                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                                    <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                    {show.movie.vote_average.toFixed(1)}
                                </p>
                            </div>       
                            <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormat(show.showDateTime)}</p>
                        </div>
                    ))
                ) : (
                    <div className='text-gray-400 mt-6'>No active shows available.</div>
                )}

            </div>

        </>
    ) : <Loading />
}


export default Dashboard

