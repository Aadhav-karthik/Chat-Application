
import React, {useEffect, useState } from 'react';
import './LoginPage.css';

function LoginPage(props){
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        props.socket.emit('userLogin',{name:name, password:password});
        props.handleSetName(name);
        setName("");
        setPassword("");
    }

    const handleLogin = (value) => {
        setErrorMessage(value.userLogin);
        props.handleSubmit(value);
    }
    useEffect(() => {
    props.socket.on('userLogin',(value) => handleLogin(value));
    });

    const handleAnonymous = () => {
        setName("Anonymous");
        setPassword("Anonymous");
        props.socket.emit('userLogin',{name:name, password:password});
    }

    return (
        <div className="container d-flex justify-content-center ">
        <div className="row">
        <form onSubmit={handleSubmit} className="mt-md-5 mt-4">
            {errorMessage?<p/>:<p className="text-danger">Invalid Credentials</p>}
            <input className="form-control login-input my-3" placeholder="Username" type="text" name="username" value={name} onChange={(e) => setName(e.target.value)}/>
            <input className="form-control login-input my-3" placeholder="Password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button className="btn submit-button" type="submit" name="submit">Submit</button>
            <p><button className="btn btn-link pt-3" onClick={()=> {handleAnonymous()}}>Login as Anonymous User</button></p>
        </form>
        </div>
        </div>
    )
}

export default LoginPage;