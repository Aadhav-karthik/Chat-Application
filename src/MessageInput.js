import React, { useState } from 'react';
import './MessageInput.css';

function MessageInput(props){
    const [value, setValue] = useState('');

    const submitForm = (e) => {
        e.preventDefault();
        if(value.trim().length!==0)
        props.socket.emit('message', value, props.name);
        setValue('');
    }

    return(
        <div className="fixed-small-bottom m-3 m-md-0">
        <form onSubmit={submitForm} className="message-form form-group d-inline row">
            <input className="text-input form-control d-inline col-md-6 col-9 mt-3" autoFocus placeholder="Type your message" 
            value={value} onChange={(e)=> setValue(e.target.value)}></input>
            <button className="send-button btn d-inline col-md-3 col-3" type="submit" value="submit">Send</button>
        </form>
        </div>
    );
};

export default MessageInput;