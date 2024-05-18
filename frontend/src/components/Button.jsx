import React, { useState } from 'react'
import { Navigate } from 'react-router-dom';

function Button(props) {
  const [goto, setGoto] = useState(false);

  if (goto) {
    return <Navigate to={props.goto} />
  }
  return (
    <button 
      className='btn'
      onClick={() => {
        setGoto(true);
      }}
    >
      {props.text}
    </button>
  )
}

export default Button