<template>
  <div class="remoteTrackWrapper" @click="pin">
    <div class="remoteContentWrapper" id="remoteContentWrapper" ref="remoteContentWrapper">
      <div class="remoteVideoWrapper" id="remoteVideoWrapper" :style="{width: videoWidth, height: videoHeight}">
        <ParticipantMenu
        class="participantMenu"
        v-if="participantMenu"
        :id="id"
        :room="room"
        />
        <!-- <img class="profileImg" src="~/static/img/place_holder_2.gif"> -->
        <div class="profileImgWrapper" ref="remoteProfileImgWrapper" id="remoteProfileImgWrapper">
          <img class="profileImg" :src="usersAvatar">
        </div>
        <video autoPlay='1' ref="remoteVideo" class="remoteVideo" id="remoteVideoFeed"/>
        <audio autoplay='1' muted='true' ref="remoteAudio" class="remoteAudio video" />
        <img class="pinImg hidden" ref="pinImg" src="~/static/img/pin_icon.svg">
        <div class="nameAndStatus" id="remoteNameAndStatus" ref="remoteNameAndStatus">
          <div class="micAndName" id="remoteMicAndName" ref="remoteMicAndName">
            <div class="micAndNameBg">
            </div>
            <div class="micStatus">
              <img class="micImg" :src="micImg">
            </div>
            <div class="userName">
              <p class="userNameText" id="remoteUserNameText" ref="remoteUserNameText">
                {{ displayName }}
              </p>
            </div>
            <div class="userOption" >
              <!-- <img class="menuImg" src="~/static/img/menu_dots_white3.svg" @click="menuBtn" v-if="getModerator"> -->
            </div>
          </div>
          <div class="cameraStatus" id="cameraStatus">
            <img class="videoImg" id="videoImg" :src="cameraImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ParticipantMenu from '@/components/ParticipantMenu.vue';
