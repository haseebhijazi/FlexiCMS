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
        <div>
            <h2>UpdateRowForm: {entity_display_name}</h2>
            <form onSubmit={handleSubmit}>
                {schema.map((key) => (
                    <div key={key}>
                        <label htmlFor={key}>{key}</label>
                        <input
                            type="text"
                            id={key}
                            name={key}
                            value={formData[key] || ''}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default UpdateRowForm;
