<script>
	import { playerState } from '../stores/playerStore.svelte.js';
	import { allReleases } from '../data/tracks.js';
	import locale from '../data/locale/en.json';

	let { albumId, onBack, onPlayTrack } = $props();
	let visible = $state(false);

	$effect(() => {
		visible = false;
		requestAnimationFrame(() => {
			requestAnimationFrame(() => { visible = true; });
		});
	});

	const album = $derived(allReleases.find(r => r.id === albumId));

	function handlePlayTrack(index) {
		if (onPlayTrack && album) onPlayTrack(album, index);
	}

	function handlePlayAll() {
		handlePlayTrack(0);
	}

	function getTypeLabel(type) {
		return locale.album.types[type] || type;
	}

	function isTrackPlaying(index) {
		return playerState.queueAlbumId === albumId &&
			playerState.currentTrack === index &&
			playerState.playing;
	}

	function isTrackActive(index) {
		return playerState.queueAlbumId === albumId &&
			playerState.currentTrack === index;
	}
</script>

{#if album}
<div class="album-detail" class:visible>
	<button class="back-btn" onclick={onBack} aria-label={locale.album.back}>
		<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
			<path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
		</svg>
		<span>{locale.album.back}</span>
	</button>

	<div class="album-header">
		<div class="album-cover-container">
			<img src={album.coverHi} alt="{album.title}" class="album-cover" />
		</div>
		<div class="album-meta">
			<span class="album-type-badge">{getTypeLabel(album.type)}</span>
			<h2 class="album-title">{album.title}</h2>
			{#if album.titleJp}
				<p class="album-title-jp">{album.titleJp}</p>
			{/if}
			<p class="album-year">{album.year} · {locale.player.artist}</p>
			<p class="album-track-count">{album.tracks.length} {locale.album.tracks}</p>
			<button class="play-all-btn" onclick={handlePlayAll}>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
					<path d="M8 5v14l11-7z"/>
				</svg>
				{locale.album.playAll}
			</button>
		</div>
	</div>

	<div class="tracklist">
		{#each album.tracks as track, index}
			<button
				class="track-row"
				class:active={isTrackActive(index)}
				class:playing={isTrackPlaying(index)}
				style="--delay: {index * 0.04}s"
				onclick={() => handlePlayTrack(index)}
				aria-label="{track.title}"
			>
				<div class="track-number">
					{#if isTrackPlaying(index)}
						<div class="eq-bars">
							<span class="eq-bar"></span>
							<span class="eq-bar"></span>
							<span class="eq-bar"></span>
						</div>
					{:else if isTrackActive(index)}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" class="pause-icon">
							<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
						</svg>
					{:else}
						<span class="num">{index + 1}</span>
					{/if}
				</div>
				<div class="track-info">
					<span class="track-title">{track.title}</span>
					{#if track.featuring}
						<span class="track-featuring">{locale.album.featuring} {track.featuring}</span>
					{/if}
				</div>
				<div class="track-play-hint">
					<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z"/>
					</svg>
				</div>
			</button>
		{/each}
	</div>
</div>
{/if}

<style>
	.album-detail {
		opacity: 0;
		transform: translateX(20px);
		transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}
	.album-detail.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.back-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		background: none;
		border: none;
		color: var(--text-accent);
		font-family: var(--font-display);
		font-size: 0.9rem;
		cursor: pointer;
		padding: 0.5rem 0;
		margin-bottom: 1.5rem;
		transition: all 0.3s ease;
	}
	.back-btn:hover {
		color: var(--accent-primary);
		transform: translateX(-4px);
	}

	.album-header {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		align-items: flex-start;
	}
	.album-cover-container {
		position: relative;
		flex-shrink: 0;
		width: 200px;
		height: 200px;
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-elevated);
	}
	.album-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--radius-md);
		transition: transform 0.6s ease;
	}
	.album-cover-container:hover .album-cover {
		transform: scale(1.04);
	}

	.album-meta {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding-top: 0.5rem;
	}
	.album-type-badge {
		font-family: var(--font-display);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: var(--accent-primary);
		background: var(--accent-primary-bg);
		padding: 0.2rem 0.6rem;
		border-radius: 4px;
		display: inline-block;
		width: fit-content;
	}
	.album-title {
		font-family: var(--font-display);
		font-size: 1.7rem;
		font-weight: 700;
		color: var(--text-primary);
		line-height: 1.2;
		margin-top: 0.3rem;
	}
	.album-title-jp {
		font-family: var(--font-jp);
		font-size: 0.9rem;
		color: var(--text-accent-muted);
	}
	.album-year {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 0.2rem;
	}
	.album-track-count {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}
	.play-all-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.8rem;
		padding: 0.65rem 1.5rem;
		background: var(--accent-primary-bg);
		border: 1px solid var(--accent-primary-muted);
		border-radius: 24px;
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.35s ease;
		width: fit-content;
		box-shadow: var(--shadow-card);
	}
	.play-all-btn:hover {
		background: var(--accent-primary-hover);
		border-color: var(--accent-primary);
		transform: scale(1.03);
		box-shadow: var(--shadow-elevated);
	}

	.tracklist {
		display: flex;
		flex-direction: column;
		gap: 2px;
		background: var(--surface-raised);
		border-radius: var(--radius-md);
		padding: 0.5rem;
		box-shadow: var(--shadow-card);
		border: 1px solid var(--border-subtle);
	}

	.track-row {
		display: grid;
		grid-template-columns: 40px 1fr 32px;
		align-items: center;
		gap: 0.8rem;
		padding: 0.8rem;
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: inherit;
		font: inherit;
		cursor: pointer;
		transition: all 0.3s ease;
		text-align: left;
		animation: fadeInTrack 0.4s ease both;
		animation-delay: var(--delay);
	}
	@keyframes fadeInTrack {
		from { opacity: 0; transform: translateX(10px); }
		to { opacity: 1; transform: translateX(0); }
	}
	.track-row:hover {
		background: var(--surface-hover);
	}
	.track-row.active {
		background: var(--accent-primary-bg);
	}
	.track-row.playing {
		background: var(--accent-primary-bg);
	}

	.track-number {
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 0.85rem;
		color: var(--text-secondary);
		width: 40px;
	}
	.track-row.active .track-number {
		color: var(--accent-primary);
	}
	.num {
		transition: opacity 0.2s;
	}
	.track-row:hover .num {
		opacity: 0.5;
	}

	.eq-bars {
		display: flex;
		align-items: flex-end;
		gap: 2px;
		height: 14px;
	}
	.eq-bar {
		width: 3px;
		background: var(--accent-primary);
		border-radius: 1px;
		animation: eqBounce 0.8s ease-in-out infinite alternate;
	}
	.eq-bar:nth-child(1) { height: 60%; animation-delay: 0s; }
	.eq-bar:nth-child(2) { height: 100%; animation-delay: 0.2s; }
	.eq-bar:nth-child(3) { height: 40%; animation-delay: 0.4s; }
	@keyframes eqBounce {
		0% { transform: scaleY(0.3); }
		100% { transform: scaleY(1); }
	}

	.pause-icon { color: var(--accent-primary); }

	.track-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		overflow: hidden;
	}
	.track-title {
		font-family: var(--font-display);
		font-weight: 500;
		font-size: 0.9rem;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.track-row.active .track-title {
		color: var(--accent-primary);
	}
	.track-featuring {
		font-size: 0.75rem;
		color: var(--text-secondary);
	}

	.track-play-hint {
		opacity: 0;
		color: var(--text-accent);
		transition: opacity 0.25s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.track-row:hover .track-play-hint {
		opacity: 0.7;
	}

	@media (max-width: 520px) {
		.album-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		.album-cover-container {
			width: 200px;
			height: 200px;
		}
		.album-meta {
			align-items: center;
		}
	}

	@media (min-width: 768px) {
		.album-cover-container {
			width: 240px;
			height: 240px;
		}
		.album-title {
			font-size: 2rem;
		}
	}
</style>
