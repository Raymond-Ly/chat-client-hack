<template>
  <div class="videoPopupWrapper">
    <div class="videoInputPopup" id="videoInputPopup">
      <p>Select Camera</p>
      <label class="optionLable" v-for="device in this.getVideoInputDevice" :key="device.deviceId">
        <input type="radio" name="cameraInput"
        v-model="selectedVideoInput"
        :value="{id: device.deviceId, name: device.deviceLable}"
        @change="videoInputSelector">
        <p>{{ device.deviceLable }}</p>
        <span class="videoInputCheckmark checkmark"></span>
      </label>
    </div>
  </div>
</template>

<script>
import JitsiMeetJS from '@lyno/lib-jitsi-meet';
export default {
  name: 'VideoPopup',
  props: {
    room: Object,
  },
  data() {
    return {
      loaded: false,
      selectedAudioInput: [],
      selectedAudioOutput: [],
      selectedVideoInput: [],
    }
  },
  methods: {
    checkDefaultVideoDevice() {
      console.log('Check Selected Video Input Exacuted');
      let selectedVideoInput = this.getSelectedVideoInput;
      this.selectedVideoInput = {id: selectedVideoInput.id, name: selectedVideoInput.name};
      //Video Input:
      // let defaultVideoInput = this.getDefaultVideoInput[0].deviceLable;
      // let filteredVideoInput = this.getVideoInputDevice.filter(device => device.deviceLable === defaultVideoInput)
      // let VideoInputDevice = filteredVideoInput[0];
      // this.selectedVideoInput = {id: VideoInputDevice.deviceId, name: VideoInputDevice.deviceLable};
    },
    videoInputSelector() {
      this.$store.state.selectedDevice.videoInput = {
        'id': this.selectedVideoInput.id,
        'name': this.selectedVideoInput.name,
      };
      let localTracks = this.$store.getters.getLocalTracks;
      for (var i = 0; i < localTracks.length; i++) {
        if (localTracks[i].type === 'video') {
          localTracks[i].dispose();
          this.$store.state.localTracks.splice(i, 1);
        }
      }
      const selectedVideoInput = this.selectedVideoInput.id;
      console.log("!!Return Video Input is: " + selectedVideoInput);
      const option = {
        devices: ['video'],
        cameraDeviceId: `${this.selectedVideoInput.id}`,
        resolution: 1080,
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
      };
      JitsiMeetJS.createLocalTracks(option)
      .then(track => {
        track.forEach(track => {
          this.$store.commit('addLocalTracks', track)
          this.room.addTrack(track);
        })
      })
      .catch(error => {
          throw error;
      });
      this.$store.state.videoInputPopup = false;
    },
  },
  computed: {
    getSelectedVideoInput() {
      return this.$store.getters.getSelectedVideoInput;
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
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
    getLocalTrackId() {
      return this.$store.getters.getLocalTrackId;
    },
  },
  // watch: {
  //   getDefaultAudioInput() {
  //     this.checkDefaultVideoDevice()
  //     console.log("Watch Default Device Change!");
  //   },
  // },
  mounted() {
    this.checkDefaultVideoDevice()
  }
}
</script>

<style scoped>
.videoPopupWrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  z-index: 100;
}
.videoInputPopup {
  grid-column: 1/2;
  grid-row: 1/2;
  display: block;
  background-color: #2C2C2C;
  justify-self: start;
  align-self: end;
  z-index: 100;
  border-radius: 1.8em;
  margin-bottom: 10px;
}
.videoInputPopup label {
  font-size: 11pt;
  color: white;
  padding: 12px 10%;
  text-decoration: none;
  display: grid;
  text-align: left;
  grid-template-columns: 10% 90%;
  margin-bottom: 5%;
}
.videoInputPopup label:before {
  /*styles outer circle*/
  grid-column: 1/2;
  grid-row: 1/2;
  align-self: center;
  justify-self: center;
  content: " ";
  display: inline-block;
  position: relative;
  /* margin: 0 5px 0 0; */
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 2px solid #3BC146;
  background-color: transparent;
  z-index: 0;
}
.videoInputPopup label p {
  grid-column: 2/3;
  font-size: 11pt;
  color: white;
  align-self: center;
  padding: 10px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.videoInputPopup input {
  grid-column: 2/3;
  align-self: center;
}
.videoInputPopup input[type="radio"] {
  display: none;
}
.videoInputPopup label:before {
  /*styles outer circle*/
  grid-column: 1/2;
  grid-row: 1/2;
  align-self: center;
  justify-self: center;
  content: " ";
  display: inline-block;
  position: relative;
  /* margin: 0 5px 0 0; */
  width: 20px;
  height: 20px;
  border-radius: 11px;
  border: 2px solid #3BC146;
  background-color: transparent;
  z-index: 0;
}
.checkmark {
  grid-column: 1/2;
  grid-row: 1/2;
  border-radius: 11px;
  width: 12px;
  height: 12px;
  align-self: center;
  justify-self: center;
  background-color: #3BC146;
  display: none;
  z-index: 5;
}
.videoInputPopup input:checked ~ .videoInputCheckmark {
  display: block;
}
.videoInputPopup p {
  font-size: 14pt;
  font-weight: bold;
  color: #fff;
  text-align: left;
  margin: 9% 0 2% 10%;
}
</style>
