import React, { useEffect, useState, useRef } from 'react';
import './Messages.css';

function Messages(props){

    const [messages, setMessages] = useState({});

    useEffect(() => {
        const messageListener = (message) => {
            setMessages((prevMessages)=> {
                const newMessages = {...prevMessages};
                newMessages[message.id] = message;
                return newMessages;
            });
        };

        const deleteMessageListener = (messageID) => {
            setMessages((prevMessages) => {
                const newMessages = {...prevMessages};
                delete newMessages[messageID];
                return newMessages;
            });
        }
        
        props.socket.on('message', messageListener);
        props.socket.on('deleteMessage', deleteMessageListener);
        props.socket.emit('getMessages');
        
        

        return () => {
            props.socket.off('message', messageListener);
            props.socket.off('deleteMessage', deleteMessageListener);
        }
    
},[props.socket]);

const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {elementRef.current.scrollIntoView();});
    return <div ref={elementRef}/>
}

const userLoggedIn = (message) => {
    if(message.user.name === "Anonymous"){
        return message.socketID === props.socket.id;
    }
    else{
        return props.userName === message.user.name;
    }
}

return(
    <div className="messageList">
        {
        [...Object.values(messages)].sort((a,b) => a.time - b.time).map((message) => (
            <div key={message.id} className="row">
            {(userLoggedIn(message))?(<div className="col-6"/>):("")}
            <div className="card card-body message-container col-6">
            <span className="user ">{message.user.name}</span>
            <span className="message text-left">{message.value}</span>
            <span className="time ml-auto">{new Date(message.time).toLocaleTimeString([],{hour12: false, hour:'2-digit', minute:'2-digit'})}</span>
            </div>
            <AlwaysScrollToBottom/>
            </div>
            
        ))}
    </div>
)
}

export default Messages;