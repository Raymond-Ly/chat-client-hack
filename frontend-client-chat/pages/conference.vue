<template>
  <div class="spaceon" id="spaceon">
    <audio class="audio" ref="joinedAudio" id="joinedAudio" src="/sounds/joined.wav" type="audio/wav" />
    <audio class="audio" ref="leftAudio" id="leftAudio" src="/sounds/left.wav" type="audio/wav" />
    <audio class="audio" ref="incomingMsg" id="incomingMsg" src="/sounds/incoming_message.wav" type="audio/wav" />
    <SpeakerLayout
    class="tracks"
    :remoteTracksId="remoteTracksId"
    :room="room"
    v-if="speakerLayout"
    ref="speakerLayout"
     />
     <GridLayout
     class="tracks"
     :remoteTracksId="remoteTracksId"
     :room="room"
     v-if="gridLayout"
     ref="gridLayout"
      />
    <div class="popupWrapper" id="popupWrapper">
      <div class="hiddenBg hidden" id="hiddenBg" @click="hidePopup">
      </div>
      <AudioPopup
      class="audioPopup"
      v-if="audioPopup"
      :room="room"
       />
       <VideoPopup
       class="videoPopup"
       v-if="videoPopup"
       :room="room"
        />
    </div>
    <!-- <div class="popupWrapper2 vhidden" id="popupWrapper2">
      <div class="highlightPopup" id="highlightPopup">
      </div>
    </div> -->
    <SpaceonButtons class="buttons"
    :room="room"
     />
    <Chat
    class="chat"
    ref="chat"
    v-show="chatPopup"
    :room="room"
    :msg="msg"
     />
    <div class="warningWrapper hidden" id="warningWrapper">
      <div class="warningBg">
      </div>
      <div class="warningPopup">
        <img src="/warning_icon.svg">
        <p>Do you want to enable your camera?</p>
        <div class="warningBtnWrapper">
          <button class="yesBtn" type="button" name="try" >Yes</button>
          <button class="noBtn" type="button" name="try" @click="hidePopup">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import JitsiMeetJS from '@/functions/lib-jitsi-meet.min.js';
