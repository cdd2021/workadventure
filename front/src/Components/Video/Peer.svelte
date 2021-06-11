<script lang="ts">
    import type {RemotePeer} from "../../WebRtc/SimplePeer";
    import {VideoPeer} from "../../WebRtc/VideoPeer";
    import VideoMedia from "./VideoMedia.svelte";
    import ScreenSharingMedia from "./ScreenSharingMedia.svelte";

    export let peer: RemotePeer;
</script>

<div class="media-container">
    {#if peer instanceof VideoPeer}
        <VideoMedia peer={peer}/>
    {:else}
        <ScreenSharingMedia peer={peer}/>
    {/if}
</div>
