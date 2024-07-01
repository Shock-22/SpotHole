import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const StatusPage = () => {
    const [reports, setReports] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(5); // Change this number to adjust the number of reports per page

    useEffect(() => {
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
    }, []);

    // Get current reports
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <Navbar />
            <h2>Status Page</h2>
            <table className="status-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {currentReports.map(report => (
                        <tr key={report._id}>
                            <td>{report.description}</td>
                            <td>{report.location}</td>
                            <td>{report.status}</td>
                            <td>
                                {report.image && (
                                    <img
                                        src={`http://localhost:5000/${report.image}`}
                                        alt="report"
                                        style={{ width: '300px', height: '200px' }}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <ul className="pagination">
                {Array.from({ length: Math.ceil(reports.length / reportsPerPage) }, (_, i) => (
                    <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
                        <button onClick={() => paginate(i + 1)}>{i + 1}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StatusPage;
