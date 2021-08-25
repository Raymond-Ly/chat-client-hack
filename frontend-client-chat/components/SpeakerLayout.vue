<template>
  <div class="tracksContainer" id="tracksContainer">
    <div class="tracksWrapper" id="tracksWrapper">
      <div class="speaker" id="speaker">
        <Speaker class="speakerTrack"
        id="speakerTrack"
        :room="room"
        ref="localTrack"
        />
      </div>
      <div class="otherTrack" id="otherTrack">
        <div class="otherTrackWrapper" id="otherTrackWrapper">
          <LocalTracks
          class="track"
          id="localTrack"
          ref="localTrack"
          :room="room"
          />
          <RemoteTracks
          class="track"
          v-for="(remoteTrack) in remoteTracksId"
          :key="remoteTrack"
          :id="remoteTrack"
          :room="room"
          ref="remoteTrack"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocalTracks from '@/components/LocalTracks.vue';
import RemoteTracks from '@/components/RemoteTracks.vue';
import Speaker from '@/components/Speaker.vue';
export default {
  name: 'SpeakerLayout',
  props: {
    remoteTracksId: Array,
    room: Object,
    // currentPage: Boolean
  },
  components: {
    LocalTracks,
    RemoteTracks,
    Speaker
  },
  data() {
    return {
      localTracks: [],
      render: false
    }
  },
  methods: {
    recalculateLayout() {
      console.log("%cLayout Recalculated","color:green;font-size:15pt;");
      const tracksWrapper = document.getElementById("otherTrack");
      const aspectRatio = 16 / 9;
      const trackDiv = document.getElementById('otherTrack');
      // const trackDiv = document.getElementById('tracksContainer');
      const screenWidth = trackDiv.getBoundingClientRect().width;
      const screenHeight = trackDiv.getBoundingClientRect().height;
      const videoCount = 1

      function calculateLayout(containerWidth, containerHeight, videoCount, aspectRatio) {
      var _loopIt = 0;

      var bestLayout = {
        area: 0,
        cols: 0,
        rows: 0,
        width: 0,
        height: 0
      };

      for (var cols_1 = 1; cols_1 <= videoCount; cols_1++) {
        if (_loopIt++ > 10001) {
          var csb_global = typeof window === 'undefined' ? self : window;
          csb_global.infiniteLoopError = new RangeError('Potential infinite loop: exceeded ' + 10001 + ' iterations. You can disable this check by creating a sandbox.config.json file.');
          throw csb_global.infiniteLoopError;
        }

        var rows = Math.ceil(videoCount / cols_1);
        var hScale = containerWidth / (cols_1 * aspectRatio);
        var vScale = containerHeight / rows;
        var width_1 = void 0;
        var height_1 = void 0;
        if (hScale <= vScale) {
          width_1 = Math.floor(containerWidth / cols_1);
          height_1 = Math.floor(width_1 / aspectRatio);
        } else {
          height_1 = Math.floor(containerHeight / rows);
          width_1 = Math.floor(height_1 * aspectRatio);
        }
        var area = width_1 * height_1;
        if (area > bestLayout.area) {
          bestLayout = {
            area: area,
              width: width_1,
              height: height_1,
              rows: rows,
              cols: cols_1
            };
          }
        }
      return bestLayout;
    }
    var _a = calculateLayout(screenWidth, screenHeight, videoCount, aspectRatio),
        width = _a.width - "15",
        height = _a.height,
        cols = _a.cols;
      tracksWrapper.style.setProperty("--width", width + "px");
      tracksWrapper.style.setProperty("--height", height + "px");
      tracksWrapper.style.setProperty("--cols", cols + "");
    },
    speakerRecalculateLayout() {
      const content = document.getElementById('speaker')
      const contentScreen = document.getElementById('speakerWrapper')
      const divWidth = content.getBoundingClientRect().width;
      const divHeight = content.getBoundingClientRect().height;
      const calHeight = Math.round((divWidth/16)*9);
      const calWidth = Math.round((divHeight/9)*16);
      console.log("Width: " + divWidth);
      console.log("Height: " + divHeight);
      console.log("CalWidth: " + calWidth);
      console.log("CalHeight: " + calHeight);
      if (divWidth >= divHeight) {
        if (calWidth > divWidth) {
          contentScreen.style.width = divWidth + "px";
          contentScreen.style.height = calHeight + "px";
        }
        else {
          contentScreen.style.width = calWidth + "px";
          contentScreen.style.height = divHeight + "px";
        }
      }
      else {
        if (calHeight > divHeight) {
          contentScreen.style.width = calWidth + "px";
          contentScreen.style.height = divHeight + "px";
        }
        else {
          contentScreen.style.width = divWidth + "px";
          contentScreen.style.height = calHeight + "px";
        }
      }
    },
    watchResize() {
      window.addEventListener('resize', this.recalculateLayout);
      window.addEventListener('resize', this.speakerRecalculateLayout);
      console.log("Window Resized!");
    },
    removeWatchResize() {
      window.removeEventListener('resize', this.recalculateLayout);
      window.removeEventListener('resize', this.speakerRecalculateLayout);
      console.log("Removed SpeakerLayout Resize Listener!");
    },
    watchDivResize() {
      const wrapperWidth = document.getElementById('localTrack').clientWidth;
      const wrapperHeight = document.getElementById('localTrack').clientHeight;
      console.log("Wrapper Width: " + wrapperWidth);
      console.log("Wrapper Height: " + wrapperHeight);
      this.$store.state.spaceon.trackDivWidth = wrapperWidth;
      // let userName = document.getElementById('userName');
      // if (wrapperWidth < 500) {
      //   userName.style.fontSize = "80%";
      // }
    }
  },
  mounted() {
    this.recalculateLayout()
    // this.speakerRecalculateLayout()
    this.watchResize()
    this.watchDivResize()
  },
  computed: {
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    }
  },
  watch: {
    speakerLayout() {
      console.log("Speaker Layout Initialed");
      this.watchDivResize()
    }
  },
  beforeDestroy() {
    this.removeWatchResize()
  },
}
</script>

