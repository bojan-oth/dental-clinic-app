import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [date, setDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const fetchAppointmentsByDate = async () => {
    if (!date) {
      setError('Please select a date.');
      return;
    }
    setLoading(true);
    setError('');
    setShowAll(false);
    try {
      const res = await axios.get(`http://localhost:5000/api/appointments/admin?date=${date}`);
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch appointments');
      setAppointments([]);
    }
    setLoading(false);
  };

  const fetchAllAppointments = async () => {
    setLoading(true);
    setError('');
    setShowAll(true);
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/admin');
      setAppointments(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch appointments');
      setAppointments([]);
    }
    setLoading(false);
  };

  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`http://localhost:5000/api/appointments/${id}`);
        setMessage('Appointment deleted successfully.');
        if (showAll) {
          fetchAllAppointments();
        } else {
          fetchAppointmentsByDate();
        }
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p className="lead">Manage all appointments</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-4">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary me-2" onClick={fetchAppointmentsByDate}>
            Load Date
          </button>
          <button className="btn btn-info" onClick={fetchAllAppointments}>
            Show All Appointments
          </button>
        </div>
      </div>

      {loading && <div className="text-center">Loading...</div>}

      {appointments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Procedure</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td>{formatDate(appt.date)}</td>
                  <td>{appt.startTime}</td>
                  <td>{appt.patient?.name}</td>
                  <td>{appt.patient?.email}</td>
                  <td>{appt.patient?.phone}</td>
                  <td>{appt.procedure}</td>
                  <td>{appt.duration} min</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteAppointment(appt._id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && <p className="text-muted">No appointments found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;
