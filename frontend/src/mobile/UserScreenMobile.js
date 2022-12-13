import React from 'react';
import axios from 'axios'
import { Link, useLinkClickHandler } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import {isMobile} from 'react-device-detect';
class UserScreen extends React.Component {
    
   
    constructor(props){
        super(props);
        this.state = {
            challenges : [],
            clicked : true,
            challengesSearch : [], 
            pages : [],
            unreadMessages : 0,
            sorts : ['Date (newest)', 'Date (oldest)', 'Number of entries high', 'Number of entries low'],
            filter : null,
            sort : null,
            input : '',
            currentPage : 1,
            colors : [],
            colorQs : [],
            active : [false, false, false, false, false]
         };

         this.setSort = this.setSort.bind(this);
         this.onChangeRadio = this.onChangeRadio.bind(this);
         this.updateInput = this.updateInput.bind(this);
         this.searchChange = this.searchChange.bind(this)
    }
    searchChange(e){
        this.setState({ input : e.target.value});
        if (e.target.value == ''){
            this.updateInput('')
        }
    }
   
    async setSort(sort){
        let sortVal = '1'
        
        if (sort == 'Date (oldest)'){
            this.setState({ sort : '2'})
            sortVal = '2'
        }
        else if (sort == 'Number of entries high'){
            this.setState({ sort : '3'})
            sortVal = '3'
        }
        else if (sort == 'Number of entries low'){
            this.setState({ sort : '4'})
            sortVal = '4'
        }else{
            this.setState({ sort : '1'})
        }

        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : this.state.filter,
                sort : sortVal,
                windowWidth : window.innerWidth,
                isMobile : isMobile
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
            }
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })

        




    }
    handleCategoryChange = (sort) => {
        this.setSort(sort);
    }

    async pageClick(page){
        this.setState({ currentPage : page})
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params: {
              page: page - 1,
              filter : this.state.filter,
              sort : this.state.sort,
              windowWidth : window.innerWidth,
              searchQuery : this.state.input,
              isMobile : isMobile

            }
          }).then(res => {
            this.setState({ challenges : res.data.challenges})
            // let pages = []
            // for (let i = 0; i< res.data.pages; i++){
            //     pages.push(i+1)
            //     console.log('da')
            // }
            // console.log(pages)
            // this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })
    }
    
    async updateInput(input) {

    let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params: {
              searchQuery : input,
              page: 0,
              filter : this.state.filter,
              sort : this.state.sort,
              windowWidth : window.innerWidth,
              isMobile : isMobile
            }
          }).then(res => {
            this.setState({ challenges : res.data.challenges})
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
            }
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })



    //  const filtered = this.state.challenges.filter(challenge => {
    //       let rule = challenge.name.toLowerCase().includes(input.toLowerCase())
    //       if (challenge.text){
    //           rule = rule ||  challenge.text.toLowerCase().includes(input.toLowerCase()) 
    //       }
          
    //       if (challenge.colorNames.length > 0){
    //         rule = rule || challenge.colorNames[0].toLowerCase().includes(input.toLowerCase())|| challenge.colorNames[1].toLowerCase().includes(input.toLowerCase())|| challenge.colorNames[2].toLowerCase().includes(input.toLowerCase())
    //       }
    //         return  rule
    //  })
    //  this.setState({ challengesSearch : filtered})
    //  this.setState({ input : input})
  }
    async componentDidMount(){
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : this.state.filter,
                sort : this.state.sort,
                windowWidth : window.innerWidth,
                isMobile : isMobile
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
            }
            this.setState({pages : pages})



            // let colors = []
            // let colorQs = []
            // for (let i = 0; i< res.data.challenges.length; i++){
            //     if (res.data.challenges[i].colorNames.length > 0){
            //         if (colors.includes(res.data.challenges[i].colorNames[0])){
            //             colorQs[colors.indexOf(res.data.challenges[i].colorNames[0])] +=1 
            //         }else{
            //             colors.push(res.data.challenges[i].colorNames[0])
            //             colorQs.push(1)
            //         }
            //         if (colors.includes(res.data.challenges[i].colorNames[1])){
            //             colorQs[colors.indexOf(res.data.challenges[i].colorNames[1])] +=1 
            //         }else{
            //             colors.push(res.data.challenges[i].colorNames[1])
            //             colorQs.push(1)
            //         }
            //         if (colors.includes(res.data.challenges[i].colorNames[2])){
            //             colorQs[colors.indexOf(res.data.challenges[i].colorNames[2])] +=1 
            //         }else{
            //             colors.push(res.data.challenges[i].colorNames[2])
            //             colorQs.push(1)
            //         }
            //     }
                
            // }
           
            this.setState({colors: res.data.colors})
            this.setState({colorQs: res.data.colorQs})



        }).catch(err => {
            console.log(err)
        })
        if (localStorage.getItem('isAuthenticated') == 'true'){
            await axios.get(process.env.REACT_APP_BACKEND_URL + '/unread-messages', {
                params : {
                    user : localStorage.getItem('userId')
                }
            }).then(res => {
                
                this.setState({unreadMessages : res.data.unreadMessages})
            }).catch(err => {
                console.log(err)
            })
        }
        
       
    } 
     _handleKeyDown (event) {
        if (event.key === 'Enter') {
            this.updateInput(this.state.input)
        }
    }
    async onChangeRadio(event) {
        this.setState({ filter : event.target.value})
        let token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = "token: "+token
        await axios.get(process.env.REACT_APP_BACKEND_URL + '/challenges', {
            params : {
                filter : event.target.value,
                sort : this.state.sort,
                isMobile : isMobile
            }
        }).then(res => {
            this.setState({ challenges : res.data.challenges})
            let pages = []
            for (let i = 0; i< res.data.pages; i++){
                pages.push(i+1)
            }
            this.setState({pages : pages})
        }).catch(err => {
            console.log(err)
        })

        
      }
    logout () {
        localStorage.clear();
        let his = createBrowserHistory();
        his.push('/');
        window.location.reload();
    }
    clicked () {
        this.setState({clicked : true})
    }
    render(){
        
        
        let challenges = this.state.challenges
        let renderChallenges = challenges.map((challenge)=> {
            return (<div className="ui card"style={{paddingTop: '0px', marginTop : '0px',marginRight : '1px',backgroundColor : 'black', color : 'white',  borderRadius : '0px',maxHeight : '110px', maxWidth : Math.floor((window.innerWidth - 54)/3)+'px', justifyContent: 'center',alignItems: 'center', zIndex : '11', border : 'none', overflow : 'hidden', cursor: 'pointer', boxShadow : 'none' }}>
                {/* <div style={{display : 'inline-block', paddingTop : '8px'}} class="ui header">{challenge.name}</div> */}
                <div  style = {{padding : '0px', justifyContent: 'center',alignItems: 'center' }}className="ui middle aligned center aligned content">
                        
                        {challenge.photoURL ? <div style={{overflow : 'hidden', width : Math.floor((window.innerWidth - 74)/3)+'px', height : '100px',display : 'flex', justifyContent: 'center'}}>
                        <Link to={`/challenge/${challenge._id}`}>
                                <img style={{ padding: '0px',margin : '0px', maxHeight : '100px', width : 'auto', height : '100px'}}src={challenge.photoURL}/>
                            </Link>
                            </div>
                             :
                             <Link to={`/challenge/${challenge._id}`}><div style={{ lineHeight : '14px',position : 'relative', top : '20px',color : 'white', height : '90px', width : '90px', fontSize : '8px'}}className="description">{challenge.text.substring(0, 80)}</div></Link> }
                        <div style={{ position : 'relative', left :'6px', float : 'left',padding : '0px',color : 'white', display : 'inline-block', fontSize : '11px'}}className="description"> {challenge.name}</div>
                        <div style={{ position : 'relative',left :'6px',  top : '-8px', float : 'left',color : 'white', display : 'block', fontSize : '11px'}}className="description"> # of songs: {challenge.entries.length}</div>
                    </div>
                
                
                
                    
            </div>)
        })
        let pagesRender = []
        for (let i = this.state.currentPage - 1; i <= this.state.currentPage + 2; i++){
            if (i > 0 && this.state.pages.includes(i)){
                pagesRender.push(i)
            }
        }
        let colorQs1 = JSON.parse(JSON.stringify(this.state.colorQs));
        let colors1 = JSON.parse(JSON.stringify(this.state.colors));
        let finalColorQs = []
        let finalColors = []
        for (let j = 0; j < 5; j++){
            let max = -1
            let index = -1
            for (let i = 0; i< colors1.length; i++){
                if (max < colorQs1[i]){
                    max = colorQs1[i];
                    index = i
                }
                

            }
            finalColorQs.push(colorQs1[index])
            finalColors.push(colors1[index])
            colorQs1[index] = '-1';
            colors1[index] = 'x';
        }
        
        return (<div>
           
            <div  style={{  fontSize : '11px',color: 'white', borderBottom : '1px solid grey'}}>
            <h1 style={{position : 'relative', top : '5px', paddingLeft : '20px', display: 'inline-block'}}>Music challenge app</h1>
            </div>
            <div style={{ textDecoration : 'underline'}}>
            {localStorage.isAuthenticated == 'true' ? <div  style={{  textDecoration : 'underline',borderBottom : '1px solid grey',display: 'block', float : 'left', marginRight : '0px'}}>
            <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '3px', color: 'white' ,background : 'black',fontSize : '14px', marginLeft : '0px'}}className="ui button" to="/new_challenge">
                Create your challenge
            </Link>
            <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '3px',color: 'white',background : 'black',fontSize : '14px'}}className="ui button" to={`/profile/${localStorage.getItem('userId')}`}>
                Your profile
            </Link>
            <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '3px', color: 'white',background : 'black',fontSize : '14px'}}className="ui button" to="/inbox">
                Inbox {this.state.unreadMessages ? <span style={{color : 'white',background : 'black'}}>({this.state.unreadMessages})</span> : <div></div>}
            </Link>
            <button style={{textDecoration : 'underline',display: '',borderRadius : '0px', marginTop : '6px', color: 'white',background : 'black',fontSize : '14px'}}className="ui button" onClick={this.logout}>
                Logout
            </button>
            <Link style={{textDecoration : 'underline',borderRadius : '0px', marginTop : '3px', color: 'white',background : 'black',fontSize : '14px'}}className="ui button" to="/donate">
                Donate
            </Link>
            </div>
                 : 
            <div style={{ width : '100%',borderBottom : '1px solid grey',display: 'block', paddingLeft : '6px',float : 'left', marginTop :'10px'}}>
                <Link style={{textDecoration : 'underline', fontSize : '10px',borderRadius : '0px', marginTop : '0px', color: 'white',background : 'black', fontSize : '14px'}} className="ui button" to="/login">
                            Login
                </Link>
                <Link style={{textDecoration : 'underline', fontSize : '10px',borderRadius : '0px', marginTop : '0px', color: 'white',background : 'black', fontSize : '14px'}} className="ui button" to="/signup">
                            Sign up
                </Link>
            </div>
            }
            </div>
           
            
            
            
            
            
            
            <div style={{display : 'block'}}>
                <p className="ui paragraph" style={{display : 'block', fontSize : '12px',paddingLeft: '14px', paddingTop: '10px',paddingBottom : '4px', borderBottom : '1px solid grey'}}><br></br><br></br>Welcome to the music challenge app! Purpose of the app is to inquire your creative processes, develop musical expression of moods and emotions.
                <br></br> Goal is to create an original song which suits the image or text of the challenge the most. Enjoy!
                <br></br> For a challenge you can put an image or paragraph of text(from your favourite book or even your own writing) that you would like to hear a song composed of.
                <br></br> As for song entries of a challenge please post your original works, it can be some of your previous work if you think it suits the challenge, but you are encouraged to make a new song/ short passage specifically for a certain challenge.
                </p>
            
            </div>
           <div style={{paddingTop : '10px'}}>
           <span style={{fontSize:'16px', paddingLeft : '15px', marginTop : '14px', paddingTop : '14px', paddingRight : '22px'}}>Challenges:</span>
           <div style={{fontSize : '10px',display : 'inline', position : 'relative', height : '15px'}}class="ui search">
                <div class="ui icon input">
                    <input value={this.state.input}
                        onKeyDown={(e) => {this._handleKeyDown(e)}}
                        onChange={(e) => {this.searchChange(e)}}
                        style={{borderRadius : '0px', height : '16px'}} 
                        class="prompt" type="text" placeholder="Search by name or color!"/>
                        
                    
                    
                </div>
                <i style={{ height : '15px',fontSize : '11px',position : 'relative', left : '5px', top : '0px', cursor : 'pointer', color : 'white', zIndex : '1001'}}onClick={(e) => this.updateInput(this.state.input)}  class="ui search icon"></i>
                </div>
            </div>
            

            <div style={{ paddingLeft : '20px',fontSize : '11px',cursor : 'pointer', display : 'inline', color : 'white',display : 'inline', position : 'relative'}}>Color picker: 
                {finalColors.map((color,i) => {
                    return <span onClick={() => this.updateInput(color)} style={{ fontSize : '9px',padding : '1px', marginRight : '2px', borderRadius: '5px',zIndex : '1001', color : 'white', background : `${color}`}}>{color} ({finalColorQs[i]})</span>
                })}
            </div>





            
                
            {/* <div style={{display :'inline', position : 'relative', left : '600px', top : '-30px', color : 'white'}} onChange={this.onChangeRadio}>
                <span class="ui text">Filter by:</span>
                
                <div style={{marginLeft : '10px' , color : 'white'}}class="ui radio checkbox"> <input  type="radio" value="Image" name="options" /> <label style={{color : 'white'}}>Image</label></div>
                <div style={{marginLeft : '10px', color : 'white'}}class="ui radio checkbox"> <input type="radio" value="Text" name="options" />  <label  style={{color : 'white'}}>Text</label></div>
                <div style={{marginLeft : '10px', color : 'white'}}class="ui radio checkbox"> <input type="radio" value="Both" name="options" />  <label  style={{color : 'white'}}>Both</label></div>
                
            </div> */}
            <div style={{paddingLeft : '20px',fontSize : '10px',display :'block', position : 'relative'}}>
            
                <span>Sort by: </span>
               
                <select  name="select" class="ui dropdown" style={{ position : 'relative', top: '0px',height : '16px', width : '70px', fontSize : '7px'}}onChange={event => this.handleCategoryChange(event.target.value)}>
                {this.state.sorts.map(function(n) { 
                    return (<option style={{ }}value={n} onClick={() => this.setSort(n)}>{n}</option>);
                })}
                </select>
               
                

            {/* <select name="select" onChange={event => this.handleCategoryChange(event.target.value)}>
                {this.state.sorts.map(function(n) { 
                    return (<option value={n} onClick={() => this.setSort(n)}>{n}</option>);
                })}
            </select> */}
            </div>
            <div style={{ paddingTop: '20px', paddingLeft : '15px', borderRight : '1px solid grey'}}className="ui cards">{renderChallenges}</div>
            { this.state.pages ? 
            <div style={{paddingLeft : '20px'}}>pages: 
            {pagesRender.map(page => {
                return (<div onClick={() => this.pageClick(page)}style={{display: 'inline', cursor: 'pointer' }} > {' '+page}</div>)
            })}
            { !pagesRender.includes(this.state.pages[this.state.pages.length -1 ]) ?<div onClick={() => this.pageClick(this.state.pages[this.state.pages.length -1 ])}style={{display: 'inline', cursor: 'pointer' }} >     ...{this.state.pages[this.state.pages.length -1 ]}</div>
            : ''}
            <div style={{display : 'inline', paddingLeft: '6px'}}>
        { this.state.currentPage != 1 ? <i class="arrow left  icon"onClick={() => this.pageClick(this.state.currentPage -1)}></i> : ''}{ this.state.currentPage != this.state.pages[this.state.pages.length -1 ]  ? <i class="arrow right icon" onClick={() => this.pageClick(this.state.currentPage +1)}></i> : '' }
        </div>
            </div>
        : ''}
        
        
            


        </div>)

    }

}
export default UserScreen;