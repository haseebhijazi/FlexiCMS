import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Table from './Table';

function Dashboard() {
    const [extractedData, setExtractedData] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 140 },
        { field: 'entities_id', headerName: 'Entity ID', width: 140},
        { field: 'entity_display_name', headerName: 'Entity', width: 500 },
        { field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
            return (
                <button onClick={() => handleDelete(params.row.entity_display_name)}>Delete</button>
            );
        }},
    ];

    useEffect(() => {
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

        fetchEntities();
    }, []);

    const handleDelete = async (entityName) => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            await axios.post('http://localhost:8000/api/v1/entities/delete-entity',
                {
                    entityName: entityName,
                }, {headers}
            );
            setExtractedData(prevData => prevData.filter(item => item.entity_display_name !== entityName));
        } catch (error) {
            console.error('Error deleting entity:', error);
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
