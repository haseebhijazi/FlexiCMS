import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
import Header from './Header';
import Table from './Table';

function Dashboard() {
    const [extractedData, setExtractedData] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 140 },
        { field: 'entities_id', headerName: 'Entity ID', width: 140},
        { field: 'entity_display_name', headerName: 'Entity', width: 500, renderCell: (params) => { // Render entity_display_name as a Link
            return (
                <div>
                    <Link to={`/entity/${params.row.entity_display_name}`}>{params.row.entity_display_name}</Link>
                </div>
            );
        }},
        { field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
            return (
                <div>
                    <button onClick={() => handleEdit(params.row.entity_display_name)}>Edit</button>
                    <button onClick={() => handleDelete(params.row.entity_display_name)}>Delete</button>
                </div>
            );
        }},
    ];

    useEffect(() => {
        fetchEntities();
    }, []);

    const fetchEntities = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get('http://localhost:8000/api/v1/entities/read-entities', { headers });
            const entityData = response.data.data;
            const extractedData = entityData.map(item => ({
                id: item.entities_id,
                entities_id: item.entities_id,
                entity_display_name: item.entity_display_name
            }));

            setExtractedData(extractedData);
        } catch (error) {
            console.error('Error fetching entities:', error);
        }
    };

    const handleDelete = async (entityName) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post('http://localhost:8000/api/v1/entities/delete-entity', { entityName }, { headers });
            setExtractedData(prevData => prevData.filter(item => item.entity_display_name !== entityName));
        } catch (error) {
            console.error('Error deleting entity:', error);
        }
    };

    const handleEdit = async (oldEntityName) => {
        const newEntityName = prompt('Enter the new entity name:');
        if (newEntityName) {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                await axios.put(
                    'http://localhost:8000/api/v1/entities/rename-entity',
                    { oldEntityName, newEntityName },
                    { headers }
                );

                setExtractedData(prevData =>
                    prevData.map(item =>
                        item.entity_display_name === oldEntityName
                            ? { ...item, entity_display_name: newEntityName }
                            : item
                    )
                );
            } catch (error) {
                console.error('Error renaming entity:', error);
            }
        }
    };

    return (
        <div>
            <Header />
            <Table columns={columns} rows={extractedData} />
        </div>
    );
}

export default Dashboard;