import JitsiMeetJS from '@lyno/lib-jitsi-meet';
import GridLayout from '../components/GridLayout.vue';
import SpeakerLayout from '../components/SpeakerLayout.vue';
import SpaceonButtons from '../components/SpaceonButtons.vue';
import AudioPopup from '../components/AudioPopup.vue';
import VideoPopup from '../components/VideoPopup.vue';
import Chat from '../components/Chat.vue';
// import { mapGetters } from 'vuex';
export default {
  name: 'SpaceonWrapper',
  // props: {
  //   roomData: Object,
  //   currentPage: Boolean
  // },
  components: {
    GridLayout,
    SpeakerLayout,
    SpaceonButtons,
    AudioPopup,
    VideoPopup,
    Chat
  },
  data() {
    return {
      jitsiDims: {
        x: 0,
        y: 0,
        height: 0,
        width: 0
      },
      serverURL: "beta.meet.jit.si",
      // roomId: "testest123",
      connection: null,
      isJoined: false,
      localTrackLoaded: false,
      isLocalTrackAdded: false,
      room: null,
      connectionStatus: null,
      popup: false,
      tracks: [],
      localTracks: [],
      remoteTracks: [],
      newRemoteTracks: [],
      remoteTracksId: [],
      deviceList: {
        audioInput:[],
        audioOutput:[],
        videoInput:[]
      },
      selectedDevice: null,
      renderKey: 0,
      userDisplayName: [],
      localUsersName: null,
      msg: []
    }
  },
  methods: {
    hidePopup() {
      let warningWrapper = document.getElementById('warningWrapper');
      warningWrapper.classList.add('hidden')
      this.$store.commit("closeAllPopup")
    },
    initJitsi() {
      const initOptions = {
        disableAudioLevels: true
      };
      JitsiMeetJS.init(initOptions);
      console.log("%cJitsiMeetJS has Inited","color:green;font-size:15pt;")
    },
    newJitsiConnection() {
      console.log("%cJitsi Connection Started","color:green;font-size:15pt;")
      const options = {
          hosts: {
              domain: this.serverURL,
              muc: `conference.${this.serverURL}` // FIXME: use XEP-0030
              // focus: `focus.${this.serverURL}`
          },
          bosh: `https://${this.serverURL}/http-bind`,
          // serviceUrl:  `wss://${this.serverURL}/xmpp-websocket?room=${this.roomId}`,

          // The na3me of client node advertised in XEP-0115 'c' stanza
          clientNode: 'http://jitsi.org/jitsimeet'
          // useStunTurn: true
      };
      this.connection = new JitsiMeetJS.JitsiConnection(null, null, options);
      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        this.onConnectionSuccess);
      this.connection.addEventListener(
          JitsiMeetJS.events.connection.CONNECTION_FAILED,
          function() {
            console.log("%c!!Connection Failed!","color:red;font-size:15pt;");
          });
      this.connection.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        function() {
          console.log("%cConnection Disconnected!","color:red;font-size:15pt;");
          this.$store.state.spaceon.connectionEstablished = false;
        });
      this.connection.connect();
      this.connectionStatus = JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED;

    },
    onConnectionSuccess() {
      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR)
      console.log("%c!!Connection Success","color:green;font-size:15pt;");
      // const domain = 'spaceinonline.com/';
      // const domain = 'localhost:8080/';
      // let roomLink = this.roomLink;
      // let roomId = roomLink.split(domain)[1];
      // let filteredRoomId = roomId.toLowerCase()
      // this.$store.state.spaceon.roomId = filteredRoomId;
      console.log("%c!!Connection Status: ","color:green;font-size:15pt;" + this.connectionStatus);
      const confOptions = {
          openBridgeChannel: true,
          p2p: "disable"
      };
      let roomId = this.$store.getters.getRoomId;
      console.log("%cRoom ID is: " + roomId,"color:green;font-size:15pt;");
      this.room = this.connection.initJitsiConference(roomId, confOptions);
      this.room.on(JitsiMeetJS.events.conference.TRACK_ADDED, this.onRemoteTrack);
      this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, this.onRemoteTrackRemoved);
      this.room.on(
          JitsiMeetJS.events.conference.CONFERENCE_JOINED,
          this.onConferenceJoined);
      this.room.on(JitsiMeetJS.events.conference.USER_JOINED, this.onUserJoined);
      this.room.on(JitsiMeetJS.events.conference.USER_LEFT, this.onUserLeft);
      this.room.on(JitsiMeetJS.events.conference.DOMINANT_SPEAKER_CHANGED, id => {
        console.log("%cDominant Speaker: " + id,"color:green;font-size:15pt;");
        this.$store.commit('addDominantSpeaker', id)
      });
      this.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, track => {
        console.log("%cTrack muted: " + `${track.getParticipantId()} - ${track.getType()} - ${track.isMuted()}`, "color:green;font-size:15pt;");
        this.$store.commit('audioTrackMuteChanged', track);
      });
      this.room.on(JitsiMeetJS.events.conference.KICKED, this.onKicked);
      this.room.on(JitsiMeetJS.events.conference.MODERATOR_CHANGED, id=>{
        console.log("%cModerator Changed: " + id,"color:green;font-size:15pt;");
      });
      this.room.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, name=>{
        console.log("%cDisplay Name Changed: " + name,"color:green;font-size:15pt;");
      });
      this.room.join();
      // this.localUsersName = this.usersName + "_usersEmail:" + this.usersEmail;
      this.room.setDisplayName(this.$store.state.spaceon.displayName)
      this.room.on(JitsiMeetJS.events.conference.MESSAGE_RECEIVED, this.onMessageReceived);
      console.log("%c!!Room Joined","color:green;font-size:15pt;");
    },
    onRemoteTrack(track) {
      console.log("%c!!Remote Track Type Added: " + track.videoType,"color:green;font-size:15pt;");
      if (track.isLocal()) {
        let localTrackId = track.getParticipantId()
        // this.$store.commit('addLocalTrackId', localTrackId)
        // this.$store.commit('updateParticipantCount')
        console.log("%cLocal ID: " + localTrackId,"color:green;font-size:15pt;");
        if (track.videoType === "desktop") {
          let presenterCount = this.getPresenters.length;
          if (presenterCount > 0) {
            this.$store.state.spaceon.presenters.push(localTrackId)
            this.$store.state.spaceon.speakerLayout = false;
            this.$store.state.spaceon.gridLayout = true;
            this.$store.state.spaceon.presentMode = false;
          }
          else {
            this.$store.commit('presentMode', localTrackId)
          }
        }
        return;
      }
      let videoType = track.videoType;
      console.log("Remote Video Type: " + videoType);
      this.remoteTracks.push(track);

      const participant = track.getParticipantId()
      // this.participantId.push(participantId)
      console.log("!!Participant ID: " + participant);
      // this.$store.commit('addParticipantId', participant)
      this.$store.commit('addRemoteTracks', track)
      this.$store.commit('addTracks', track)

      if (track.videoType === "desktop") {
        let presenterCount = this.getPresenters.length;
        if (presenterCount > 0) {
          this.$store.state.spaceon.presenters.push(participant)
          this.$store.state.spaceon.speakerLayout = false;
          this.$store.state.spaceon.gridLayout = true;
          this.$store.state.spaceon.presentMode = false;
        }
        else {
          console.log("%cRemote Desktop Track Added!","color:green;font-size:15pt;");
          this.$store.commit('presentMode', participant)
        }
      }
      //
      // track.addEventListener(
      //     JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      //     audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
      // track.addEventListener(
      //     JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      //     () => {
      //       console.log("%cTrack muted: " + `${track.getParticipantId()} - ${track.getType()} - ${track.isMuted()}`, "color:green;font-size:15pt;");
      //       this.$store.commit('audioTrackMuteChanged', track);
      //       if (track.type === "audio") {
      //         this.$store.commit('audioTrackMuteChanged', track);
      //       }
      //       if (track.type === "video") {
      //         this.$store.commit('videoTrackMuteChanged', track);
      //       }
      //     });
      // track.addEventListener(
      //     JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
      //     () => console.log('Remote track stoped'));
      // track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      //     deviceId =>
      //         console.log(
      //             `track audio output device was changed to ${deviceId}`));
    },
    onRemoteTrackRemoved(track) {
      console.log("%cA Remote Track has been removed " + trackId,"color:green;font-size:15pt;");
      let trackId = track.getId();
      let ownerEndpointId = track.ownerEndpointId;
      let storeTrack = this.$store.getters.getRemoteTracks;
      if (track.isLocal()) {
        if (track.videoType === "desktop") {
          console.log("%cLocal Desktop Track Removed!","color:green;font-size:15pt;");
          this.$store.commit("presentModeOff", this.getLocalTrackId)
          this.$store.commit("addDominantSpeaker", this.getLocalTrackId)
        }
        return;
      }

      // let presenters = this.getPresenters;
      console.log("%cRemove Track Type: " + track.videoType,"color:red;font-size:15pt;");
      console.log("%cRemoved Track User ID: " + ownerEndpointId,"color:red;font-size:15pt;");
      console.log("%cRemove Track ID" + trackId,"color:green;font-size:15pt;");
      for (var i = 0; i < storeTrack.length; i++) {
        if (storeTrack[i].getId() === trackId) {
          console.log("%cRemoved Stored Remote Track: " + storeTrack[i],"color:green;font-size:15pt;");
          this.$store.state.spaceon.remoteTracks.splice(i, 1);
        }
      }
      this.$store.commit("removeRemoteTrack", track)
      for (var z = 0; z < this.getPresenters.length; z++) {
        if (this.getPresenters[z] === ownerEndpointId) {
          this.$store.commit("presentModeOff", ownerEndpointId)
        }
      }
      // if (this.getPresenters === "desktop") {
      //   this.$store.commit("presentModeOff", ownerEndpointId)
      // }
      // if (track.videoType === "desktop") {
      //   this.$store.commit("presentModeOff", ownerEndpointId)
      //   // this.$store.commit("addDominantSpeaker", ownerEndpointId)
      // }
    },
    onConferenceJoined() {
      console.log('%cConference joined!',"color:green;font-size:15pt;");
      this.isJoined = true;
      console.log(this.localTracks);
      let localId = this.room.myUserId()
      let localRole = this.room.isModerator()
      this.$store.commit('addLocalTrackId', localId)
      this.$store.commit('checkRemoteTrackStatus', localId)
      this.$store.commit('updateParticipantCount')
      this.$store.state.spaceon.connectionEstablished = true;
      console.log("Local Role is: " + localRole);
    },
    onUserJoined(id, user) {
      this.$refs.joinedAudio.play();
      // document.getElementById('joinedAudio').play();
      let localRole = this.room.isModerator()
      console.log("Local Role 2nd Check: " + localRole);
      console.log('!!user join');
      console.log('!!User ID: ' + id);
      console.log("User Display Name: " + user._displayName);
      this.userDisplayName.push(user);
      if (user._displayName === this.localUsersName) {
        console.log("Second connection connected");
        this.$store.state.spaceon.secondConnectionId = user._id;
      }
      if (!this.remoteTracksId[id]) {
        this.remoteTracksId.push(id);
        this.$store.commit('addParticipantId', id)
        this.$store.commit('checkRemoteTrackStatus', id)
        this.$store.commit('updateParticipantCount')
      }
      if (localRole) {
        this.$store.state.spaceon.moderator = true;
      }
      if (!localRole) {
        this.$store.state.spaceon.moderator = false;
      }
    },
    onUserLeft(id) {
      this.$refs.leftAudio.play();
      // document.getElementById('leftAudio').play();
      console.log('User left: ' + id);
      let UserLeftId = this.remoteTracksId.filter(user => user == id)
      let allId = this.$store.state.spaceon.allId;
      console.log("User Left Track: " + UserLeftId);
      for (var i = 0; i < this.remoteTracksId.length; i++) {
        if (this.remoteTracksId[i] == UserLeftId) {
            this.remoteTracksId.splice(i,1);
            allId.splice(i,1);
        }
      }
      this.$store.commit('removeParticipantId', id)
      this.$store.commit('updateParticipantCount')
      if (this.remoteTracksId === undefined || this.remoteTracksId.length == 0) {
        this.$store.state.spaceon.notAlone = false
      }
    },
    onKicked() {
      console.log("You've been kicked");
      // this.$router.push('/')
      const meetingData = { id: 'hub' };
      this.$store.dispatch('enterExistingSpace', { meetingData });
    },
    // addLocalTracksToServer() {
    //   if (this.isJoined) {
    //     let localTracks = this.getLocalTracks;
    //     for (let i = 0; i < localTracks.length; i++) {
    //       this.room.addTrack(localTracks[i]);
    //       console.log("%c!!Local Track Pushed to Server","color:green;font-size:15pt;");
    //     }
    //   }
    // },
    availableDevices() {
      JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        this.$store.commit('addAvailableDevices', devices)
      })
      // JitsiMeetJS.getActiveAudioDevice(devices => {
      //   console.log("Active Audio Device: " + devices);
      // })
      // setTimeout(this.$store.commit('checkDefaultDevice'), 5000)

    },
    onMessageReceived(id, msg) {
      let localId = this.$store.state.spaceon.localTrackId;
      const newMsg = {
        'id': id,
        'msg': msg
      }
      this.msg.push(newMsg)
      this.$store.commit("newMsg", newMsg)
      if (id !== localId) {
        this.$refs.incomingMsg.play();
        this.$store.state.spaceon.newMsg = true;
      }
    },
    leave() {
      this.$store.state.spaceon.secondLocalTrack = false;
      let localTracks = this.$store.getters.getLocalTracks;
      // for (let i = 0; i < localTracks.length; i++) {
      //   this.room.removeTrack(localTracks[i])
      //   .then(promise => {
      //     console.log("%cRemove Track: " + promise,"color:green;font-size:15pt;");
      //   })
      //   // localTracks[i].dispose();
      // }
      localTracks.forEach(track => {
        track.dispose()
        .catch(err => {
          console.log("%cRemove Track Error: " + err,"color:red;font-size:15pt;");
        })
      })
      this.$store.commit('leaveRoom')
      this.room.leave()
      .then(() => {
        this.connection.disconnect();
        console.log("%c!!You've left the conf","color:green;font-size:15pt;");
        // localTracks.forEach(track => {
        //   track.dispose()
        //   .catch(err => {
        //     console.log("%cRemove Track Error: " + err,"color:red;font-size:15pt;");
        //   })
        // })
      })
      .catch(err => {
        console.log("%c!!Leaving Error: " + err,"color:red;font-size:15pt;");
        // localTracks.forEach(track => {
        //   track.dispose()
        //   .catch(err => {
        //     console.log("%cRemove Track Error: " + err,"color:red;font-size:15pt;");
        //   })
        // })
      })
    },
    // leaveTheRoom() {
    //   this.leave()
    // },
    getJitsiDims() {
      console.log("%cJitsiDims Inited","color:green;font-size:15pt;");
      let jitsiGap = document.querySelector('.room-page');
      let roomPageFooter = document.querySelector('.room-page-title');
      let spaceon = document.querySelector('#spaceon');
      if (this.currentPage === true) {
        if (jitsiGap && spaceon) {
          let jitsiDims = jitsiGap.getBoundingClientRect();
          let roomPageFooterDims = roomPageFooter.getBoundingClientRect();
          this.jitsiDims.x = jitsiDims.x;
          this.jitsiDims.y = jitsiDims.y + roomPageFooterDims.height;
          this.jitsiDims.height = jitsiDims.height - roomPageFooterDims.height;
          this.jitsiDims.width = jitsiDims.width;
        }
      } else {
        this.jitsiDims.x = 0;
        this.jitsiDims.y = 0;
        this.jitsiDims.height = 0;
        this.jitsiDims.width = 0;
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
    // usersAvatar() {
    //   return this.usersData && this.usersData.avatar ? this.usersData.avatar : '';
    // },
    // usersEmail() {
    //   return this.usersData && this.usersData.email ? this.usersData.email : '';
    // },
    // roomId() {
    //   return this.currentUsersRoom.id;
    // },
    // roomLink() {
    //   return this.currentUsersRoom.link;
    // },
    getRoomId() {
      return this.$store.getters.getRoomId;
    },
    getLocalAudioInit() {
      return this.$store.getters.getLocalAudioInit;
    },
    getLocalVideoInit() {
      return this.$store.getters.getLocalVideoInit;
    },
    getLocalTracks() {
      return this.$store.getters.getLocalTracks;
    },
    getLocalTrackId() {
      return this.$store.getters.getLocalTrackId;
    },
    audioPopup() {
      return this.$store.getters.getAudioPopup;
    },
    videoPopup() {
      return this.$store.getters.getVideoPopup;
    },
    chatPopup() {
      return this.$store.getters.getChatPopup;
    },
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
    getPresenters() {
      return this.$store.getters.getPresenters;
    },
    getModerator() {
      return this.$store.getters.getModerator;
    },
    jitsiStyles() {
      return {
        left: `${this.jitsiDims.x}px`,
        top: `calc(${this.jitsiDims.y}px - var(--header-height))`,
        height: `${this.jitsiDims.height}px`,
        width: `${this.jitsiDims.width}px`,
        // 'grid-template-rows': `1% 87% 20%`
      };
    }
  },
  watch: {
    // currentPage(newVal, oldVal) {
    //   if (newVal !== oldVal) {
    //     setTimeout(() => {
    //       this.getJitsiDims();
    //     }, 500);
    //   }
    // },
    audioPopup() {
      if (this.audioPopup || this.videoPopup) {
        document.getElementById('hiddenBg').classList.remove('hidden')
      }
      else if (!this.audioPopup || !this.videoPopup) {
        document.getElementById('hiddenBg').classList.add('hidden')
      }
    },
    videoPopup() {
      if (this.audioPopup || this.videoPopup) {
        document.getElementById('hiddenBg').classList.remove('hidden')
      }
      else if (!this.audioPopup || !this.videoPopup) {
        document.getElementById('hiddenBg').classList.add('hidden')
      }
    }
  },
  mounted() {
    // if (this.currentUsersRoom.conferenceType === "Spacein") {
    //   this.initJitsi(),
    //   this.newJitsiConnection()
    //   this.availableDevices()
    //   setTimeout(() => {
    //     this.getJitsiDims();
    //   }, 300);
    //   window.addEventListener('resize', this.getJitsiDims);
    // }
    this.initJitsi(),
    this.newJitsiConnection()
    this.availableDevices()
    // setTimeout(() => {
    //   this.getJitsiDims();
    // }, 300);
    window.addEventListener('resize', this.getJitsiDims);
  },
  beforeDestroy() {
    this.leave();
  },
}
</script>

