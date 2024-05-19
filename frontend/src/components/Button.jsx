import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

function Button(props) {
  const [goto, setGoto] = useState(false);

  if (goto) {
    return <Navigate to={props.goto} />;
  }

  return (
    <button
      className={`btn border border-gray-500 rounded px-4 py-2 text-gray-300 hover:bg-gray-600 hover:border-transparent ${props.subtle ? 'text-sm' : 'text-lg'} ${props.neon ? 'animate-neon' : ''}`}
      onClick={() => {
        setGoto(true);
      }}
      style={{ transition: 'all 0.3s ease' }}
    >
      {props.text}
    </button>
  );
}

export default Button;
