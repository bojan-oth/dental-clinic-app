import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/appointments/my-appointments');
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      setError('Could not fetch your appointments. Please try again.');
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`);
        setMessage('Appointment cancelled successfully!');
        fetchMyAppointments();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not delete appointment');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const isPastAppointment = (dateString, startTime) => {
    const [hours, minutes] = startTime.split(':');
    const appointmentDate = new Date(dateString);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return appointmentDate < new Date();
  };

  if (loading) {
    return <div className="text-center mt-5">Loading your appointments...</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Appointments</h2>
        <Link to="/patient-dashboard" className="btn btn-primary">Book New Appointment</Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {appointments.length === 0 ? (
        <div className="alert alert-info text-center p-5">
          <h4>You don't have any appointments yet.</h4>
          <p className="mb-3">Book your first appointment to get started!</p>
          <Link to="/patient-dashboard" className="btn btn-primary btn-lg">Book an Appointment</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Procedure</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => {
                const isPast = isPastAppointment(appt.date, appt.startTime);
                return (
                  <tr key={appt._id} className={isPast ? 'table-secondary' : ''}>
                    <td>{formatDate(appt.date)}</td>
                    <td><strong>{appt.startTime}</strong></td>
                    <td>{appt.procedure}</td>
                    <td>{appt.duration} min</td>
                    <td>
                      {isPast ? (
                        <span className="badge bg-secondary">Completed</span>
                      ) : (
                        <span className="badge bg-success">Upcoming</span>
                      )}
                    </td>
                    <td>
                      {!isPast && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteAppointment(appt._id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;