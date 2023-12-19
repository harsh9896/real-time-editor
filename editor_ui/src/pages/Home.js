import React from 'react'
import { Link } from 'react-router-dom';
import '../App.css';
const Home = () => {
  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <h4 className='mainLabel'>Paste Invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input className='inputBox' type='text' placeholder='Room Id'></input>
          <input className='inputBox' type='text' placeholder='User Name'></input>
          <button className='btn joinBtn'>Join</button>
          <span className='createInfo'> If you don't have an invite then create &nbsp;
          <Link to='' className='createNewBtn'>New Room</Link>
          </span>
        </div>
      </div>
      <footer>
        <h4> Built with 😊  by &nbsp;
          <Link className='githubLink' to= 'https://github.com/harsh9896/'>Harsh Goyal</Link>
        </h4>
      </footer>
    </div>

  )
}

export default Home;

