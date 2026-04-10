<script>
	import { playerState } from '../stores/playerStore.js';

	let { tracks, currentTrack, playing, currentTime, duration } = $props();

	let audioElement;

	$effect(() => {
		if (tracks && tracks.length > 0) {
			const track = tracks[currentTrack];
			if (audioElement && audioElement.src !== track.src) {
				audioElement.src = track.src;
				if (playing) {
					audioElement.play();
				}
			}
		}
	});

	function togglePlay() {
		if (!audioElement) return;
		
		if (playing) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		playing = !playing;
	}

	function nextTrack() {
		currentTrack = (currentTrack + 1) % tracks.length;
		playing = true;
		setTimeout(() => {
			if (audioElement) audioElement.play();
		}, 100);
	}

	function prevTrack() {
		currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
		playing = true;
		setTimeout(() => {
			if (audioElement) audioElement.play();
		}, 100);
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
	on:timeupdate={handleTimeUpdate}
	on:ended={handleEnded}
	on:loadedmetadata={handleTimeUpdate}
></audio>

<div class="controls">
	<button class="control-btn" on:click={prevTrack} title="Previous">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
		</svg>
	</button>
	
	<button class="control-btn play-btn" on:click={togglePlay} title={playing ? 'Pause' : 'Play'}>
		{#if playing}
			<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
				<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
			</svg>
		{:else}
			<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
				<path d="M8 5v14l11-7z"/>
			</svg>
		{/if}
	</button>
	
	<button class="control-btn" on:click={nextTrack} title="Next">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
		</svg>
	</button>
</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.control-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 2px solid rgba(255, 0, 255, 0.3);
		border-radius: 50%;
		color: #e0e0ff;
		cursor: pointer;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
	}

	.control-btn:hover {
		background: rgba(255, 0, 255, 0.2);
		border-color: rgba(255, 0, 255, 0.6);
		transform: scale(1.1);
		box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
	}

	.play-btn {
		padding: 1rem;
		background: linear-gradient(135deg, #ff00ff, #00ffff);
		border: none;
	}

	.play-btn:hover {
		transform: scale(1.15);
		box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
	}

	.control-btn svg {
		filter: drop-shadow(0 0 5px rgba(255, 0, 255, 0.5));
	}
</style>
