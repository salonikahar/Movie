import React, { useEffect, useState } from "react"
import BlurCircle from "./BlurCircle"
import toast from "react-hot-toast"

const DateSelect = ({ dateTime, id, onDateSelect }) => {

  const [selected, setSelected] = useState(null)
  const [dates, setDates] = useState([])

  // Take dates directly from backend (next 5 days only)
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 4)
    endDate.setHours(23, 59, 59, 999)

    const backendDates = Object.keys(dateTime)
      .filter(date => {
        const d = new Date(date)
        return d >= today && d <= endDate
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
      <p className="text-gray-400 mt-6">
        No shows available
      </p>
    )
  }

  return (
    <div id="dateSelect" className="pt-20">

      <div className="relative p-8 bg-primary/10 border border-primary/20 rounded-lg">

        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0px" />

        <p className="text-lg font-semibold">Choose Date</p>

        <div className="flex flex-wrap gap-4 mt-5">

          {dates.map(date => {

            const d = new Date(date)

            return (
              <button
                key={date}
                onClick={() => setSelected(date)}
                className={`h-14 w-14 rounded flex flex-col items-center justify-center
                  ${selected === date
                    ? "bg-primary text-white"
                    : "border border-primary/60 hover:bg-primary/20"
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
          className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90"
        >
          Book Now
        </button>

      </div>
    </div>
  )
}

export default DateSelect
