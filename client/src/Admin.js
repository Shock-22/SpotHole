import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPage = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = () => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:5000/api/reports', {
            headers: { Authorization: token }
        })
        .then(response => {
            setReports(response.data);
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
        });
    };

    const handleStatusChange = (reportId, newStatus) => {
        const token = localStorage.getItem('token');
        axios.put(`http://localhost:5000/api/reports/${reportId}`, { status: newStatus }, {
            headers: { Authorization: token }
        })
        .then(response => {
            console.log('Status updated successfully:', response.data);
            fetchReports(); // Refresh reports after status update
        })
        .catch(error => {
            console.error('Error updating status:', error);
        });
    };

    return (
        <div>
            <h2>Admin Portal</h2>
            <table className="status-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map(report => (
                        <tr key={report._id}>
                            <td>{report.description}</td>
                            <td>{report.location}</td>
                            <td>{report.status}</td>
                            <td>
                                {report.status !== 'Completed' && (
                                    <button onClick={() => handleStatusChange(report._id, 'Completed')}>
                                        Mark as Completed
                                    </button>
                                )}
                                {report.status !== 'Approved' && (
                                    <button onClick={() => handleStatusChange(report._id, 'Approved')}>
                                        Approve
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
