<script>
	import Player from './lib/Player.svelte';
	import ArtistProfile from './lib/ArtistProfile.svelte';
	import AlbumDetail from './lib/AlbumDetail.svelte';
	import NowPlaying from './lib/NowPlaying.svelte';
	import ExpandedPlayer from './lib/ExpandedPlayer.svelte';
	import ThemeToggle from './lib/ThemeToggle.svelte';
	import { allReleases } from './data/tracks.js';
	import { playerState } from './stores/playerStore.svelte.js';
	import { initTheme } from './stores/themeStore.svelte.js';

	let currentView = $state('profile');
	let currentAlbumId = $state(null);
	let playing = $state(false);
	let currentTrack = $state(0);
	let currentTime = $state(0);
	let duration = $state(0);
	let playerComponent;
	let viewKey = $state(0);

	$effect(() => { initTheme(); });
	$effect(() => { playerState.playing = playing; });
	$effect(() => { playerState.currentTrack = currentTrack; });
	$effect(() => { playerState.currentTime = currentTime; });
	$effect(() => { playerState.duration = duration; });

	const currentQueueAlbum = $derived(allReleases.find(r => r.id === playerState.queueAlbumId));
	const currentTrackObj = $derived(
		currentQueueAlbum && currentQueueAlbum.tracks[currentTrack]
			? currentQueueAlbum.tracks[currentTrack]
			: null
	);
	const queueTracks = $derived(currentQueueAlbum ? currentQueueAlbum.tracks : []);

	function navigateTo(view, albumId = null) {
		currentView = view;
		currentAlbumId = albumId;
		viewKey++;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	function handleSelectAlbum(albumId) {
		navigateTo('album', albumId);
	}

	function handleBack() {
		navigateTo('profile');
	}

	function handlePlayTrack(album, trackIndex) {
		playerState.queueAlbumId = album.id;
		currentTrack = trackIndex;
		playing = true;
		setTimeout(() => {
			const audio = document.querySelector('audio');
			if (audio) {
				audio.src = album.tracks[trackIndex].src;
				audio.play().catch(() => {});
			}
		}, 50);
	}

	function handleTogglePlay() {
		if (playerComponent) playerComponent.togglePlay();
	}

	function handleNext() {
		if (playerComponent) playerComponent.nextTrack();
	}

	function handlePrev() {
		if (playerComponent) playerComponent.prevTrack();
	}

	function handleSeek(percentage) {
		if (playerComponent) playerComponent.seekTo(percentage);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Noto+Sans+JP:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<main class="uchu-app">
	<div class="texture-overlay"></div>
	<div class="bg-particles">
		<div class="particle p1"></div>
		<div class="particle p2"></div>
		<div class="particle p3"></div>
	</div>

	<ThemeToggle />

	<div class="app-container">
		<Player
			bind:this={playerComponent}
			tracks={queueTracks}
			bind:currentTrack
			bind:playing
			bind:currentTime
			bind:duration
		/>

		{#key viewKey}
			<div class="view-wrapper">
				{#if currentView === 'profile'}
					<ArtistProfile onSelectAlbum={handleSelectAlbum} />
				{:else if currentView === 'album'}
					<AlbumDetail
						albumId={currentAlbumId}
						onBack={handleBack}
						onPlayTrack={handlePlayTrack}
					/>
				{/if}
			</div>
		{/key}
	</div>

	<NowPlaying
		track={currentTrackObj}
		album={currentQueueAlbum}
		{playing}
		{currentTime}
		{duration}
		onTogglePlay={handleTogglePlay}
		onNext={handleNext}
		onPrev={handlePrev}
		onSeek={handleSeek}
	/>

	<ExpandedPlayer
		track={currentTrackObj}
		album={currentQueueAlbum}
		{playing}
		{currentTime}
		{duration}
		onTogglePlay={handleTogglePlay}
		onNext={handleNext}
		onPrev={handlePrev}
		onSeek={handleSeek}
	/>
</main>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(:root),
	:global([data-theme="dark"]) {
		--font-display: 'Outfit', sans-serif;
		--font-body: 'Inter', 'Noto Sans JP', sans-serif;
		--font-jp: 'Noto Sans JP', sans-serif;

		--radius-sm: 8px;
		--radius-md: 14px;
		--radius-lg: 20px;

		--bg-primary: #1a1a22;
		--bg-gradient: linear-gradient(160deg, #1a1a22 0%, #1e1a28 30%, #1a1e2a 60%, #1a1a22 100%);
		--surface-raised: rgba(255, 255, 255, 0.04);
		--surface-hover: rgba(255, 255, 255, 0.08);
		--surface-inset: rgba(0, 0, 0, 0.3);
		--surface-player: rgba(22, 22, 30, 0.88);
		--border-subtle: rgba(255, 255, 255, 0.07);

		--text-primary: #f0ece8;
		--text-secondary: #8a8a9a;
		--text-muted: rgba(240, 236, 232, 0.4);
		--text-accent: #a0a0d4;
		--text-accent-muted: rgba(160, 160, 212, 0.6);

		--accent-primary: #d4a0a0;
		--accent-secondary: #a0a0d4;
		--accent-primary-muted: rgba(212, 160, 160, 0.3);
		--accent-primary-bg: rgba(212, 160, 160, 0.1);
		--accent-primary-hover: rgba(212, 160, 160, 0.2);
		--accent-glow: rgba(212, 160, 160, 0.2);
		--gradient-accent: linear-gradient(90deg, #d4a0a0, #a0a0d4);

		--shadow-card:
			4px 4px 12px rgba(0, 0, 0, 0.4),
			-2px -2px 8px rgba(255, 255, 255, 0.02);
		--shadow-elevated:
			8px 8px 24px rgba(0, 0, 0, 0.5),
			-4px -4px 12px rgba(255, 255, 255, 0.03);
		--shadow-player:
			0 -4px 20px rgba(0, 0, 0, 0.4);

		--overlay-strong: rgba(26, 26, 34, 0.92);
		--overlay-medium: rgba(26, 26, 34, 0.4);
		--expanded-overlay: rgba(10, 10, 16, 0.75);
		--texture-opacity: 0.03;
		--particle-opacity-1: 0.04;
		--particle-opacity-2: 0.03;
	}

	:global([data-theme="light"]) {
		--bg-primary: #f0ece6;
		--bg-gradient: linear-gradient(160deg, #f0ece6 0%, #ece4de 30%, #e8e4ec 60%, #f0ece6 100%);
		--surface-raised: rgba(255, 255, 255, 0.65);
		--surface-hover: rgba(255, 255, 255, 0.85);
		--surface-inset: rgba(0, 0, 0, 0.06);
		--surface-player: rgba(240, 236, 230, 0.88);
		--border-subtle: rgba(0, 0, 0, 0.07);

		--text-primary: #2a2a32;
		--text-secondary: #6a6a7a;
		--text-muted: rgba(42, 42, 50, 0.4);
		--text-accent: #6a5a8a;
		--text-accent-muted: rgba(106, 90, 138, 0.5);

		--accent-primary: #b07070;
		--accent-secondary: #7070b0;
		--accent-primary-muted: rgba(176, 112, 112, 0.25);
		--accent-primary-bg: rgba(176, 112, 112, 0.1);
		--accent-primary-hover: rgba(176, 112, 112, 0.18);
		--accent-glow: rgba(176, 112, 112, 0.15);
		--gradient-accent: linear-gradient(90deg, #b07070, #7070b0);

		--shadow-card:
			4px 4px 12px rgba(0, 0, 0, 0.08),
			-2px -2px 6px rgba(255, 255, 255, 0.8);
		--shadow-elevated:
			6px 6px 20px rgba(0, 0, 0, 0.12),
			-4px -4px 12px rgba(255, 255, 255, 0.9);
		--shadow-player:
			0 -4px 16px rgba(0, 0, 0, 0.08);

		--overlay-strong: rgba(240, 236, 230, 0.92);
		--overlay-medium: rgba(240, 236, 230, 0.4);
		--expanded-overlay: rgba(200, 195, 188, 0.75);
		--texture-opacity: 0.025;
		--particle-opacity-1: 0.06;
		--particle-opacity-2: 0.04;
	}

	:global(body) {
		font-family: var(--font-body);
		background: var(--bg-primary);
		color: var(--text-primary);
		min-height: 100vh;
		overflow-x: hidden;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		transition: background 0.4s ease, color 0.4s ease;
	}

	:global(button) {
		font-family: inherit;
	}

	:global(::-webkit-scrollbar) {
		width: 6px;
	}
	:global(::-webkit-scrollbar-track) {
		background: transparent;
	}
	:global(::-webkit-scrollbar-thumb) {
		background: var(--accent-primary-muted);
		border-radius: 10px;
	}
	:global(::-webkit-scrollbar-thumb:hover) {
		background: var(--accent-primary);
	}

	.uchu-app {
		position: relative;
		min-height: 100vh;
		background: var(--bg-gradient);
		transition: background 0.4s ease;
	}

	.texture-overlay {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		opacity: var(--texture-opacity);
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 200px 200px;
	}

	.app-container {
		position: relative;
		z-index: 1;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 2rem 6rem;
	}

	.view-wrapper {
		animation: viewFadeIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	}
	@keyframes viewFadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.bg-particles {
		position: fixed;
		inset: 0;
		pointer-events: none;
		z-index: 0;
		overflow: hidden;
	}
	.particle {
		position: absolute;
		border-radius: 50%;
		animation: floatParticle linear infinite;
	}
	.p1 {
		width: 250px;
		height: 250px;
		background: radial-gradient(circle, rgba(212, 160, 160, var(--particle-opacity-1)) 0%, transparent 70%);
		top: 10%;
		left: 10%;
		animation-duration: 22s;
	}
	.p2 {
		width: 350px;
		height: 350px;
		background: radial-gradient(circle, rgba(160, 160, 212, var(--particle-opacity-2)) 0%, transparent 70%);
		top: 45%;
		right: 5%;
		animation-duration: 28s;
		animation-delay: 4s;
	}
	.p3 {
		width: 200px;
		height: 200px;
		background: radial-gradient(circle, rgba(232, 220, 208, var(--particle-opacity-2)) 0%, transparent 70%);
		bottom: 25%;
		left: 35%;
		animation-duration: 20s;
		animation-delay: 8s;
	}
	@keyframes floatParticle {
		0% { opacity: 0; transform: translate(0, 0) scale(0.8); }
		15% { opacity: 1; }
		85% { opacity: 1; }
		100% { opacity: 0; transform: translate(60px, -80px) scale(1.2); }
	}

	@media (max-width: 600px) {
		.app-container {
			padding: 1rem 1rem 5.5rem;
		}
	}

	@media (min-width: 1400px) {
		.app-container {
			max-width: 1400px;
			padding: 2.5rem 3rem 6rem;
		}
	}
</style>
