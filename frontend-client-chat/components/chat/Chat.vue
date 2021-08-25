<template>
  <div ref="chatWrapper" class="chatWrapper vhidden">
    <div class="closeBtnWrapper">
      <img class="closeBtn" src="~/static/icons/close_btn.svg" @click="closeBtn">
    </div>
    <div class="msgContainer">
      <div ref="msgWrapper" class="msgWrapper">
        <ReceivedMsg
          v-for="(msg, index) in msgs"
          ref="receivedMsg"
          :key="index"
          class="receivedMsg"
          :msg="msg"
          :room="room"
        />
      </div>
    </div>
    <VEmojiPicker v-show="emojiPickerPopup && hasMounted" class="emojiPicker" @select="selectEmoji" />
    <div class="msgInputWrapper">
      <textarea ref="msgInput" v-model="msgInput" class="msgInput" @keyup.enter="sendBtn" />
      <div class="msgInputBtns">
        <div class="sendBtnBg">
        </div>
        <img class="sendBtn" src="~/static/icons/send_btn.svg" @click="sendBtn">
        <div class="emojiBtnBg">
        </div>
        <img class="emojiBtn" src="~/static/icons/emoji_btn.svg" @click="emojiPopup">
      </div>
    </div>
  </div>
</template>

<script>
import { VEmojiPicker } from 'v-emoji-picker';
import ReceivedMsg from '@/components/chat/ReceivedMsg.vue';

export default {
  name: "Chat",
  components: {
    ReceivedMsg,
    VEmojiPicker
  },
  props: {
    room: {
      type: Object,
      default: null
    },
    msgs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hasMounted: false,
      msgInput: "",
      emojiPickerPopup: false
    }
  },
  computed: {
    msgArray() {
      return this.$store.getters.getMsg;
    },
    chatPopup() {
      return this.$store.getters.getChatPopup;
    },
  },
  watch: {
    msgArray() {
      setTimeout(() => {
        const chat = this.$refs.msgWrapper;
        chat.scrollTop = chat.scrollHeight;
      },50)
    },
    chatPopup() {
      if (this.chatPopup) {
        setTimeout(() => {
          const chat = this.$refs.msgWrapper;
          chat.scrollTop = chat.scrollHeight;
          this.$refs.msgInput.focus();
        },50)
      }
      else {
        this.emojiPickerPopup = false;
      }
    }
  },
  mounted() {
    this.hasMounted = true
    this.$refs.chatWrapper.classList.remove("vhidden");
  },
  beforeDestroy() {
  },
  methods: {
    closeBtn () {
      this.$store.commit("toggleChatPopup");
    },
    sendBtn() {
      this.room.sendTextMessage(this.msgInput);
      this.msgInput = "";
      this.$refs.msgInput.value="";
    },
    selectEmoji(emoji) {
      this.msgInput += emoji.data;
      this.emojiPickerPopup = false;
      this.$refs.msgInput.focus();
    },
    emojiPopup() {
      if (!this.emojiPickerPopup) {
        this.emojiPickerPopup = true;
      }
      else {
        this.emojiPickerPopup = false;
      }
    }
  },
}
</script>

<style scoped>
  .chatWrapper {
    height: 100%;
    width: 300px;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 6% 82% 10% 2%;
    background-color: #141313;
    transition: 0.5s ease-in-out;
    opacity: 1;
  }
  .closeBtnWrapper {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 93% 7%;
    grid-template-rows: 7% 86% 7%;
  }
  .closeBtn {
    grid-column: 1/2;
    grid-row: 2/3;
    height: 19px;
    width: 19px;
    justify-self: end;
    align-self: center;
    cursor: pointer;
  }
  .msgContainer {
    grid-column: 1/2;
    grid-row: 2/3;
    display: grid;
    grid-template-columns: 4% 92% 4%;
    grid-template-rows: 100%;
  }
  .msgWrapper {
    grid-column: 2/3;
    grid-row: 1/2;
    display: flex;
    align-items: flex-start;
    /* justify-content: center; */
    flex-direction: column;
    overflow-y: auto;
    padding-bottom: 6%;
    transition: 0.3s ease-in-out;
  }
  .sender {
    grid-column: 1/2;
    grid-row: 1/2;
    color: white;
    font-size: 8pt;
    margin: 10px;
    align-self: center;
  }
  .msg {
    grid-column: 1/2;
    grid-row: 2/3;
    color: white;
    font-size: 12pt;
    align-self: center;
    padding: 10px;
    background: #2C2C2C;
    border-radius: 0 0.8em 0.8em 0.8em;
  }
  .emojiPicker {
    grid-column: 1/2;
    grid-row: 2/3;
    max-height: 70%;
    width: 80%;
    align-self: end;
    margin-bottom: 5%;
    z-index: 100;
  }
  .msgInputWrapper {
    grid-column: 1/2;
    grid-row: 3/4;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 4% 71% 25%;
    grid-template-rows: 100%;
  }
  .msgInput {
    grid-column: 2/3;
    grid-row: 1/2;
    height: 78%;
    width: 88%;
    justify-self: center;
    align-self: center;
    border-radius: 0.9em;
    border-style: none;
    resize: none;
    padding: 5%;
    font-size: 12pt;
  }
  ::-webkit-scrollbar {
    display: none;
  }
  .msgInputBtns {
    grid-column: 3/4;
    grid-row: 1/2;
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: 50% 50%;
  }
  .sendBtn {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 20px;
    width: 20px;
    justify-self: center;
    align-self: center;
    cursor: pointer;
    z-index: 5;
  }
  .sendBtnBg {
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: center;
    justify-self: center;
    height: 2px;
    width: 2px;
    z-index: 0;
    background-color: #2C2C2C;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .emojiBtn {
    grid-column: 1/2;
    grid-row: 2/3;
    height: 20px;
    width: 20px;
    justify-self: center;
    align-self: center;
    cursor: pointer;
    z-index: 5;
  }
  .emojiBtnBg {
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
    justify-self: center;
    height: 2px;
    width: 2px;
    z-index: 0;
    background-color: #2C2C2C;
    border-radius: 50%;
    transition: 0.3s ease-in-out;
    opacity: 0;
  }
  .msgInputWrapper:hover .sendBtnBg{
    opacity: 1;
    transform: scale(21, 21);
    -webkit-transform: scale(21, 21);
  }
  .msgInputWrapper:hover .emojiBtnBg{
    opacity: 1;
    transform: scale(21, 21);
    -webkit-transform: scale(21, 21);
  }
  .vhidden {
    opacity: 0;
  }
</style>
