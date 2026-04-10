<script>
	import Player from './lib/Player.svelte';
	import Playlist from './lib/Playlist.svelte';
	import { tracks } from './data/tracks.js';
	import { playerState } from './stores/playerStore.js';

	let currentTrack = $state(playerState.currentTrack);
	let playing = $state(playerState.playing);
	let currentTime = $state(playerState.currentTime);
	let duration = $state(playerState.duration);

	$effect(() => { playerState.currentTrack = currentTrack; });
	$effect(() => { playerState.playing = playing; });
	$effect(() => { playerState.currentTime = currentTime; });
	$effect(() => { playerState.duration = duration; });

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleSeek(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const percentage = x / rect.width;
		const audio = document.querySelector('audio');
		if (audio) {
			audio.currentTime = percentage * duration;
		}
	}
</script>

<main class="uchu-player">
	<div class="stars"></div>
	<div class="container">
		<header class="header">
			<h1>🐱 Uchu Nekoko 🌌</h1>
			<p class="subtitle">Cosmic Sound Player</p>
		</header>

		<div class="player-content">
			<Playlist {tracks} {currentTrack} {playing} bind:currentTrack bind:playing />
			
			<div class="player-controls">
				<Player {tracks} {currentTrack} {playing} bind:currentTrack bind:playing bind:currentTime bind:duration />
				
				<div class="progress-bar" on:click={handleSeek}>
					<div class="progress" style="width: {duration ? (currentTime / duration) * 100 : 0}%"></div>
				</div>
				
				<div class="time-display">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>
		</div>

		<footer class="footer">
			<p>🎵 Music from Uchu Nekoko 🎵</p>
		</footer>
	</div>
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Exo 2', sans-serif;
		background: #0a0a1a;
		color: #e0e0ff;
		min-height: 100vh;
		overflow-x: hidden;
	}

	.uchu-player {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #16213e 100%);
		overflow: hidden;
	}

	.stars {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		background-image: 
			radial-gradient(2px 2px at 20px 30px, #eee, transparent),
			radial-gradient(2px 2px at 60px 70px, #fff, transparent),
			radial-gradient(1px 1px at 50px 50px, #fff, transparent),
			radial-gradient(1px 1px at 130px 80px, #fff, transparent),
			radial-gradient(2px 2px at 90px 10px, #fff, transparent);
		background-size: 200px 200px;
		animation: twinkle 5s ease-in-out infinite;
		opacity: 0.5;
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 0.8; }
	}

	.container {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		font-family: 'Orbitron', sans-serif;
		font-size: 3rem;
		font-weight: 900;
		background: linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		animation: gradient 3s linear infinite;
		text-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
	}

	@keyframes gradient {
		0% { background-position: 0% center; }
		100% { background-position: 200% center; }
	}

	.subtitle {
		font-size: 1.2rem;
		color: #8888ff;
		margin-top: 0.5rem;
		letter-spacing: 2px;
	}

	.player-content {
		flex: 1;
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.player-controls {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 10px;
		cursor: pointer;
		margin: 1.5rem 0;
		overflow: hidden;
		transition: all 0.3s;
	}

	.progress-bar:hover {
		height: 12px;
	}

	.progress {
		height: 100%;
		background: linear-gradient(90deg, #ff00ff, #00ffff);
		border-radius: 10px;
		transition: width 0.1s;
		box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
	}

	.time-display {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		color: #8888ff;
		font-family: 'Orbitron', sans-serif;
	}

	.footer {
		text-align: center;
		margin-top: 3rem;
		padding: 1rem;
		color: #6666aa;
		font-size: 0.9rem;
	}

	@media (min-width: 768px) {
		.player-content {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
