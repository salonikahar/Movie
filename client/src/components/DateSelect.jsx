import React, { useEffect, useState } from "react"
import BlurCircle from "./BlurCircle"
import toast from "react-hot-toast"

const DateSelect = ({ dateTime, id, onDateSelect }) => {

  const [selected, setSelected] = useState(null)
  const [dates, setDates] = useState([])

  // Take dates directly from backend (future dates only)
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const backendDates = Object.keys(dateTime)
      .filter(date => {
        const d = new Date(date)
        return d >= today
      })
      .sort((a, b) => new Date(a) - new Date(b))

    setDates(backendDates)
  }, [dateTime])



  const onBookHandler = () => {
    if (!selected) {
      return toast("Please select a date")
    }
    onDateSelect(selected)
    window.scrollTo(0, 0)
  }

  if (dates.length === 0) {
    return (
      <p className="text-slate-500 mt-6">
        No shows available
      </p>
    )
  }

  return (
    <div id="dateSelect" className="pt-20">

      <div className="relative p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <p className="text-lg font-semibold text-slate-900">Choose Date</p>

        <div className="flex flex-wrap gap-4 mt-5">

          {dates.map(date => {

            const d = new Date(date)

            return (
              <button
                key={date}
                onClick={() => setSelected(date)}
                className={`h-14 w-14 rounded-xl flex flex-col items-center justify-center
                  ${selected === date
                    ? "bg-primary text-white"
                    : "border border-slate-200 text-slate-700 hover:border-primary/40 hover:bg-primary/10"
                  }`}
              >
                <span>{d.getDate()}</span>
                <span>{d.toLocaleString("en-US", { month: "short" })}</span>
              </button>
            )
          })}

        </div>

        <button
          onClick={onBookHandler}
          className="bg-primary text-white px-8 py-2 mt-6 rounded-md hover:bg-primary/90"
        >
          Book Now
        </button>

      </div>
    </div>
  )
}

export default DateSelect
