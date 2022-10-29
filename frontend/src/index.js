import React from 'react';
import ReactDOM from 'react-dom/client'
import Login from './Login';
import Signup from './Signup';
import UserScreen from './UserScreen';
import Challenge from './Challenge';
import ProfilePage from './ProfilePage';
import Inbox from './Inbox';
import NewChallenge from './NewChallenge';
import Waveform from './Waveform';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
const App = () => {
    return(
        
        <BrowserRouter>
            <div className='App'>
                <Routes>
                   
                    
                    <Route  path="login" element={<Login/>} />
                    <Route  path="signup" element={<Signup/>} />
                    <Route exact path="/challenge/:id" element={<Challenge/>}/>
                    <Route path="/new_challenge" element={<NewChallenge/>}/>
                    <Route path="/profile/:id" element={<ProfilePage/>}/>
                    <Route path="/inbox/:id" element={<Inbox/>}/>
                    <Route path="/wave" element={<Waveform/>}/>
                    <Route path="/inbox" element={<Inbox/>}/>
                    <Route  path="/" element={
                        <UserScreen />}/>
                    
                    {/* <Route  path="/admin" element={<PrivateRoute isAdmin={true}>
                        <Admin />
                    </PrivateRoute>}/> */}
                    

                </Routes>
                
            </div>
        </BrowserRouter>
        
        
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
