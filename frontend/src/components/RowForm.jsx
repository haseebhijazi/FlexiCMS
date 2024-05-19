import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RowForm() {
    const { entity_display_name } = useParams();
    const [schema, setSchema] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchSchema();
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
                method: 'post',
                url: 'http://localhost:8000/api/v1/rows/insert-row',
                headers: headers,
                data: {
                    entity_display_name: entity_display_name,
                    values: formData,
                },
            });

            console.log('Row inserted successfully:', response.data);
            window.location.href = `/entity/${entity_display_name}`;

        } catch (error) {
            console.error('Error inserting row:', error);
        }
    };

    return (
        <div>
            <h2>RowForm: {entity_display_name}</h2>
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

export default RowForm;
