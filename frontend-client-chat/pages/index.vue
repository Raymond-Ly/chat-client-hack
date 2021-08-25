<template>
  <div class="main">
    <div class="title">
      <img class="logo" src="~/static/itechlogo-en.svg" alt="logo">
    </div>
    <div class="buttonWrapper">
      <button type="button" name="enter" class="iframeJitsiBtn" @click="enterBtn">ENTER</button>
    </div>
    <div id="popup" class="popup hidden">
      <label ref="roomNametxt" for="roomName">Room Name</label>
      <label ref="userNametxt" class="userNametxt hidden" for="userName">What is your name?</label>
      <div id="closeBtn" class="closeBtn" @click="closePopup">
        <img src="~/static/icons/close_btn.svg">
      </div>
      <input id="roomName" ref="roomNameInput" v-model="roomName" class="roomNameInput" type="text" name="roomName" @keyup.enter="next">
      <input id="userName" ref="userNameInput" v-model="userName" class="userNameInput hidden" type="text" name="userName" @keyup.enter="letMeIn">
      <button id="nextBtn" ref="nextBtn" class="nextBtn" type="button" name="next" @click="next">Next</button>
      <button id="letMeIn" ref="letMeInBtn" class="letMeInBtn hidden" type="button" name="enter" @click="letMeIn">Let Me In</button>
    </div>
    <div id="errorPoup" class="errorPoup hidden">
      <img src="~/static/icons/error_icon.svg">
      <p>Wrong!</p>
      <div class="popupButtonWrapper">
        <button class="tryBtn" type="button" name="try" @click="enterBtn">Try Again</button>
        <button class="giveUpBtn" type="button" name="try" @click="giveUp">I Give Up</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      roomName: null,
      userName: null
    }
  },
  methods: {
    enterBtn() {
      document.getElementById('popup').classList.remove('hidden')
      document.getElementById('errorPoup').classList.add('hidden')
      document.getElementById('roomName').value='';
      // this.enterKeyListener()
    },
    closePopup() {
      document.getElementById('popup').classList.add('hidden')
      this.$refs.roomNametxt.classList.remove('hidden');
      this.$refs.userNametxt.classList.add('hidden');
      this.$refs.roomNameInput.classList.remove('hidden');
      this.$refs.userNameInput.classList.add('hidden');
      this.$refs.nextBtn.classList.remove('hidden');
      this.$refs.letMeInBtn.classList.add('hidden');
    },
    next() {
      // const enteredValue = this.roomName;
      this.$store.commit('updateRoomId', this.roomName)
      this.$refs.roomNametxt.classList.add('hidden');
      this.$refs.userNametxt.classList.remove('hidden');
      this.$refs.roomNameInput.classList.add('hidden');
      this.$refs.userNameInput.classList.remove('hidden');
      this.$refs.nextBtn.classList.add('hidden');
      this.$refs.letMeInBtn.classList.remove('hidden');
    },
    letMeIn() {
      this.$store.commit('updateUserName', this.userName);
      this.$router.push('/chat-room');
    },
    enterKeyListener() {
      const letMeIn = document.getElementById('letMeIn');
      const roomName = document.getElementById('roomName');
      roomName.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          letMeIn.click();
        }
      })
    },
    giveUp() {
      document.getElementById('popup').classList.add('hidden')
      document.getElementById('errorPoup').classList.add('hidden')
    }
  },
}
</script>

<style scoped>
  .main {
    align-self: center;
    display: grid;
    background-color: #4b2cff;
    height: 1000px;
  }

  .title {
    padding-bottom: 188px;
    grid-column: 1/2;
    grid-row: 1/2;
    color: black;
    font-size: 50pt;
    font-weight: bold;
    text-align: center;
    align-self: flex-end;
  }

  .logo {
    width: 30%;
  }
  .buttonWrapper {
    margin-top: 24px;
    grid-column: 1/2;
    grid-row: 2/3;
    display: grid;
    grid-template-columns: auto auto;
    align-self: center;
  }
  button {
    width: 300px;
    height: 80px;
    font-size: 24pt;
    border-radius: 80px;
    font-weight: bold;
    border-style: solid;
    border-color: #fff;
    background-color: #fff;
    color: black;
    cursor: pointer;
    border-width: 3px;
    transition: 0.4s ease-in-out;
  }
  button:hover {
    border-color: black;
    background-color: black;
    color: white;
    transition: 0.4s ease-in-out;
  }
  .iframeJitsiBtn {
    grid-column: 1/2;
    justify-self: end;
    margin-right: 10px;
  }
  .customJitsiBtn {
    grid-column: 2/3;
    justify-self: start;
    margin-left: 10px;
  }
  .popup {
    grid-column: 1/2;
    grid-row: 1/4;
    width: 50%;
    height: 40%;
    align-self: center;
    justify-self: center;
    background-color: #2C2C2C;
    border-radius: 2em;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 30% 40% 30%;
    z-index: 50;
  }
  .popup label {
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: flex-end;
    justify-self: center;
    color: white;
    font-size: 24pt;
    font-weight: bold;
  }
  .closeBtn {
    grid-column: 1/2;
    grid-row: 1/2;
    z-index: 5;
    align-self: flex-start;
    justify-self: end;
    margin: 3.5% 3.5%;
    cursor: pointer;
  }
  .popup input {
    grid-column: 1/2;
    grid-row: 2/3;
    width: 50%;
    height: 50px;
    align-self: center;
    justify-self: center;
    font-size: 18pt;
    font-weight: bold;
    text-align: center;
    background-color: black;
    color: white;
    border-radius: 4em;
    border-style: none;
  }
  .popup button {
    grid-column: 1/2;
    grid-row: 3/4;
    width: 200px;
    height: 50px;
    align-self: center;
    justify-self: center;
    margin-bottom: 5%;
    font-size: 18pt;
    background-color: #3BC146;
    border-color: #3BC146;
    color: white;
  }
  .errorPoup {
    grid-column: 1/2;
    grid-row: 1/4;
    width: 40%;
    height: 40%;
    align-self: center;
    justify-self: center;
    background-color: #2C2C2C;
    border-radius: 2em;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 50% 20% 30%;
    z-index: 100;
  }
  .errorPoup img {
    grid-column: 1/2;
    grid-row: 1/2;
    height: 60%;
    align-self: center;
    justify-self: center;
  }
  .errorPoup p {
    grid-column: 1/2;
    grid-row: 2/3;
    align-self: center;
    justify-self: center;
    color: white;
    font-size: 24pt;
    font-weight: bold;
    padding: 0;
    margin: 0;
  }
  .popupButtonWrapper {
    grid-column: 1/2;
    grid-row: 3/4;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto
  }
  .popupButtonWrapper button {
    width: 60%;
    height: 40%;
    font-size: 17pt;
  }
  .tryBtn {
    grid-column: 1/2;
    grid-row: 1/2;
    align-self: center;
    justify-self: end;
    margin-right: 5%;
    background-color: #3BC146;
    border-color: #3BC146;
    color: white;
  }
  .giveUpBtn {
    grid-column: 2/3;
    grid-row: 1/2;
    align-self: center;
    justify-self: start;
    margin-left: 5%;
    background-color: #FF3746;
    border-color: #FF3746;
    color: white;
  }
  .hidden {
    display: none;
  }
</style>
