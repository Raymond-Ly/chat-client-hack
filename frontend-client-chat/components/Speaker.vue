<template>
  <div class="speakerTrackWrapper" id="speakerTrackWrapper">
    <div class="speakerVideoWrapper" id="speakerVideoWrapper">
      <div class="profileImgWrapper" ref="profileImgWrapper">
        <img class="profileImg" ref="profileImg" :src="speakerAvatar">
      </div>
      <video autoPlay='1' ref="speakerVideo" class="remoteVideo" id="speakerVideoFeed">
      </video>
      <!-- <audio autoplay='1' muted='true' ref="speakerAudio" class="remoteAudio video" /> -->
      <div class="speakerNameAndStatus">
        <div class="micAndName">
          <div class="micAndNameBg">
          </div>
          <div class="micStatus">
            <img class="micImg" :src="micImg">
          </div>
          <div class="userName">
            <p>{{ displayName }}</p>
          </div>
        </div>
        <div class="cameraStatus" id="cameraStatus">
          <img class="videoImg" id="videoImg" :src="cameraImg">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
export default {
  name: "Speaker",
  data() {
    return {
      currentVideo: [],
      currentAudio: [],
      displayName: null,
      speakerAvatar: null
    }
  },
  props: {
    id: String,
    room: Object
  },
  methods: {
    onRemoteTracks() {
      let speakerTrack = this.getNewTrack;
      let localTracks = this.getLocalTracks;
      if (this.getDominantSpeaker === this.getLocalTrackId) {
        localTracks.forEach(track => {
          if (track.type == "video") {
            track.attach(this.$refs.speakerVideo)
            if (track.videoType === 'desktop') {
              this.$refs.speakerVideo.classList.remove("flipVideo");
            }
            else {
              this.$refs.speakerVideo.classList.add("flipVideo");
            }
            this.$parent.recalculateLayout()
            console.log("%c!!Remote Video Attached: " + track,"color:green;font-size:15pt;");
          }
        })
      }
      else {
        speakerTrack.forEach(track => {
          if (track.type == "video") {
            track.attach(this.$refs.speakerVideo)
            this.$refs.speakerVideo.classList.remove("flipVideo");
            this.$parent.recalculateLayout()
            console.log("%c!!Remote Video Attached: " + track,"color:green;font-size:15pt;");
          }
        })
      }
    },
    getDisplayName() {
      if (this.getDominantSpeaker === this.getLocalTrackId) {
        let displayName = this.$store.getters.getUserName;
        if (displayName._displayName === null || undefined) {
          this.displayName = "This is a random person";
        }
        else {
          this.displayName = displayName;
        }
      }
      else {
        let displayName = this.room.getParticipantById(this.getDominantSpeaker);
        console.log("Speaker track display name: " + displayName);
        if (displayName._displayName === null || undefined) {
          this.displayName = "This is a random person";
        }
        else {
          this.displayName = displayName._displayName;
        }
      }
    },
    getAvatar() {
      if (this.getDominantSpeaker === this.getLocalTrackId || this.getDominantSpeaker == null) {
        this.speakerAvatar = this.usersAvatar;
      }
      else {
        let displayName = this.room.getParticipantById(this.getDominantSpeaker);
        let filteredName = displayName._displayName;
        let email = filteredName.substring(filteredName.indexOf("_usersEmail:") + 12);
        this.userEmail = email;
        this.speakerAvatar = this.$store.getters.getUsersData({type: 'email', email: email }).avatar;
        console.log("Avatar: " + this.usersAvatar);
      }
    },
    calculateAspectRatio() {
      console.log("Speaker Layout Calculated!");
      const content = document.getElementById('speakerTrackWrapper')
      const contentScreen = document.getElementById('speakerVideoWrapper')

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
      console.log("Speaker Wrapper Resized!");
    },
    checkMicImg() {
      if (this.getRemoteTrackStatus[0] == null) {
        return require('~/static/img/no_mic.svg')
      }
      if (this.getRemoteTrackStatus[0].audio) {
        return require('~/static/img/mic.svg')
      }
      else {
        return require('~/static/img/no_mic.svg')
      }
    },
    checkCameraImg() {
      console.log("%cCamera Img Checked" + this.getRemoteTrackStatus[0].video,"color:green;font-size:15pt;");
      if (this.getRemoteTrackStatus[0] == null) {
        this.$refs.speakerVideo.classList.add('hidden');
        this.$refs.profileImgWrapper.classList.remove('hidden');
        console.log("%cNo Video Feed","color:red;font-size:15pt;");
      }
      if (this.getRemoteTrackStatus[0].video) {
        this.$refs.speakerVideo.classList.remove('hidden');
        this.$refs.profileImgWrapper.classList.add('hidden');
        console.log("%cNew Video Feed","color:green;font-size:15pt;");
      }
      if (!this.getRemoteTrackStatus[0].video) {
        this.$refs.speakerVideo.classList.add('hidden');
        this.$refs.profileImgWrapper.classList.remove('hidden');
        console.log("%cNo Video Feed","color:red;font-size:15pt;");
      }
    }
  },
  computed: {
    // ...mapGetters({
    //   currentUsersRoom: 'getCurrentUsersRoom',
    //   usersData: 'getCurrentUsersData',
    //   leaveMeetingBarHeight: 'getCurrentMeetingBarHeight'
    // }),
    // usersName() {
    //   let name = '';
    //   if (this.usersData) {
    //     name = `${this.usersData.firstName} ${this.usersData.lastName}`;
    //   }
    //   return name;
    // },
    usersAvatar() {
      return this.usersData && this.usersData.avatar ? this.usersData.avatar : '';
    },
    getDominantSpeaker() {
      return this.$store.getters.getDominantSpeaker;
    },
    getNewTrack() {
      return this.$store.getters.getSpeakerTrack(this.getDominantSpeaker);
    },
    amIAlone() {
      return this.$store.getters.getNotAlone;
    },
    getLocalTracks() {
      return this.$store.getters.getLocalTracks;
    },
    getLocalTrackId() {
      return this.$store.getters.getLocalTrackId;
    },
    getRemoteTrackStatus() {
      return this.$store.getters.getRemoteTrackStatus(this.getDominantSpeaker);
    },
    getRemoteVideoStatus() {
      return this.$store.getters.getRemoteVideoStatus(this.getDominantSpeaker);
    },
    micImg() {
      if (this.getRemoteTrackStatus[0] == null) {
        return require('~/static/img/no_mic.svg')
      }
      if (this.getRemoteTrackStatus[0].audio) {
        return require('~/static/img/mic.svg')
      }
      else {
        return require('~/static/img/no_mic.svg')
      }
    },
    cameraImg() {
      if (this.getRemoteTrackStatus[0] == null) {
        return require('~/static/img/no_camera.svg')
      }
      if (this.getRemoteTrackStatus[0].video) {
        return require('~/static/img/empty_pixel.svg')
      }
      else {
        return require('~/static/img/no_camera.svg')
      }
    },
    shareScreenStatus() {
      return this.$store.getters.getShareScreenStatus;
    },
  },
  watch: {
    getNewTrack() {
      console.log("%cNew Remote Track Added!!","color:green;font-size:15pt;");
      this.onRemoteTracks()
      this.calculateAspectRatio()
      this.getDisplayName()
      // this.getAvatar()
      this.checkMicImg()
      this.checkCameraImg()
      // setTimeout(this.onRemoteTracks,500);
    },
    getRemoteVideoStatus() {
      console.log("%cRemote Track Status Changed","color:red;font-size:15pt;");
      this.checkCameraImg()
    }
    // getDominantSpeaker() {
    //   // this.getDisplayName()
    //   // this.getAvatar()
    //   // this.checkMicImg()
    //   // this.checkCameraImg()
    // }
  },
  mounted() {
    this.$parent.recalculateLayout()
    this.onRemoteTracks()
    this.calculateAspectRatio()
    this.watchResize()
    this.getDisplayName()
    // this.getAvatar()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateAspectRatio);
  },
}
</script>

