<template>
  <div class="audioPopupWrapper">
    <div class="audioInputPopup" id="audioPopup">
      <div class="topMargin">
      </div>
      <div class="scrollWrapper">
        <div class="optionWrapper">
          <div class="audioInputOption">
            <p>Select Microphone</p>
            <label class="optionLable" v-for="device in this.getAudioInputDevice" :key="device.deviceId">
              <input type="radio" name="audioInput"
              v-model="selectedAudioInput"
              :value="{id: device.deviceId, name: device.deviceLable}"
              @change="audioInputSelector">
              <p>{{ device.deviceLable }}</p>
              <span class="audioInputCheckmark checkmark"></span>
            </label>
          </div>
          <div class="audioOutputOption">
            <p>Select Speaker</p>
            <label class="optionLable" v-for="device in this.getAudioOutputDevice" :key="device.deviceId">
              <input type="radio" name="audioOutput"
              v-model="selectedAudioOutput"
              :value="{id: device.deviceId, name: device.deviceLable}"
              @change="audioOutputSelector">
              <p>{{ device.deviceLable }}</p>
              <span class="audioOutputCheckmark checkmark"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="bottomMargin">
      </div>
    </div>
  </div>
</template>

<script>
import JitsiMeetJS from '@lyno/lib-jitsi-meet';
export default {
  name: 'AudioPopup',
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
    checkDefaultAudioDevice() {
      console.log('Check Default Function Exacuted');
      const selectedAudioInput = this.getSelectedAudioInput;
      this.selectedAudioInput = {id: selectedAudioInput.id, name: selectedAudioInput.name};
      const selectedAudioOutput = this.getSelectedAudioOutput;
      this.selectedAudioOutput = {id: selectedAudioOutput.id, name: selectedAudioOutput.name};
    },
    audioOutputSelector() {
      this.$store.state.spaceon.selectedDevice.audioOutput = {
        'id': this.selectedAudioOutput.id,
        'name': this.selectedAudioOutput.name,
      };
      console.log("!!Return Checkbox: " + this.selectedAudioOutput);
      const selectedAudioOutput = this.selectedAudioOutput.name;
      console.log("!!Return Audio Output is: " + this.selectedAudioOutput.name);
      JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        for (let i = 0; i < devices.length; i++) {
          if (devices[i].label === selectedAudioOutput) {
            JitsiMeetJS.mediaDevices.setAudioOutputDevice(devices[i].deviceId);
            console.log("!!Return Audio Output is: " + devices[i].deviceId);
          }
        }
      })
      this.$store.state.spaceon.audioPopup = false;
    },
    audioInputSelector() {
      this.$store.state.spaceon.selectedDevice.audioInput = {
        'id': this.selectedAudioInput.id,
        'name': this.selectedAudioInput.name,
      };
      const localTracks = this.$store.getters.getLocalTracks;
      for (let i = 0; i < localTracks.length; i++) {
        if (localTracks[i].type === 'audio') {
          localTracks[i].dispose();
          this.$store.state.spaceon.localTracks.splice(i, 1);
        }
      }
      const selectedAudioInput = this.selectedAudioInput.id;
      console.log("!!Return Audio Input is: " + selectedAudioInput);
      const option = {
        devices: ['audio'],
        micDeviceId: `${this.selectedAudioInput.id}`
      }
      JitsiMeetJS.createLocalTracks(option)
      .then(track => {
        // this.localTracks.push(track)
        this.$store.commit('addLocalTracks', track[0])
        this.room.addTrack(track[0]);
      })
      .catch(error => {
          throw error;
      });
      this.$store.state.spaceon.audioPopup = false;
    },
  },
  computed: {
    getSelectedAudioInput() {
      return this.$store.getters.getSelectedAudioInput;
    },
    getSelectedAudioOutput() {
      return this.$store.getters.getSelectedAudioOutput;
    },
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
  watch: {
    getDefaultAudioInput() {
      this.checkDefaultAudioDevice()
      console.log("Watch Default Device Change!");
    },
  },
  mounted() {
    this.checkDefaultAudioDevice()
    // if (this.$store.state.audioPopupFirstTime) {
    //   this.checkDefaultAudioDevice()
    //   this.$store.state.audioPopupFirstTime = false;
    // }

  }
}
</script>

<style scoped>
.audioPopupWrapper {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  z-index: 100;

}

.audioInputPopup {
  grid-column: 1/2;
  grid-row: 1/2;
  display: grid;
  background-color: #2C2C2C;
  justify-self: start;
  align-self: end;
  z-index: 150;
  border-radius: 1.8em;
  position: relative;
  max-height: 80%;
  overflow: hidden;
}
.topMargin {
  height: 0.5rem;
}

.scrollWrapper {
  height: 100%;
  width: 90%;
  overflow-y: scroll;
  justify-self: center;
}
.optionWrapper {
  height: 130%;
  width: 100%;
  justify-self: center;
  /* overflow-y: auto; */
}

::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar-track-piece:end {
  background: transparent !important;
  margin-bottom: 20% !important;
}

::-webkit-scrollbar-track-piece:start {
  background: transparent !important;
  margin-top: 20% !important;
}

/* .scrollWrapper::-webkit-scrollbar-thumb {
  background-color: red !important;
  border-right: none !important;
  border-left: none !important;
}
.scrollWrapper::-webkit-scrollbar-track {
  height: 60% !important;
  background-color: red !important;
}

.scrollWrapper::-webkit-scrollbar-track-piece:end {
  background: transparent !important;
  margin-bottom: 10% !important;
}

.scrollWrapper::-webkit-scrollbar-track-piece:start {
  background: transparent !important;
  margin-top: 10% !important;
} */
.audioInputPopup label {
  font-size: 11pt;
  color: white;
  padding: 12px 5%;
  text-decoration: none;
  display: grid;
  text-align: left;
  grid-template-columns: 10% 90%;
}
.audioInputPopup label p {
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
.audioInputPopup input {
  grid-column: 2/3;
  align-self: center;
}
.audioInputPopup input[type="radio"] {
  display: none;
}
.audioInputPopup label:before {
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
.audioInputOption input:checked ~ .audioInputCheckmark {
  display: block;
}
.audioOutputOption input:checked ~ .audioOutputCheckmark {
  display: block;
}
.audioInputPopup p {
  font-size: 14pt;
  font-weight: bold;
  color: #fff;
  text-align: left;
  margin: 8% 0 2% 7%;
}
</style>
