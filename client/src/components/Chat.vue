<template>
  <div class="chat-container" v-drag="'.chat-handle'">
    <div id="chat" :class="{open}">
      <div id="chat-buttons">
        <button id="close-chat">
          <font-awesome-icon v-on:click="open = !open" icon="times-circle"></font-awesome-icon>
        </button>
        <font-awesome-icon class="chat-handle" icon="grip-lines"></font-awesome-icon>
      </div>
      <div class="users"></div>
      <ul id="messages" ref="msgs"></ul>
      <div id="new-messages" v-if="newMessages">
        <button id="scroll-to-bottom" @click="scrollToBottom()">
          <i class="fas fa-arrow-down"></i>
        </button>
        <span>New Messages</span>
      </div>
      <form ref="form" v-on:submit.prevent="send()">
        <input id="m" ref="msgInput" autocomplete="off" @keypress="keyWatcher()"/>
        <font-awesome-icon class="send-btn" icon="arrow-right" v-on:click="send()"></font-awesome-icon>
      </form>
    </div>
    <div class="closed" :class="{open}">
      <font-awesome-icon class="chat-handle" icon="grip-lines-vertical"></font-awesome-icon>
      <font-awesome-icon title="Settings" v-on:click="showModal()" icon="cog"></font-awesome-icon> <!-- tried to use "cogs", not sure why it isn't found -->
      <font-awesome-icon title="Browse Rooms" v-on:click="goToRooms()" icon="th-large"></font-awesome-icon>
      <font-awesome-icon title="Show Chat" v-on:click="open = !open" icon="comments"></font-awesome-icon>
      <font-awesome-icon title="Invite User" v-on:click.stop="showInviteDialog()" icon="user-plus" v-if="isAdmin"></font-awesome-icon>
    </div>
      <modal v-show="isModalVisible" @close="closeModal" :currentRoom="$route.params.roomId"/>
      <invite-code :roomId="$route.params.roomId" :dialog="inviteDialog" @close="closeInviteDialog()"/>      
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import SocketService from '../services/socket-io.service';
  import { Message } from '../services/socket-io.service';
  import Emoji from "./helpers/emoji";
  import { getTime } from '../plugins/time';
  import modal from "../components/SettingsModal.vue";
  import InviteCode from "./InviteCode.vue";
  import roomService from "../services/room.service";
  


  /** A component to make menus have consistant styling and be movable */
  @Component({
  components: {
    modal,
    InviteCode
  }
  })
  export default class Chat extends Vue {
    @Prop() creatorUsername!: string;
    [x: string]: any;
    private readonly emoji = new Emoji();

    public open = false;

    private lastMessage: Partial<Message> | Message = {};
    private currentlyScrolling = false;
    private newMessages = false;
    private isModalVisible = false;
    private inviteDialog = false;

    created() {
      SocketService.socket.on('chat-msg', (msg) => this.recieve(msg) );
    }

    tryUntilExists (test, func, ...args) {
      let int_ = undefined;
      const _try = () => {
        if (!test) return;
        clearInterval(int_);
        func(...args);
      };
      int_ = setInterval(_try, 120);
    }

    mounted() {
      SocketService.socket.on('chatHistory', (history) => this.tryUntilExists(this.$refs.msgs, (history) => {
        const messages = this.$refs.msgs as Element;
        messages.innerHTML = ''; // clear old just in case
        for(const message in history){
          this.recieve(history[message].message);
        }
      }, history));
    }

    goToRooms() {
      this.$router.push('/rooms');
    }

    send() {
      const msgInput = this.$refs.msgInput as HTMLInputElement;
      const msg = msgInput.value;
      if (msg === '') return;

      const m = SocketService.sendMsg(msg, this.$route.params.roomId);
      msgInput.value = '';

      this.$emit('message', m);
      this.onMessage(m);
    }

    scrollToBottom() {
      const messages = this.$refs.msgs as Element;
      //this.currentlyScrolling = true;
      this.newMessages = false;

      messages.scrollTop = messages.scrollHeight;
      // $("#messages").stop();
      // $("#messages").animate({ scrollTop: messages.scrollHeight }, 700, 'swing', ()=>this.currentlyScrolling=false);
    }

    //input msg object
    onMessage(obj: Message) {
      const { effect, from: id, time, msg } = obj;
      const { name, colour } = obj;
      const emojis = this.emoji.only(msg), sent = id === this.$store.state.auth.user.id;
      let ind;
      const c = [effect || '', sent ? 'sent' :'', emojis ? 'emojis' : ''].filter(x => !!x);

      //TODO: grab user list and update the name if needed?

      const messages = this.$refs.msgs as Element;
      const distfrombot = messages.scrollHeight - messages.scrollTop - messages.getBoundingClientRect().height;

      if (!sent && (!this.lastMessage || this.lastMessage.from !== id)) {
        const nameEl = document.createElement('span');
        nameEl.classList.add('name', ...c);
        nameEl.setAttribute('data-from', id);
        nameEl.innerText = name;
        nameEl.style.color = colour;
        messages.append(nameEl);
      }

      const msgEl = document.createElement('li');
      msgEl.classList.add(...c);
      msgEl.innerHTML = emojis ? msg.replace(/\s+/g, '') : msg;
      messages.append(msgEl);

      const timeEl = document.createElement('span');
      timeEl.classList.add('time', ...c);
      timeEl.innerText = time;
      messages.append(timeEl);

      this.lastMessage = obj;

      if ( !this.currentlyScrolling && distfrombot > messages.getBoundingClientRect().height / 2) // ask first
        this.newMessages = true;
      else 
        this.scrollToBottom();

    }

    keyWatcher() {
      const msgInput = this.$refs.msgInput as HTMLInputElement;
      msgInput.classList.remove('error');
      msgInput.value = this.emoji.emojify(msgInput.value);
    }

    recieve(msg) {
      this.onMessage(msg);
    }

    showModal() {
    this.isModalVisible = true;
    }

    closeModal() {
      this.isModalVisible = false;
    }

    showInviteDialog() {
      this.inviteDialog = true;
    }

    closeInviteDialog() {
      this.inviteDialog = false;
    }

    get isAdmin() {
      const user = this.$store.state.auth.user;
      return user.admin || user.username === this.creatorUsername;
    }
  }