<style scoped>
  .speakerTrackWrapper {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
  }
  .speakerVideoWrapper {
    grid-column: 1/2;
    grid-row: 1/2;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 92% 8%;
    align-self: center;
    justify-self: end;
  }
  .remoteVideo {
    grid-column: 1/2;
    grid-row: 1/3;
    height: 100%;
    width: 100%;
    align-self: center;
    justify-self: center;
    z-index: 10;
  }
  .remoteAudio {
    /* grid-column: 1/2;
    grid-row: 1/2; */
    display: none;
    z-index: 0;
  }
  .profileImgWrapper {
    grid-column: 1/2;
    grid-row: 1/3;
    width: 200px;
    height: 200px;
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
  .speakerNameAndStatus {
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
  .userName p {
    /* grid-column: 1/2;
    grid-row: 1/2; */
    color: white;
    /* font-size: 100%; */
    text-align: left;
    align-self: center;

    display: contents;
    height: 100%;
    /* justify-self: center;
    align-self: center; */
    /* margin-left: 5%; */
    /* padding: 0; */
    /* width: 100%;
    height: 100%; */
  }
  .userName2 {
    color: white;
    font-size: 22pt;
    text-align: left;
    margin-left: 9%;
    display: contents;
    font-weight: bold;
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
</style>
