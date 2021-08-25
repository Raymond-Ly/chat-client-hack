<template>
  <div class="buttonContainer" id="buttonContainer">
    <div class="hiddenBg hidden" id="hiddenBg" @click="hideAllPopup">
    </div>
    <!-- <SecondConnection
    class="secondConnection"
    v-if="secondLocalTrack"
    :key="secondLocalTrack"
    ref="secondLocalTrack"
    /> -->
    <div class="buttonWrapper">
      <div class="newMsgDot" v-show="newMsgDot">
      </div>
      <div class="chatBtn" @click="chatPopup">
        <img class="menuIcon1" src="~/static/img/chat.svg">
        <div class="btnBg">
        </div>
        <p class="btnText">Chat</p>
      </div>
      <div class="layoutBtn"
      @click="changeLayout">
        <img class="menuIcon1" :src="layoutToggle">
        <div class="btnBg">
        </div>
        <p class="btnText">Layout</p>
      </div>
      <!-- <div class="fullScreenBtn"
      @click="enterFullScreen">
        <img :src="fullScreenToggle">
      </div> -->
      <div class="secureBtn">
        <img class="menuIcon1" src="~/static/img/unlock.svg">
        <p class="btnText">Lock</p>
      </div>
      <div class="participant">
        <!-- <img src="~/static/img/participant_icon_spaceon.svg"> -->
        <p>{{ this.getParticipantCount }}</p>
      </div>
      <div class="btnCover">

      </div>
      <div class="shareScreenButton" @click="disposeVideo2">
        <img class="menuIcon1" :src="shareScreenToggle">
        <div class="btnBg">
        </div>
        <!-- <p class="btnText">Share Screen</p> -->
        <p v-if="this.shareScreen" class="btnText">Stop Sharing</p>
        <p v-else class="btnText">Share Screen</p>
      </div>
      <div class="audioInputSelectWrapper">
        <div class="audioInputBtn" id="audioBtn"
        @click="muteLocalAudio">
          <img :src="audioBtnImage">
          <div class="btnBg">
          </div>
          <!-- <p class="btnText2">Mute</p> -->
          <p v-if="this.audioMuted" class="btnText2">Unmute</p>
          <p v-else class="btnText2">Mute</p>
        </div>
        <div class="audioPopupBtn" id="audioPopupBtn"
        @click="audioInputBtn">
          <img src="~/static/img/arrow_down.svg">
          <div class="popupBtnBg">
          </div>
        </div>
      </div>
      <div class="videoInputSelectWrapper">
        <div class="videoInputBtn"
        @click="cameraOnOff">
          <img :src="videoBtnImage">
          <div class="btnBg">
          </div>
        </div>
        <!-- <p class="btnText3">Stop Video</p> -->
        <p v-if="this.cameraOff" class="btnText3">Start Video</p>
        <p v-else class="btnText3">Stop Video</p>
        <div class="videoPopupBtn" id="videoPopupBtn" @click="videoInputBtn">
          <img src="~/static/img/arrow_down.svg">
          <div class="popupBtnBg">
          </div>
        </div>
      </div>
      <div class="leavePopup hidden" id="leavePopup">
        <div class="leave">
        </div>
        <div class="cancel">
        </div>
      </div>
      <div class="leaveBtn" @click="leaveTheRoom"></div>
    </div>
  </div>
