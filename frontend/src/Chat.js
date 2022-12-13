import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
export default function Chat(props) {

    
    const [message, setMessage] = useState({});
    const [inbox, setInbox] = useState({});
    const handleChange = (event) => {
        const value = event.target.value;
        setMessage({ message : value})
      }
    
    useEffect(() => {
        var element = document.getElementById("chatbox");
        element.scrollTop = element.scrollHeight;
        if (!props.inbox){
            return
        }
        setInbox({ id : props.inbox._id, messages : props.inbox.messages, user1 : props.inbox.user1, user2 : props.inbox.user2});


        
    }, [props.inbox]);

    useEffect(() => {
        var element = document.getElementById("chatbox");
        element.scrollTop = element.scrollHeight;
       
    });


    const handleSubmit = async (event) => {
        event.preventDefault();

        
        

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

        
        let response;
        
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/send-message', {
            id : props.inbox?._id,
            message : message.message,
            user : localStorage.getItem('userId')
        })
        let msgs = []
            for (let i = 0 ; i< inbox.messages.length; i++){
                msgs.push(inbox.messages[i])
            }
        msgs.push(response.data.message)
        setInbox(values => ({...values, messages: msgs}))
        setMessage({ message : ''})
        var element = document.getElementById("chatbox");
        element.scrollTop = element.scrollHeight;
            
    }

    return (
        <div>
            <div id="chatbox" style={{overflowY: 'scroll', height : '400px'}}class="ui comments">
            { props.newUsername ? <div>Send first message to {props.newUsername}</div> : <div></div>}
            { !props.inbox ? <div>Please choose a user to chat with</div> : <div></div>}
            {inbox? inbox.messages ? inbox.messages.map(message => {
                return <div class="comment">
                     <div class="content">
                         <span class="author" >
                         <Link style={{textDecoration : message.user._id == localStorage.getItem('userId') ?'underline' : '', fontWeight: 'bold',color : 'white' }} class="author" to={`/profile/${message.user._id}`}>
                                    {message.user.username}
                                </Link>
                        </span>
                     <div class="metadata">
                                    <span class="date">{message.time.replace('T', ' ').substring(0, message.time.length - 5)}</span>
                    </div>
                        <div style={{color : 'white'}}class="text">
                            {message.message}
                        </div>
                    </div>
                    
                    </div>
            }) : <div></div> : <div></div>}
            </div>
            
            <form style={{ position : 'absolute', bottom : '15px', width : '600px', height :'150px',color : 'white', background : 'black'}}class="ui reply form" onSubmit={handleSubmit}>
                <div class="field">
                <textarea name="comment" value={message.message || ""} style={{background : 'black', color :'white', border : '1px solid grey'}}
                    onChange={handleChange}></textarea>
                </div>
                <button type="submit" style={{border : '1px solid grey'}}class="ui blue labeled submit icon button">
                <i class="icon edit"></i> Send message
                </button>
            </form>
        </div>
    )
}
