<template>
  <div class="tracksContainer" id="tracksContainer" @click="recalculateLayout">
    <div class="tracksWrapper" id="tracksWrapper">
      <LocalTracks
      class="track"
      ref="localTrack"
      :room="room" />
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
</template>

<script>
import LocalTracks from '@/components/LocalTracks.vue';
import RemoteTracks from '@/components/RemoteTracks.vue';
export default {
  name: 'GridLayout',
  props: {
    remoteTracksId: Array,
    room: Object,
    currentPage: Boolean
  },
  components: {
    LocalTracks,
    RemoteTracks
  },
  data() {
    return {
      localTracks: []
      // remoteTracksId: []
    }
  },
  methods: {
    recalculateLayout() {
      console.log("%cLayout Recalculated","color:green;font-size:15pt;");
      const video = document.getElementsByTagName("video").length;
      // let otherVideo = video - 1;
      // console.log("%cVideo length: " + video,"color:orange;font-size:15pt;");
      const tracksWrapper = document.getElementById("tracksWrapper");
      const aspectRatio = 16 / 9;
      const trackDiv = document.getElementById('tracksContainer');
      const screenWidth = trackDiv.getBoundingClientRect().width;
      const screenHeight = trackDiv.getBoundingClientRect().height;
      const videoCount = video;
      // const videoCount = this.secondLocalTrack ? otherVideo : video;

      function calculateLayout(containerWidth, containerHeight, videoCount, aspectRatio) {
      const _loopIt = 0;

      const bestLayout = {
        area: 0,
        cols: 0,
        rows: 0,
        width: 0,
        height: 0
      };

      for (let cols_1 = 1; cols_1 <= videoCount; cols_1++) {
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
        width = _a.width - "14",
        height = _a.height,
        cols = _a.cols;
      tracksWrapper.style.setProperty("--width", width + "px");
      tracksWrapper.style.setProperty("--height", height + "px");
      tracksWrapper.style.setProperty("--cols", cols + "");
    },
    watchResize() {
      window.addEventListener('resize', this.recalculateLayout);
      console.log("Window Resized!");
    },
    removeWatchResize() {
      window.removeEventListener('resize', this.recalculateLayout);
      console.log("Removed GridLayout Resize Listener!");
    },
  },
  mounted() {
    setTimeout(() => {
      this.recalculateLayout();
    }, 350);
    this.recalculateLayout()
    this.watchResize()
  },
  computed: {
    speakerLayout() {
      return this.$store.getters.getSpeakerLayout;
    },
    gridLayout() {
      return this.$store.getters.getGridLayout;
    },
  },
  // watch: {
  //   currentPage(newVal, oldVal) {
  //     if (newVal !== oldVal) {
  //       setTimeout(() => {
  //         this.recalculateLayout();
  //       }, 510);
  //     }
  //   },
  // },
  beforeDestroy() {
    this.removeWatchResize()
  },
}
</script>

<style scoped>
  .tracksContainer {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  #tracksWrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    max-width: calc(var(--width) * var(--cols));
  }
  .track {
    width: var(--width);
    height: var(--height);
  }
</style>
