
const state = {
    serverURL: "spaceon.spaceinonline.com",
    roomId: null,
    displayName: null,
    room: null,
    connectionStatus: null,
    connectionEstablished: false,
    tracks: [],
    track: null,
    localAudioInit: false,
    localVideoInit: false,
    localTracks: [],
    localTrackId: null,
    localCamera: false,
    localCameraSetting: false,
    localAudio: false,
    remoteTracks: [],
    remoteTrackStatus: [],
    participantId: [],
    allId: [],
    deviceList: {
      audioInput:[],
      audioOutput:[],
      videoInput:[]
    },
    defaultDevice: {
      audioInput:[],
      audioOutput:[],
      videoInput:[]
    },
    selectedDevice: {
      audioInput:[],
      audioOutput:[],
      videoInput:[]
    },
    audioPopup: false,
    audioPopupFirstTime: true,
    videoPopup: false,
    chatPopup: false,
    newMsg: false,
    msg:[],
    speakerLayout: false,
    gridLayout: true,
    presentMode: false,
    presenters: [],
    dominantSpeaker: null,
    participantCount: 0,
    notAlone: false,
    testTrack: [],
    trackDivWidth: null,
    participantMenu: false,
    moderator: false,
    shareScreen: false,
    secondConnection: false,
    secondLocalTrack: false,
    presenterTrack: null,
    secondConnectionId: null,
    selectedComponent: null
  };
  
  const getters = {
    getRoomId: state => state.roomId,
    getUserName: state => state.displayName,
    getLocalAudioInit: state => state.localAudioInit,
    getLocalVideoInit: state => state.localVideoInit,
    getLocalTracks: state => {
      return state.localTracks
    },
    getLocalVideoTrack: state => {
      const videoTrack = state.localTracks.filter(localTracks => localTracks.type === 'video')
      return videoTrack;
    },
    getLocalAudioTrack: state => {
      const audioTrack = state.localTracks.filter(localTracks => localTracks.type === 'audio')
      return audioTrack;
    },
    getLocalDesktopTrack: state => {
      const desktopTrack = state.localTracks.filter(localTracks => localTracks.videoType === 'desktop')
      return desktopTrack[0];
    },
    getLocalTrackId: state => state.localTrackId,
    getLocalCamera: state => state.localCamera,
    getlocalAudio: state => state.localAudio,
    getAllId: state => state.allId,
    getParticipantId: state => state.participantId,
    getRemoteTracks: state => {
      return state.remoteTracks
    },
    getNewRemoteTrack: state => id => {
      const newTrack = state.remoteTracks.filter(remoteTracks => remoteTracks.ownerEndpointId === id);
      return newTrack;
    },
    getRemoteTrackStatus: state => id => {
      const trackStatus = state.remoteTrackStatus.filter(remoteTracks => remoteTracks.ownerId === id);
      return trackStatus;
    },
    getRemoteVideoStatus: state => id => {
      const trackStatus = state.remoteTrackStatus.filter(remoteTracks => remoteTracks.ownerId === id);
      return trackStatus[0].video;
    },
    getRemoteAudioStatus: state => id => {
      const trackStatus = state.remoteTrackStatus.filter(remoteTracks => remoteTracks.ownerId === id);
      return trackStatus[0].audio;
    },
    getSpeakerTrack: state => id => {
      const newTrack = state.tracks.filter(tracks => tracks.ownerEndpointId === id);
      return newTrack;
    },
    getAudioOutputDeviceList: state => {
      return state.deviceList.audioOutput;
    },
    getAudioInputDeviceList: state => {
      return state.deviceList.audioInput;
    },
    getVideoInputDeviceList: state => {
      return state.deviceList.videoInput;
    },
    getDefaultAudioOutput: state => {
      return state.defaultDevice.audioOutput
    },
    getDefaultAudioInput: state => {
      return state.defaultDevice.audioInput
    },
    getDefaultCamera: state => {
      return state.defaultDevice.videoInput
    },
    getSelectedAudioInput: state => {
      return state.selectedDevice.audioInput
    },
    getSelectedAudioOutput: state => {
      return state.selectedDevice.audioOutput
    },
    getSelectedVideoInput: state => {
      return state.selectedDevice.videoInput
    },
    getConnectionEstablished: state => state.connectionEstablished,
    getAudioPopup: state => state.audioPopup,
    getVideoPopup: state => state.videoPopup,
    getChatPopup: state => state.chatPopup,
    getSpeakerLayout: state => state.speakerLayout,
    getGridLayout: state => state.gridLayout,
    getPresenters: state => state.presenters,
    getDominantSpeaker: state => state.dominantSpeaker,
    getParticipantCount: state => state.participantCount,
    getNotAlone: state => state.notAlone,
    getTrackDivWidth: state => state.trackDivWidth,
    getParticipantMenu: state => state.participantMenu,
    getModerator: state => state.moderator,
    getShareScreenStatus: state => state.shareScreen,
    getLocalCameraSetting: state => state.localCameraSetting,
    getSecondConnection: state => state.secondConnection,
    getSecondLocalTrack: state => state.secondLocalTrack,
    getPresenterTrack: state => state.presenterTrack,
    getSelectedComponent: state => state.selectedComponent,
    getPresentMode: state => state.presentMode,
    getNewMsg: state => state.newMsg,
    getMsg: state => state.msg
  };
  
  const mutations = {
    updateRoomId(state, id) {
      state.roomId=id.toLowerCase();
    },
    updateUserName(state, userName) {
      state.displayName=userName;
    },
    addTracks(state, track) {
      state.tracks.push(track)
    },
    localAudioInit(state) {
      state.localAudioInit = true;
    },
    localVideoInit(state) {
      state.localVideoInit = true;
    },
    addLocalTracks(state, track) {
      const localId = state.localTrackId;
      const remoteTrackStatus = state.remoteTrackStatus;
      state.localTracks.push(track)
      if (track.videoType === "camera") {
        state.localCamera = true;
        for (let i = 0; i < remoteTrackStatus.length; i++) {
          if (remoteTrackStatus[i].ownerId === localId) {
            remoteTrackStatus[i].video = true;
          }
        }
      }
      if (track.videoType === "desktop") {
        for (let z = 0; z < remoteTrackStatus.length; z++) {
          if (remoteTrackStatus[z].ownerId === localId) {
            remoteTrackStatus[z].video = true;
          }
        }
      }
    },
    localAudioIsOn(state) {
      const localId = state.localTrackId;
      const remoteTrackStatus = state.remoteTrackStatus;
      state.localAudio = true;
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === localId) {
          remoteTrackStatus[i].audio = true;
        }
      }
    },
    localAudioIsOff(state) {
      const localId = state.localTrackId;
      const remoteTrackStatus = state.remoteTrackStatus;
      state.localAudio = false;
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === localId) {
          remoteTrackStatus[i].audio = false;
        }
      }
    },
    localCameraOn(state) {
      const localId = state.localTrackId;
      const remoteTrackStatus = state.remoteTrackStatus;
      state.localCamera = true;
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === localId) {
          remoteTrackStatus[i].video = true;
        }
      }
    },
    localCameraOff(state) {
      const localId = state.localTrackId;
      const remoteTrackStatus = state.remoteTrackStatus;
      state.localCamera = false;
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === localId) {
          remoteTrackStatus[i].video = false;
        }
      }
    },
    // removeOldLocalVideoTrack(state, track) {
    //   const i = state.localTracks.map(item => item.id).indexOf(payload.id);
    //   state.localTracks.splice(i, 1);
    // },
    addRemoteTracks(state, track) {
      console.log("!!Store Remote Track Added: " + track);
      state.remoteTracks.push(track)
      const trackOwnerId = track.ownerEndpointId;
      const remoteTrackStatus = state.remoteTrackStatus;
      // let remoteTrackStatus = Object.keys(state.remoteTrackStatus);
      console.log("Remote Track Updated: " + trackOwnerId);
    //   if (track.videoType === "camera") {
    //     remoteTrackStatus.trackOwnerId
    //   }
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === trackOwnerId && track.videoType === "camera") {
          console.log(trackOwnerId + "'s camera feed is here!");
          remoteTrackStatus[i].video = true;
        }
        if (remoteTrackStatus[i].ownerId === trackOwnerId && track.videoType === "desktop") {
          console.log(trackOwnerId + "'s desktop feed is here!");
          remoteTrackStatus[i].video = true;
        }
        if (remoteTrackStatus[i].ownerId === trackOwnerId && track.type === "audio" && track.muted === false) {
          console.log(trackOwnerId + "'s audio feed is here!");
          remoteTrackStatus[i].audio = true;
        }
        if (remoteTrackStatus[i].ownerId === trackOwnerId && track.type === "audio" && track.muted === true) {
          console.log(trackOwnerId + "'s audio feed is here!");
          remoteTrackStatus[i].audio = false;
        }
      }
    },
    removeRemoteTrack(state, track) {
      // this.getNewRemoteTrack
      const ownerId = track.ownerEndpointId;
      const trackType = track.type;
      console.log("State new removed track ID: " + ownerId);
      console.log("State new removed track type: " + trackType);
      // let remoteTracks = state.remoteTracks;
      // for (let i = 0; i < remoteTracks.length; i++) {
      //   if (remoteTracks[i].ownerEndpointId === ownerId) {
      //     console.log("%cRemoved Stored Remote Track: " + remoteTracks[i],"color:red;font-size:15pt;");
      //     state.remoteTracks.splice(i, 1);
      //   }
      // }
      const remoteTrackStatus = state.remoteTrackStatus;
      for (let z = 0; z < remoteTrackStatus.length; z++) {
        if (remoteTrackStatus[z].ownerId === ownerId && trackType === "video") {
          console.log("Remote video track status updated");
          remoteTrackStatus[z].video = false;
        }
        if (remoteTrackStatus[z].ownerId === ownerId && trackType === "audio") {
          console.log("Remote audio track status updated");
          remoteTrackStatus[z].audio = false;
        }
      }
    },
    audioTrackMuteChanged(state, track) {
      const ownerId = track.ownerEndpointId;
      const trackType = track.type;
      const muted = track.muted;
      const remoteTrackStatus = state.remoteTrackStatus;
      for (let i = 0; i < remoteTrackStatus.length; i++) {
        if (remoteTrackStatus[i].ownerId === ownerId && trackType === "audio" && muted === false) {
          remoteTrackStatus[i].audio = true;
        }
        else if (remoteTrackStatus[i].ownerId === ownerId && trackType === "audio" && muted === true) {
          remoteTrackStatus[i].audio = false;
        }
        else if (remoteTrackStatus[i].ownerId === ownerId && trackType === "video" && muted === false) {
          remoteTrackStatus[i].video = true;
        }
        else if (remoteTrackStatus[i].ownerId === ownerId && trackType === "video" && muted === true) {
          remoteTrackStatus[i].video = false;
        }
      }
    },
    // videoTrackMuteChanged(state, track) {
    //   let ownerId = track.ownerEndpointId;
    //   let trackType = track.type;
    //   let muted = track.muted;
    //   let remoteTrackStatus = state.remoteTrackStatus;
    //   for (let i = 0; i < remoteTrackStatus.length; i++) {
    //     if (remoteTrackStatus[i].ownerId === ownerId && trackType === "video" && muted === false) {
    //       remoteTrackStatus[i].audio = true;
    //     }
    //     if (remoteTrackStatus[i].ownerId === ownerId && trackType === "video" && muted === true) {
    //       remoteTrackStatus[i].audio = false;
    //     }
    //   }
    // },
    addLocalTrackId(state, id) {
      if (state.localTrackId !== id) {
        state.localTrackId=id
        state.allId.push(id)
      }
    },
    addAllId(state, id) {
      if (!state.allId[id]) {
        state.allId.push(id)
      }
    },
    addParticipantId(state, participant) {
      if (!state.participantId[participant]) {
        state.participantId.push(participant)
        state.allId.push(participant)
      }
    },
    removeParticipantId(state, participant) {
      const participantId = state.participantId;
      const remoteTrackStatus = state.remoteTrackStatus;
      for (let i = 0; i < participantId.length; i++) {
        if (participantId[i] === participant) {
          participantId.splice(i, 1)
        }
      }
      delete remoteTrackStatus[participant]
      if (state.dominantSpeaker === participant) {
        if (state.selectedComponent === participant) {
          console.log("Left user unpined");
          // this.unpinParticipant();
          state.presentMode = false;
          state.selectedComponent = null;
          state.dominantSpeaker = state.localTrackId;
        }
        else {
          state.dominantSpeaker = state.localTrackId;
        }
      }
    },
    updateParticipantCount(state) {
      const allId = state.allId;
      state.participantCount = allId.length;
    },
    checkRemoteTrackStatus(state, id) {
      const remoteTrackStatus = state.remoteTrackStatus;
      if (remoteTrackStatus.length === 0 || remoteTrackStatus.ownerId !== id) {
        const newStatus = {
          "ownerId":id,
          "video":false,
          "audio":false
        }
        remoteTrackStatus.push(newStatus)
      }
    },
    addAvailableDevices(state, devices) {
      state.deviceList= {
        audioInput:[],
        audioOutput:[],
        videoInput:[]
      };
      for (let i = 0; i < devices.length; i++) {
        // if (state.deviceList === undefined || state.deviceList.length == 0) {
        //   state.deviceList= {
        //     audioInput:[],
        //     audioOutput:[],
        //     videoInput:[]
        //   };
        // }
        if (devices[i].kind === 'audioinput') {
          const deviceList = {
            'deviceLable': devices[i].label,
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.deviceList.audioInput.push(deviceList)
        }
        if (devices[i].kind === 'audiooutput') {
          const deviceList = {
            'deviceLable': devices[i].label,
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.deviceList.audioOutput.push(deviceList)
        }
        if (devices[i].kind === 'videoinput') {
          const deviceList = {
            'deviceLable': devices[i].label,
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.deviceList.videoInput.push(deviceList)
        }
        if (devices[i].kind === 'audioinput' && devices[i].deviceId === 'default') {
          const deviceList = {
            'deviceLable': devices[i].label.substring('Default - '.length),
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.defaultDevice.audioInput.push(deviceList)
          // let deviceName = devices[i].label.substring('Communications - '.length);
          // let filteredAudioInput = state.deviceList.audioInput.filter(device => device.deviceLable === deviceName)
          // console.log("filteredAudioInput: " + state.deviceList.audioInput);
          // console.log("defaul audio input: " + filteredAudioInput);
          state.selectedDevice.audioInput = {
            'id': devices[i].deviceId,
            'name': devices[i].label,
          };
        }
        if (devices[i].kind === 'audiooutput' && devices[i].deviceId === 'default') {
          const deviceList = {
            'deviceLable': devices[i].label.substring('Default - '.length),
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.defaultDevice.audioOutput.push(deviceList)
          state.selectedDevice.audioOutput = {
            'id': devices[i].deviceId,
            'name': devices[i].label,
          };
        }
        if (devices[i].kind === 'videoinput') {
          const deviceList = {
            'deviceLable': devices[i].label,
            'deviceKind': devices[i].kind,
            'deviceId': devices[i].deviceId,
            'groupId': devices[i].groupId,
            'selected': false
          }
          state.defaultDevice.videoInput.push(deviceList)
          state.selectedDevice.videoInput = {
            'id': devices[i].deviceId,
            'name': devices[i].label,
          };
        }
      }
    },
    presenterCamera(state, track) {
      state.presenterTrack = track;
    },
    leaveRoom(state) {
      state.roomId=null;
      state.connectionEstablished=false;
      state.localAudioInit=false;
      state.localVideoInit=false;
      state.tracks=[];
      state.localTracks=[];
      state.localCamera=false;
      state.localCameraSetting=false;
      state.localAudio=false;
      state.remoteTracks=[];
      state.remoteTrackStatus=[];
      state.participantId=[];
      state.allId=[];
      state.deviceList= {
        audioInput:[],
        audioOutput:[],
        videoInput:[]
      };
      state.defaultDevice= {
        audioInput:[],
        audioOutput:[],
        videoInput:[]
      };
      state.selectedDevice= {
        audioInput:[],
        audioOutput:[],
        videoInput:[]
      };
      state.audioPopup= false;
      state.videoPopup= false;
      state.participantCount=0;
      state.speakerLayout= false;
      state.gridLayout= true;
      state.presentMode= false;
      state.presenters= [];
      state.dominantSpeaker= null;
      state.participantMenu= false;
      state.secondLocalTrack= false;
      state.selectedComponent= null;
      state.chatPopup= false;
      state.newMsg= false;
    },
    toggleLayout(state) {
      if (state.speakerLayout) {
        state.speakerLayout = false;
        state.gridLayout = true;
      }
      else {
        state.speakerLayout = true;
        state.gridLayout = false;
      }
    },
    presentMode(state, id) {
      state.speakerLayout = true;
      state.gridLayout = false;
      state.presentMode = true;
      state.dominantSpeaker = null;
      state.dominantSpeaker = id;
      state.selectedComponent = id;
      if (!state.presenters[id]) {
        state.presenters.push(id)
      }
    },
    presentModeOff(state, id) {
      state.presentMode = false;
      const presenters = state.presenters;
      for (let i = 0; i < presenters.length; i++) {
        if (presenters[i] === id) {
          console.log("Presenter ID removed: " + id);
          presenters.splice(i, 1);
        }
      }
      state.selectedComponent = null;
      state.dominantSpeaker = null;
      state.dominantSpeaker = id;
    },
    addDominantSpeaker(state, id) {
      if (!state.presentMode) {
        state.dominantSpeaker = id;
      }
      else if (state.presentMode) {
        console.log("%cPresent Mode is On", "color:red;font-size:15pt;");
      }
    },
    pinParticipant(state, id) {
      state.presentMode = true;
      state.selectedComponent = id;
      state.dominantSpeaker = id;
      state.speakerLayout = true;
      state.gridLayout = false;
    },
    unpinParticipant(state) {
      console.log("unpinParticipant triggered");
      state.presentMode = false;
      state.selectedComponent = null;
      // state.dominantSpeaker = state.localTrackId;
    },
    audioPopupToggle(state) {
      if (!state.audioPopup) {
        state.audioPopup = true;
        state.videoPopup = false;
      }
      else if (state.audioPopup) {
        state.audioPopup = false;
      }
    },
    videoPopupToggle(state) {
      if (!state.videoPopup) {
        state.audioPopup = false;
        state.videoPopup = true;
      }
      else if (state.videoPopup) {
        state.videoPopup = false;
      }
    },
    closeAllPopup(state) {
      state.audioPopup = false;
      state.videoPopup = false;
    },
    toggleSecondLocalTrack(state) {
      if (state.secondLocalTrack) {
        state.secondLocalTrack = false;
      }
      else {
        state.secondLocalTrack = true;
      }
    },
    toggleChatPopup(state) {
      if (state.chatPopup) {
        state.chatPopup = false;
      }
      else {
        state.chatPopup = true;
      }
    },
    newMsg(state, msg) {
      state.msg.push(msg);
    }
  };
  
  export default {
    state,
    getters,
    mutations
  };
  