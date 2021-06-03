<script lang="ts">
    import {ChatMessageTypes} from "../../Stores/ChatStore";
    import type {ChatMessage} from "../../Stores/ChatStore";
    import {HtmlUtils} from "../../WebRtc/HtmlUtils";

    export let message: ChatMessage

    $: urlifyText = HtmlUtils.urlify(message.text);
</script>

<p>
{#if message.type === ChatMessageTypes.text}
    <b>{message.author}:</b> <span 	contenteditable="true" bind:innerHTML={urlifyText}></span>
{:else if message.type === ChatMessageTypes.userIncoming}
    User {message.author} came in
{:else if message.type === ChatMessageTypes.userOutcoming}
    User {message.author} left
{/if}
</p>