export default {
  name: "RemoteTracks",
  components: {
    ParticipantMenu
  },
  data() {
    return {
      loaded: false,
      currentVideo: [],
      currentAudio: [],
      audioLoaded: false,
      videoLoaded: false,
      videoWidth: null,
      videoHeight: null,
      fontSize: "100%",
      displayName: null,
      participantData:[],
      userEmail: null,
      usersAvatar: null,
      selected: false
    }
  },
  props: {
    id: String,
    room: Object,
    // currentPage: Boolean
  },
  methods: {
    onRemoteTracks() {
      // this.loaded = true;
      let remoteTracks = this.getNewTrack;
      remoteTracks.forEach(track => {
        if (track.type == "video") {
          track.attach(this.$refs.remoteVideo)
          this.$parent.recalculateLayout()
          console.log("%c!!Remote Video Attached: " + track,"color:green;font-size:15pt;");
          //
          // if (!this.videoLoaded) {
          //   this.videoLoaded = true;
          //   track.attach(this.$refs.remoteVideo)
          //   this.$parent.recalculateLayout()
          //   console.log("%c!!Remote Video Attached: " + track,"color:green;font-size:15pt;");
          // }
        }
        if (track.type == "audio") {
          track.attach(this.$refs.remoteAudio)
          console.log("%c!!Remote Audio Attached: " + track,"color:green;font-size:15pt;");
          //
          // if (!this.audioLoaded) {
          //   this.audioLoaded = true;
          //   track.attach(this.$refs.remoteAudio)
          //   console.log("%c!!Remote Audio Attached: " + track,"color:green;font-size:15pt;");
          // }
        }
      })
    },
    cameraStatusToggel() {
      console.log("cameraStatusToggel triggered");
      if (this.getRemoteVideoStatus) {
        console.log("hide cameraStatusToggel icon");
        document.getElementById('cameraStatus').classList.add('hidden')
      }
      if (!this.getRemoteVideoStatus) {
        console.log("remove hide cameraStatusToggel icon");
        document.getElementById('cameraStatus').classList.remove('hidden')
      }
    },
    calculateAspectRatio() {
      const content = document.getElementById('remoteContentWrapper')
      // const contentScreen = document.getElementById('remoteVideoWrapper')
      // const content = this.$ref.remoteContentWrapper;
      // const contentScreen = this.$ref.remoteVideoWrapper;

      // const divWidth = content.getBoundingClientRect().width;
      // const divHeight = content.getBoundingClientRect().height;
      const divWidth = content.offsetWidth;
      const divHeight = content.offsetHeight;
      const calHeight = Math.round((divWidth/16)*9);
      const calWidth = Math.round((divHeight/9)*16);
      if (divWidth >= divHeight) {
        if (calWidth > divWidth) {
          // let reCalHeight = Math.round((calWidth/16)*9);
          // let reCalWidth = Math.round((calWidth/16)*9);
          // contentScreen.style.setProperty('--screenWidth', divWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', calHeight + 'px')
          // contentScreen.style.width = divWidth + "px";
          // contentScreen.style.height = calHeight + "px";
          this.videoWidth = divWidth + "px";
          this.videoHeight = calHeight + "px";
        }
        else {
          // contentScreen.style.setProperty('--screenWidth', calWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', divHeight + 'px')
          // contentScreen.style.width = calWidth + "px";
          // contentScreen.style.height = divHeight + "px";
          this.videoWidth = calWidth + "px";
          this.videoHeight = divHeight + "px";
        }
      }
      else {
        if (calHeight > divHeight) {
          // let reCalHeight = Math.round((calHeight/16)*9);
          // let reCalWidth = Math.round((calHeight/16)*9);
          // contentScreen.style.setProperty('--screenWidth', calWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', divHeight + 'px')
          // contentScreen.style.width = calWidth + "px";
          // contentScreen.style.height = divHeight + "px";
          this.videoWidth = calWidth + "px";
          this.videoHeight = divHeight + "px";
        }
        else {
          // contentScreen.style.setProperty('--screenWidth', divWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', calHeight + 'px')
          // contentScreen.style.width = divWidth + "px";
          // contentScreen.style.height = calHeight + "px";
          this.videoWidth = divWidth + "px";
          this.videoHeight = calHeight + "px";
        }
      }
    },
    watchResize() {
      window.addEventListener('resize', this.calculateAspectRatio);
      console.log("Remote Wrapper Resized!");
    },
    // watchDivResize() {
    //   const wrapperWidth = document.getElementById('remoteVideoWrapper').clientWidth;
    //   const wrapperHeight = document.getElementById('remoteVideoWrapper').clientHeight;
    //   console.log("Wrapper Width: " + wrapperWidth);
    //   console.log("Wrapper Height: " + wrapperHeight);
    //   let userName = document.getElementById('userName');
    //   if (wrapperWidth < 500) {
    //     userName.style.fontSize = "80%";
    //   }
    // }
    getDisplayName() {
      let displayName = this.room.getParticipantById(this.id);
      console.log("Remote track display name: " + displayName._displayName);
      if (displayName._displayName === null || undefined) {
        this.displayName = "This is a random person";
      }
      else {
        this.displayName = displayName._displayName;
      }
    },
    getAvatar() {
      let displayName = this.room.getParticipantById(this.id);
      let filteredName = displayName._displayName;
      let email = filteredName.substring(filteredName.indexOf("_usersEmail:") + 12);
      this.userEmail = email;
      this.usersAvatar = this.$store.getters.getUsersData({type: 'email', email: email }).avatar;
      console.log("Avatar: " + this.usersAvatar);
    },
    menuBtn() {
      if (this.participantMenu) {
        this.$store.state.participantMenu = false;
      }
      else {
        this.$store.state.participantMenu = true;
      }
    },
    checkCameraImg() {
      console.log("%cRemote Camera Img Checked","color:green;font-size:15pt;");
      if (this.getRemoteTrackStatus[0] == null) {
        this.$refs.remoteVideo.classList.add('hidden')
        this.$refs.remoteProfileImgWrapper.classList.remove('hidden');
        console.log("%cRemote No Video Feed","color:red;font-size:15pt;");
      }
      if (this.getRemoteTrackStatus[0].video) {
        setTimeout(() => {
          this.$refs.remoteVideo.classList.remove('hidden')
          this.$refs.remoteProfileImgWrapper.classList.add('hidden');
          console.log("%cRemote New Video Feed","color:green;font-size:15pt;");
        }, 500);
      }
      else {
        this.$refs.remoteVideo.classList.add('hidden')
        this.$refs.remoteProfileImgWrapper.classList.remove('hidden');
        console.log("%cRemote No Video Feed","color:red;font-size:15pt;");
      }
    },
    pin() {
      console.log("Pin clicked");
      if (this.selectedComponent === this.id) {
        console.log("Unpin remote");
        this.$store.commit("unpinParticipant");
        // this.$store.state.spaceon.presentMode = false;
        // this.$store.state.spaceon.selectedComponent = null;
      }
      else {
        console.log("Pin remote");
        this.$store.commit("pinParticipant", this.id);
      }
    },
    highlightRemoteTrack() {
      if (this.selectedComponent === this.id) {
        console.log("Remote " + this.id + " selected");
        // document.getElementById('remoteVideoFeed').classList.add('selected');
        this.$refs.remoteVideo.classList.add('selected');
        this.$refs.pinImg.classList.remove('hidden');
      }
      else {
        console.log("Remote " + this.id + " unselected");
        // document.getElementById('remoteVideoFeed').classList.remove('selected');
        this.$refs.remoteVideo.classList.remove('selected');
        this.$refs.pinImg.classList.add('hidden');
      }
    }
  },
  computed: {
    getNewTrack() {
      return this.$store.getters.getNewRemoteTrack(this.id);
    },
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
    getRemoteTrackStatus() {
      return this.$store.getters.getRemoteTrackStatus(this.id);
    },
    getRemoteVideoStatus() {
      return this.$store.getters.getRemoteVideoStatus(this.id);
    },
    getRemoteAudioStatus() {
      return this.$store.getters.getRemoteAudioStatus(this.id);
    },
    micImg() {
      if (this.getRemoteTrackStatus[0].audio) {
        return require('~/static/img/mic.svg')
      }
      else {
        return require('~/static/img/no_mic.svg')
      }
    },
    cameraImg() {
      if (this.getRemoteTrackStatus[0].video) {
        return require('~/static/img/empty_pixel.svg')
      }
      else {
        return require('~/static/img/no_camera.svg')
      }
    },
    getAllId() {
      return this.$store.getters.getAllId;
    },
    getTrackDivWidth() {
      return this.$store.getters.getTrackDivWidth;
    },
    participantMenu() {
      return this.$store.getters.getParticipantMenu;
    },
    getModerator() {
      return this.$store.getters.getModerator;
    },
    selectedComponent() {
      return this.$store.getters.getSelectedComponent;
    }
  },
  watch: {
    // currentPage(newVal, oldVal) {
    //   if (newVal !== oldVal) {
    //     setTimeout(() => {
    //       this.calculateAspectRatio();
    //     }, 550);
    //   }
    // },
    getNewTrack() {
      console.log("%cNew Remote Track Added: " + this.id,"color:green;font-size:15pt;");
      this.onRemoteTracks()
      this.calculateAspectRatio()
      // let trackOwnerId = this.getNewTrack[0].ownerEndpointId;
      // if (trackOwnerId === this.id) {
      //   console.log("%cNew Remote Track Added: " + this.id,"color:green;font-size:15pt;");
      //   this.onRemoteTracks()
      //   this.calculateAspectRatio()
      // }
      // this.checkCameraImg()
      // setTimeout(this.onRemoteTracks,500);
    },
    getRemoteTracks() {
      this.onRemoteTracks();
    },
    speakerLayout() {
      console.log("%cSpeakerLayout changed!","color:green;font-size:15pt;");
      this.onRemoteTracks()
      this.calculateAspectRatio()
      this.checkCameraImg()
      // this.watchDivResize()
    },
    gridLayout() {
      console.log("%cGridLayout changed!","color:green;font-size:15pt;");
      this.onRemoteTracks()
      this.calculateAspectRatio()
      // this.watchDivResize()
    },
    getRemoteVideoStatus() {
      console.log("getRemoteTrackStatus watch triggered");
      this.checkCameraImg()
      if (!this.getRemoteVideoStatus) {
        this.videoLoaded = false;
      }
      // this.cameraStatusToggel()
    },
    getRemoteAudioStatus() {
      if (!this.getRemoteAudioStatus) {
        this.audioLoaded = false;
      }
    },
    getAllId() {
      this.calculateAspectRatio()
    },
    selectedComponent() {
      this.highlightRemoteTrack();
    }
    // getTrackDivWidth() {
    //   if (this.getTrackDivWidth < 350) {
    //     this.fontSize = "70%"
    //   }
    //   else if (this.getTrackDivWidth >= 350 && this.getTrackDivWidth < 450) {
    //     this.fontSize = "80%"
    //   }
    // },
    // getModerator() {
    //   if (this.getModerator) {
    //
    //   }
    // }
  },
  mounted() {
    this.$parent.recalculateLayout()
    this.onRemoteTracks()
    this.calculateAspectRatio()
    this.watchResize()
    this.getDisplayName()
    // this.getAvatar()
    if (this.speakerLayout) {
      console.log("%cSpeakerLayout!","color:green;font-size:15pt;");
      this.$refs.remoteNameAndStatus.classList.remove('nameAndStatus');
      this.$refs.remoteNameAndStatus.classList.add('nameAndStatus2');
      this.$refs.remoteMicAndName.classList.remove('micAndName');
      this.$refs.remoteMicAndName.classList.add('micAndName2');
      this.$refs.remoteUserNameText.classList.remove('userNameText');
      this.$refs.remoteUserNameText.classList.add('userNameText2');
      setTimeout(() => {
        this.highlightRemoteTrack();
      }, 300);
    }
    else {
      console.log("%cGridLayout!","color:green;font-size:15pt;");
      this.$refs.remoteNameAndStatus.classList.remove('nameAndStatus2');
      this.$refs.remoteNameAndStatus.classList.add('nameAndStatus');
      this.$refs.remoteMicAndName.classList.remove('micAndName2');
      this.$refs.remoteMicAndName.classList.add('micAndName');
      this.$refs.remoteUserNameText.classList.remove('userNameText2');
      this.$refs.remoteUserNameText.classList.add('userNameText');
      setTimeout(() => {
        this.highlightRemoteTrack();
      }, 300);
    }
    this.checkCameraImg()
    // this.watchDivResize()
    // this.cameraStatusToggel()
  },
  destroyed() {
    this.$parent.recalculateLayout()
  }
}
</script>