</template>
<script>
import JitsiMeetJS from '@lyno/lib-jitsi-meet';
// import SecondConnection from '@/components/room_page/spaceon/wip/SecondConnection.vue';
export default {
  name: 'SpaceonButtons',
  // components: {
  //   SecondConnection
  // },
  data() {
    return {
      localTracks:[],
      layout: 0,
      audioOutput:[],
      audioMuted: true,
      // audioPopup: false,
      cameraOff: true,
      // videoPopup: false,
      screenSharing: false,
      fullScreen: false,
      shareScreen: false,
      participantNumber: null,
      selectedAudioInput: [],
      selectedAudioOutput: [],
      selectedVideoInput1: [],
      popup: false,
      localTrackStatus: false,
      testTrack: [],
      testTrack2: [],
      errorMsg: null,
      newMsgDot: false
    }
  },
  props: {
    room: Object,
  },
  methods: {
    chatPopup() {
      this.$store.commit("toggleChatPopup");
      this.$store.state.spaceon.newMsg = false;
    },
    leaveTheRoom() {
      this.$router.push('/')
      // const meetingData = { id: 'hub' };
      // this.$store.dispatch('enterExistingSpace', { meetingData });
    },
    changeLayout() {
      console.log("Layout Button Pressed");
      this.$store.commit('toggleLayout')
    },
    enterFullScreen() {
      let mainWindow = document.getElementsByTagName("body")
      if (!this.fullScreen) {
        this.fullScreen = true;
        if (mainWindow[0].requestFullscreen) {
          mainWindow[0].requestFullscreen();
        } else if (mainWindow[0].mozRequestFullScreen) { /* Firefox */
          mainWindow[0].mozRequestFullScreen();
        } else if (mainWindow[0].webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          mainWindow[0].webkitRequestFullscreen();
        } else if (mainWindow[0].msRequestFullscreen) { /* IE/Edge */
          mainWindow[0].msRequestFullscreen();
        }
      }
      else if (this.fullScreen) {
        this.fullScreen = false;
        if (document.exitFullscreen) {
          document.exitFullscreen();
          // this.fullScreen = false;
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
          // this.fullScreen = false;
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
          document.webkitExitFullscreen();
          // this.fullScreen = false;
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
          // this.fullScreen = false;
        }
      }
    },
    checkDefaultDevice() {
      //Audio Input:
      let defaultAudioInput = this.getDefaultAudioInput[0].deviceLable;
      let filteredAudioInput = this.getAudioInputDevice.filter(device => device.deviceLable === defaultAudioInput)
      let AudioInputDevice = filteredAudioInput[0];
      this.selectedAudioInput = {id: AudioInputDevice.deviceId, name: AudioInputDevice.deviceLable};
      //Audio Output:
      let defaultAudioOutput = this.getDefaultAudioOutput[0].deviceLable;
      let filteredAudioOutput = this.getAudioOutputDevice.filter(device => device.deviceLable === defaultAudioOutput)
      let AudioOutputDevice = filteredAudioOutput[0];
      this.selectedAudioOutput = {id: AudioOutputDevice.deviceId, name: AudioOutputDevice.deviceLable};
      //Video Input:
      let defaultVideoInput = this.getDefaultVideoInput[0].deviceLable;
      let filteredVideoInput = this.getVideoInputDevice.filter(device => device.deviceLable === defaultVideoInput)
      let VideoInputDevice = filteredVideoInput[0];
      this.selectedVideoInput1 = {id: VideoInputDevice.deviceId, name: VideoInputDevice.deviceLable};
    },
    audioInputBtn() {
      console.log("Clicked aduio popup");
      this.$store.commit("audioPopupToggle")
    },
    muteLocalAudio() {
      // let localAudio = this.$store.getters.getLocalAudioTrack;

      // let localTracks = this.$store.getters.getLocalTracks;
      switch (this.getLocalAudioInit) {
        case true:
        if (!this.audioMuted) {
          // for (var i = 0; i < localTracks.length; i++) {
          //   if (localTracks[i].type === 'audio') {
          //     localTracks[i].dispose();
          //     this.$store.state.spaceon.localTracks.splice(i, 1);
          //   }
          // }
          this.getLocalAudioTrack[0].mute();
          this.audioMuted = true;
          this.$store.commit('localAudioIsOff')
          console.log("%cLocal Audio is Muted!!","color:green;font-size:15pt;");
        }
        else {
          this.getLocalAudioTrack[0].unmute();
          this.audioMuted = false;
          this.$store.commit('localAudioIsOn')
          // this.createAudioTrack()
        }
        break;
        case false:
        this.createAudioTrack()
        this.$store.commit('localAudioInit')
      }
      // if (!this.getLocalAudioInit) {
      //   this.createAudioTrack()
      // }
      // else if (!localAudio[0].isMuted()) {
      //   localAudio[0].mute()
      //   this.audioMuted = true;
      //   this.$store.commit('localAudioIsOff')
      //   console.log("%cLocal Audio is Muted!!","color:green;font-size:15pt;");
      // }
      // else if (localAudio[0].isMuted()) {
      //   localAudio[0].unmute()
      //   this.audioMuted = false;
      //   this.$store.commit('localAudioIsOn')
      //   console.log("%cLocal Audio is Already Muted!!","color:red;font-size:15pt;");
      // }
    },
    videoInputBtn() {
      this.$store.commit("videoPopupToggle")
    },
    hideAllPopup() {
      console.log("Clicked body");
      let hiddenBg = document.getElementById('hiddenBg');
      if (this.audioPopup) {
        document.getElementById('audioPopup').classList.add('hidden');
        hiddenBg.classList.add('hidden');
        this.audioPopup=false;
      }
      if (this.videoPopup) {
        document.getElementById('videoInputPopup').classList.add('hidden');
        hiddenBg.classList.add('hidden');
        this.videoPopup=false;
      }
    },
    disposeVideo() {
      console.log("disposeVideo triggered");
      let localTracks = this.getLocalTracks;
      switch (this.getLocalVideoInit) {
        case true:
        for (var i = 0; i < localTracks.length; i++) {
          if (localTracks[i].type === 'video') {
            localTracks[i].dispose();
            this.$store.state.spaceon.localTracks.splice(i, 1);
          }
        }
        if (this.getLocalCameraSetting) {
          this.shareScreen = false;
          this.$store.state.spaceon.shareScreen = false;
          this.createVideoTrack()
        }
        if (this.secondLocalTrack) {
          this.shareScreen = false;
          this.$store.state.spaceon.shareScreen = false;
          this.$store.state.spaceon.secondLocalTrack = false;
        }
        else {
          this.shareScreen = false;
          this.$store.state.spaceon.shareScreen = false;
        }
        break;
        case false:
          for (var t = 0; t < localTracks.length; t++) {
            if (localTracks[t].type === 'video') {
              localTracks[t].dispose();
              this.$store.state.spaceon.localTracks.splice(t, 1);
            }
          }
          this.shareScreen = false;
          this.$store.state.spaceon.shareScreen = false;
          console.log("%cUser's Camera Has Not Inited Yet.","color:red;font-size:15pt;");
        break;
      }
    },
    createVideoTrack() {
      JitsiMeetJS.createLocalTracks({ devices: [ 'video' ],
      constraints: {
       video: {
           aspectRatio: 16 / 9,
           height: {
            ideal: 720,
            max: 720,
            min: 480
          },
         }
        }
     })
      .then(track => {
        track.forEach(track => {
          this.$store.commit('addLocalTracks', track)
          let newLocalVideoTrack = this.getLocalVideoTrack;
          this.room.addTrack(newLocalVideoTrack[0]);
          this.cameraOff = false;
          this.$store.state.spaceon.localCameraSetting = true;
          this.$store.state.spaceon.presentMode = false;
          console.log("%c!!Local Track After ShareScreen: " + track,"color:green;font-size:15pt;");
          this.$store.commit('localVideoInit')
          if (track.videoType === "camera") {
            track.addEventListener(
              JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => {
                this.$store.commit('localCameraOff')
                console.log('Local camera track stoped')
              }
            );
          }
          let localId = this.$store.state.spaceon.localTrackId
          this.$store.commit('addDominantSpeaker', "0")
          this.$store.commit('addDominantSpeaker', localId)
        })
      })
      .catch(error => {
        this.$store.commit('localCameraOff')
        throw error;
      });
    },
    createAudioTrack() {
      JitsiMeetJS.createLocalTracks({ devices: [ 'audio' ],})
      .then(track => {
        track.forEach(track => {
          this.$store.commit('addLocalTracks', track)
          this.$store.commit('addTracks', track)
          let newLocalAudioTrack = this.getLocalAudioTrack;
          this.room.addTrack(newLocalAudioTrack[0]);
          this.audioMuted = false;
          this.$store.commit('localAudioIsOn')
          console.log("!!Device List: " + this.deviceList)
          console.log("!!Local Tracks: " + this.$store.state.spaceon.localTracks)
        })
        // this.$store.commit('localAudioInit')
      })
      .catch(error => {
        throw error;
      });
    },
    cameraOnOff() {
      if (!this.getLocalVideoInit) {
        this.createVideoTrack()
      }
      else if (!this.cameraOff && !this.shareScreen) {
        // let localTracks = this.$store.getters.getLocalTracks;
        // for (var i = 0; i < localTracks.length; i++) {
        //   if (localTracks[i].type === 'video') {
        //     localTracks[i].dispose();
        //     this.$store.state.spaceon.localTracks.splice(i, 1);
        //   }
        // }
        this.getLocalVideoTrack[0].mute();
        this.cameraOff = true;
        this.$store.state.spaceon.localCameraSetting = false;
        this.$store.commit('localCameraOff')
      }
      else if (this.cameraOff && !this.shareScreen){
        this.getLocalVideoTrack[0].unmute();
        // this.createVideoTrack()
        this.cameraOff = false;
        this.$store.state.spaceon.localCameraSetting = true;
        this.$store.commit('localCameraOn')
      }
    },
    disposeVideo2() {
      console.log("disposeVideo2 triggered");
      let localTracks = this.$store.getters.getLocalTracks;
      let localCamera = this.getLocalCamera;
      switch (this.getLocalVideoInit) {
        case false:
          if (!this.shareScreen) {
            this.shareScreen = true;
            this.$store.state.spaceon.shareScreen = true;
            this.shareScreenBtn()
          }
          else if (this.shareScreen) {
            this.shareScreen = false;
            this.$store.state.spaceon.shareScreen = false;
            for (var t = 0; t < localTracks.length; t++) {
              if (localTracks[t].type === 'video') {
                localTracks[t].mute();
                // localTracks[t].dispose();
                this.$store.state.spaceon.localTracks.splice(t, 1);
                if (this.getLocalCameraSetting) {
                  this.cameraOff = false;
                  this.createVideoTrack()
                }
                else {
                  this.cameraOff = true;
                }
              }
            }
          }
        break;
        case true:
          for (var i = 0; i < localTracks.length; i++) {
            if (localTracks[i].type === 'video') {
              localTracks[i].dispose();
              this.$store.state.spaceon.localTracks.splice(i, 1);
              this.cameraOff = true;
              this.$store.commit('localCameraOff')
            }
          }
          if (!this.shareScreen) {
            if (!localCamera) {
              this.shareScreen = true;
              this.$store.state.spaceon.shareScreen = true;
              this.shareScreenBtn()
            }
            else {
              this.shareScreen = true;
              this.$store.state.spaceon.shareScreen = true;
            }
          }
          else if (this.shareScreen) {
            this.shareScreen = false;
            this.$store.state.spaceon.shareScreen = false;
            // this.$store.commit('localCameraOff')
          }
        break;
      }
    },
    shareScreenBtn() {
      if (this.shareScreen) {
        JitsiMeetJS.createLocalTracks({
          devices: [ 'desktop' ]
        })
        .then(track => {
          console.log("Screenshare: " + track[0]);
          let localCamera = this.getLocalCamera;
          if (!localCamera) {
            this.$store.commit('addLocalTracks', track[0])
            let localVideoTrack = this.getLocalVideoTrack[0];
            localVideoTrack.addEventListener(
              JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, this.disposeVideo
            )
            this.room.addTrack(track[0]);
            this.$store.state.spaceon.selectedComponent = null;
          }
          if (localCamera) {
            console.log("%cLocal camera is still on", "color:red;font-size:15pt;");
          }
        })
        .catch(error => {
            this.disposeVideo()
            throw error;
        });
      }
    },
    // watchFullscreen() {
    //   document.addEventListener('fullscreenchange', function() {
    //     if (document.fullscreenElement) {
    //       this.fullScreen = true;
    //       console.log("FullScreen Now!!!");
    //     }
    //     else {
    //       this.fullScreen = false;
    //       console.log("Not FullScreen Now!!!");
    //     }
    //   })
    // }
  },
  computed: {
    connectionEstablished() {
      return this.$store.getters.getConnectionEstablished;
    },
    getAudioOutputDevice() {
      return this.$store.getters.getAudioOutputDeviceList;
    },
    getAudioInputDevice() {
      return this.$store.getters.getAudioInputDeviceList;
    },
    getVideoInputDevice() {
      return this.$store.getters.getVideoInputDeviceList;
    },
    getDefaultAudioOutput() {
      return this.$store.getters.getDefaultAudioOutput;
    },
    getDefaultAudioInput() {
      return this.$store.getters.getDefaultAudioInput;
    },
    getDefaultVideoInput() {
      return this.$store.getters.getDefaultCamera;
    },
    getLocalAudioInit() {
      return this.$store.getters.getLocalAudioInit;
    },
    getlocalAudio() {
      return this.$store.getters.getlocalAudio;
    },
    getLocalVideoInit() {
      return this.$store.getters.getLocalVideoInit;
    },
    getLocalTracks() {
      return this.$store.getters.getLocalTracks;
    },
    getLocalVideoTrack() {
      return this.$store.getters.getLocalVideoTrack;
    },
    getLocalAudioTrack() {
      return this.$store.getters.getLocalAudioTrack;
    },
    getLocalCamera() {
      return this.$store.getters.getLocalCamera;
    },
    getLocalCameraSetting() {
      return this.$store.getters.getLocalCameraSetting;
    },
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
    getLocalTrackId() {
      return this.$store.getters.getLocalTrackId;
    },
    layoutToggle() {
      if (this.layout === 1) {
        return require('~/static/img/layout_1.svg')
      }
      else {
        return require('~/static/img/layout_0.svg')
      }
    },
    fullScreenToggle() {
      if (this.fullScreen) {
        return require('~/static/img/window_screen.svg')
      }
      else {
        return require('~/static/img/full_screen.svg')
      }
    },
    audioBtnImage() {
      if (this.audioMuted) {
        return require('~/static/img/no_mic.svg')
      }
      else {
        return require('~/static/img/mic.svg')
      }
    },
    videoBtnImage() {
      if (this.cameraOff) {
        return require('~/static/img/no_camera.svg')
      }
      else {
        return require('~/static/img/camera.svg')
      }
    },
    shareScreenToggle() {
      if (this.shareScreen) {
        return require('~/static/img/share_screen_stop.svg')
      }
      else {
        return require('~/static/img/share_screen.svg')
      }
    },
    shareScreenText() {
      if (this.shareScreen) {
        return ('Stop Sharing')
      }
      else {
        return ('Share Screen')
      }
    },
    getParticipantCount() {
      return this.$store.getters.getParticipantCount;
    },
    getPresenters() {
      return this.$store.getters.getPresenters;
    },
    audioPopup() {
      return this.$store.getters.getAudioPopup;
    },
    videoPopup() {
      return this.$store.getters.getVideoPopup;
    },
    newMsg() {
      return this.$store.getters.getNewMsg;
    },
    secondLocalTrack() {
      return this.$store.getters.getSecondLocalTrack;
    },
  },
  watch: {
    connectionEstablished() {
      if (this.connectionEstablished) {
        this.muteLocalAudio();
        this.cameraOnOff();
      }
    },
    speakerLayout() {
      if (this.speakerLayout === true) {
        this.layout = 1
      }
      else {
        this.layout = 0
      }
    },
    getLocalCamera() {
      let localCamera = this.getLocalCamera;
      console.log("%cLocal camera status change to: " + localCamera, "color:green;font-size:15pt;");
      if (!this.getLocalCamera) {
        console.log("Local Camera is Off!");
        if (this.shareScreen) {
          console.log("Share Screen is True!");
          this.shareScreenBtn()
        }
      }
    },
    getLocalVideoInit() {
      if (this.getLocalVideoInit) {
        this.$parent.availableDevices()
      }
    },
    getLocalAudioInit() {
      if (this.getLocalVideoInit) {
        this.$parent.availableDevices()
      }
    },
    newMsg() {
      let chatPopup = this.$store.getters.getChatPopup;
      if (chatPopup) {
        this.newMsgDot = false;
      }
      else {
        if (this.newMsg) {
          this.newMsgDot = true;
        }
        else {
          this.newMsgDot = false;
        }
      }
    }
  },
  // mounted() {
  //   this.watchFullscreen()
  // }
}
</script>

