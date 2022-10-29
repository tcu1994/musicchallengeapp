import React, { Component } from 'react';
import WaveSurfer from 'wavesurfer.js';
import './styles.css'
import axios from 'axios'
import { ElasticBeanstalk } from 'aws-sdk';

class Waveform extends Component {  
  state = {
    playing: false,
    current : 0,
    hasStarted : false,
    pause : false
  };
  componentDidMount() {
    const track = document.querySelector(`#track${this.props.id}`);
    const volumeIcon = document.querySelector("#volumeIcon")
    const volumeSlider = document.querySelector("#volumeSlider")
    volumeIcon.addEventListener("click", this.toggleMute)
    volumeSlider.addEventListener("input", this.handleVolumeChange)

    this.waveform = WaveSurfer.create({

      barWidth: 3,
      cursorWidth: 1,
      container: `#waveform${this.props.id}`,
      backend: 'WebAudio',
      height: 45,
      progressColor: '#'+this.props.color,
      responsive: true,
      fillParent: true,
      minPxPerSec : 5,
      waveColor: 'white',
      cursorColor: 'transparent',
    });
    this.props.send(this.waveform, this.props.id, this.pause)
    this.waveform.on('audioprocess', () => {      
        this.setState({current :this.waveform.getCurrentTime()})
    });
    this.waveform.load(track);
    console.log(this.props.color)
    
  };
  setVolumeFromLocalStorage = () => {
    const volumeSlider = document.querySelector("#volumeSlider")
    // Retrieves the volume from local storage, or falls back to default value of 50
    const volume = localStorage.getItem("audio-player-volume") * 100 || 50
    volumeSlider.value = volume
  }
  handleVolumeChange = e => {
    // Set volume as input value divided by 100
    // NB: Wavesurfer only excepts volume value between 0 - 1
    const volume = e.target.value / 100
    this.waveform.setVolume(volume)
    // Save the value to local storage so it persists between page reloads
    localStorage.setItem("audio-player-volume", volume)
  }
  async componentWillUnmount(){
    if ( this.state.playing){

      this.waveform.playPause();
    }
  }
  toggleMute = () => {
    this.waveform.toggleMute()
    const isMuted = this.waveform.getMute()
    const volumeSlider = document.querySelector("#volumeSlider")
    if (isMuted) {
      volumeSlider.disabled = true
    } else {
      volumeSlider.disabled = false
    }
  }

  handlePlay = async () => {
    

    if (!this.state.hasStarted){
      this.setState({ hasStarted : true})
      let token = localStorage.getItem('token')
      axios.defaults.headers.common['Authorization'] = "token: "+token

          
      let response;
      
      response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/play-song', {
          url : this.props.url
      })


    }
    if (!this.state.playing){
      this.props.pause(this.props.id)
    } 
    this.setState({ playing: !this.state.playing });
    this.waveform.playPause();
  };
  pause = () => {
    this.setState({ playing: false });
    this.waveform.pause();
  }
  render() {
    const url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3';

    return (
      <div style={{height : '50px'}} >
        <button id="wavebtn" onClick={this.handlePlay} >
          <span style={{fontSize : '3em'}}>{!this.state.playing ? '►' : '❚❚'}</span>
        </button>
        <div style={{width : '400px'}}>
        <div class="waveform "id={`waveform${this.props.id}`} />
        </div>
       
        <div style={{ color : 'white',position : 'relative', top : '-45px', left :'450px'}}>►{this.props.plays}</div>
        <audio id={`track${this.props.id}`} src={this.props.url} />
        { this.state.hasStarted ? <div style={{ width : '30px',zIndex : '30', position : 'relative', left : '450px', top : '-88px'}}>{Math.floor(this.state.current / 60) + ':' + ('0'+Math.floor(this.state.current % 60)).slice(-2)}</div> : ''}
        <div class="volume"  style={{ color : 'white', visibility : !this.state.playing ? 'hidden' : ''}}>
              <i
                class=" ui volume down icon" id="volumeIcon" style={{zIndex : '1000', position : 'relative',top : '-84px',left : '280px',color : 'white'
                  
                  }}
              />
              <input style={{backgroundColor : '#'+this.props.color}}
                id="volumeSlider"
                class="volume-slider"
                type="range"
                name="volume-slider"
                min="0"
                max="100"
                defaultValue="50"
              />
            </div>
      </div>
    );
  }
};

export default Waveform;