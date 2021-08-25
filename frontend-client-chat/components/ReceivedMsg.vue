<template>
  <div class="receivedMsgContainer" ref="receivedMsgContainer">
    <div class="receivedMsgWrapper">
      <p class="sender" ref="sender">{{ displayName }}</p>
      <p class="msg" ref="msg">{{ msg.msg }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "ReceivedMsg",
  data() {
    return {
      displayName: null,
      incomingMsg: null
    }
  },
  props: {
    room: Object,
    msg: Object
  },
  methods: {
    getDisplayName() {
      let msgId = this.msg.id;
      let localId = this.$store.state.spaceon.localTrackId;
      if (msgId === localId) {
        this.displayName = this.usersName;
        this.$refs.sender.classList.add('localMsg');
        this.$refs.msg.classList.add('localMsg');
      }
      else {
        let displayName = this.room.getParticipantById(msgId);
        if (displayName._displayName === null || undefined) {
          this.displayName = "This is a random person";
        }
        else {
          this.displayName = displayName._displayName;
        }
        this.$refs.sender.classList.add('remoteMsg');
        this.$refs.msg.classList.add('remoteMsg');
      }
    },
    getMsg() {
      this.incomingMsg = this.msg.msg;
    }
  },
  computed: {
    ...mapGetters({
      currentUsersRoom: 'getCurrentUsersRoom',
      usersData: 'getCurrentUsersData',
      leaveMeetingBarHeight: 'getCurrentMeetingBarHeight'
    }),
    usersName() {
      return this.$store.getters.getUserName;
      // let name = '';
      // if (this.usersData) {
      //   name = `${this.usersData.firstName} ${this.usersData.lastName}`;
      // }
      // return name;
    },
  },
  watch: {

  },
  mounted() {
    this.getDisplayName();
    this.getMsg();
  },
}
</script>

<style scoped>
  .receivedMsgContainer {
    /* width: 100%; */
    width: 100%;
    max-height: 100%;
  }
  .receivedMsgWrapper {
    max-height: 100%;
    /* width: max-content; */
    display: flex;
    /* grid-template-columns: 100%;
    grid-template-rows: 30% 70%; */
    align-items: flex-start;
    /* justify-content: center; */
    flex-direction: column;
    overflow: hidden;
  }
  .sender {
    grid-column: 1/2;
    grid-row: 1/2;
    color: white;
    font-size: 8pt;
    margin: 10px 0 0 10px;
    /* align-self: flex-end; */
  }
  .msg {
    max-width: 250px;
    grid-column: 1/2;
    grid-row: 2/3;
    display: inline-block;
    color: white;
    font-size: 12pt;
    /* align-self: flex-end; */
    padding: 10px;
    background: #2C2C2C;
    border-radius: 0 0.8em 0.8em 0.8em;
    word-wrap: break-word;
    /* white-space: wrap; */
    /* overflow: hidden; */
    /* text-overflow: ; */
  }
  .localMsg {
    align-self: flex-end;
    border-radius: 0.8em 0 0.8em 0.8em;
  }
  .remoteMsg {
    align-self: flex-start;
  }
</style>