<style scoped>
  ::-webkit-scrollbar {
    display: none;
  }
  .tracksContainer {
    margin: 0;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 100%;
    height: 100%;
    /* overflow: hidden; */
  }
  .tracksWrapper {
    display: grid;
    grid-template-columns: 83% 15% 2%;
    grid-template-rows: auto;
    align-self: start;
    justify-self: end;
    height: 100%;
    width: 100%;
  }
  /* #tracksWrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: calc(var(--width) * var(--cols));
  } */
  .speaker {
    grid-column: 1/2;
    grid-row: 1/2;
    /* display: flex;
    align-items: center;
    justify-content: center; */
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 1% 99%;
    grid-template-rows: 0.7% 98.3% 1%;
    align-self: center;
    justify-self: center;
  }
  /* .speakerWrapper {
    display: flex;
    justify-content: center;
    flex-flow: column wrap;
  } */
  .speakerTrack {
    grid-column: 2/3;
    grid-row: 2/3;
    height: 100%;
    width: 100%;

    /* width: var(--speakerWidth);
    height: var(--speakerHeight); */
    /* position: fixed; */
  }
  #otherTrackWrapper {
    display: flex;
    justify-content: center;
    flex-flow: column wrap;
    max-width: calc(var(--width) * var(--cols));
    /* position: fixed; */
    /* overflow-y: auto; */
    /* height: 100%; */
    /* z-index: 5; */
  }
  .otherTrack {
    grid-column: 2/3;
    grid-row: 1/2;
    /* height: 100%;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    flex-direction: row; */
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    /* height: 100%; */
  }
  .track {
    width: var(--width);
    height: var(--height);
  }

</style>
