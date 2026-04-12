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
		onSeek,
		onAlbumClick
	} = $props();

	let volumeOpen = $state(false);

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

	function expandPlayer() {
		playerState.expanded = true;
	}

	const progress = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);
</script>

{#if track}
<div class="now-playing">
	<button
		class="progress-bar-top"
		onclick={handleProgressClick}
		role="slider"
		aria-label={locale.player.seekProgress}
		aria-valuenow={currentTime}
		aria-valuemin={0}
		aria-valuemax={duration}
	>
		<div class="progress-fill" style="width: {progress}%"></div>
	</button>

	<div class="player-inner">
		<button class="track-section" onclick={expandPlayer} aria-label={locale.player.expand}>
			{#if album}
				<img
					src={album.coverLow}
					alt="{album.title}"
					class="mini-cover"
					class:pulse={playing}
				/>
			{/if}
			<div class="track-meta">
				<span class="np-track-title">{track.title}</span>
				<span class="np-track-artist">
					{locale.player.artist}{track.featuring ? ` · ${locale.album.featuring} ${track.featuring}` : ''}
				</span>
			</div>
		</button>

		<div class="controls">
			<button class="ctrl-btn" onclick={onPrev} title={locale.player.previous} aria-label={locale.player.previous}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
				</svg>
			</button>
			<button class="ctrl-btn play-btn" onclick={onTogglePlay} title={playing ? locale.player.pause : locale.player.play} aria-label={playing ? locale.player.pause : locale.player.play}>
				{#if playing}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
					</svg>
				{:else}
					<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z"/>
					</svg>
				{/if}
			</button>
			<button class="ctrl-btn" onclick={onNext} title={locale.player.next} aria-label={locale.player.next}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
				</svg>
			</button>
		</div>

		<div class="right-section">
			<span class="time-label">{formatTime(currentTime)} / {formatTime(duration)}</span>
			<div class="volume-control">
				<button
					class="ctrl-btn volume-btn"
					onclick={() => volumeOpen = !volumeOpen}
					title={locale.player.volume}
					aria-label={locale.player.volume}
				>
					{#if playerState.volume === 0}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
						</svg>
					{:else if playerState.volume < 0.5}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>
						</svg>
					{:else}
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
						</svg>
					{/if}
				</button>
				{#if volumeOpen}
					<button
						class="volume-slider-wrap"
						onclick={handleVolumeChange}
						role="slider"
						aria-label={locale.player.volumeSlider}
						aria-valuenow={Math.round(playerState.volume * 100)}
						aria-valuemin={0}
						aria-valuemax={100}
					>
						<div class="volume-slider">
							<div class="volume-fill" style="width: {playerState.volume * 100}%"></div>
						</div>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
{/if}

<style>
	.now-playing {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--surface-player);
		backdrop-filter: blur(24px) saturate(1.4);
		-webkit-backdrop-filter: blur(24px) saturate(1.4);
		border-top: 1px solid var(--border-subtle);
		animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
		box-shadow: var(--shadow-player);
	}
	@keyframes slideUp {
		from { transform: translateY(100%); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.progress-bar-top {
		width: 100%;
		height: 3px;
		background: var(--surface-inset);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: height 0.25s ease;
		display: block;
	}
	.progress-bar-top:hover {
		height: 6px;
	}
	.progress-fill {
		height: 100%;
		background: var(--gradient-accent);
		border-radius: 0 2px 2px 0;
		transition: width 0.15s linear;
	}

	.player-inner {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		padding: 0.6rem 1.5rem;
		max-width: 1400px;
		margin: 0 auto;
		gap: 1rem;
	}

	.track-section {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		text-align: left;
		padding: 0;
		overflow: hidden;
		transition: opacity 0.3s;
	}
	.track-section:hover {
		opacity: 0.85;
	}
	.mini-cover {
		width: 46px;
		height: 46px;
		border-radius: var(--radius-sm);
		object-fit: cover;
		flex-shrink: 0;
		box-shadow: var(--shadow-card);
		transition: box-shadow 0.3s ease;
	}
	.mini-cover.pulse {
		animation: gentlePulse 3s ease-in-out infinite;
	}
	@keyframes gentlePulse {
		0%, 100% { box-shadow: var(--shadow-card); }
		50% { box-shadow: 0 0 14px 2px var(--accent-glow); }
	}
	.track-meta {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		overflow: hidden;
	}
	.np-track-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.np-track-artist {
		font-size: 0.72rem;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.6rem;
	}
	.ctrl-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.25s ease;
	}
	.ctrl-btn:hover {
		color: var(--text-primary);
		background: var(--surface-hover);
		transform: scale(1.1);
	}
	.play-btn {
		background: var(--accent-primary-bg);
		border: 1px solid var(--accent-primary-muted);
		padding: 0.6rem;
		color: var(--text-primary);
	}
	.play-btn:hover {
		background: var(--accent-primary-hover);
		border-color: var(--accent-primary);
		transform: scale(1.12);
		box-shadow: 0 2px 12px var(--accent-glow);
	}

	.right-section {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.8rem;
	}
	.time-label {
		font-family: var(--font-display);
		font-size: 0.72rem;
		color: var(--text-secondary);
		white-space: nowrap;
	}

	.volume-control {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		position: relative;
	}
	.volume-btn {
		padding: 0.4rem;
	}
	.volume-slider-wrap {
		background: none;
		border: none;
		padding: 4px 0;
		cursor: pointer;
		width: 80px;
		display: block;
	}
	.volume-slider {
		width: 100%;
		height: 4px;
		background: var(--surface-inset);
		border-radius: 4px;
		overflow: hidden;
	}
	.volume-fill {
		height: 100%;
		background: var(--gradient-accent);
		border-radius: 4px;
		transition: width 0.1s;
	}

	@media (max-width: 600px) {
		.player-inner {
			grid-template-columns: 1fr auto;
			padding: 0.5rem 1rem;
		}
		.right-section {
			display: none;
		}
		.mini-cover {
			width: 40px;
			height: 40px;
		}
	}
</style>
