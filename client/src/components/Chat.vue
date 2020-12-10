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
      <ul id="messages" ref="msgs">
        <span class="name" data-from="c3987a84-3acc-445a-95ab-46abf9baf7e0" style="color: rgb(0, 0, 0);">Keenan</span>
        <li>hey</li><span class="time">7:06pm</span>
        <li>Whats up</li><span class="time">7:06pm</span>
        <li class="sent">nm u?</li><span class="time sent">7:06pm</span>
        <li class="sent emojis">🙂</li><span class="time sent emojis">7:07pm</span>
      </ul>
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
      <font-awesome-icon v-on:click="open = !open" icon="comments"></font-awesome-icon>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from "vue-property-decorator";
  import Emoji from "./helpers/emoji";

  interface MessageObj {
    msg?: string;
    effect?: string;
    from?: string;
    name?: string;
    colour?: string;
    time?: string;
  }

  /** A component to make menus have consistant styling and be movable */
  @Component
  export default class Chat extends Vue {
    private readonly emoji = new Emoji();

    public open = false;

    private lastMessage: MessageObj = {};
    private currentlyScrolling = false;
    private newMessages = false;

    private user =  {
      id: "0000-0000-0000-0000",
      name: "Keenan"
    }

    mounted() {
      const  x = 0;
    }

    send() {
      const msgInput = this.$refs.msgInput as HTMLInputElement;
      const msg = msgInput.value;
      if (msg === '') return;

      //socket.emit('chat message', {from: this.user.id, name: this.user.name, msg});
      msgInput.value = '';
      const getTime = () => {
        const d = new Date();
        const fixup = (num: number) => num.toString().padStart(2,'0')
        const hr = (a: number) => a % 12 == 0 ? 12 : a % 12;
        return `${hr(d.getHours())}:${fixup(d.getMinutes())}${d.getHours() < 12 ? 'a': 'p'}m`;
      };
      const [from, name] = Math.random() > 0.5 ? ["0000-0000-0000-0000", "Keenan"] : ["1111-1111-1111-1111", "Sun Bun"];
      const m = {name, from, time: getTime(), msg, colour: 'cadetblue', effect: ''};
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
    onMessage(obj: Required<MessageObj>) {
      const { effect, from: id, time, msg } = obj;
      const { name, colour } = obj;
      const emojis = this.emoji.only(msg), sent = id === this.user.id;
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
    width: 3.5rem;
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
  #handle {
    user-select: none;
  }

$border-radius: 1rem;

$accent: violet;
$white: azure;
$dark: #302d32;
$warning: #b33c3c;

$message-bg: darksalmon;
$message-fg: white;
$sent-bg: cornflowerblue;
$sent-fg: white;

$input-bar-bg: white;
$input-bg: white;
$chat-bg: white;

$new-messages: black;
$name-color: black;
$time-color: black;


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