<style scoped>
  .secondConnection {
    height: 0;
    width: 0;
    opacity: 0;
    z-index: 0;
  }
  .buttonContainer {
    display: grid;
    grid-template-columns: 90% 10%;
    grid-template-rows: 100%;
    overflow: hidden;
    width: 100%;
  }
  .hiddenBg {
    grid-column: 1/12;
    grid-row: 1/4;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 50;
  }
  .buttonWrapper {
    grid-column: 1/2;
    grid-row: 1/2;
    display: grid;
    grid-template-columns: 5% 7% 7% 7% 18% 7% 7% 7% 7% 7% 7% 5% 9%;
    grid-template-rows: 30% 70%;
    background-color: black;
    z-index: 150;
  }
  .mainMenu {
    grid-column: 1/2;
    grid-row: 1/3;
    justify-self: center;
    align-self: center;
    width: 30px;
    height: 30px;
    background-image: url('~/static/img/3_dots.svg');
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }
  .btnText {
    grid-column: 1/2;
    grid-row: 2/3;
    /* height: 24px; */
    align-self: start;
    justify-self: center;
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    color: white;
    margin: 0;
    z-index: 10;
    padding-top: 15px;
    padding-bottom: 2px;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .menuIcon1 {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 30px;
    width: 30px;
    align-self: start;
    justify-self: center;
    z-index: 10;
  }
  .newMsgDot {
    grid-column: 4/5;
    grid-row: 1/2;
    height: 17px;
    width: 17px;
    justify-self: end;
    align-self: end;
    background-color: #FF3746;
    border-radius: 50%;
    margin-right: 20%;
  }
  .chatBtn {
    grid-column: 4/5;
    grid-row: 2/3;
    justify-self: center;
    align-self: start;
    display: grid;
    cursor: pointer;
    opacity: 1;
  }
  .chatBtn:hover .btnText {
    opacity: 1;
  }
  .chatBtn:hover .btnBg{
    opacity: 1;
    transform: scale(27, 27);
    -webkit-transform: scale(27, 27);
  }
  .layoutBtn {
    grid-column: 3/4;
    grid-row: 2/3;
    justify-self: center;
    align-self: start;
    display: grid;
    cursor: pointer;
  }
  .layoutBtn:hover .btnText {
    opacity: 1;
  }
  .btnBg {
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: center;
    justify-self: center;
    height: 2px;
    width: 2px;
    z-index: 0;
    background-color: #2C2C2C;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .layoutBtn:hover .btnBg{
    opacity: 1;
    transform: scale(27, 27);
    -webkit-transform: scale(27, 27);
  }
  .secureBtn {
    grid-column: 12/13;
    grid-row: 2/3;
    justify-self: center;
    align-self: start;
    opacity: 0.3;
    display: none;
    cursor: pointer;
  }
  .secureBtn:hover .btnText {
    opacity: 1;
  }
  .participant {
    grid-column: 2/3;
    grid-row: 1/3;
    justify-self: center;
    align-self: center;
    width: 100%;
    height: 50px;
    background-color: black;
    display: grid;
    grid-template-columns: 55% 45%;
    background-image: url('~/static/img/participant_icon_spaceon.svg');
    background-repeat: no-repeat;
    background-position: top;
    margin-bottom: 11%;
  }
  .participant p {
    grid-column: 2/3;
    grid-row: 1/2;
    font-size: 14pt;
    font-weight: bold;
    color: white;
    text-align: center;
    align-self: center;
    justify-self: start;
    margin: 1px 0 0 5px;
  }
  .btnCover {
    grid-column: 7/8;
    grid-row: 1/3;
    width: 100%;
    height: 100%;
    background-color: black;
  }
  .audioInputSelectWrapper {
    grid-column: 6/7;
    grid-row: 2/3;
    justify-self: end;
    align-self: start;
    display: grid;
    /* width: 100%; */
    grid-template-columns: 55px 24px;
    grid-template-rows: auto;
    /* margin-right: 2px; */
  }
  .audioInputBtn {
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
    align-self: center;
    justify-self: center;
    display: grid;
    z-index: 100;
    cursor: pointer;
    margin-bottom: 10px;
  }
  .audioInputBtn img {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 35px;
    align-self: center;
    justify-self: center;
    z-index: 10;
  }
  .btnText2 {
    grid-column: 1/2;
    grid-row: 2/3;
    /* height: 24px; */
    align-self: center;
    justify-self: center;
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    color: white;
    margin: 0;
    z-index: 10;
    padding-top: 8px;
    padding-bottom: 2px;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .audioInputSelectWrapper:hover .btnText2 {
    opacity: 1;
  }
  .audioInputSelectWrapper:hover .btnBg{
    opacity: 1;
    transform: scale(26, 26);
    -webkit-transform: scale(26, 26);
  }
  .audioPopupBtn {
    grid-column: 2/3;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
    align-self: center;
    justify-self: center;
    transition: 0.3s ease-in-out;
    z-index: 100;
    cursor: pointer;
    opacity: 1;
    display: grid;
    grid-template-rows: auto auto;
    margin-bottom: 10px;
  }
  .audioPopupBtn img {
    grid-column: 1/2;
    grid-row: 1/2;
    width: 14px;
    align-self: center;
    justify-self: center;
    z-index: 10;
    opacity: 0;
    transition: 0.3s ease-in-out;
  }
  .popupBtnBg {
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: center;
    justify-self: center;
    height: 2px;
    width: 2px;
    z-index: 0;
    background-color: #2C2C2C;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .audioInputSelectWrapper:hover .audioPopupBtn img{
    opacity: 1;
  }
  .audioInputSelectWrapper:hover .popupBtnBg{
    opacity: 1;
    transform: scale(12, 12);
    -webkit-transform: scale(12, 12);
  }
  .videoInputSelectWrapper {
    grid-column: 8/9;
    grid-row: 2/3;
    justify-self: start;
    align-self: start;
    margin-left: 24px;
    display: grid;
    grid-template-columns: 55px 24px;
    grid-template-rows: auto auto;
  }
  .videoInputSelectWrapper:hover .btnText3 {
    opacity: 1;
  }
  .videoInputBtn {
    grid-column: 1/2;
    grid-row: 1/2;
    width: 100%;
    height: 100%;
    align-self: start;
    justify-self: center;
    display: grid;
    z-index: 100;
    cursor: pointer;
  }
  .videoInputBtn img {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 30px;
    width: 35px;
    align-self: start;
    justify-self: center;
    z-index: 10;
  }
  .videoInputSelectWrapper:hover .btnBg{
    opacity: 1;
    transform: scale(26, 26);
    -webkit-transform: scale(26, 26);
  }
  .videoPopupBtn {
    grid-column: 2/3;
    grid-row: 1/2;
    height: 100%;
    align-self: center;
    justify-self: center;
    transition: 0.3s ease-in-out;
    z-index: 100;
    cursor: pointer;
    display: grid;
  }
  .videoPopupBtn img {
    grid-column: 1/2;
    grid-row: 1/2;
    width: 14px;
    align-self: center;
    justify-self: center;
    z-index: 10;
    opacity: 0;
    transition: 0.3s ease-in-out;
  }
  .videoInputSelectWrapper:hover .videoPopupBtn img{
    opacity: 1;
  }
  .videoInputSelectWrapper:hover .popupBtnBg{
    opacity: 1;
    transform: scale(12, 12);
    -webkit-transform: scale(12, 12);
  }
  .btnText3 {
    grid-column: 1/3;
    grid-row: 2/3;
    align-self: center;
    justify-self: center;
    text-align: center;
    font-size: 11pt;
    font-weight: bold;
    color: white;
    margin: 0;
    z-index: 10;
    padding-top: 15px;
    padding-bottom: 2px;
    opacity: 0;
    transition: 0.3s ease-in-out;
  }
  .shareScreenButton {
    grid-column: 7/8;
    grid-row: 2/3;
    justify-self: center;
    align-self: start;
    transition: box-shadow .1s ease-out;
    display: grid;
    cursor: pointer;
  }
  .shareScreenButton:hover .btnText {
    opacity: 1;
  }
  .shareScreenButton:hover .btnBg{
    opacity: 1;
    transform: scale(27, 27);
    -webkit-transform: scale(27, 27);
  }
  .leaveBtn {
    grid-column: 13/14;
    grid-row: 1/3;
    justify-self: center;
    margin-bottom: 8%;
    /* text-align: top;
    vertical-align: top; */
    align-self: center;
    transition: box-shadow .3s ease-out;
    width: 100%;
    height: 50px;
    background-image: url('~/static/img/leave_btn.svg');
    background-repeat: no-repeat;
    background-position: top;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }
  .leaveBtn:hover {
    background-image: url('~/static/img/leave_btn2.svg');
  }
  .hidden {
    display: none;
  }
  .vhidden {
    opacity: 0;
  }
  @media only screen and (min-height: 2160px)  and (orientation: landscape) {
    .audioInputSelectWrapper {
      margin-right: 70px;
    }
  }
  /* @media only screen and (min-height: 1240px)  and (orientation: landscape) {
    .audioInputSelectWrapper {
      margin-right: 20px;
    }
  } */
  @media only screen and (max-height: 960px)  and (orientation: landscape) {
    .buttonContainer {
      grid-template-rows: 89% 2.5% 8.5%;
    }
    .mainMenu {
      width: 25px;
      height: 25px;
    }
    .newMsgDot {
      height: 14px;
      width: 14px;
      margin-right: 16%;
    }
    .btnText {
      font-size: 9pt;
      color: white;
      padding-top: 10px;
    }
    .menuIcon1 {
      height: 25px;
    }
    .participant {
      height: 43px;
      margin-bottom: 10%;
    }
    .participant img {
      width: 28px;
      align-self: center;
      justify-self: end;
      margin-right: 5px;
    }
    .participant p {
      font-size: 12pt;
    }
    .audioInputBtn img {
      height: 30px;
    }
    .btnText2 {
      font-size: 9pt;
      padding-top: 10px;
    }
    .videoInputBtn img {
      height: 25px;
      width: 30px;
    }
    .btnText3 {
      font-size: 9pt;
      padding-top: 10px;
    }
    .leaveBtn {
      width: 100%;
      height: 42px;
    }
  }
  @media only screen and (max-height: 911px)  and (orientation: landscape) {
    .buttonContainer {
      grid-template-rows: 89% 2.5% 8.5%;
    }
    .mainMenu {
      width: 20px;
      height: 20px;
    }
    .newMsgDot {
      height: 10px;
      width: 10px;
      margin-right: 20%;
    }
    .btnText {
      font-size: 8pt;
      color: white;
      padding-top: 11px;
    }
    .menuIcon1 {
      height: 20px;
    }
    .participant {
      width: 100%;
      height: 28px;
      margin-bottom: 9%;
    }
    .participant p {
      font-size: 9pt;
    }
    .audioInputSelectWrapper {
      grid-template-columns: 40px 24px;
    }
    .audioInputBtn img {
      height: 25px;
    }
    .btnText2 {
      font-size: 8pt;
      padding-top: 5px;
    }
    .videoInputSelectWrapper {
      grid-template-columns: 40px 24px;
      margin-left: 25px;
    }
    .videoInputBtn img {
      height: 20px;
      width: 25px;
    }
    .btnText3 {
      font-size: 8pt;
      padding-top: 11px;
    }
    .leaveBtn {
      width: 100%;
      height: 25px;
    }
    .layoutBtn:hover .btnBg{
      opacity: 1;
      transform: scale(19, 19);
      -webkit-transform: scale(19, 19);
    }
    .chatBtn:hover .btnBg{
      opacity: 1;
      transform: scale(19, 19);
      -webkit-transform: scale(19, 19);
    }
    .shareScreenButton:hover .btnBg{
      opacity: 1;
      transform: scale(20, 20);
      -webkit-transform: scale(20, 20);
    }
    .audioInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(20, 20);
      -webkit-transform: scale(20, 20);
    }
    .audioInputSelectWrapper:hover .popupBtnBg{
      transform: scale(10, 10);
      -webkit-transform: scale(10, 10);
    }
    .videoInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(20, 20);
      -webkit-transform: scale(20, 20);
    }
    .videoInputSelectWrapper:hover .popupBtnBg{
      opacity: 1;
      transform: scale(10, 10);
      -webkit-transform: scale(10, 10);
    }
  }
  @media only screen and (max-height: 700px)  and (orientation: landscape) {
    /* .buttonWrapper {
      grid-template-columns: 5% 7% 7% 7% 25% 10% 4% 7% 7% 7% 1% 9%;
    } */
    .newMsgDot {
      height: 10px;
      width: 10px;
      margin-right: 25%;
    }
    .mainMenu {
      width: 15px;
      height: 15px;
    }
    .btnText {
      font-size: 6pt;
      color: white;
      padding-top: 11px;
    }
    .menuIcon1 {
      height: 15px;
    }
    .participant img {
      width: 16px;
      align-self: center;
      justify-self: end;
      margin-right: 5px;
    }
    .participant p {
      font-size: 9pt;
    }
    .layoutBtn:hover .btnBg{
      opacity: 1;
      transform: scale(18, 18);
      -webkit-transform: scale(18, 18);
    }
    .shareScreenButton:hover .btnBg{
      opacity: 1;
      transform: scale(18, 18);
      -webkit-transform: scale(18, 18);
    }
    .audioInputSelectWrapper {
      grid-template-columns: 30px 10px;
      justify-self: end;
      margin-left: 0px;
    }
    .audioInputBtn img {
      height: 18px;
    }
    .btnText2 {
      font-size: 6pt;
      padding-top: 11px;
    }
    .audioPopupBtn img {
      width: 10px;
    }
    .audioInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(18, 18);
      -webkit-transform: scale(18, 18);
    }
    .audioInputSelectWrapper:hover .popupBtnBg{
      transform: scale(8, 8);
      -webkit-transform: scale(8, 8);
    }
    .videoInputSelectWrapper {
      grid-template-columns: 30px 10px;
      justify-self: start;
      margin-left: 6px;
    }
    .videoInputBtn img {
      height: 15px;
      width: 18px;
    }
    .btnText3 {
      font-size: 8pt;
      padding-top: 11px;
    }
    .videoPopupBtn img {
      width: 10px;
    }
    .videoInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(18, 18);
      -webkit-transform: scale(18, 18);
    }
    .videoInputSelectWrapper:hover .popupBtnBg{
      opacity: 1;
      transform: scale(8, 8);
      -webkit-transform: scale(8, 8);
    }
    .leaveBtn {
      width: 100%;
      height: 30px;
    }
  }
  @media only screen and (max-width: 960px)  and (orientation: portrait) {
    .buttonWrapper {
      grid-template-columns: 10% 10% 7% 7% 7% 10% 6% 7% 1% 5% 1% 7% 7%;
    }
    .mainMenu {
      width: 15px;
      height: 15px;
    }
    .btnText {
      font-size: 6pt;
      color: white;
      padding-top: 11px;
    }
    .menuIcon1 {
      height: 15px;
    }
    .participant {
      grid-row: 1/3;
      height: 25px;
      align-self: start;
      margin-top: 43px;
      /* align-self: center;
      justify-self: end;
      margin-right: 5px; */
    }
    .participant p {
      font-size: 8pt;
    }
    .layoutBtn:hover .btnBg{
      opacity: 1;
      transform: scale(16, 16);
      -webkit-transform: scale(16, 16);
    }
    .shareScreenButton:hover .btnBg{
      opacity: 1;
      transform: scale(16, 16);
      -webkit-transform: scale(16, 16);
    }
    .audioInputSelectWrapper {
      grid-template-columns: 30px 10px;
    }
    .audioInputBtn img {
      height: 18px;
    }
    .btnText2 {
      font-size: 6pt;
      padding-top: 11px;
    }
    .audioPopupBtn img {
      width: 10px;
    }
    .audioInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(16, 16);
      -webkit-transform: scale(16, 16);
    }
    .audioInputSelectWrapper:hover .popupBtnBg{
      transform: scale(7, 7);
      -webkit-transform: scale(7, 7);
    }
    .videoInputSelectWrapper {
      grid-template-columns: 30px 10px;
      margin-left: 9px;
    }
    .videoInputBtn img {
      height: 15px;
      width: 18px;
    }
    .btnText3 {
      font-size: 8pt;
      padding-top: 11px;
    }
    .videoPopupBtn img {
      width: 10px;
    }
    .videoInputSelectWrapper:hover .btnBg{
      opacity: 1;
      transform: scale(16, 16);
      -webkit-transform: scale(16, 16);
    }
    .videoInputSelectWrapper:hover .popupBtnBg{
      opacity: 1;
      transform: scale(7, 7);
      -webkit-transform: scale(7, 7);
    }
    .leaveBtn {
      grid-row: 2/3;
      width: 100%;
      height: 20px;
      align-self: start;
    }
  }
  @media only screen and (max-height: 1280px)  and (orientation: portrait) {
    .participant {
      margin-top: 28px;
    }
  }
</style>
