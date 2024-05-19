import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Button from './Button';
import '@fortawesome/fontawesome-free/css/all.min.css';

function EntityDashboard() {
    const { entity_display_name } = useParams();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        fetchRows();
    }, []);

    const fetchRows = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios({
                method: 'post',
                url: 'http://localhost:8000/api/v1/rows/read-rows',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                },
            });

            setRows(response.data.data[0]);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRow = async (rowId) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios({
                method: 'post',
                url: 'http://localhost:8000/api/v1/rows/delete-row',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                    row_id: rowId,
                },
            });

            // After successful deletion, fetch rows again to reflect changes
            fetchRows();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 mt-16">Entity Dashboard: {entity_display_name}</h1>
                <table className="w-full border-collapse mb-8">
                    <thead>
                        <tr>
                            {rows.length > 0 && Object.keys(rows[0]).map((key) => (
                                <th key={key} className="border border-gray-700 px-4 py-2 bg-gray-800">{key}</th>
                            ))}
                            <th className="border border-gray-700 px-4 py-2 bg-gray-800">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-800">
                                {Object.values(row).map((value, idx) => (
                                    <td key={idx} className="border border-gray-700 px-4 py-2">{value}</td>
                                ))}
                                <td className="border border-gray-700 px-4 py-2 flex space-x-4">
                                    <button 
                                        onClick={() => deleteRow(row.id)} 
                                        className="text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                    <Link 
                                        to={`/update-row/${entity_display_name}/${row.id}`} 
                                        className="text-blue-500 hover:text-blue-700 focus:outline-none"
                                    >
                                        <i className="fas fa-pen"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center">
                    <Button text="Insert Row" goto={`/insert-row/${entity_display_name}`} subtle neon />
                </div>
            </div>
        </div>
    );
}

export default EntityDashboard;
