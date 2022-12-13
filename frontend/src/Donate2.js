import React, { useState, useRef, useEffect } from "react";
import { Link ,useParams } from 'react-router-dom'
import address from './address.png';
import {isMobile} from 'react-device-detect';
const Donate2 = () => {



    return (
        <div>


            <div style={{ borderBottom : '1px solid grey', color: 'white', float : 'top', height : '51px', marginBottom : '0px'}}>
               
               
               <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', width : '400px', display: 'inline-block'}}><Link style={{ color : 'white'}}to="/">Music challenge app</Link></h1>
               {isMobile ? null : <Link style={{borderRadius : '0px', marginTop : '8px', color: 'white', float :'right', marginRight : '100px', color : 'white', background : 'black'}} className="ui button" to="/">
               Back
           </Link>}
           
           </div>
            <div style={{marginLeft : '20px', marginTop : '20px'}}>
                <div>Thank you for choosing to donate</div>
                <div>Crypto donations are currently available</div>
                <div>Coinbase BTC QR address :</div>
                <img style={{marginTop : '10px', width : '200px', height : '200px'}}src={address}></img>
                <div>Coinbase BTC address: 3GeRqatdhgAH5BDsAhg8Z5eiQf84rnrciz</div>
                <div>Coinbase ETH address: 0xb0c00C2Ae0166995F57B862E9B05baec10D6214d</div>

            </div>



        </div>
    )
}

export default Donate2;