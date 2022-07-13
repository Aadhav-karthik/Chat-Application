import React, {useEffect, useState} from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import LoginPage from './LoginPage';
import './App.css';

function App() {
const [socket, setSocket] = useState(null);
const [userLogin, setUserLogin] = useState(false);
const [name, setName] = useState(null);

useEffect(() => {
  const newSocket = io(`https://chat-server11.herokuapp.com/`);
  setSocket(newSocket);
  return () => newSocket.close();
},[setSocket]);

const handleLogout = () => {
  socket.emit('userLogout');

  socket.on('userLogin',(value) => {
    if(value.socketID === socket.id) {
    setUserLogin(value.userLogin);
  }})
}

const handleSubmit = (value) => {
  if(value.socketID === socket.id) {
    setUserLogin(value.userLogin);
  }
}

return(
<div className="App position-relative">
<p className="App-header">
  React Chat
</p>
{(userLogin ? 
(<div className=""><span className="Logged-name d-md-inline d-none">Logged in: {name}</span>
<div className="navbar navbar-expand-md position-absolute">
  <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#logout" aria-expanded="false" aria-controls="logout">
  <span className="navbar-toggler-icon"></span></button>
  <ul  id="logout" className="navbar-nav navbar-collapse collapse Logout-button">
<li className="nav-item">
<button className="btn btn-link text-white" onClick={() => handleLogout()}>Logout</button>
</li>
</ul>
</div>

</div>):(""))}


{ socket ? (userLogin ? (
  <div className="App-container container">
<Messages socket={socket} userName={name}/>
<MessageInput name={name} socket={socket}/>
</div>
):
(<LoginPage handleSetName={(name) => setName(name)} handleSubmit={(value) => handleSubmit(value)} socket={socket}/>)
): 
(<div>Not connected</div>)}
</div>
)
}


export default App;
