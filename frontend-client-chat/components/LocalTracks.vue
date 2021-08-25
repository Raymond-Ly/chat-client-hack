<template>
  <div class="localTrackWrapper" @click="pin">
    <div class="localContentWrapper" id="localContentWrapper">
      <div class="localVideoWrapper" ref="localVideoWrapper" id="localVideoWrapper">
        <div class="profileImgWrapper" ref="localProfileImgWrapper" id="profileImgWrapper">
          <img class="profileImg" :src="usersAvatar">
        </div>
        <video autoPlay='1' ref="localVideo" class="Localvideo" id="Localvideo" />
        <img class="pinImg hidden" ref="pinImg" src="~/static/img/pin_icon.svg">
        <div class="nameAndStatus" ref="nameAndStatus" id="nameAndStatus">
          <div class="micAndName" ref="micAndName" id="micAndName">
            <div class="micAndNameBg">
            </div>
            <div class="micStatus">
              <img class="micImg" :src="micImg">
            </div>
            <div class="userName">
              <p class="userNameText" ref="localUserNameText" id="localUserNameText">{{ usersName }}</p>
            </div>
            <div class="userOption">
            </div>
          </div>
          <div class="cameraStatus">
            <img class="videoImg" :src="cameraImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
export default {
  name: 'LocalTracks',
  data() {
    return {
      audioMuted: true,
      cameraOff: true,
      fontSize: "100%",
      iconSize: "100%"
    }
  },
  // props: {
  //   currentPage: Boolean
  // },
  methods: {
    onLocalTracks() {
      // console.log("!!onLocalTracks Loaded");
      let localTracks = this.getLocalTracks;
      for (var i = 0; i < localTracks.length; i++) {
        if (localTracks[i].type === 'video') {
          localTracks[i].attach(this.$refs.localVideo)
          if (localTracks[i].videoType === 'desktop') {
            this.$refs.localVideo.classList.remove("flipVideo");
          }
          else {
            this.$refs.localVideo.classList.add("flipVideo");
          }
          this.$parent.recalculateLayout()
        }
      }
    },
    calculateAspectRatio() {
      console.log("Local ratio caclulation");
      const content = document.getElementById('localContentWrapper')
      const contentScreen = document.getElementById('localVideoWrapper')
      const divWidth = content.getBoundingClientRect().width;
      const divHeight = content.getBoundingClientRect().height;
      const calHeight = Math.round((divWidth/16)*9);
      const calWidth = Math.round((divHeight/9)*16);
      if (divWidth >= divHeight) {
        if (calWidth > divWidth) {
          // let reCalHeight = Math.round((calWidth/16)*9);
          // let reCalWidth = Math.round((calWidth/16)*9);
          // contentScreen.style.setProperty('--screenWidth', divWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', calHeight + 'px')
          contentScreen.style.width = divWidth + "px";
          contentScreen.style.height = calHeight + "px";
        }
        else {
          // contentScreen.style.setProperty('--screenWidth', calWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', divHeight + 'px')
          contentScreen.style.width = calWidth + "px";
          contentScreen.style.height = divHeight + "px";
        }
      }
      else {
        if (calHeight > divHeight) {
          // let reCalHeight = Math.round((calHeight/16)*9);
          // let reCalWidth = Math.round((calHeight/16)*9);
          // contentScreen.style.setProperty('--screenWidth', calWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', divHeight + 'px')
          contentScreen.style.width = calWidth + "px";
          contentScreen.style.height = divHeight + "px";
        }
        else {
          // contentScreen.style.setProperty('--screenWidth', divWidth + 'px')
          // contentScreen.style.setProperty('--screenHeight', calHeight + 'px')
          contentScreen.style.width = divWidth + "px";
          contentScreen.style.height = calHeight + "px";
        }
      }
    },
    watchResize() {
      window.addEventListener('resize', this.calculateAspectRatio);
      console.log("Local Wrapper Resized!");
    },
    checkCameraImg() {
      console.log("%cRemote Camera Img Checked","color:green;font-size:15pt;");
      if (this.getRemoteVideoStatus == null) {
        this.$refs.localVideo.classList.add('hidden')
        this.$refs.localProfileImgWrapper.classList.remove('hidden');
        console.log("%cRemote No Video Feed","color:red;font-size:15pt;");
      }
      if (this.getRemoteVideoStatus || this.shareScreen) {
        this.$refs.localVideo.classList.remove('hidden')
        this.$refs.localProfileImgWrapper.classList.add('hidden');
        console.log("%cRemote New Video Feed","color:green;font-size:15pt;");
      }
      else {
        this.$refs.localVideo.classList.add('hidden')
        this.$refs.localProfileImgWrapper.classList.remove('hidden');
        console.log("%cRemote No Video Feed","color:red;font-size:15pt;");
      }
    },
    pin() {
      console.log("Pin triggered");
      let localId = this.$store.state.spaceon.localTrackId;
      if (this.selectedComponent === localId) {
        console.log("Unpin local");
        this.$store.commit("unpinParticipant");
        // this.$store.state.spaceon.presentMode = false;
        // this.$store.state.spaceon.selectedComponent = null;
      }
      else {
        console.log("Pin: " + localId);
        this.$store.commit("pinParticipant", localId);
      }
    },
    highlight() {
      if (this.connectionEstablished) {
        let localId = this.$store.state.spaceon.localTrackId;
        if (this.selectedComponent === localId) {
          console.log("Local selected");
          this.$refs.localVideo.classList.add('selected');
          this.$refs.pinImg.classList.remove('hidden');
          // document.getElementById('Localvideo').classList.add('selected');
        }
        else {
          console.log("Local unselected");
          this.$refs.localVideo.classList.remove('selected');
          this.$refs.pinImg.classList.add('hidden');
        }
      }
    }
  },
  computed: {
    // ...mapGetters({
    //   currentUsersRoom: 'getCurrentUsersRoom',
    //   usersData: 'getCurrentUsersData',
    //   leaveMeetingBarHeight: 'getCurrentMeetingBarHeight'
    // }),
    usersName() {
      return this.$store.getters.getUserName;
      // let name = '';
      // if (this.usersData) {
      //   name = `${this.usersData.firstName} ${this.usersData.lastName}`;
      // }
      // return name;
    },
    usersAvatar() {
      return this.usersData && this.usersData.avatar ? this.usersData.avatar : '';
    },
    connectionEstablished() {
      return this.$store.getters.getConnectionEstablished;
    },
    getLocalTracks() {
      return this.$store.getters.getLocalTracks;
    },
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
    getLocalCamera() {
      return this.$store.getters.getLocalCamera;
    },
    getlocalAudio() {
      return this.$store.getters.getlocalAudio;
    },
    micImg() {
      if (this.getlocalAudio) {
        return require('~/static/img/mic.svg')
      }
      else {
        return require('~/static/img/no_mic.svg')
      }
    },
    cameraImg() {
      if (this.getLocalCamera) {
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
    selectedComponent() {
      return this.$store.getters.getSelectedComponent;
    },
    getPresentMode() {
      return this.$store.getters.getPresentMode;
    },
    getRemoteVideoStatus() {
      let localId = this.$store.state.spaceon.localTrackId;
      return this.$store.getters.getRemoteVideoStatus(localId);
    },
    shareScreen() {
      return this.$store.getters.getShareScreenStatus;
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
    getLocalTracks() {
      console.log("%cNew Local Track Added!!","color:green;font-size:15pt;");
      this.onLocalTracks()
      this.calculateAspectRatio()
    },
    selectedComponent() {
      console.log("Selected Component: " + this.selectedComponent);
      this.highlight();
    },
    getLocalCamera() {
      console.log("Local getLocalCamera watch triggered");
      this.checkCameraImg()
    },
    speakerLayout() {
      this.checkCameraImg()
    },
    getAllId() {
      this.calculateAspectRatio()
    },
    getTrackDivWidth() {
      if (this.getTrackDivWidth < 180) {
        this.fontSize = "40%";
        this.iconSize = "40%";
      }
      if (this.getTrackDivWidth < 350) {
        this.fontSize = "70%";
        this.iconSize = "70%";
      }
      else if (this.getTrackDivWidth >= 350 && this.getTrackDivWidth < 450) {
        this.fontSize = "80%";
        this.iconSize = "80%";
      }
    },
    // getLocalCamera() {
    //   if (this.getLocalCamera) {
    //     document.getElementById('profileImgWrapper').classList.add('hidden');
    //   }
    //   else {
    //     document.getElementById('profileImgWrapper').classList.remove('hidden');
    //   }
    // }
  },
  updated() {
    this.onLocalTracks()
  },
  mounted() {
    this.$parent.recalculateLayout()
    this.onLocalTracks()
    // setTimeout(this.calculateAspectRatio,3000);
    setTimeout(() => {
      this.calculateAspectRatio();
    }, 600);
    this.calculateAspectRatio()
    window.addEventListener('resize', this.calculateAspectRatio);
    if (this.speakerLayout) {
      console.log("%cSpeakerLayout!","color:green;font-size:15pt;");
      this.$refs.nameAndStatus.classList.remove('nameAndStatus');
      this.$refs.nameAndStatus.classList.add('nameAndStatus2');
      this.$refs.micAndName.classList.remove('micAndName');
      this.$refs.micAndName.classList.add('micAndName2');
      this.$refs.localUserNameText.classList.remove('userNameText');
      this.$refs.localUserNameText.classList.add('userNameText2');
      setTimeout(() => {
        this.highlight();
      }, 300);
    }
    else {
      console.log("%cGridLayout!","color:green;font-size:15pt;");
      this.$refs.nameAndStatus.classList.remove('nameAndStatus2');
      this.$refs.nameAndStatus.classList.add('nameAndStatus');
      this.$refs.micAndName.classList.remove('micAndName2');
      this.$refs.micAndName.classList.add('micAndName');
      this.$refs.localUserNameText.classList.remove('userNameText2');
      this.$refs.localUserNameText.classList.add('userNameText');
      setTimeout(() => {
        this.highlight();
      }, 300);
    }
    this.checkCameraImg()
    // this.watchResize()
  }
  // destroyed() {
  //   this.$parent.recalculateLayout()
  // }
}
</script>

<style scoped>
  .localTrackWrapper {
    /* margin: 1%; */
    /* display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto; */
    /* display: block; */
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1% 98% 1%;
    grid-template-rows: 1% 98% 1%;
    /* background-image: url('~~/static/img/place_holder.gif');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 50%; */
  }
  .localContentWrapper {
    grid-column: 2/3;
    grid-row: 2/3;
    height: 100%;
    width: 100%;
    display: grid;
    transition: 0.2s ease-in-out;
  }
  .localVideoWrapper {
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 90% 10%;
    align-self: center;
    justify-self: center;
    transition: 0.2s ease-in-out;
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
  .Localvideo {
    grid-column: 1/2;
    grid-row: 1/3;
    height: 100%;
    width: 100%;
    align-self: center;
    justify-self: center;
    z-index: 0;
    cursor: pointer;
    /* display: flex; */
    /* justify-self: center; */
  }
  .flipVideo {
    transform: rotateY(180deg);
    -webkit-transform:rotateY(180deg); /* Safari and Chrome */
    -moz-transform:rotateY(180deg); /* Firefox */
  }
  .Localaudio {
    /* grid-column: 1/2;
    grid-row: 1/2; */
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
    grid-column: 3/4;
    grid-row: 1/2;
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
    .localVideoWrapper {
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
