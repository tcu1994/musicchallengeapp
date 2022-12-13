import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
import Counter from '../Counter'
import FormData from 'form-data'
import Vibrant from 'vibrant'
import analyze from 'rgbaster'
import moment from 'moment'
import Waveform from '../Waveform';
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
            setChallenge({ colors : response.data.challenge.colors,colorNames : response.data.challenge.colorNames, comments : response.data.challenge.comments, user : response.data.challenge.user, text : response.data.challenge.text, id : response.data.challenge._id, name : response.data.challenge.name, photoURL : response.data.challenge.photoURL, entries: response.data.challenge.entries, color : response.data.challenge.color})
           
           
            
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
        
        setFormData(formData)
        setFileName(file.name)
        setDisabled(false)
        const config = {
            headers: {
                "Content-Type":"multipart/form-data" 
            }
        };
        setDisabled(false)
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
       
        <div style={{ backgroundColor : 'black', color: 'white', float : 'top', height : '51px'}}>
        <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '100%', display: 'inline-block', borderBottom : '1px solid grey'}}><Link style={{color : 'white'}}to="/">Music challenge app</Link></h1>
            
            
            
            
        
            {localStorage.isAuthenticated == 'true' ? <div style={{ backgroundColor : 'black', color: 'white',width : '100%', display: 'inline', float : 'right',fontSize : '10px', borderBottom : '1px solid grey', marginRight : '20px'}}>
            <Link style={{textDecoration : 'underline', borderRadius : '0px', marginTop : '8px', backgroundColor : 'black', color: 'white',float : 'right', marginRight : '14px'}} className="ui button" to="/">
                Back
            </Link>
            
            {
                challenge.user ? (challenge.user._id == localStorage.getItem('userId') || localStorage.getItem('role') == 'admin')?
                <button style={{borderRadius : '0px', marginTop : '8px',backgroundColor : 'black', color: 'white', marginLeft : '15px', textDecoration : 'underline'}}className="ui button" onClick={() => {if(window.confirm('Are you sure to delete this challenge?')){deleteChallenge(challenge.id)}}}>Delete challenge</button>
                : <div></div> : <div></div>
                
            }
           
            </div>
                 : 
            <div style={{ textDecoration : 'underline',width : '100%', display: 'inline', marginRight : '0px', marginTop : '10px',float : 'left', marginLeft : '6px',fontSize : '10px', borderBottom : '1px solid grey'}}>
                <Link style={{borderRadius : '0px', marginTop : '0px', backgroundColor : 'black', color: 'white'}} className="ui button" to="/login">
                            Login
                </Link>
                <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '0px',backgroundColor : 'black', color: 'white'}} className="ui button" to="/signup">
                            Sign up
                </Link>
                <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '0px', backgroundColor : 'black', color: 'white'}} className="ui button" to="/">
                Back
            </Link>
            </div>}
            
            </div>
            <div>
                <h2 style={{backgroundColor : 'black', color: 'white',position : 'relative', margin: '0px', marginTop : '8px',paddingLeft : '20px', display: 'inline-block'}}className="ui header">{challenge.name} </h2><div style={{fontSize : '11px',backgroundColor : 'black', color: 'white', position : 'relative', top : '-1px', left: '25px', display: 'inline'}}>By: 
            {challenge.user ? <Link style={{fontSize : '11px',backgroundColor : 'black', color: 'white', fontWeight: 'bold'}} to={`/profile/${challenge.user._id}`}>
                    {challenge.user ? ' '+challenge.user.username : ''}
                </Link> : <div></div>}
                
            </div></div>
            {!challenge?.hasEnded ? <div style={{fontSize : '11px',paddingTop : '10px', paddingLeft : '20px'}}>Winner by vote will be declared on {moment(date).format('MM/DD')}</div> : <div style={{paddingTop : '10px', paddingLeft : '20px'}}>Winner has been declared, but you can still add your songs!</div> }
            {challenge?.user?._id == localStorage.getItem('userId' ) ? <div style={{ zIndex : '1000',position: 'relative', top : '-0px', left : '20px', float : 'left', display : 'inline-block', marginRight : '100px'}}>
            <span style={{fontSize : '11px'}}>Choose winner: </span>
               
               <select  style={{ height : '15px', position : 'relative', top : '8px'}}name="select" class="ui dropdown" onChange={ event => setWinner(event.target.value)}>
                   <option >-</option>
               {challenge?.entries?.map(function(e) { 
                   return (<option value={e._id} onClick={() => setWinner(e)}>{e.user.username}</option>);
               })}
               </select>
            </div> : null}
            
            
        { challenge.photoURL ? 
        <div style={{height : 'auto', float: 'left', marginTop : '32px',marginBottom : '42px'}}>
            <div style={{float : 'left', height : `${Math.floor(window.innerWidth / 1.8)}px` , display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
            <img id="image" style={{marginTop : '20px',marginLeft : '20px', maxHeight : `${Math.floor(window.innerWidth / 1.4)}px`, width : 'auto', maxWidth : `${Math.floor(window.innerWidth / 1.4)}px`, height : 'auto'}} src={challenge.photoURL}/>
            
            </div>
            { challenge.text ? <div style={{top : '0px', left : '0px',position : 'relative',paddingLeft : '20px', height : 'auto', width : 'auto', float : 'bottom ', display: 'block', marginBottom : '20px'}}> {challenge.text}
        
        
            </div> : <div></div>} 
            </div>
        
        :
        
        <div style={{ float : 'left', paddingLeft : '20px',position : 'relative', top : '20px', maxHeight : `${Math.floor(window.innerWidth / 2.2)}px`, width : 'auto', maxWidth : '400px', height : 'auto', marginBottom : '30px'}}> {challenge.text}
        
        
        </div>}
        
        
        
        
        <div style={{paddingTop : '20px',color : 'white', float : 'left', width : '100%'}}>
        {challenge?.entries?.length  > 0 ? 
        <table style={{borderCollapse : 'collapse', marginLeft : '0px' }}id="table"class="">
        <thead >
            <tr ><th style={{border : 'none'}} ></th>
                <th style={{color : 'white',border : '1px solid white', fontSize : '9px'}}>User</th>
            <th style={{color : 'white',border : '1px solid white', fontSize : '9px'}}>Song</th>
            <th style={{color : 'white',border : '1px solid white', fontSize : '9px'}}>Votes</th>
        </tr></thead>
        <tbody id="table" style={{borderColor : 'white', fontSize : '9px'}}>
         {challenge.entries.map((entry, i) => {
                return (<tr>
                    <td style={{ border : 'none'}}>{entry.authorsChoice ? <div class="" data-tooltip="Author's choice">
                    <i  style={{ fontSize : '1.5em',color : 'white', display: 'flex', position : 'relative', right : entry.winner ? '-2px' : '0', top  :'0px'}}class="hovertext ui check circle outline icon"></i></div>: null}
                    {entry.winner ? <div class="" data-tooltip="Winner by vote">
                    <i  style={{ fontSize : '1.5em', color : 'white',display: 'flex', position : 'relative', right : entry.authorsChoice ? '-1px' :'0px', top  :entry.authorsChoice ? '8px' : '0px'}}class="hovertext ui trophy icon"></i></div>: null}</td>
                    <td style={{  height : '30px',color : 'white', fontSize : '9px'}}>
                    
                    <Link style={{display : 'inline', color : 'white', fontWeight: 'bold', fontSize : '9px'}} to={`/profile/${entry.user._id}`}>
                        {entry.user ? ' '+entry.user.username : ''}
                </Link>
                
                    </td>
                    <td style={{width : '220px', height : '30px', marginRight : '5px'}}>
                     <Waveform  color={challenge.colors[0]}plays={entry.plays} pause={pause} send={send} id={i}url={entry.songURL} length={challenge.entries.length}
                    /> <span style={{width : '20px', height : '30px'}}></span>
                    </td>
                    <td style={{ height : '30px', width : '10px', position : 'relative', top : '10px'}}>
                        <Counter votes={entry.votes} hasVoted={entry.voted.includes(localStorage.getItem('userId'))} id={entry._id}/>
                    </td>
                    { (entry.user._id === localStorage.getItem('userId')|| localStorage.getItem('role') == 'admin') ? 
                    
                    <i onClick={() => {if(window.confirm('Are you sure to delete this record?')){deleteSong(entry._id)}}} style={{ fontSize : '1.2em', position : 'relative' ,left : '2px', top : '20px', height : '25px', width : '24px', color : 'white'}}class="ui trash icon"></i> :
                    <div></div>
                }
                    
                </tr>)
            }) } 
        </tbody>
        { challenge.entries && challenge.entries.length == 0 ? <div style={{marginBottom : '30px'}}>No song entries!</div> : <div></div>}

        </table>: <div style={{marginBottom : '30px', paddingLeft : '50px'}}>No song entries!</div>}
            { localStorage.getItem('isAuthenticated') === 'true' ? <div style={{float : 'left', marginTop : '35px'}}>
            <div style={{ marginLeft : '30px',marginTop : '85px', width : '120px', display :'inline', fontSize : '12px'}}>Add your song:</div>
            <i style={{ marginLeft : '12px', fontSize : '2em', color : 'white', cursor : 'pointer', display : 'inline'}}onClick={handleClick} class=" ui file audio outline icon"></i>
            <input  style={{visibility : 'hidden'}}
                    type="file"
                    accept="audio/*"
                    id="contained-button-file"
                    ref={hiddenFileInput}
                    onChange={(e) => onSelectImageHandler(e.target.files)}
            />
            <button style={{ display : 'inline-block', border : '1px solid white', backgroundColor : 'black', color: 'white', position : 'relative', left : '20px', top : '0px'}} disabled={disabled}className="ui button" onClick={() => submitSong()} >
            Send
            </button><span style={{position  : 'relative', top : '-52px', left : '100px'}}>{fileName}</span>
            </div> : <div></div>}
            
            <div style={{float : 'left', marginLeft : `20px`, fontSize : '13px'}}>
            <div style={{paddingTop : '40px',paddingLeft : '10px', width : '100%', color : 'white'}}class="ui comments">
                <h3 style={{ color : 'white'}}class="ui dividing header">Comments</h3>
                {challenge?.comments?.length > 0 ? challenge.comments.map(comment => {
                    return <div class="comment">
                            <div class="content">
                            <Link style={{ color : 'white', fontWeight: 'bold',background : 'black', fontSize : '13px'}} class="author" to={`/profile/${comment.user._id}`}>
                                    {comment.user.username}
                                </Link>
                                <div class="metadata">
                                    <span class="date">{comment.time.replace('T', ' ').substring(0, comment.time.length - 5)}</span>
                                </div>
                                {((localStorage.getItem('userId') === comment.user._id) || localStorage.getItem('role') == 'admin') ? <i style={{cursor: 'pointer'}}onClick={() => deleteComment(comment.time)} class="trash icon"></i> : <div></div>}
                                <div style={{ color : 'white', fontSize : '13px'}} class="text">
                                    {comment.comment}
                                </div>
                            </div>
                            <span>_______</span>
                        </div>
                }) : <div>No comments</div>}
            </div>
            <form style={{ width : '150px', paddingLeft : '12px'}}class="ui reply form" onSubmit={handleSubmit}>
                <div class="field">

                
                </div>
                {localStorage.isAuthenticated == 'true' ? 
                <div>
                    <textarea name="comment" value={comment.text || ""}  style={{background : 'black', color : 'white', border : '1px solid grey', width : '200px', height : '120px'}}
                    onChange={handleChange}></textarea>
                    <button type="submit" style={{border : '1px solid grey', marginTop : '5px', marginBottom : '10px', fontSize : '12px'}}class="ui blue labeled submit icon button">
                        <i class="icon edit"></i> Add Comment
                    </button>
                </div>
                 : <div></div>}
            </form>

            </div>

            
        </div>
        
        
       
    </div>)
       
        
}
