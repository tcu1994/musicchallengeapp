import React from 'react';
import ReactDOM from 'react-dom/client'
import Login from './Login';
import LoginMobile from './mobile/LoginMobile';
import SignupMobile from './mobile/SignupMobile';
import Signup from './Signup';
import Donate2 from './Donate2.js';
import UserScreen from './UserScreen';
import UserScreenMobile from './mobile/UserScreenMobile';
import Challenge from './Challenge';
import ChallengeMobile from './mobile/ChallengeMobile';
import ProfilePage from './ProfilePage';
import ProfilePageMobile from './mobile/ProfilePageMobile';

import Inbox from './Inbox';
import InboxMobile from './mobile/InboxMobile';
import NewChallenge from './NewChallenge';
import NewChallengeMobile from './mobile/NewChallengeMobile';
import Waveform from './Waveform';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom'
import {isMobile} from 'react-device-detect';
const App = () => {
    return(
        <HashRouter basename = {process.env.PUBLIC_URL}>
        
                 
                
        
        { isMobile ? 
        <div className='App'>
        
            <Routes>
                <Route  path="/" element={<UserScreenMobile />}/>
                <Route exact path="/challenge/:id" element={<ChallengeMobile/>}/>
                <Route  path="login" element={<LoginMobile/>} />
                <Route  path="signup" element={<SignupMobile/>} />
                <Route path="/new_challenge" element={<NewChallengeMobile/>}/>
                <Route path="/profile/:id" element={<ProfilePageMobile/>}/>
                <Route path="/inbox/:id" element={<InboxMobile/>}/>
                <Route path="/inbox" element={<InboxMobile/>}/>
                <Route path="/donate" element={<Donate2/>}/>
                
            </Routes>
        </div> : 
        <div className='App'>
        
        <Routes>
           
            
            <Route  path="login" element={<Login/>} />
            <Route  path="signup" element={<Signup/>} />
            <Route exact path="/challenge/:id" element={<Challenge/>}/>
            <Route path="/new_challenge" element={<NewChallenge/>}/>
            <Route path="/profile/:id" element={<ProfilePage/>}/>
            <Route path="/inbox/:id" element={<Inbox/>}/>
            <Route path="/inbox" element={<Inbox/>}/>
            <Route path="/donate" element={<Donate2/>}/>
            <Route  path="/" element={
                <UserScreen />}/>
            
            {/* <Route  path="/admin" element={<PrivateRoute isAdmin={true}>
                <Admin />
            </PrivateRoute>}/> */}
            

        </Routes>
        
    </div>
    
    }
        
        
        
        
    
    
            </HashRouter>
       
        
        
        
    )
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// ReactDOM.render(
//     <App/>,
//     document.querySelector('#root')
// )
