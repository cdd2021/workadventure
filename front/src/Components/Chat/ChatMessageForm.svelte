<script lang="ts">
    import {chatMessagesStore, ChatMessageTypes} from "../../Stores/ChatStore";

    let newMessageText = '';

    function saveMessage() {
        chatMessagesStore.addMessage({
            text: newMessageText,
            author: 'me',
            type: ChatMessageTypes.text,
        });
        newMessageText = '';
    }
</script>

<form on:submit|preventDefault={saveMessage}>
    <input type="text" bind:value={newMessageText} placeholder="new text"><button type="submit">Save</button>
</form>