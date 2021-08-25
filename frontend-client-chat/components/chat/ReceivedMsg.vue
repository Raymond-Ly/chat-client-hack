<template>
  <div ref="receivedMsgContainer" class="receivedMsgContainer">
    <div class="receivedMsgWrapper">
      <p ref="sender" class="sender">{{ displayName }}</p>
      <p ref="msg" class="msg">{{ msg.msg }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'ReceivedMsg',
  props: {
    room: {
      type: Object,
      default: null
    },
    msg: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      displayName: null,
      incomingMsg: null
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
    },
  },
  mounted() {
    this.getDisplayName();
    this.getMsg();
  },
  methods: {
    getDisplayName() {
      const msgId = this.msg.id;
      const localId = this.$store.state.spaceon.localTrackId;
      if (msgId === localId) {
        this.displayName = this.usersName;
        this.$refs.sender.classList.add('localMsg');
        this.$refs.msg.classList.add('localMsg');
      }
      else {
        const displayName = this.room.getParticipantById(msgId);
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
  }
}
</script>

<style scoped>
  .receivedMsgContainer {
    width: 100%;
    max-height: 100%;
  }
  .receivedMsgWrapper {
    max-height: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    overflow: hidden;
  }

  .sender {
    grid-column: 1/2;
    grid-row: 1/2;
    color: white;
    font-size: 8pt;
    margin: 10px 0 0 10px;
  }

  .msg {
    max-width: 250px;
    grid-column: 1/2;
    grid-row: 2/3;
    display: inline-block;
    color: white;
    font-size: 12pt;
    padding: 10px;
    background: #2C2C2C;
    border-radius: 0 0.8em 0.8em 0.8em;
    word-wrap: break-word;
  }
  .localMsg {
    align-self: flex-end;
    border-radius: 0.8em 0 0.8em 0.8em;
  }
  .remoteMsg {
    align-self: flex-start;
  }
</style>
