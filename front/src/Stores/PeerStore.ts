import {derived, get, readable, writable} from "svelte/store";
import type {RemotePeer, SimplePeer} from "../WebRtc/SimplePeer";
import {VideoPeer} from "../WebRtc/VideoPeer";
import {ScreenSharingPeer} from "../WebRtc/ScreenSharingPeer";
import {DivImportance} from "../WebRtc/LayoutManager";

/**
 * A store that contains the list of (video) peers we are connected to.
 */
function createPeerStore() {
    let peers = new Map<number, VideoPeer>();

    const { subscribe, set, update } = writable(peers);

    return {
        subscribe,
        connectToSimplePeer: (simplePeer: SimplePeer) => {
            peers = new Map<number, VideoPeer>();
            set(peers);
            simplePeer.registerPeerConnectionListener({
                onConnect(peer: RemotePeer) {
                    if (peer instanceof VideoPeer) {
                        update(users => {
                            users.set(peer.userId, peer);
                            return users;
                        });
                    }
                    console.log('CONNECT VIDEO', peers);
                },
                onDisconnect(userId: number) {
                    update(users => {
                        users.delete(userId);
                        return users;
                    });
                    console.log('DISCONNECT VIDEO', peers);
                }
            })
        }
    };
}

/**
 * A store that contains the list of screen sharing peers we are connected to.
 */
function createScreenSharingPeerStore() {
    let peers = new Map<number, ScreenSharingPeer>();

    const { subscribe, set, update } = writable(peers);

    return {
        subscribe,
        connectToSimplePeer: (simplePeer: SimplePeer) => {
            peers = new Map<number, ScreenSharingPeer>();
            set(peers);
            simplePeer.registerPeerConnectionListener({
                onConnect(peer: RemotePeer) {
                    if (peer instanceof ScreenSharingPeer) {
                        update(users => {
                            users.set(peer.userId, peer);
                            return users;
                        });
                    }
                },
                onDisconnect(userId: number) {
                    update(users => {
                        users.delete(userId);
                        return users;
                    });
                }
            })
        }
    };
}

export const peerStore = createPeerStore();
export const screenSharingPeerStore = createScreenSharingPeerStore();

/**
 * A store that contains ScreenSharingPeer, ONLY if those ScreenSharingPeer are emitting a stream towards us!
 */
function createScreenSharingStreamStore() {
    let peers = new Map<number, ScreenSharingPeer>();

    return readable<Map<number, ScreenSharingPeer>>(peers, function start(set) {

        let unsubscribes: (()=>void)[] = [];

        const unsubscribe = screenSharingPeerStore.subscribe((screenSharingPeers) => {
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
            unsubscribes = [];

            peers = new Map<number, ScreenSharingPeer>();

            screenSharingPeers.forEach((screenSharingPeer: ScreenSharingPeer, key: number) => {

                if (screenSharingPeer.isReceivingScreenSharingStream()) {
                    peers.set(key, screenSharingPeer);
                }

                unsubscribes.push(screenSharingPeer.streamStore.subscribe((stream) => {
                    if (stream) {
                        peers.set(key, screenSharingPeer);
                    } else {
                        peers.delete(key);
                    }
                    set(peers);
                }));

            });

            set(peers);

        });

        return function stop() {
            unsubscribe();
            for (const unsubscribe of unsubscribes) {
                unsubscribe();
            }
        };
    })
}

export const screenSharingStreamStore = createScreenSharingStreamStore();

/**
 * A store that contains the layout of the streams
 */
function createLayoutStore() {

    let unsubscribes: (()=>void)[] = [];

    return derived([
        screenSharingStreamStore,
        peerStore,
    ], ([
        $screenSharingStreamStore,
        $peerStore,
    ], set) => {
        for (const unsubscribe of unsubscribes) {
            unsubscribe();
        }
        unsubscribes = [];

        const peers = new Map<DivImportance, Map<string, RemotePeer>>();
        peers.set(DivImportance.Normal, new Map<string, RemotePeer>());
        peers.set(DivImportance.Important, new Map<string, RemotePeer>());

        const addPeer = (peer: RemotePeer, key: number) => {
            const importance = get(peer.importanceStore);

            peers.get(importance)?.set(peer.uniqueId, peer);

            unsubscribes.push(peer.importanceStore.subscribe((importance) => {
                peers.forEach((category) => {
                    category.delete(peer.uniqueId);
                });
                peers.get(importance)?.set(peer.uniqueId, peer);
                set(peers);
                console.log('PEEEEEES', peers);
            }));
        };

        $screenSharingStreamStore.forEach(addPeer);
        $peerStore.forEach(addPeer);

        console.log('PEEEEEE', peers);

        set(peers);
    });
}

export const layoutStore = createLayoutStore();