</script>
<style lang="scss">
  .chat-container {
    position: absolute;
  }

  .closed.open { display: none; }
  .closed:not(.open) {
    z-index: 10000;
    display: flex;
    height: 2rem;
    width: 9rem;
    border: 2px solid black;
    border-radius: 1rem;
    font-size: 1rem;
    justify-content: space-evenly;
    align-items: center;

    position: absolute;
    top: 0;
    left: 0;
    background-color: $menu-bg;
  }
  .closed * {
    margin: 0px 5px;
  }
  #handle {
    user-select: none;
  }

input, button {
  border-radius: $border-radius;
  padding: 0.5rem;
  border: none;
}

#new-messages {
  position: absolute;
  width: 100%;
  bottom: 3rem;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: end;

  color: $new-messages;

  button {
    width: 2rem;
    height: 2rem;
  }

  span {
    margin-bottom: -0.75rem;
  }
}

#chat-buttons {
  position: absolute;
  top: -0.5rem;
  left: -0.25rem;
  font-size: 1rem;
  padding: 0;
  z-index: 100000;
}

#messages {
  list-style-type: none;
  margin: 0;
  padding: 0.5rem;

  background-color: $chat-bg;

  flex-grow: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;

  :first-child {
    margin-top: 1rem;
  }

  .name {
    color: $name-color;
    font-size: 0.6rem;
    &.sent { align-self: flex-end; }
    &.warning { align-self: center; }
  }

  .time {
    color: $time-color;
    font-size: 0.6rem;
    margin-top: -0.25rem;
    margin-bottom: 0.2rem;
    height: 0px;
    opacity: 0;
    transition: all 0.3s ease-in;
    &.sent { align-self: flex-end; }
    &.warning { align-self: center; }
  }
}

#chat {
  max-height: 200px;
  margin: auto;

  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  flex-direction: column;
  align-items: stretch;

  width: 50%;
  max-width: 600px;;
  overflow: hidden;

  border: $border-style;
  border-radius: $border-radius;
}

#chat:not(.open) { display: none; }

#chat li {
  &:hover + span { height: 0.8rem; opacity: 1; }
  width: fit-content;
  max-width: 70%;
  word-break: break-word;

  border-radius: $border-radius;
  padding-left: 0.75rem;
  padding-right: 0.75rem;

  margin-block-end: 0.25rem;
  // &:not(:last-of-type) { margin-block-end: 0.25rem; }

  &:not(.sent) {
    border-bottom-left-radius: 1px;
    color: $message-fg;
    background-color: $message-bg;
  }

  &.warning {
    align-self: center;
    padding: 0.5rem 1rem;
    border-radius: $border-radius;
    background-color: $warning;
    color: $white;
  }

  &.sent {
    background-color: $sent-bg;
    color: $sent-fg;
    border-bottom-right-radius: 1px;
    align-self: flex-end;
  }

  &.emojis {
    font-size: 2rem;
    background: none;
    padding: 0px;
    margin-bottom: -0.25rem;
    margin-top: 0;
  }
}

@keyframes plunk {
  from {
    background-color: $warning;
  }
  to {
    background-color: $white;
  }
}

#chat form {
  background: $input-bar-bg;
  padding: 0.25rem;
  display: flex;
  align-content: center;
  justify-content: space-between;

  input {
    height: 2rem;
    flex-grow: 0.95;
    border: $border-style;
    border-radius: 1rem;

    padding-left: 0.75rem;
    padding-right: 0.75rem;
    background-color: $input-bg;
    outline: 0 !important;
    &.error {
      animation: plunk 0.9s ease-in-out;
      animation-iteration-count: 1;
    }
    &:focus {
      border-color: $accent;
    }
  }

  button {
    display: flex;
    align-content: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: 2px solid black;
    //background: $accent; //rgb(130, 224, 255);
    i { color: black; }
  }
  .send-btn {
    font-size: 1.7rem;
    :hover {
      color: $accent;
    }
  }
}
</style>