<style scoped>
  .spaceon {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows:1% 88% 11%;
    position: absolute;
    cursor: default;
    height: 100%;
    width: 100%;
    background-color: black;
  }
  /* #spaceon{
    display: none;
  }
  .status-bar.current-space-page #spaceon {
  display: grid;
  } */
  .audio {
    opacity: 0;
    z-index: 0;
  }
  .warningWrapper {
    grid-column: 1/2;
    grid-row: 1/4;
    height: 100%;
    width: 100%;
    display: grid;
    z-index: 100;
  }
  .warningBg {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-color: #2C2C2C;
    opacity: 0.7;
  }
  .warningPopup {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 40%;
    width: 40%;
    align-self: center;
    justify-self: center;
    background-color: #2C2C2C;
    border-radius: 30px;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 45% 15% 40%;
    z-index: 10;
  }
  .warningPopup img {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 55%;
    align-self: center;
    justify-self: center;
  }
  .warningPopup p {
    grid-column: 1/2;
    grid-row: 2/3;
    color: white;
    font-size: 20pt;
    align-self: center;
    font-weight: bold;
  }
  .warningBtnWrapper {
    grid-column: 1/2;
    grid-row: 3/4;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    height: 100%;
  }
  .warningBtnWrapper button {
    border-radius: 80px;
    border-style: solid;
    width: 50%;
    height: 35%;
    color: white;
    font-size: 20pt;
    font-weight: bold;
  }
  .yesBtn {
    grid-column: 1/2;
    grid-row: 1/2;

    align-self: center;
    justify-self: right;
    margin-right: 8%;
    background-color: #3BC146;
    border-color: #3BC146;
  }
  .noBtn {
    grid-column: 2/3;
    grid-row: 1/2;

    align-self: center;
    justify-self: left;
    margin-left: 8%;
    background-color: #2C2C2C;
    border-color: #707070;
  }
  .popupWrapper2 {
    grid-column: 1/2;
    grid-row: 2/4;
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 5% 7% 7% 7% 19% 10% 2% 7% 7% 7% 7% 15%;
    grid-template-rows: 90% 10%;
    transition: 0.3s ease-in-out;
  }
  .highlightPopup {
    grid-column: 8/10;
    grid-row: 1/2;
    width: 100%;
    height: 25%;
    justify-self: center;
    align-self: end;
    background-image: url('/img/camera_mic_warning.svg');
    background-repeat: no-repeat;
    background-position: center;
    /* background-color: #2C2C2C; */
    /* border-radius: 30px; */
    /* display: grid;
    grid-template-rows: 50% 50%; */
    margin-bottom: 5%;
    z-index: 150;
    transition: 0.3s ease-in-out;
  }
  /* .highlightPopup img {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 70%;
    justify-self: center;
    align-self: flex-end;
  }
  .highlightPopup p {
    grid-column: 1/2;
    grid-row: 2/3;
    color: white;
    font-weight: bold;
    justify-self: center;
    align-self: center;
    margin: 0 5% 0 5%;
    text-align: center;
  } */
  /* .highlightBox {
    grid-column: 8/10;
    grid-row: 2/3;
    width: 100%;
    height: 60%;
    justify-self: center;
    align-self: start;
    border-color: #3BC146;
    border-width: 5px;
    border-style: solid;
    border-radius: 3rem;
    z-index: 150;
    transition: 0.3s ease-in-out;
  } */
  .popupWrapper {
    grid-column: 1/2;
    grid-row: 2/3;
    width: 100%;
    display: grid;
    grid-template-columns: 5% 7% 7% 7% 15% 7% 5% 7% 7% 7% 7% 5% 9%;
    grid-template-rows: 100%;
  }
  .hiddenBg {
    grid-column: 1/12;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    z-index: 10;
  }
  .audioPopup {
    grid-column: 6/10;
    grid-row: 1/2;
    z-index: 20;
  }
  .videoPopup {
    grid-column: 8/11;
    grid-row: 1/2;
    justify-self: start;
    z-index: 20;
  }
  .tracks {
    grid-column: 1/2;
    grid-row: 2/3;
    z-index: 0;
  }
  .buttons {
    grid-column: 1/2;
    grid-row: 3/4;
    z-index: 100;
  }
  .chat {
    grid-column: 1/2;
    grid-row: 1/3;
    z-index: 100;
    transition: 0.3s ease-in-out;
  }
  .sideMenu {
    grid-column: 1/2;
    grid-row: 1/4;
    z-index: 100;
    transition: 0.3s ease-in-out;
  }
  .hidden {
    display: none;
  }
  .vhidden {
    opacity: 0;
  }
  .bringForward {
    z-index: 10;
  }
</style>