<style scoped>
  .remoteTrackWrapper {
    /* margin: 1%; */
    /* display: block; */
    /* display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto; */
    /* height: 100%;
    width: 100%; */
    display: grid;
    grid-template-columns: 1% 98% 1%;
    grid-template-rows: 1% 98% 1%;
    /* background-image: url('~~/static/img/place_holder_2.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 50%; */
  }
  .remoteContentWrapper {
    grid-column: 2/3;
    grid-row: 2/3;
    height: 100%;
    width: 100%;
    display: grid;
    transition: 0.2s ease-in-out;
  }
  .remoteVideoWrapper {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 90% 10%;
    align-self: center;
    justify-self: center;
    margin: 0;
    padding: 0;
    transition: 0.2s ease-in-out;
  }
  .participantMenu {
    width: 35%;
    height: 80%;
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: end;
    margin: 0 0 1% 1%;
    z-index: 20;
  }
  .profileImgWrapper {
    grid-column: 1/2;
    grid-row: 1/3;
    width: 7rem;
    height: 7rem;
    align-self: center;
    justify-self: center;
    display: grid;
    background-color: white;
    border-radius: 50%;
    overflow: hidden;
  }
  .profileImg {
    grid-column: 1/2;
    grid-row: 1/3;
    align-self: center;
    justify-self: center;
    height: 100%;
    width: 100%;
    z-index: 0;
  }
  .remoteVideo {
    grid-column: 1/2;
    grid-row: 1/3;
    height: 100%;
    width: 100%;
    align-self: center;
    justify-self: center;
    z-index: 10;
    cursor: pointer;
    /* margin-top: 2%; */
    /* display: flex; */
    /* justify-self: center; */
  }
  .remoteAudio {
    /* grid-column: 1/2;
    grid-row: 1/2; */
    display: none;
    z-index: 0;
  }
  .pinImg {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 24px;
    width: 24px;
    align-self: start;
    justify-self: end;
    margin: 2% 2% 0 0;
    z-index: 10;
    cursor: pointer;
  }
  .nameAndStatus {
    grid-column: 1/2;
    grid-row: 2/3;
    max-height: 40px;
    width: 100%;
    align-self: end;
    display: grid;
    grid-template-columns: minmax(min-content, max-content) auto 8%;
    grid-template-rows: 100%;
    z-index: 10;
    transition: 0.2s ease-in-out;
  }
  .nameAndStatus2 {
    grid-column: 1/2;
    grid-row: 2/3;
    max-height: 25px;
    width: 100%;
    align-self: end;
    display: grid;
    grid-template-columns: minmax(min-content, max-content) auto 8%;
    grid-template-rows: 100%;
    z-index: 10;
    transition: 0.2s ease-in-out;
  }
  .micAndName {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    display: grid;
    /* grid-template-columns: 50px 80% 20px; */
    grid-template-columns: 40px 10px minmax(min-content, max-content) 25px;
    grid-template-rows: 40px;
  }
  .micAndName2 {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    display: grid;
    /* grid-template-columns: 50px 80% 20px; */
    grid-template-columns: 25px 10px minmax(min-content, max-content) 25px;
    grid-template-rows: 25px;
  }
  .micAndNameBg {
    grid-column: 1/5;
    grid-row: 1/2;
    /* width: 100%;
    height: 100%; */
    background-color: black;
    background-position: center;
    background-size: contain;
    opacity: 0.5;
    z-index: 0;
  }
  .micStatus {
    grid-column: 1/2;
    grid-row: 1/2;
    display: grid;
    /* grid-template-columns: auto;
    grid-template-rows: auto; */
    grid-template-columns: 5% 90% 5%;
    grid-template-rows: 5% 90% 5%;
    z-index: 5;
    max-height: 40px;
    max-width: 40px;
  }
  .micImg {
    grid-column: 2/3;
    grid-row: 2/3;
    height: 60%;
    /* height: 70%; */
    /* width: 20px; */
    /* margin-left: 10%; */
    justify-self: center;
    align-self: center;
  }
  .userName {
    grid-column: 3/4;
    grid-row: 1/2;
    align-self: center;
    margin-left: 0%;
    /* width: 100%;
    height: 100%; */
    /* display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto; */
    display: grid;
    z-index: 5;
    overflow: hidden;
  }
  .userNameText {
    color: white;
    font-size: 100%;
    text-align: left;
    align-self: center;
    display: contents;
    height: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    /* white-space: nowrap; */
  }
  .userNameText2 {
    color: white;
    font-size: 80%;
    text-align: left;
    align-self: center;
    display: contents;
    height: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    /* white-space: nowrap; */
  }
  .userOption {
    height: 100%;
    width: 100%;
    grid-column: 3/4;
    grid-row: 1/2;
    display: grid;
    z-index: 20;
  }
  .menuImg {
    height: 30%;
    align-self: center;
    justify-self: center;
    opacity: 1;
    color: white;
    cursor: pointer;
    /* z-index: 10; */
  }
  .cameraStatus {
    grid-column: 3/4;
    grid-row: 1/2;
    max-height: 40px;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    z-index: 5;
  }
  .videoImg {
    grid-column: 1/2;
    grid-row: 1/2;
    justify-self: end;
    align-self: center;
    margin-right: 20%;
    height: 45%;
    /* width: 30px; */
  }
  .hidden {
    display: none;
  }
  .selected {
    border-color: #FFFFFF;
    border-width: 0.18em;
    border-style: solid;
  }

  /* @media only screen and (max-height: 911px)  and (orientation: landscape) {
    .userName p {
      font-size: 10pt;
    }
    .micImg {
      grid-column: 1/2;
      grid-row: 1/2;
      height: 18px;
      width: 13px;
      justify-self: center;
      align-self: center;
    }
    .videoImg {
      grid-column: 1/2;
      grid-row: 1/2;
      justify-self: end;
      align-self: center;
      margin-right: 20%;
      height: 13px;
      width: 23px;
    }
  } */
  @media only screen and (max-height: 770px)  and (orientation: landscape) {
    .remoteVideoWrapper {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 80% 20%;
      align-self: center;
      justify-self: center;
      margin: 0;
      padding: 0;
    }
    /* .userName p {
      font-size: 8pt;
    }
    .micImg {
      grid-column: 1/2;
      grid-row: 1/2;
      height: 15px;
      width: 10px;
      justify-self: center;
      align-self: center;
    }
    .videoImg {
      grid-column: 1/2;
      grid-row: 1/2;
      justify-self: end;
      align-self: center;
      margin-right: 20%;
      height: 10px;
      width: 20px;
    } */
  }
  @media only screen and (max-height: 500px)  and (orientation: landscape) {
    .localVideoWrapper {
      display: grid;
      grid-template-columns: 100%;
      grid-template-rows: 80% 20%;
      align-self: center;
      justify-self: center;
      margin: 0;
      padding: 0;
    }
    .micAndName {
      grid-template-columns: 30% 100% 20%;
      grid-template-rows: 100%;
    }
  }
</style>
