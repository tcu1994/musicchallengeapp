import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
const Login = () => {
  const simpleValidator = useRef(new SimpleReactValidator({autoForceUpdate: this}))
  
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMsg, seterrorMsg] = useState("")
  const navigate = useNavigate();   
  localStorage.setItem('isAuthenticated', false)
  const closeMsg = () => {
    seterrorMsg('')
  }
  // useEffect(() => {
  //   simpleValidator.current.hideMessages();
  //   console.log('sda')
  // }, [])
  const changeMail=(e) => {
    setEmail(e)
    simpleValidator.current.showMessageFor('email')
  }
  const changePass=(e) => {
    setpassword(e)
    simpleValidator.current.showMessageFor('password')
  }
  const handlesubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid()
    if (!formValid) {
      simpleValidator.current.showMessages()
        e.preventDefault();
    }else{
      let data = { email : email, password : password }
      let response = null;
      try{
          response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/sign-in',data)
          if (response.status === 201){
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('role', response.data.role)
            localStorage.setItem('userId', response.data.userId)
            
            navigate('/');
            
            
        }
      }catch(err){
          console.log(err, 'asd')
          seterrorMsg(true)
      }
      
      // if (response.status === 401) {
      //     seterrorMsg(true)
      // }
    }
    
  };
  return (
      <div >
          {simpleValidator.current.hideMessages()}
      
    <h1 style={{width:' 100%',height: '100px',display: 'flex',justifyContent: 'center',alignItems: 'center', color : 'white'}}className="ui header"><Link to="/" style={{color : 'white'}}>Music challenge app</Link></h1>
    <div style={{background : 'black', color : 'white', paddingTop : '50px', height : '350px', }}className="ui middle aligned center aligned grid">
       
      <form style={{background : 'black', color : 'white', width : '300px',border : '1px solid grey'}}className="ui large form" onSubmit={handlesubmit}>
          <div style={{background : 'black', color : 'white'}}className="ui  segment">
            <div class="form-group">
            <div style={{background : 'black', color : 'white'}}className="field">
            <label style={{background : 'black', color : 'white'}} htmlFor="Email">Email</label>
            <input
              style={{ fontFamily : 'FavoritPro, monospace', background : 'black', color : 'white', border : '1px solid grey'}}
                type="text"
                placeholder="email"
                required
                value={email}
                onChange={(e) => changeMail(e.target.value)}
                className="Input"
            />
            <div style={{color: 'grey'}}>{simpleValidator.current.message('email', email, 'required|email')}</div>
            

            </div>
            <div style={{background : 'black', color : 'white'}}className="field">
            <label style={{background : 'black', color : 'white'}} htmlFor="Password">Password</label>
            <input
                style={{ fontFamily : 'FavoritPro, monospace', background : 'black', color : 'white', border : '1px solid grey'}}
                type="Password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => changePass(e.target.value)}
                
            />
            <div style={{color: 'grey'}}>{simpleValidator.current.message('password', password, 'required|min:5')}</div>
            </div>
            </div>
           
          </div>
        
        <button style={{marginLeft : '100px', color : 'white', border: '1px solid grey'}}className="ui button" type="submit">Log in</button>
        <div>
            <div className="ui message" style={{ color: 'grey', marginTop : '10px', display : errorMsg ? 'block' : 'none'}}>
                            <i className="close icon" onClick={closeMsg}></i>
                            <div className="header">
                            </div>
                            <p>Wrong email or password</p>
                </div>
        </div>
      </form>
    </div>
    </div>
  );
};
export default Login;