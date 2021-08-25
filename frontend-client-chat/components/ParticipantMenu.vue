<template>
  <div class="participantMenuWrapper" id="participantMenuWrapper">
    <div class="muteParticipant menuItem" @click="muteParticipant">
      <img src="~/static/img/mic.svg">
      <div class="menuText">
        <p>Mute user</p>
      </div>
    </div>
    <div class="participantCameraOff menuItem">
      <img src="~/static/img/camera.svg">
      <div class="menuText">
        <p>Turn off camera</p>
      </div>
    </div>
    <div class="makeHost menuItem" @click="grantModerator">
      <img src="~/static/img/star_icon.svg">
      <div class="menuText">
        <p>Make host</p>
      </div>
    </div>
    <div class="kickParticipant menuItem" @click="kickParticipant">
      <img src="~/static/img/exit_icon.svg">
      <div class="menuText">
        <p>Kick out</p>
      </div>
    </div>
    <div class="messageParticipant menuItem">
      <img src="~/static/img/chat.svg">
      <div class="menuText">
        <p>Send a private chat</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ParticipantMenu",
  data() {
    return {
    }
  },
  props: {
    id: String,
    room: Object
  },
  methods: {
    kickParticipant() {
      this.room.kickParticipant(this.id)
    },
    muteParticipant() {
      this.room.muteParticipant(this.id)
    },
    grantModerator() {
      this.room.grantOwner(this.id)
      this.$store.state.moderator = false;
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  // destroyed() {
  //   this.$parent.recalculateLayout()
  // }
}
</script>

<style scoped>
  .participantMenuWrapper {
    height: 100%;
    width: 100%;
    background-color: #141313;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 2.5% 19% 19% 19% 19% 19% 2.5%;
    border-radius: 30px;
  }
  .menuItem {
    display: grid;
    grid-template-columns: 5% 20% 5% 70%;
    grid-template-rows: auto;
    cursor: pointer;
  }
  .menuItem img {
    grid-column: 2/3;
    grid-row: 1/2;
    height: 50%;
    width: 50%;
    align-self: center;
    justify-self: center;

  }
  .menuText {
    grid-column: 4/5;
    grid-row: 1/2;
    color: white;
    text-align: left;
    align-self: center;
    font-size: 120%;
    font-weight: bold;
  }
  .muteParticipant {
    grid-column: 1/2;
    grid-row: 2/3;
  }
  .participantCameraOff {
    grid-column: 1/2;
    grid-row: 3/4;
  }
  .makeHost {
    grid-column: 1/2;
    grid-row: 4/5;
  }
  .kickParticipant {
    grid-column: 1/2;
    grid-row: 5/6;
  }
  .messageParticipant {
    grid-column: 1/2;
    grid-row: 6/7;
  }
  .disable {
    opacity: 0.4;
  }
</style>
