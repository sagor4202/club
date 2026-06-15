import React, { useState } from "react";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function ReservationCalendar({ mode = "view", onRangeChange, onAvailabilityChange, bookedDates = [] }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    if (mode === "view") return;

    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return;

    const getWeekStart = (date) => {
      const sunday = new Date(date);
      sunday.setDate(date.getDate() - date.getDay());
      sunday.setHours(0, 0, 0, 0);
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      if (sunday < t) sunday.setDate(sunday.getDate() + 7);
      return sunday;
    };

    if (mode === "manage") {
      const sunday = getWeekStart(selectedDate);
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      const weekDates = [];
      for (let d = new Date(sunday); d <= saturday; d.setDate(d.getDate() + 1)) {
        weekDates.push(new Date(d).toDateString());
      }

      const isWeekMarked = weekDates.length > 0 && weekDates.every(ds => availableDates.includes(ds));
      const newDates = isWeekMarked
        ? availableDates.filter(d => !weekDates.includes(d))
        : [...new Set([...availableDates, ...weekDates])];

      setAvailableDates(newDates);
      if (onAvailabilityChange) onAvailabilityChange(newDates);
      return;
    }

    const sunday = getWeekStart(selectedDate);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);

    let isWeekBooked = false;
    for (let d = new Date(sunday); d <= saturday; d.setDate(d.getDate() + 1)) {
      if (bookedDates.includes(d.toDateString())) {
        isWeekBooked = true;
        break;
      }
    }
    if (isWeekBooked) return;

    if (!startDate || sunday.getTime() === startDate.getTime() || sunday < startDate) {
      setStartDate(sunday);
      setEndDate(saturday);
      if (onRangeChange) onRangeChange(sunday, saturday);
    } else {
      let hasBookingConflict = false;
      const checkStart = new Date(startDate);
      while (checkStart <= saturday) {
        if (bookedDates.includes(checkStart.toDateString())) {
          hasBookingConflict = true;
          break;
        }
        checkStart.setDate(checkStart.getDate() + 1);
      }

      if (hasBookingConflict) {
        setStartDate(sunday);
        setEndDate(saturday);
        if (onRangeChange) onRangeChange(sunday, saturday);
      } else {
        setEndDate(saturday);
        if (onRangeChange) onRangeChange(startDate, saturday);
      }
    }
  };

  const getDayStatus = (day) => {
    if (!day) return "empty";
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = date.toDateString();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (bookedDates.includes(dateStr)) {
      return "past-marked";
    }

    if (mode === "manage") {
      if (date < today) return "past";
      return availableDates.includes(dateStr) ? "available-marked" : "available";
    }

    if (date < today) return "past";
    if (startDate && date.getTime() === startDate.getTime()) return "start";
    if (endDate && date.getTime() === endDate.getTime()) return "end";
    if (startDate && endDate && date > startDate && date < endDate) return "range";
    return "available";
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startOffset = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const prevMonthTotalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth() - 1);

    for (let i = startOffset - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="h-16 md:h-[88px] flex items-center justify-center text-white/[0.04] text-xs md:text-sm border-r border-b border-white/[0.03]">
          {prevMonthTotalDays - i}
        </div>
      );
    }

    for (let i = 1; i <= totalDays; i++) {
      const status = getDayStatus(i);
      const isStart = status === "start";
      const isEnd = status === "end";
      const isInRange = status === "range";
      const isPast = status === "past";
      const isPastMarked = status === "past-marked";
      const isMarked = status === "available-marked";

      const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
      const isDateBooked = bookedDates.includes(currentDate.toDateString());

      days.push(
        <div
          key={`curr-${i}`}
          onClick={() => mode !== 'view' && !isPast && !isDateBooked && handleDateClick(i)}
          className={`h-16 md:h-[88px] flex items-center justify-center text-xs md:text-sm font-bold relative transition-all duration-200 border-r border-b border-white/[0.03]
            ${mode === 'view' || isDateBooked ? 'cursor-default' : 'cursor-pointer'}
            ${isPast ? "text-white/[0.08] bg-black/30" : "text-white/80"}
            ${mode !== 'view' && !isPast && !isDateBooked ? 'hover:bg-white/[0.06] hover:text-white' : ''}
            ${isPastMarked ? "!text-[#E3087E]/20 cursor-not-allowed bg-[#E3087E]/[0.06]" : ""}
            ${isStart || isEnd ? "bg-gradient-to-b from-[#E3087E] to-[#C00A65] !text-white z-10 shadow-lg shadow-[#E3087E]/30" : ""}
            ${isInRange ? "bg-[#E3087E]/[0.12] !text-[#E3087E]" : ""}
            ${isMarked ? "bg-[#E3087E]/20 !text-white border-[#E3087E]/40" : ""}
          `}
        >
          <span className="relative z-10">{i}</span>
          {isStart && <div className="absolute inset-0 border border-white/20 rounded-sm" />}
          {(isMarked || isPastMarked) && <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E3087E] rounded-full shadow-[0_0_6px_rgba(227,8,126,0.6)]" />}
        </div>
      );
    }

    const totalRendered = days.length;
    for (let i = 1; i <= 42 - totalRendered; i++) {
      days.push(
        <div key={`next-${i}`} className="h-16 md:h-[88px] flex items-center justify-center text-white/[0.04] text-xs md:text-sm border-r border-b border-white/[0.03]">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.08] overflow-hidden backdrop-blur-3xl shadow-[0_8px_30px_rgba(227,8,126,0.12)]">
      <div className="bg-gradient-to-r from-white/[0.04] to-transparent px-5 py-5 border-b border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E3087E]/10 flex items-center justify-center text-[#E3087E]">
            <span className="material-symbols-outlined text-lg">calendar_today</span>
          </div>
          <div>
            <h3 className="text-white font-bold uppercase tracking-[0.15em] text-xs">
              {mode === "manage" ? "My Availability" : mode === "book" ? "Select Week" : "Availability Calendar"}
            </h3>
            {mode !== "manage" && (
            <p className="text-white/20 text-[9px] uppercase tracking-widest mt-0.5">
              {mode === "book" ? "Tap a week (Sunday to Saturday)" : "Please select 7 nights minimum"}
            </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-5 bg-black/30 px-5 py-2.5 rounded-xl border border-white/[0.04]">
          <button onClick={handlePrevMonth} className="text-white/30 hover:text-[#E3087E] transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <span className="text-white font-bold tracking-[0.2em] text-[11px] min-w-[130px] text-center">
            {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
          </span>
          <button onClick={handleNextMonth} className="text-white/30 hover:text-[#E3087E] transition-colors">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-white/[0.02]">
        {weekDays.map(d => (
          <div key={d} className="py-3.5 text-center text-white/[0.25] text-[9px] font-bold uppercase tracking-widest border-r border-white/[0.03] last:border-r-0">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-l border-white/[0.03]">
        {renderDays()}
      </div>

      <div className="bg-white/[0.02] px-5 py-3.5 flex items-center justify-between gap-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[9px] text-white/25 uppercase tracking-widest font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-white/[0.04] border border-white/[0.08]" /> Empty
          </div>
          <div className="flex items-center gap-2 text-[9px] text-[#E3087E]/60 uppercase tracking-widest font-bold">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E3087E]/20 border border-[#E3087E]/40" /> Marked
          </div>
        </div>
        {mode === "manage" && (
          <span className="text-white/15 text-[9px] uppercase tracking-widest font-bold">Tap a week to toggle</span>
        )}
      </div>
    </div>
  );
}
