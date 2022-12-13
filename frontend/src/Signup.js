import React, { useState, useRef } from "react";
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import Modal from "./Modal/index.js";
const Signup = () => {
  const simpleValidator = useRef(new SimpleReactValidator({autoForceUpdate: this}))
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, seterrorMsg] = useState("")
  const [modal, setModal] = useState(false);
  const navigate = useNavigate()
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const showModal = () => {
    setModal(!modal)
  };  
  const changeMail=(e) => {
    setEmail(e)
    simpleValidator.current.showMessageFor('email')
  }
  const changeUser=(e) => {
    setUsername(e)
    simpleValidator.current.showMessageFor('username')
  }
  const changePass=(e) => {
    setpassword(e)
    simpleValidator.current.showMessageFor('password')
  }
  const closeMsg = () => {
    seterrorMsg('')
  }
  const handlesubmit = async (e) => {
    e.preventDefault();
    const formValid = simpleValidator.current.allValid()
    if (!formValid) {
      simpleValidator.current.showMessages()
        e.preventDefault();
    }else{
      let data = { email : email, password : password, username : username }
      let response = null;
      
      response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/sign-up',data).then(async res => {
          
          localStorage.setItem('isAuthenticated', true);
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('userId', res.data.userId)

          setModal(true)
          await delay(2000);
          navigate('/');
      }).catch(err => {
          console.log(err.response.data.message)
          seterrorMsg(err.response.data.message)
      })

    }
    
  };
  return (
      <div >

      
<h1 style={{width:' 100%',height: '100px',display: 'flex',justifyContent: 'center',alignItems: 'center', color : 'white'}}className="ui header"><Link style={{color : 'white'}} to="/">Music challenge app</Link></h1>
    <div style={{background : 'black', color : 'white', paddingTop : '49px', height : '480px', }}className="ui middle aligned center aligned grid">
       
      <form style={{background : 'black', color : 'white', width : '300px',border : '1px solid grey'}}className="ui large form" onSubmit={handlesubmit}>
          <div style={{background : 'black', color : 'white'}}className="ui  segment">
            <div class="form-group">
            <div style={{background : 'black', color : 'white'}}className="field">
            <label style={{background : 'black', color : 'white'}} htmlFor="Email">email</label>
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
            <label style={{background : 'black', color : 'white'}} htmlFor="Email">username</label>
            <input
              style={{ fontFamily : 'FavoritPro, monospace', background : 'black', color : 'white', border : '1px solid grey'}}
                type="text"
                placeholder="username"
                required
                value={username}
                onChange={(e) =>   changeUser(e.target.value)}
                className="Input"
            />
            <div style={{color: 'grey'}}>{simpleValidator.current.message('username', email, 'required')}</div>
            </div>
            <div style={{background : 'black', color : 'white'}}className="field">
            <label style={{background : 'black', color : 'white'}} htmlFor="Password">Password</label>
            <input
                style={{ font : 'FavoritPro, monospace', background : 'black', color : 'white', border : '1px solid grey'}}
                type="Password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) =>  changePass(e.target.value)}
                
            />
            <div style={{color: 'grey'}}>{simpleValidator.current.message('password', password, 'required|min:5')}</div>
            </div>
            </div>
           
          </div>
        
        <button style={{marginLeft : '95px', color : 'white', border: '1px solid grey'}}className="ui button" type="submit">Sign up</button>
        <div>
            <div className="ui message" style={{ color: 'grey', margin : '0px', display : errorMsg ? 'block' : 'none'}}>
                            <i className="close icon" onClick={closeMsg}></i>
                            <div className="header">
                            </div>
                            <p>{errorMsg}</p>
                </div>
        </div>
      </form>
      <Modal onClose={showModal} show={modal}>
                Thanks for signing up!
                </Modal>
    </div>
    </div>
  );
};
export default Signup;