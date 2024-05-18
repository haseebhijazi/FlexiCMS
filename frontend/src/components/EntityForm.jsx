import React, { useState } from 'react';
import axios from 'axios';

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

      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Dynamic Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Entity Display Name:</label>
          <input
            type="text"
            value={entityDisplayName}
            onChange={(e) => setEntityDisplayName(e.target.value)}
          />
        </div>
        <div>
          {attributes.map((attribute, index) => (
            <div key={index}>
              <label>Attribute Name:</label>
              <input
                type="text"
                name="name"
                value={attribute.name}
                onChange={(e) => handleAttributeChange(index, e)}
              />
              <label>Attribute Type:</label>
              <select
                name="type"
                value={attribute.type}
                onChange={(e) => handleAttributeChange(index, e)}
              >
                <option value="STRING">String</option>
                <option value="INTEGER">Integer</option>
                <option value="DATEONLY">Date</option>
              </select>
              <button type="button" onClick={() => handleDeleteAttribute(index)}>
                Delete
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddAttribute}>
            Add Attribute
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DynamicForm;
