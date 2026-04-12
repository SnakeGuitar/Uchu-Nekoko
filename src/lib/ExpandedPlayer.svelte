<script>
	import { playerState } from '../stores/playerStore.svelte.js';
	import locale from '../data/locale/en.json';

	let {
		track = null,
		album = null,
		playing = false,
		currentTime = 0,
		duration = 0,
		onTogglePlay,
		onNext,
		onPrev,
		onSeek
	} = $props();

	let visible = $state(false);

	$effect(() => {
		if (playerState.expanded) {
			requestAnimationFrame(() => { visible = true; });
		} else {
			visible = false;
		}
	});

	function formatTime(seconds) {
		if (!seconds || isNaN(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function handleProgressClick(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		if (onSeek) onSeek(x / rect.width);
	}

	function handleVolumeChange(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = event.clientX - rect.left;
		playerState.volume = Math.max(0, Math.min(1, x / rect.width));
	}

	function collapse() {
		visible = false;
		setTimeout(() => { playerState.expanded = false; }, 400);
	}

	const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

{#if playerState.expanded && track}
<div class="expanded-player" class:visible>
	<div class="expanded-backdrop">
		{#if album}
			<img src={album.coverHi} alt="" class="backdrop-img" />
		{/if}
	</div>

	<div class="expanded-container">
		<button class="collapse-btn" onclick={collapse} aria-label={locale.player.collapse}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
			</svg>
		</button>

		<div class="expanded-content">
			<div class="expanded-cover-wrap">
				{#if album}
					<img
						src={album.coverHi}
						alt="{album.title}"
						class="expanded-cover"
						class:spin={playing}
					/>
				{/if}
			</div>

			<div class="expanded-info">
				<h2 class="expanded-title">{track.title}</h2>
				<p class="expanded-artist">
					{locale.player.artist}{track.featuring ? ` · ${locale.album.featuring} ${track.featuring}` : ''}
				</p>
				{#if album}
					<p class="expanded-album">{album.title} ({album.year})</p>
				{/if}
			</div>

			<div class="expanded-progress-section">
				<button
					class="expanded-progress-bar"
					onclick={handleProgressClick}
					role="slider"
					aria-label={locale.player.seekProgress}
					aria-valuenow={currentTime}
					aria-valuemin={0}
					aria-valuemax={duration}
				>
					<div class="expanded-progress-fill" style="width: {progress}%"></div>
					<div class="expanded-progress-thumb" style="left: {progress}%"></div>
				</button>
				<div class="expanded-time">
					<span>{formatTime(currentTime)}</span>
					<span>{formatTime(duration)}</span>
				</div>
			</div>

			<div class="expanded-controls">
				<button class="exp-ctrl" onclick={onPrev} aria-label={locale.player.previous}>
					<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
					</svg>
				</button>
				<button class="exp-ctrl exp-play" onclick={onTogglePlay} aria-label={playing ? locale.player.pause : locale.player.play}>
					{#if playing}
						<svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
						</svg>
					{:else}
						<svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
							<path d="M8 5v14l11-7z"/>
						</svg>
					{/if}
				</button>
				<button class="exp-ctrl" onclick={onNext} aria-label={locale.player.next}>
					<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
					</svg>
				</button>
			</div>

			<div class="expanded-volume">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="vol-icon">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
				</svg>
				<button
					class="expanded-vol-bar"
					onclick={handleVolumeChange}
					role="slider"
					aria-label={locale.player.volumeSlider}
					aria-valuenow={Math.round(playerState.volume * 100)}
					aria-valuemin={0}
					aria-valuemax={100}
				>
					<div class="expanded-vol-fill" style="width: {playerState.volume * 100}%"></div>
				</button>
				<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="vol-icon">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
				</svg>
			</div>
		</div>
	</div>
</div>
{/if}

<style>
	.expanded-player {
		position: fixed;
		inset: 0;
		z-index: 200;
		opacity: 0;
		transition: opacity 0.4s ease;
	}
	.expanded-player.visible {
		opacity: 1;
	}

	.expanded-backdrop {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}
	.backdrop-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(60px) brightness(0.3) saturate(1.5);
		transform: scale(1.2);
	}
	.expanded-backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
		background: var(--expanded-overlay);
	}

	.expanded-container {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1.5rem;
	}

	.collapse-btn {
		align-self: flex-start;
		background: rgba(255,255,255,0.1);
		border: none;
		border-radius: 50%;
		color: rgba(255,255,255,0.8);
		cursor: pointer;
		padding: 0.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease;
		backdrop-filter: blur(10px);
	}
	.collapse-btn:hover {
		background: rgba(255,255,255,0.2);
		color: #fff;
		transform: scale(1.1);
	}

	.expanded-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.8rem;
		max-width: 420px;
		width: 100%;
	}

	.expanded-cover-wrap {
		width: min(300px, 65vw);
		height: min(300px, 65vw);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0,0,0,0.5);
		transition: transform 0.5s ease;
	}
	.expanded-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.8s ease;
	}
	.expanded-cover.spin {
		animation: slowBreath 4s ease-in-out infinite;
	}
	@keyframes slowBreath {
		0%, 100% { transform: scale(1); }
		50% { transform: scale(1.02); }
	}

	.expanded-info {
		text-align: center;
	}
	.expanded-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.3rem;
	}
	.expanded-artist {
		font-size: 0.9rem;
		color: rgba(255,255,255,0.6);
	}
	.expanded-album {
		font-size: 0.8rem;
		color: rgba(255,255,255,0.4);
		margin-top: 0.2rem;
	}

	.expanded-progress-section {
		width: 100%;
	}
	.expanded-progress-bar {
		width: 100%;
		height: 6px;
		background: rgba(255,255,255,0.15);
		border-radius: 6px;
		cursor: pointer;
		border: none;
		padding: 0;
		position: relative;
		transition: height 0.2s;
	}
	.expanded-progress-bar:hover {
		height: 8px;
	}
	.expanded-progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
		border-radius: 6px;
		transition: width 0.15s linear;
	}
	.expanded-progress-thumb {
		position: absolute;
		top: 50%;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fff;
		transform: translate(-50%, -50%);
		box-shadow: 0 2px 8px rgba(0,0,0,0.3);
		opacity: 0;
		transition: opacity 0.2s;
	}
	.expanded-progress-bar:hover .expanded-progress-thumb {
		opacity: 1;
	}
	.expanded-time {
		display: flex;
		justify-content: space-between;
		font-family: var(--font-display);
		font-size: 0.72rem;
		color: rgba(255,255,255,0.5);
		margin-top: 0.4rem;
	}

	.expanded-controls {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.exp-ctrl {
		background: none;
		border: none;
		color: rgba(255,255,255,0.8);
		cursor: pointer;
		padding: 0.6rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.25s ease;
	}
	.exp-ctrl:hover {
		color: #fff;
		transform: scale(1.15);
	}
	.exp-play {
		background: rgba(255,255,255,0.15);
		padding: 1rem;
		backdrop-filter: blur(10px);
	}
	.exp-play:hover {
		background: rgba(255,255,255,0.25);
		box-shadow: 0 4px 24px rgba(255,255,255,0.1);
	}

	.expanded-volume {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		width: 100%;
		max-width: 200px;
	}
	.vol-icon {
		color: rgba(255,255,255,0.5);
		flex-shrink: 0;
	}
	.expanded-vol-bar {
		flex: 1;
		height: 4px;
		background: rgba(255,255,255,0.15);
		border-radius: 4px;
		cursor: pointer;
		border: none;
		padding: 0;
		overflow: hidden;
	}
	.expanded-vol-fill {
		height: 100%;
		background: rgba(255,255,255,0.6);
		border-radius: 4px;
		transition: width 0.1s;
	}

	@media (min-width: 768px) {
		.expanded-cover-wrap {
			width: 340px;
			height: 340px;
		}
		.expanded-title {
			font-size: 1.8rem;
		}
	}
</style>
