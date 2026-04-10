<script>
	import { currentTrack, playing } from '../stores/playerStore.js';

	export let tracks;
	export let currentTrack;
	export let playing;

	function selectTrack(index) {
		currentTrack = index;
		playing = true;
	}
</script>

<div class="playlist">
	<h2 class="playlist-title">🎵 Playlist</h2>
	<div class="track-list">
		{#each tracks as track, index}
			<div 
				class="track-item {index === currentTrack ? 'active' : ''}"
				on:click={() => selectTrack(index)}
			>
				<div class="track-number">
					{#if index === currentTrack && playing}
						<span class="playing-icon">▶</span>
					{:else}
						{index + 1}
					{/if}
				</div>
				<div class="track-info">
					<div class="track-title">{track.title}</div>
					<div class="track-artist">{track.artist}</div>
				</div>
				<div class="track-duration">{track.duration}</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.playlist {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 20px;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.playlist-title {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
		background: linear-gradient(90deg, #ff00ff, #00ffff);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.track-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-height: 400px;
		overflow-y: auto;
		padding-right: 0.5rem;
	}

	.track-list::-webkit-scrollbar {
		width: 6px;
	}

	.track-list::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 10px;
	}

	.track-list::-webkit-scrollbar-thumb {
		background: linear-gradient(180deg, #ff00ff, #00ffff);
		border-radius: 10px;
	}

	.track-item {
		display: grid;
		grid-template-columns: 40px 1fr auto;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1px solid transparent;
	}

	.track-item:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 0, 255, 0.3);
		transform: translateX(5px);
	}

	.track-item.active {
		background: linear-gradient(90deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.1));
		border-color: rgba(255, 0, 255, 0.5);
		box-shadow: 0 0 20px rgba(255, 0, 255, 0.3);
	}

	.track-number {
		font-family: 'Orbitron', sans-serif;
		text-align: center;
		color: #8888ff;
		font-weight: 600;
	}

	.playing-icon {
		color: #ff00ff;
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.5; }
	}

	.track-info {
		overflow: hidden;
	}

	.track-title {
		font-weight: 600;
		color: #e0e0ff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.track-artist {
		font-size: 0.85rem;
		color: #8888aa;
		margin-top: 0.25rem;
	}

	.track-duration {
		font-family: 'Orbitron', sans-serif;
		font-size: 0.85rem;
		color: #8888ff;
	}
</style>
