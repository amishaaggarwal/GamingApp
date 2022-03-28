import { Button } from '@material-ui/core'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function Error404() {

    const navigate = useNavigate();
    return (
      <div>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0WoitHkWENmBvkr2S_bMYqGZX6t0oXTO1ow&usqp=CAU"
          alt="pagen0tfound"
        />
        <Button onClick={() => navigate("/")}>Back to Start Game</Button>
      </div>
    );
}

export default Error404