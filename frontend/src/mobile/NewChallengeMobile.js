import React, { useState, useRef } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import FormData from 'form-data'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Link ,useParams } from 'react-router-dom'
export default function Challenge() {
    const [inputs, setInputs] = useState({});
    const simpleValidator = useRef(new SimpleReactValidator({autoForceUpdate: this}))
    const [errMsg, setErrMsg] = useState();
    const [disabled, setDisabled] = useState(false);
    const [fileName, setFileName] = useState();
    const [formData, setFormData] = useState(new FormData());
    const navigate = useNavigate();
    const onSelectImageHandler = (files) => {
        const file = files[0];
        var formData = new FormData();
        formData.append('file', file)
        setFileName(file.name)
        setFormData(formData)
        const config = {
            headers: {
                "Content-Type":"multipart/form-data" 
            }
        };
    }
    const handleClick = event => {
        hiddenFileInput.current.click();
      };
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setInputs(values => ({...values, [name]: value}))
      }
    const hiddenFileInput = React.useRef(null);
    const handleSubmit = async (event) => {
        if (disabled) {
            return;
        }
        setDisabled(true);
        event.preventDefault();

        const formValid = simpleValidator.current.allValid()
        if (!formValid) {
          simpleValidator.current.showMessages()
          setDisabled(false);
            event.preventDefault();
        }else{

            let token = localStorage.getItem('token')
            axios.defaults.headers.common['Authorization'] = "token: "+token

            let photoURL;
            let response;
            let colors
            let colorNames
            if (!formData.entries().next().done){
                response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/upload', formData)
                photoURL = response.data.url
                colors = response.data.colors
                colorNames = response.data.colorNames
            }
            






            let data = { name : inputs.name, photoURL : photoURL, text: inputs.text , colors : colors, colorNames: colorNames}
            
            response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/challenge',data).then(response => {
                navigate('/')
            }).catch(error => {
                setErrMsg(error.message)
             })
            
        }
    }








    return (<div>
        
        <div style={{ borderBottom : '1px solid grey', backgroundColor : 'black', color: 'white', float : 'top', height : '51px', marginBottom : '20px'}}>
        <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block', }}><Link style={{color : 'white'}}to="/">Music challenge app</Link></h1>
        
        <Link style={{borderRadius : '0px', marginTop : '8px',backgroundColor : 'black', color: 'white', float :'right', marginRight : '20px'}}className="ui button" to="/">
                Back
            </Link>
        </div>
        <h2 style={{marginTop : '0px',backgroundColor : 'black', color: 'white',paddingLeft : '20px', display: 'inline-block'}}className="ui header">Add new challenge: </h2>
        <form className="ui form" style={{paddingLeft : '20px'}}onSubmit={handleSubmit} >
        <div className="fields" >
        <div className="field">
            <label style={{color : 'white'}}>Name: </label>
            <input type="text" value={inputs.name || ""} style={{background : 'black', color : 'white', border : '1px solid grey'}}
            onChange={handleChange} name = "name" onBlur={simpleValidator.current.showMessageFor('name')}/>
            
            <div style={{color: 'grey'}}>{simpleValidator.current.message('name', inputs.name, 'required')}</div>
             </div>
             <div className="field">
             <label style={{color : 'white'}}>Text: </label>
             <textarea value={inputs.text || ""} style={{background : 'black', color : 'white', border : '1px solid grey', width : '300px'}}
                onChange={handleChange} name = "text" type="textarea" rows={2} cols={5} />
           
             </div>
            
        </div>
        <div style={{paddingTop : '20px'}}>
        <label >Add image of a challenge:</label>
        <i style={{ fontSize : '2em', color : 'white', cursor : 'pointer'}}onClick={handleClick} class=" ui file alternate icon"></i><span>{fileName}</span>
        <input style={{display : 'block',marginTop : '16px' , color : 'white', border :' 1px solid white'}}className="ui button" disabled={disabled}  type="submit" />
             <input style ={{border : 'none', background : 'black', color : 'white', visibility : 'hidden'}}
                    type="file"
                    accept="image/*"
                    id="contained-button-file"
                    onChange={(e) => onSelectImageHandler(e.target.files)}
                    ref={hiddenFileInput}
            /> 
        </div>
        
        </form>
        
        <div className="ui message" style={{ color: 'grey', margin : '0px', display : errMsg ? 'block' : 'none'}}>
                        <i className="close icon"></i>
                        <div className="header">
                        </div>
                        <p>{errMsg}</p>
            </div>
    </div>)
}