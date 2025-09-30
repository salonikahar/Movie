import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const { id, date } = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const s = dummyShowsData.find(show => show._id === id)
    if (s) setShow({ movie: s, dateTime: dummyDateTimeData })
  }, [id])

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Please select time first")
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
      return toast("You can only select 5 seats")
    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId])
  }

  const renderSeats = row => (
    <div key={row} className="flex gap-2 mb-1 justify-center">
      {Array.from({ length: 9 }, (_, i) => {
        const seatId = `${row}${i + 1}`
        return (
          <button
            key={seatId}
            onClick={() => handleSeatClick(seatId)}
            className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
              ${selectedSeats.includes(seatId) ? "bg-primary text-white" : ""}`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-10 md:pt-20'>
      {/* Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime[date].map(item => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md 
              cursor-pointer transition ${selectedTime?.time === item.time ? "bg-primary text-white" : "hover:bg-primary/20"}`}>
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0px" right="0px" />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt="screen"/>
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>

        {/* Rows A and B */}
        <div className='flex flex-col gap-2 mb-8 items-center'>
          {['A', 'B'].map(renderSeats)}
        </div>

        {/* Block 1: (C/D left, E/F right) */}
        <div className='flex flex-row gap-16 mb-8 justify-center'>
          <div className='flex flex-col'>{['C', 'D'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['E', 'F'].map(renderSeats)}</div>
        </div>
        
        {/* Block 2: (G/H left, I/J right) */}
        <div className='flex flex-row gap-16 justify-center'>
          <div className='flex flex-col'>{['G', 'H'].map(renderSeats)}</div>
          <div className='flex flex-col'>{['I', 'J'].map(renderSeats)}</div>
        </div>

        <button onClick={()=> navigate('/my-bookings')} className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary 
        hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
          Proceed To Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : <Loading />
}

export default SeatLayout
