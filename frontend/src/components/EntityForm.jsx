import React, { useState } from 'react';
import axios from 'axios';
import Header from './Header';

const DynamicForm = () => {
  const [entityDisplayName, setEntityDisplayName] = useState('');
  const [attributes, setAttributes] = useState([{ name: '', type: 'STRING' }]);

  const handleAddAttribute = () => {
    setAttributes([...attributes, { name: '', type: 'STRING' }]);
  };

  const handleDeleteAttribute = (index) => {
    const newAttributes = [...attributes];
    newAttributes.splice(index, 1);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index, event) => {
    const { name, value } = event.target;
    const newAttributes = [...attributes];
    newAttributes[index][name] = value;
    setAttributes(newAttributes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedAttributes = attributes.reduce((acc, attr) => {
      if (attr.name && attr.type) {
        acc[attr.name] = attr.type;
      }
      return acc;
    }, {});

    console.log('Formatted Attributes:', formattedAttributes);

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/api/v1/entities/create-entity',
        {
          entity_display_name: entityDisplayName,
          attributes: formattedAttributes,
        },
        { headers }
      );

      window.location.href = '/dashboard';

      console.log('Response:', response.data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center py-8">
      <Header />
      <h2 className="text-3xl font-light mb-8 animate-neon">Dynamic Form</h2>
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg">
        <div className="mb-6">
          <label className="block mb-2 text-base font-light">Entity Display Name:</label>
          <input
            type="text"
            value={entityDisplayName}
            onChange={(e) => setEntityDisplayName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          {attributes.map((attribute, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2 text-base font-light">Attribute Name:</label>
              <input
                type="text"
                name="name"
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, e)}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <label className="block mb-2 text-base font-light">Attribute Type:</label>
              <select
                name="type"
                value={attribute.type}
                onChange={(e) => handleAttributeChange(index, e)}
                className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              >
                <option value="STRING">String</option>
                <option value="TEXT">Text</option>
                <option value="INTEGER">Integer</option>
                <option value="BIGINT">Big Integer</option>
                <option value="FLOAT">Float</option>
                <option value="DOUBLE">Double</option>
                <option value="DATEONLY">Date</option>
                <option value="BOOLEAN">Boolean</option>
              </select>
              <button
                type="button"
                onClick={() => handleDeleteAttribute(index)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddAttribute}
            className="mt-4 py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded animate-neon"
          >
            Add Attribute
          </button>
        </div>
        <button
          type="submit"
          className="mt-4 py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded animate-neon-green"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
