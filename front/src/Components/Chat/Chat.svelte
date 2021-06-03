<script lang="ts">
    import { fly } from 'svelte/transition';
    import {chatMessagesStore, chatVisibilityStore} from "../../Stores/ChatStore";
    import ChatMessageForm from './ChatMessageForm.svelte'
    import ChatElement from './ChatElement.svelte'
    
    function closeChat() {
        chatVisibilityStore.set(false);
    }
</script>

<aside class="chatWindow" transition:fly="{{ x: -1000, duration: 500 }}">
    <section class="chatWindowTitle">
        <h2>You can launch a discussion!</h2>
        <button on:click={closeChat}>Close</button>
    </section>
    <section class="messagesList">
        <ul>
        {#each $chatMessagesStore as message}
            <li><ChatElement message={message}></ChatElement></li>
        {/each} 
        </ul>

    </section>
    <section class="messageForm">
        <ChatMessageForm></ChatMessageForm>
    </section>
</aside>

<style lang="scss">
    .chatWindow {
      pointer-events: auto;
      position: absolute;
      top: 0;
      left: 0;
      height: 100vh;
      background: lightgray;
      font-family: 'Press Start 2P' !important;
      
      .chatWindowTitle {
        height: 20%;
      }
      .messagesList {
        height: 70%;
      }
      .messageForm {
        height: 10%;
      }
    }
</style>