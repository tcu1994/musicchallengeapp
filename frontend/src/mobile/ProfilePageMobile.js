import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'
import { Link ,useParams } from 'react-router-dom'
import Waveform from '../Waveform';
import { useNavigate } from 'react-router-dom';
export default function Challenge() {
    const [offset, setOffset] = useState({});
    const [user, setUser] = useState({});
    const [edit, setEdit] = useState({});
    const [inputs, setInputs] = useState({});
    const { id } = useParams();
    const [waveforms, setWaveforms] = useState([]);
    const navigate = useNavigate();   
    const handleSubmit = async (event) => {
        event.preventDefault();

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        let response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/set-link', {
                id : localStorage.getItem('userId'),
                link: inputs.link
                
              })
        
        setUser(values => ({...values, link: inputs.link}))
        setEdit(false);
    }




    useEffect(() => {
        async function fetchAPI(){
            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token
            let response = await axios.get(process.env.REACT_APP_BACKEND_URL + '/user', {
                params: {
                  id: id
                }
              })
            setUser(response.data.user)
            setOffset(0)
        }
        fetchAPI()

        

    }, []);
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
      }
    const editLink = () => {
        setEdit(true);
    }
    const clickArrow = (flag) => {
        if (flag){
            setOffset(offset + 5)
        }else{
            setOffset(offset - 5)
        }
        
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
    const openInbox = async(id) => {

        await axios.get(process.env.REACT_APP_BACKEND_URL + '/user', {
            params : {
                id : id
            }
        }).then( async (res)  => {
            let res1 = await axios.post(process.env.REACT_APP_BACKEND_URL + '/new-inbox', {
                user1: id,
                user2: localStorage.getItem('userId')
            })
            


        }).catch(err => {
            console.log(err)
        })











        navigate('/inbox/')
    }

    return(<div>
        <div style={{ borderBottom : '1px solid grey' ,backgroundColor : 'black', color: 'white', float : 'top', height : '51px', marginBottom : '20px'}}>
        <h1 style={{position : 'relative', color: 'white',top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block',backgroundColor : 'black', color: 'white'}}><Link style={{ color : 'white', background : 'black'}}to="/">Music challenge app</Link></h1>
        <Link style={{background : 'black', borderRadius : '0px', marginTop : '8px', color: 'white', float :'right', marginRight : '20px'}} className="ui button" to="/">
                Back
            </Link>
            

        </div>
        { user._id == localStorage.getItem('userId') ?
        <h2 style={{paddingLeft : '20px',color: 'white'}}className="ui header">Your profile </h2>
          :
          <h2 style={{paddingLeft : '20px',color: 'white'}}className="ui header">
            Profile page for user {user.username}               <i onClick={() => openInbox(user._id)} style={{ display : localStorage.getItem('isAuthenticated') == 'true' ? 'inline' : 'none',color: 'white',marginBottom :'5px', fontSize : '30px',cursor : 'pointer' }}class="envelope outline icon"></i> 
        </h2> }
        { edit == true ? 
                <form style={{ paddingLeft : '20px'}} onSubmit={handleSubmit}>
                    <label>Soundcloud/ bandcamp link :</label>
                    <input style={{background : 'transparent', color : 'white', fontFamily : 'FavoritPro, monospace'}}type="text" name = "link" onChange={handleChange} value={inputs.link}></input>
                    <i onClick={handleSubmit} class="ui paper plane icon" style={{color : 'white', marginLeft :'3px'}}></i>
                    
                </form>
        
            : 
            <div style={{paddingLeft : '20px',color: 'white'}}>Soundcloud/ bandcamp link :<a target = "_blank"  style={{color : 'white',textDecoration: 'underline' }}href={user.link}>{user.link}</a> 
            
            { user._id == localStorage.getItem('userId') ?
            <i onClick={()=> editLink()}style={{ paddingLeft : '10px',color: 'white'}}class="edit icon"></i>
                : <div></div>
            }
            
            </div>
            
            }
            <div style={{paddingLeft : '20px',color: 'white'}}><i  style={{ color: 'white',fontSize : '1em', display: 'inline', position : 'relative'}}class="hovertext ui trophy icon"></i>Wins by vote: {user?.entries?.reduce(function (result, entry) {
                            return (result + (entry.winner ? 1 : 0))
                            }, 0)}</div>
            <div style={{paddingLeft : '20px',color: 'white'}}><i  style={{ color: 'white',fontSize : '1em', display: 'inline', position : 'relative'}}class="hovertext ui check circle outline icon"></i>Author's choice awards: {user?.entries?.reduce(function (result, entry) {
        return (result + (entry.authorsChoice ? 1 : 0))
        }, 0)}</div>
        

        <h4 style={{paddingLeft : '55px',color: 'white'}}>
            Song entries
        </h4> 
        { user?.entries?.length > 0 ? 
        <table style={{paddingLeft : '5px',color: 'white',borderCollapse : 'collapse'}} class="">
        <thead>
            <tr ><th style={{border : 'none'}} ></th>
                
            <th style={{color : 'white',border : '1px solid white'}}><div style={{marginTop : '10px'}}>challenge</div></th>
            <th style={{color : 'white',border : '1px solid white'}}><div style={{marginTop : '10px'}}>song</div></th>
        </tr></thead>
        <tbody>
        {user?.entries?.length > 0 ? user.entries.slice(offset,offset+ 5).map((entry,i) => {
                return <tr >
                    <td style={{borderBottom : 'none',borderLeft  : 'none', borderTop: 'none'}}>{entry.authorsChoice ? <div class="" data-tooltip="Author's choice">
                    <i  style={{ color: 'white',fontSize : '1.5em', display: 'flex', position : 'relative', right : entry.winner ? '-2px' : '0', top  :'0px'}}class="hovertext ui check circle outline icon"></i></div>: null}
                    {entry.winner ? <div class="" data-position="bottom left" data-tooltip="Winner by vote">
                    <i  style={{ color: 'white',fontSize : '1.5em', display: 'flex', position : 'relative', right : entry.authorsChoice ? '-1px' :'0px', top  :entry.authorsChoice ? '8px' : '0px'}}class="hovertext ui trophy icon"></i></div>: null}</td>
                    
                    <td><Link style={{color: 'white'}}to={`/challenge/${entry.challenge._id}`}>
                        {entry.challenge.name}
                    </Link></td>
                    <td id="profileWave" style={{color: 'white',width : '230px'}}><Waveform send={send} pause={pause}id={i}url={entry.songURL} plays={entry.plays}
                    /> </td>
                </tr>
            }) : <div>No song entries</div>}
            { offset != 0 ? <i class="arrow left  icon"onClick={() => clickArrow(false)}></i> : ''}{ user.entries ? offset + 5 < user.entries.length ? <i class="arrow right icon" onClick={() => clickArrow(true)}></i> : '' : '' }
        </tbody>


        </table> : <div style={{ paddingLeft : '20px'}}>No song entries by user</div>
    }
        
            
        
            

        <table style={{  border : 'none',padding: '5px',color: 'white',float : 'bottom', paddingLeft : '20px', paddingTop : '20px'}}class="ui very basic collapsing celled table">
        
        
        <h4 ><div style={{textAlign : 'center'}}>Challenges</div></h4><hr style={{width : '200px'}}></hr>
        <tbody style={{}}>
            
           
            {user?.challenges?.length > 0  ? user.challenges.map((entry, i) => {
                return <tr style={{borderRight : 'none', borderBottom : (i+1  == user.challenges.length) ? 'none' : '1px solid' }}>
                    <td style={{borderRight : 'none', borderBottom : (i+1  == user.challenges.length) ? 'none' : '1px solid' }}><Link style={{color: 'white', marginLeft : '10px'}}to={`/challenge/${entry._id}`}>
                        {entry.name}
                    </Link></td>
                    
                </tr>
            }) : <div>No challenges</div>}
        </tbody>


        </table>
        
        
        
    </div>)
}