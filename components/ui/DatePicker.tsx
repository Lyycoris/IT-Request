
import React, { useState, useMemo, useRef, useEffect } from 'react';

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  onClose: () => void;
}

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, onClose }) => {
  const selectedDate = useMemo(() => value ? new Date(value + 'T00:00:00') : null, [value]);
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerRef, onClose]);
  
  const monthName = viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const changeMonth = (amount: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + amount, 1);
    setViewDate(newDate);
  };

  const handleDayClick = (day: number) => {
    const newSelectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatDate(newSelectedDate));
    onClose();
  };

  const handleTodayClick = () => {
    const today = new Date();
    setViewDate(today);
    onChange(formatDate(today));
    onClose();
  };
  
  const handleClearClick = () => {
      onChange('');
      onClose();
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();
    
    const days = [];
    // Blank days for padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="datepicker-day is-other-month"></div>);
    }
    
    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      
      const isSelected = selectedDate && formatDate(currentDate) === formatDate(selectedDate);
      const isToday = formatDate(currentDate) === formatDate(today);
      
      let classes = 'datepicker-day';
      if (isSelected) classes += ' is-selected';
      if (isToday && !isSelected) classes += ' is-today';
      
      days.push(
        <button key={day} className={classes} onClick={() => handleDayClick(day)}>
          {day}
        </button>
      );
    }
    return days;
  };

  return (
    <div className="datepicker-container" ref={pickerRef}>
      <div className="datepicker-header">
        <button onClick={() => changeMonth(-1)} aria-label="Bulan sebelumnya">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <span className="font-semibold text-sm">{monthName}</span>
        <button onClick={() => changeMonth(1)} aria-label="Bulan berikutnya">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
      <div className="datepicker-grid">
        {dayNames.map(day => <div key={day} className="datepicker-day-name">{day}</div>)}
        {renderDays()}
      </div>
      <div className="datepicker-footer">
        <button onClick={handleClearClick}>Hapus</button>
        <button onClick={handleTodayClick}>Hari ini</button>
      </div>
    </div>
  );
};
