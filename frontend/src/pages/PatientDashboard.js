import React, { useState } from 'react';
import axios from 'axios';

const procedureOptions = [
  'Basic Check-up',
  'Cavity Filling',
  'Deep Cleaning',
  'Tooth Extraction',
  'Root Canal Treatment',
];

const PatientDashboard = () => {
  const [date, setDate] = useState('');
  const [procedure, setProcedure] = useState('');
  const [hours, setHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const isWeekend = (dateString) => {
    if (!dateString) return false;
    const day = new Date(dateString).getDay();
    return day === 0 || day === 6;
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setDate(val);
    setSelectedHour('');
    setSlots([]);
    setSelectedSlot('');
    if (isWeekend(val)) {
      setError('Weekend appointments are not available. Please select Monday-Friday.');
    } else {
      setError('');
    }
  };

  const fetchHours = async () => {
    if (!date || !procedure) {
      setError('Please select a date and procedure.');
      return;
    }
    if (isWeekend(date)) {
      setError('Weekend appointments are not available.');
      return;
    }
    setError('');
    setSlots([]);
    setSelectedSlot('');
    setSelectedHour('');
    setMessage('');

    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/available?date=${date}&procedure=${encodeURIComponent(procedure)}`
      );
      if (res.data.availableHours) {
        setHours(res.data.availableHours);
        if (res.data.availableHours.length === 0) {
          setMessage('No available hours for this date.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch available hours');
      setHours([]);
    }
  };

  const fetchSlotsForHour = async (hour) => {
    setSelectedHour(hour);
    setSelectedSlot('');
    setError('');
    setMessage('');
    const hourNumber = hour.split(':')[0];
    try {
      const res = await axios.get(
        `http://localhost:5000/api/appointments/available?date=${date}&procedure=${encodeURIComponent(procedure)}&hour=${hourNumber}`
      );
      setSlots(res.data.availableSlots || []);
      if (res.data.availableSlots && res.data.availableSlots.length === 0) {
        setMessage('No available slots for this hour.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch slots');
      setSlots([]);
    }
  };

  const bookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }
    setError('');
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        date,
        startTime: selectedSlot,
        procedure,
      });
      setMessage(`Appointment booked successfully for ${date} at ${selectedSlot}!`);
      if (selectedHour) {
        fetchSlotsForHour(selectedHour);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <p className="lead">Select a date, procedure, and time slot.</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
          />
          {isWeekend(date) && (
            <small className="text-danger">Weekends are not available.</small>
          )}
        </div>
        <div className="col-md-4">
          <label className="form-label">Procedure</label>
          <select
            className="form-select"
            value={procedure}
            onChange={(e) => {
              setProcedure(e.target.value);
              setSelectedHour('');
              setSlots([]);
              setSelectedSlot('');
            }}
          >
            <option value="">-- Choose Procedure --</option>
            {procedureOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={fetchHours}
            disabled={isWeekend(date) || !date || !procedure}
          >
            Check Availability
          </button>
        </div>
      </div>

      {hours.length > 0 && (
        <div className="mb-4">
          <h5>Select Hour</h5>
          <div className="d-flex flex-wrap gap-2">
            {hours.map((hour) => (
              <button
                key={hour}
                className={`btn ${selectedHour === hour ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => fetchSlotsForHour(hour)}
              >
                {hour}
              </button>
            ))}
          </div>
        </div>
      )}

      {slots.length > 0 && (
        <div className="mb-4">
          <h5>Available Time Slots for {selectedHour}</h5>
          <div className="d-flex flex-wrap gap-2">
            {slots.map((slot) => (
              <button
                key={slot}
                className={`btn ${selectedSlot === slot ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
          <button
            className="btn btn-lg btn-success mt-3"
            onClick={bookAppointment}
            disabled={!selectedSlot}
          >
            {selectedSlot ? `Book Appointment at ${selectedSlot}` : 'Select a time slot'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
