import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
import Counter from './Counter'
import FormData from 'form-data'
import Vibrant from 'vibrant'
import analyze from 'rgbaster'
import moment from 'moment'
import Waveform from './Waveform';
import { createBrowserHistory } from 'history'
export default function Challenge() {
    const hiddenFileInput = React.useRef(null);
    
    const { id } = useParams();
    const [challenge, setChallenge] = useState({});
    const [comment, setComment] = useState({});
    const [formData, setFormData] = useState(new FormData());
    const [disabled, setDisabled] = useState(true);
    const [fileName, setFileName] = useState();
    const [waveforms, setWaveforms] = useState([]);
    const [winnerr, setWinnerr] = useState([]);
    const [color, setColor] = useState();
    const [date, setDate] = useState(Date);
    const handleClick = event => {
        hiddenFileInput.current.click();
      };
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setComment({ text : value})
      }
    const setWinner = async (entry) => {
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        let response;
            
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/authors-choice', {
            entry : entry
        })
        let challenge2 = challenge
        for (let i = 0; i< challenge2.entries.length; i++){
            if (challenge2.entries[i]._id == entry){
                challenge2.entries[i].authorsChoice = true;
            }
        }



        challenge2.authorsChoice = entry;
        setChallenge(challenge2)
        setWinnerr(true)
    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        
        

            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token

           
            let response;
            
            response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/comment', {
                comment : comment.text,
                id : challenge.id
            })
            let com = []
            for (let i = 0 ; i< challenge.comments.length; i++){
                com.push(challenge.comments[i])
            }
            com.push(response.data.comment)
            setChallenge(values => ({...values, comments: com}))
            //setChallenge({ comments : com})
            setComment({ text : ''})

        
            
    }





    const send = (obj, id, pauseFunc) => {
        let arr = waveforms
        waveforms[id] = [obj,pauseFunc]
        setWaveforms(arr);

    }
    const pause = (id) => {
        for (let i = 0; i < waveforms.length; i++){
            if (id !== i){
                const f1 = waveforms[i][1];
                f1()
            }
        }
    }

    useEffect(() => {
        async function fetchAPI(){
            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenge', {
                params: {
                  id: id
                }
              })
            setChallenge({ colors : response.data.challenge.colors,colorNames : response.data.challenge.colorNames, comments : response.data.challenge.comments, user : response.data.challenge.user, text : response.data.challenge.text, id : response.data.challenge._id, name : response.data.challenge.name, photoURL : response.data.challenge.photoURL, entries: response.data.challenge.entries, color : response.data.challenge.color, hasEnded : response.data.challenge.hasEnded})
           
           
            
            let date1 = new Date(response.data.challenge.createdAt)
            date1.setDate(date1.getDate() + 7)
            setDate(date1)
           
        }
        
        fetchAPI()
       
        

    }, []);
   
    

    const deleteComment = async (time) => {
        let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-comment', {
                time: time,
                id : challenge.id
                
              })
              let com = []
              for (let i = 0 ; i< challenge.comments.length; i++){
                  if (challenge.comments[i].time != time){
                    com.push(challenge.comments[i])
                  }
                  
              }
              setChallenge(values => ({...values, comments: com}))

    }
    const onSelectImageHandler = (files) => {
        
        const file = files[0];
        var formData = new FormData();
        formData.append('file', file)
        setFileName(file.name)
        setDisabled(false)
        setFormData(formData)
        const config = {
            headers: {
                "Content-Type":"multipart/form-data" 
            }
        };
    }
    const deleteSong = async (id) => {
        
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token

           
        let response;
        
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-song', {
            id : id
        })
        let entries = []
        for (let i = 0 ; i< challenge.entries.length; i++){
            if (challenge.entries[i]._id != id){
                entries.push(challenge.entries[i])
            }
            
        }
        setChallenge(values => ({...values, entries: entries}))




    }
    const deleteChallenge = async (id) => {
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
           
        let response;
        
        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/delete-challenge', {
            id : challenge.id
        })
        
        let his = createBrowserHistory();
        his.push('/');
        window.location.reload();



    }
   
    const submitSong = async () => {
        if (disabled) {
            return;
        }
        setDisabled(true);
        axios.defaults.headers.common['Content-Type'] ="multipart/form-data"
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/upload', formData)
        let songURL = response.data.url

        response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/entry', {
            challenge : challenge.id,
            songURL : songURL
        })
        window.location.reload();

    }
    
    return (<div>
       
        <div style={{ backgroundColor : 'black', color: 'white', float : 'top', height : '51px', borderBottom : '1px solid grey'}}>
        <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block'}}><Link style={{color : 'white'}}to="/">Music challenge app</Link></h1>
            
            
            
            
        
            {localStorage.isAuthenticated == 'true' ? <div style={{ backgroundColor : 'black', color: 'white',width : '300px', display: 'inline-block', float : 'right', marginRight : '50px'}}>
            <Link style={{borderRadius : '0px', marginTop : '8px', backgroundColor : 'black', color: 'white'}} className="ui button" to="/">
                Back
            </Link>
            
            {
                challenge.user ? (challenge.user._id == localStorage.getItem('userId') || localStorage.getItem('role') == 'admin')?
                <button style={{borderRadius : '0px', marginTop : '8px',backgroundColor : 'black', color: 'white'}}className="ui button" onClick={() => {if(window.confirm('Are you sure to delete this challenge?')){deleteChallenge(challenge.id)}}}>Delete challenge</button>
                : <div></div> : <div></div>
                
            }
           
            </div>
                 : 
            <div style={{ width : '700px', display: 'inline', float : 'right', paddingLeft: '400px', marginRight : '0px', marginTop : '10px'}}>
                <Link style={{borderRadius : '0px', marginTop : '0px', backgroundColor : 'black', color: 'white'}} className="ui button" to="/login">
                            Login
                </Link>
                <Link style={{borderRadius : '0px', marginTop : '0px',backgroundColor : 'black', color: 'white'}} className="ui button" to="/signup">
                            Sign up
                </Link>
                <Link style={{borderRadius : '0px', marginTop : '0px', backgroundColor : 'black', color: 'white'}} className="ui button" to="/">
                Back
            </Link>
            </div>}
            
            </div>
            <div>
                <h1 style={{backgroundColor : 'black', color: 'white',position : 'relative', margin: '0px', marginTop : '8px',paddingLeft : '20px', display: 'inline-block'}}className="ui header">{challenge.name} </h1><div style={{backgroundColor : 'black', color: 'white', position : 'relative', top : '-1px', left: '25px', display: 'inline'}}>By: 
            {challenge.user ? <Link style={{backgroundColor : 'black', color: 'white', fontWeight: 'bold'}} to={`/profile/${challenge.user._id}`}>
                    {challenge.user ? ' '+challenge.user.username : ''}
                </Link> : <div></div>}
                
            </div></div>
            {!(challenge.hasEnded) ? <div style={{paddingTop : '10px', paddingLeft : '20px'}}>Winner by vote will be declared on {moment(date).format('MM/DD')}</div> : <div style={{paddingTop : '10px', paddingLeft : '20px'}}>Winner has been declared, but you can still add your songs!</div> }
            {challenge?.user?._id == localStorage.getItem('userId' ) ? <div style={{ zIndex : '1000',position: 'relative', top : '-20px', left : '-40px', float : 'right', display : 'inline-block', marginRight : '100px'}}>
            <span>Choose winner: </span>
               
               <select  name="select" class="ui dropdown" onChange={ event => setWinner(event.target.value)}>
                   <option >-</option>
               {challenge?.entries?.map(function(e) { 
                   return (<option value={e._id} onClick={() => setWinner(e)}>{e.user.username}</option>);
               })}
               </select>
            </div> : null}
            
            
        { challenge.photoURL ? 
        <div style={{height : 'auto', float: 'left'}}>
            <div style={{float : 'left', height : '500px' , display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
            <img id="image" style={{marginTop : '30px',marginLeft : '40px', maxHeight : `450px`, width : 'auto', maxWidth : `${window.innerWidth / 2.6}px`, height : 'auto'}} src={challenge.photoURL}/>
            
            </div>
            { challenge.text ? <div style={{top : '0px', left : '0px',position : 'relative',paddingLeft : '20px', height : 'auto', width : 'auto', float : 'bottom ', display: 'block'}}> {challenge.text}
        
        
            </div> : <div></div>} 
            </div>
        
        :
        
        <div style={{ float : 'left', paddingLeft : '20px',position : 'relative', top : '70px', maxHeight : '400px', width : 'auto', maxWidth : '400px', height : 'auto'}}> {challenge.text}
        
        
        </div>}
        
        
        
        
        <div style={{paddingTop : '100px',color : 'white', float : 'right', paddingRight : challenge?.entries?.length > 0 ? `${window.innerWidth / 20}px` : '50px'}}>
        {challenge?.entries?.length  > 0 ? 
        <table style={{marginBottom : '30px'}}id="table"class="ui basic collapsing celled table">
        <thead>
            <tr ><th style={{borderTop : 'none'}} ></th>
                <th style={{color : 'white',border : '1px solid white'}}>User</th>
            <th style={{color : 'white',border : '1px solid white'}}>Song</th>
            <th style={{color : 'white',border : '1px solid white'}}>Votes</th>
        </tr></thead>
        <tbody id="table" style={{borderColor : 'white',}}>
         {challenge.entries.map((entry, i) => {
                return (<tr>
                    <td style={{ borderBottom : 'none'}}>{entry.authorsChoice ? <div class="" data-tooltip="Author's choice">
                    <i  style={{ fontSize : '1.5em',color : 'white', display: 'flex', position : 'relative', right : entry.winner ? '-2px' : '0', top  :'0px'}}class="hovertext ui check circle outline icon"></i></div>: null}
                    {entry.winner ? <div class="" data-tooltip="Winner by vote">
                    <i  style={{ fontSize : '1.5em', color : 'white',display: 'flex', position : 'relative', right : entry.authorsChoice ? '-1px' :'0px', top  :entry.authorsChoice ? '8px' : '0px'}}class="hovertext ui trophy icon"></i></div>: null}</td>
                    <td style={{  height : '50px',color : 'white'}}>
                    
                    <Link style={{display : 'inline', color : 'white', fontWeight: 'bold'}} to={`/profile/${entry.user._id}`}>
                        {entry.user ? ' '+entry.user.username : ''}
                </Link>
                
                    </td>
                    <td style={{width : '500px', height : '50px', marginRight : '20px'}}>
                     <Waveform  color={challenge.colors[0]}plays={entry.plays} pause={pause} send={send} id={i}url={entry.songURL} length={challenge.entries.length}
                    /> <span style={{width : '20px', height : '50px'}}></span>
                    </td>
                    <td style={{ height : '50px'}}>
                        <Counter votes={entry.votes} hasVoted={entry.voted.includes(localStorage.getItem('userId'))} id={entry._id}/>
                    </td>
                    { (entry.user._id === localStorage.getItem('userId')|| localStorage.getItem('role') == 'admin') ? 
                    
                    <i onClick={() => {if(window.confirm('Are you sure to delete this record?')){deleteSong(entry._id)}}} style={{ fontSize : '1.5em', position : 'relative' ,left : '2px', top : '24px', height : '25px', width : '24px', color : 'white'}}class="ui trash icon"></i> :
                    <div></div>
                }
                    
                </tr>)
            }) } 
        </tbody>
        { challenge.entries && challenge.entries.length == 0 ? <div style={{marginBottom : '30px', paddingLeft : '50px'}}>No song entries!</div> : <div></div>}

        </table>: <div style={{marginBottom : '30px', paddingLeft : '50px'}}>No song entries!</div>}
            { localStorage.getItem('isAuthenticated') === 'true' ? <div style={{float : 'bottom', paddingRight : '200px'}}>
            <div style={{ marginLeft : '50px',paddingTop : '45px', width : '120px', display :'inline'}}>Add your song:</div>
            <i style={{ marginLeft : '12px', fontSize : '2em', color : 'white', cursor : 'pointer', display : 'inline'}}onClick={handleClick} class=" ui file audio outline icon"></i>
            <input  style={{visibility : 'hidden'}}
                    type="file"
                    accept="audio/*"
                    id="contained-button-file"
                    ref={hiddenFileInput}
                    onChange={(e) => onSelectImageHandler(e.target.files)}
            />
            <button style={{ marginLeft : '50px',display : 'block', border : '1px solid white', marginTop : '10px', backgroundColor : 'black', color: 'white'}} disabled={disabled}className="ui button" onClick={() => submitSong()} >
            Send
            </button><span style={{position  : 'relative', top : '-72px', left : '205px'}}>{fileName}</span>
            </div> : <div></div>}
            
            <div style={{float : 'right', marginRight : `${window.innerWidth / 6}px`}}>
            <div style={{paddingTop : '50px',paddingLeft : '50px', width : '400px', color : 'white'}}class="ui comments">
                <h3 style={{ color : 'white'}}class="ui dividing header">Comments</h3>
                {challenge?.comments?.length > 0 ? challenge.comments.map(comment => {
                    return <div class="comment">
                            <div class="content">
                            <Link style={{ color : 'white', fontWeight: 'bold',background : 'black'}} class="author" to={`/profile/${comment.user._id}`}>
                                    {comment.user.username}
                                </Link>
                                <div class="metadata">
                                    <span class="date">{comment.time.replace('T', ' ').substring(0, comment.time.length - 5)}</span>
                                </div>
                                {((localStorage.getItem('userId') === comment.user._id) || localStorage.getItem('role') == 'admin') ? <i style={{cursor: 'pointer'}}onClick={() => deleteComment(comment.time)} class="trash icon"></i> : <div></div>}
                                <div style={{ color : 'white'}} class="text">
                                    {comment.comment}
                                </div>
                            </div>
                            <span>_______</span>
                        </div>
                }) : <div>No comments</div>}
            </div>
            <form style={{ width : '400px', paddingLeft : '20px'}}class="ui reply form" onSubmit={handleSubmit}>
                <div class="field">

                
                </div>
                {localStorage.isAuthenticated == 'true' ? 
                <div>
                    <textarea name="comment" value={comment.text || ""} style={{background : 'black', color : 'white', border : '1px solid grey'}}
                    onChange={handleChange}></textarea>
                    <button type="submit" style={{border : '1px solid grey', marginTop : '5px', marginBottom : '10px'}}class="ui blue labeled submit icon button">
                        <i class="icon edit"></i> Add Comment
                    </button>
                </div>
                 : <div></div>}
            </form>

            </div>

            
        </div>
        
        
       
    </div>)
       
        
}
