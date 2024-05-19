import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateRowForm() {
    const { entity_display_name, row_id } = useParams();
    const [schema, setSchema] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchSchema();
        fetchRowData();
    }, []);

    const fetchSchema = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8000/api/v1/rows/fetch-schema',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                },
            });
    
            const schemaKeys = response.data.data || [];
            const filteredSchema = schemaKeys.filter(key => key !== 'id'); // Filter out 'id'
    
            setSchema(filteredSchema);
        } catch (error) {
            console.error('Error fetching schema:', error);
        }
    };

    const fetchRowData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const response = await axios({
                method: 'post',
                url: 'http://localhost:8000/api/v1/rows/read-row',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                    row_id: row_id,
                },
            });

            setFormData(response.data.data || {});
        } catch (error) {
            console.error('Error fetching row data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios({
                method: 'put',
                url: 'http://localhost:8000/api/v1/rows/update-row',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                    row_id: row_id,
                    values: formData,
                },
            });

            console.log('Row updated successfully:', response.data);

            window.location.href = `/entity/${entity_display_name}`;
            // Redirect or show success message
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-white mb-4">UpdateRowForm: {entity_display_name}</h2>
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                {schema.map((key) => (
                    <div key={key} className="mb-4">
                        <label htmlFor={key} className="block text-base font-medium text-gray-300 mb-1">{key}</label>
                        <input
                            type="text"
                            id={key}
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-base border-gray-700 rounded-md bg-gray-700 text-white px-4 py-2"
                            style={{ fontSize: '1rem', padding: '0.8rem' }} // Adjust font-size and padding
                        />
                    </div>
                ))}
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 animate-neon">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default UpdateRowForm;
