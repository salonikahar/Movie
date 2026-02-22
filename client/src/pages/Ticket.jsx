import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import { Download, ArrowLeft, Ticket, CheckCircle } from 'lucide-react'
import { dateFormat } from '../lib/dateFormat'
import BlurCircle from '../components/BlurCircle'
import toast from 'react-hot-toast'

const TicketPage = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('userToken')
        const response = await fetch(`/api/bookings/invoice/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (data.success) {
          setBooking(data.booking)
        } else {
          toast.error('Ticket not found')
          navigate('/my-bookings')
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to load ticket')
        navigate('/my-bookings')
      } finally {
        setLoading(false)
      }
    }

    if (bookingId) {
      fetchTicket()
    }
  }, [bookingId, navigate])

  const handleDownload = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Popup blocked. Allow popups to download ticket.')
      return
    }

    const escapeHTML = (value) =>
      String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

    const formatTicketDate = (dateValue) => {
      const d = new Date(dateValue)
      if (Number.isNaN(d.getTime())) return 'N/A'
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}/${m}/${day}`
    }

    const movieName = escapeHTML(booking?.show?.movie?.title || 'MOVIE NAME')
    const ticketNo = escapeHTML(booking?.bookingId || '00000000')
    const theaterRaw = booking?.show?.theater || 'theater1'
    const theaterDisplay = escapeHTML(String(theaterRaw).replace(/[^0-9]/g, '') || theaterRaw)
    const seats = booking?.bookedSeats?.length ? booking.bookedSeats : ['10', '11']
    const seatDisplay = escapeHTML(seats.join('/'))
    const dateDisplay = escapeHTML(formatTicketDate(booking?.show?.showDateTime))
    const barcodeNumber = escapeHTML(
      String(booking?.bookingId || '355456233678').replace(/[^0-9]/g, '').padEnd(12, '7').slice(0, 12)
    )

    printWindow.document.write(`
      <html>
        <head>
          <title>Ticket - ${ticketNo}</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 24px;
              background: #f1f5f9;
              font-family: 'Arial Narrow', Arial, sans-serif;
              color: #163a5a;
            }
            .ticket-wrap {
              max-width: 980px;
              margin: 0 auto;
              border: 10px solid #242424;
              background: #ffffff;
            }
            .ticket {
              position: relative;
              display: grid;
              grid-template-columns: 32% 68%;
              min-height: 290px;
              overflow: hidden;
              background: repeating-linear-gradient(
                120deg,
                #ffffff,
                #ffffff 42px,
                #f4f7fb 42px,
                #f4f7fb 82px
              );
            }
            .top-band {
              position: absolute;
              left: 0;
              right: 0;
              top: 36px;
              height: 42px;
              background: #1f4466;
              color: #f8fbff;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 36px;
              font-size: 28px;
              letter-spacing: 2px;
            }
            .top-band .small {
              font-size: 26px;
              letter-spacing: 1px;
            }
            .stub, .main {
              position: relative;
              padding-top: 96px;
              z-index: 1;
            }
            .stub {
              padding-left: 26px;
              padding-right: 26px;
              border-right: 4px dotted #1f4466;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .main {
              padding-left: 42px;
              padding-right: 32px;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
            .cut-top, .cut-bottom {
              position: absolute;
              left: calc(32% - 18px);
              width: 0;
              height: 0;
              border-left: 18px solid transparent;
              border-right: 18px solid transparent;
              z-index: 2;
            }
            .cut-top {
              top: 0;
              border-top: 18px solid #1f4466;
            }
            .cut-bottom {
              bottom: 0;
              border-bottom: 18px solid #1f4466;
            }
            .label {
              font-size: 20px;
              letter-spacing: 1px;
              margin: 0;
            }
            .value {
              font-size: 40px;
              line-height: 1;
              font-weight: 700;
              margin: 0;
              letter-spacing: 1px;
            }
            .title {
              margin: 0;
              font-size: 54px;
              letter-spacing: 2px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .meta {
              margin: 8px 0 0;
              font-size: 30px;
              letter-spacing: 2px;
            }
            .stub-circle {
              width: 88px;
              height: 88px;
              border: 2px solid #5f7e99;
              border-radius: 50%;
              margin-bottom: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 34px;
            }
            .stub-line, .main-line {
              margin: 5px 0;
              font-size: 38px;
              letter-spacing: 1px;
            }
            .main-grid {
              margin-top: 22px;
              display: grid;
              grid-template-columns: 1fr auto;
              gap: 18px;
              align-items: end;
            }
            .seat-big {
              font-size: 70px;
              font-weight: 700;
              letter-spacing: 2px;
              line-height: 1;
              text-align: right;
            }
            .barcode {
              margin-top: 8px;
              width: 290px;
              height: 64px;
              background:
                repeating-linear-gradient(
                  to right,
                  #111 0px, #111 2px,
                  transparent 2px, transparent 5px,
                  #111 5px, #111 7px,
                  transparent 7px, transparent 10px
                );
              border: 1px solid #94a3b8;
            }
            .barcode-text {
              text-align: center;
              font-size: 11px;
              letter-spacing: 1px;
              margin-top: 4px;
              color: #4b5563;
            }
            @media print {
              body { padding: 0; background: #fff; }
              .ticket-wrap { border: 6px solid #242424; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-wrap">
            <div class="ticket">
              <div class="top-band">
                <div class="small">NO. ${ticketNo}</div>
                <div>MOVIE TICKET</div>
              </div>
              <div class="cut-top"></div>
              <div class="cut-bottom"></div>
              <div class="stub">
                <div class="stub-circle">&#127909;</div>
                <p class="stub-line">THEATER: ${theaterDisplay}</p>
                <p class="stub-line">SEAT: ${seatDisplay}</p>
                <p class="stub-line">DATE: ${dateDisplay}</p>
              </div>
              <div class="main">
                <h1 class="title">${movieName}</h1>
                <p class="meta">NO. ${ticketNo}</p>
                <div class="main-grid">
                  <div>
                    <p class="main-line">THEATER: ${theaterDisplay} &nbsp;&nbsp;&nbsp; SEAT: ${seatDisplay}</p>
                    <p class="main-line">DATE: ${dateDisplay}</p>
                    <div class="barcode"></div>
                    <div class="barcode-text">${barcodeNumber}</div>
                  </div>
                  <div class="seat-big">S:${seatDisplay}</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) return <Loading />
  if (!booking) return null

  const movie = booking.show?.movie
  const show = booking.show

  return (
    <div className='relative min-h-screen pt-32 pb-16 px-6 md:px-16 lg:px-40'>
      <BlurCircle top='50px' left='50px' />
      <BlurCircle bottom='50px' right='50px' />

      <div className='max-w-4xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <button
            onClick={() => navigate('/my-bookings')}
            className='flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-slate-700'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Bookings
          </button>
          <button
            onClick={handleDownload}
            className='flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg transition'
          >
            <Download className='w-4 h-4' />
            Download Ticket
          </button>
        </div>

        <div id='ticket-content' className='bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 shadow-sm'>
          <div className='flex items-start justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-slate-900'>BookMyScreen Ticket</h1>
              <p className='text-slate-500 mt-1'>Show this ticket at theater entry</p>
            </div>
            <div className='flex items-center gap-2'>
              <span className='px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700'>
                {booking.isPaid ? 'Paid' : 'Pending'}
              </span>
              {booking.isPaid && <CheckCircle className='w-5 h-5 text-green-600' />}
            </div>
          </div>

          <div className='flex items-center gap-2 text-primary mb-4'>
            <Ticket className='w-5 h-5' />
            <p className='font-semibold'>Booking ID: {booking.bookingId}</p>
          </div>

          <div className='grid md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4'>
            <div>
              <p className='text-sm text-slate-500'>Movie</p>
              <p className='font-semibold text-slate-900'>{movie?.title || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Theater</p>
              <p className='font-semibold text-slate-900'>{show?.theater || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Date & Time</p>
              <p className='font-semibold text-slate-900'>{show?.showDateTime ? dateFormat(show.showDateTime) : 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Seats</p>
              <p className='font-semibold text-slate-900'>{(booking.bookedSeats || []).join(', ') || 'N/A'}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Tickets</p>
              <p className='font-semibold text-slate-900'>{(booking.bookedSeats || []).length}</p>
            </div>
            <div>
              <p className='text-sm text-slate-500'>Amount Paid</p>
              <p className='font-semibold text-primary'>Rs. {booking.amount}</p>
            </div>
          </div>

          <div className='mt-6 text-sm text-slate-500'>
            <p>Customer: {booking.user?.name || user?.name || 'Guest'}</p>
            <p>Email: {booking.user?.email || user?.email || 'N/A'}</p>
            <p className='mt-2'>Please arrive 15 minutes before showtime.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketPage
