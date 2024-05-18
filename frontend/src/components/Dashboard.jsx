import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header'
import Table from './Table'


function Dashboard() {
    const [extractedData, setExtractedData] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 140 },
        { field: 'entities_id', headerName: 'Entity ID', width: 140},
        { field: 'entity_display_name', headerName: 'Entity', width: 500 },
    ];

    useEffect(() => {
        const fetchEntities = async (event) => {
            try {
                const token = localStorage.getItem('token');

                // console.log(token)

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.get('http://localhost:8000/api/v1/entities/read-entities', { headers });
                // console.log(response.data.data)

                const entityData = response.data.data;

                const extractedData = entityData.map(item => ({
                    id: item.entities_id,
                    entities_id: item.entities_id,
                    entity_display_name: item.entity_display_name
                }));

                console.log(extractedData);

                setExtractedData(extractedData);
            } catch (error) {
                throw error
            }
        };

        fetchEntities();
    }, [])

  return (
    <div>
        <Header />
        <Table columns={columns} rows={extractedData} />
    
    </div>
  )
}

export default Dashboard