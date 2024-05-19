import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';
import Table from './Table';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Dashboard() {
    const [extractedData, setExtractedData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentEntity, setCurrentEntity] = useState('');
    const [newEntityName, setNewEntityName] = useState('');

    const columns = [
        { field: 'id', headerName: 'ID', width: 140 },
        { field: 'entities_id', headerName: 'Entity ID', width: 140 },
        { field: 'entity_display_name', headerName: 'Entity', width: 500, renderCell: (params) => {
            return (
                <div>
                    <Link to={`/entity/${params.row.entity_display_name}`} className="text-gray-300 hover:underline text-lg font-bold">{params.row.entity_display_name}</Link>
                </div>
            );
        }},
        { field: 'actions', headerName: 'Actions', width: 200, renderCell: (params) => {
            return (
                <div className="flex space-x-4"> {/* Added space-x-4 for spacing between buttons */}
                    <button onClick={() => handleEdit(params.row.entity_display_name)} className="text-gray-300 hover:text-gray-500">
                        <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={() => handleDelete(params.row.entity_display_name)} className="text-gray-300 hover:text-gray-500">
                        <i className="fas fa-trash"></i>
                    </button>
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

    const handleEdit = (entityName) => {
        setCurrentEntity(entityName);
        setShowModal(true);
    };

    const handleRename = async () => {
        if (newEntityName) {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                await axios.put(
                    'http://localhost:8000/api/v1/entities/rename-entity',
                    { oldEntityName: currentEntity, newEntityName },
                    { headers }
                );

                setExtractedData(prevData =>
                    prevData.map(item =>
                        item.entity_display_name === currentEntity
                            ? { ...item, entity_display_name: newEntityName }
                            : item
                    )
                );
                setShowModal(false);
                setNewEntityName('');
            } catch (error) {
                console.error('Error renaming entity:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
            <Header />
            <div className="w-full max-w-screen-lg mt-8">
                <Table columns={columns} rows={extractedData} />
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl mb-4">Rename Entity</h2>
                        <input 
                            type="text" 
                            value={newEntityName} 
                            onChange={(e) => setNewEntityName(e.target.value)} 
                            className="w-full p-2 mb-4 text-black rounded"
                            placeholder="Enter new entity name" 
                        />
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="mr-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleRename} 
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
