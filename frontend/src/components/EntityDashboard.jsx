import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import Button from './Button';  // Import your Button component

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

            const response = await axios({
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

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
    };

    const thStyle = {
        border: '1px solid #dddddd',
        padding: '8px',
        backgroundColor: '#333',
        color: 'white',
    };

    const tdStyle = {
        border: '1px solid #dddddd',
        padding: '8px',
    };

    return (
        <div>
            <Header />
            <h1>EntityDashboard: {entity_display_name}</h1>
            <Button text="Insert Row" goto={`/insert-row/${entity_display_name}`} />
            <table style={tableStyle}>
                <thead>
                    <tr>
                        {rows.length > 0 && Object.keys(rows[0]).map((key) => (
                            <th key={key} style={thStyle}>{key}</th>
                        ))}
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            {Object.values(row).map((value, idx) => (
                                <td key={idx} style={tdStyle}>{value}</td>
                            ))}
                            <td>
                                <button onClick={() => deleteRow(row.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EntityDashboard;
