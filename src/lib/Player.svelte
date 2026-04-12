<script>
	import { playerState } from '../stores/playerStore.svelte.js';

	let { tracks = [], currentTrack = $bindable(0), playing = $bindable(false), currentTime = $bindable(0), duration = $bindable(0) } = $props();

	let audioElement;

	$effect(() => {
		if (tracks && tracks.length > 0 && currentTrack >= 0 && currentTrack < tracks.length) {
			const track = tracks[currentTrack];
			if (audioElement && track && audioElement.src !== track.src) {
				audioElement.src = track.src;
				audioElement.load();
				if (playing) {
					audioElement.play().catch(() => {});
				}
			}
		}
	});

	$effect(() => {
		if (audioElement) {
			audioElement.volume = playerState.volume;
		}
	});

	export function togglePlay() {
		if (!audioElement) return;
		if (playing) {
			audioElement.pause();
		} else {
			audioElement.play().catch(() => {});
		}
		playing = !playing;
	}

	export function nextTrack() {
		if (!tracks || tracks.length === 0) return;
		currentTrack = (currentTrack + 1) % tracks.length;
		playing = true;
		setTimeout(() => {
			if (audioElement) audioElement.play().catch(() => {});
		}, 100);
	}

	export function prevTrack() {
		if (!tracks || tracks.length === 0) return;
		if (audioElement && audioElement.currentTime > 3) {
			audioElement.currentTime = 0;
			return;
		}
		currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
		playing = true;
		setTimeout(() => {
			if (audioElement) audioElement.play().catch(() => {});
		}, 100);
	}

	export function seekTo(percentage) {
		if (audioElement && duration) {
			audioElement.currentTime = percentage * duration;
		}
	}

	export function setVolume(vol) {
		playerState.volume = Math.max(0, Math.min(1, vol));
		if (audioElement) {
			audioElement.volume = playerState.volume;
		}
	}

	function handleTimeUpdate() {
		if (audioElement) {
			currentTime = audioElement.currentTime;
			duration = audioElement.duration || 0;
		}
	}

	function handleEnded() {
		nextTrack();
	}
</script>

<audio
	bind:this={audioElement}
	ontimeupdate={handleTimeUpdate}
	onended={handleEnded}
	onloadedmetadata={handleTimeUpdate}
></audio>
