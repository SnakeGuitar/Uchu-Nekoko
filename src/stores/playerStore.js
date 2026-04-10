import { writable } from 'svelte/store';

export const playing = writable(false);
export const currentTrack = writable(0);
export const currentTime = writable(0);
export const duration = writable(0);
