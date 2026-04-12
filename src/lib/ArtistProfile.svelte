<script>
	import { albums, epsAndSingles, allReleases } from '../data/tracks.js';
	import locale from '../data/locale/en.json';
	import heroImage from '../assets/images/hero.png';
	import nemukoAvatar from '../assets/images/nemuko.jpg';
	import kanoAvatar from '../assets/images/kano.jpg';

	let { onSelectAlbum } = $props();
	let showAllReleases = $state(false);
	let visible = $state(false);

	$effect(() => {
		requestAnimationFrame(() => { visible = true; });
	});

	function handleAlbumClick(release) {
		if (onSelectAlbum) onSelectAlbum(release.id);
	}

	function getTypeLabel(type) {
		return locale.album.types[type] || type;
	}

	const displayedReleases = $derived(showAllReleases ? allReleases : allReleases.slice(0, 4));
</script>

<div class="artist-profile" class:visible>
	<section class="hero-banner">
		<img src={heroImage} alt="Uchu Nekoko banner" class="hero-img" />
		<div class="hero-overlay">
			<h1 class="hero-title">{locale.app.title}</h1>
			<p class="hero-subtitle">{locale.app.titleJp}</p>
		</div>
	</section>

	<div class="main-content">
		<section class="releases-section">
			<h2 class="section-title">{locale.profile.releases}</h2>
			<div class="releases-grid">
				{#each displayedReleases as release, i}
					<button
						class="release-card"
						style="--delay: {i * 0.07}s"
						onclick={() => handleAlbumClick(release)}
						aria-label="{release.title}"
					>
						<div class="release-cover-wrap">
							<img src={release.coverLow} alt="{release.title}" class="release-cover" loading="lazy" />
							<div class="release-play-overlay">
								<svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z"/>
								</svg>
							</div>
						</div>
						<div class="release-info">
							<span class="release-title">{release.title}</span>
							{#if release.titleJp}
								<span class="release-title-jp">{release.titleJp}</span>
							{/if}
							<span class="release-meta">{release.year} · {getTypeLabel(release.type)}</span>
						</div>
					</button>
				{/each}
			</div>
			{#if !showAllReleases && allReleases.length > 4}
				<button class="view-more-btn" onclick={() => showAllReleases = true}>
					{locale.profile.viewMore}
				</button>
			{/if}
		</section>

		<section class="biography-section">
			<div class="bio-members">
				<div class="member">
					<img src={nemukoAvatar} alt={locale.profile.members.nemuko} class="member-avatar" />
					<span class="member-name">{locale.profile.members.nemuko}</span>
				</div>
				<div class="member">
					<img src={kanoAvatar} alt={locale.profile.members.kano} class="member-avatar" />
					<span class="member-name">{locale.profile.members.kano}</span>
				</div>
			</div>
			{#each locale.profile.biography as paragraph, i}
				<p class="bio-text" class:bio-secondary={i > 0}>{paragraph}</p>
			{/each}
		</section>
	</div>
</div>

<style>
	.artist-profile {
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}
	.artist-profile.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-banner {
		position: relative;
		width: 100%;
		height: 260px;
		overflow: hidden;
		border-radius: var(--radius-lg);
		margin-bottom: 2rem;
		box-shadow: var(--shadow-elevated);
	}
	.hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
		filter: brightness(0.85) saturate(0.9);
		transition: transform 0.8s ease, filter 0.8s ease;
	}
	.hero-banner:hover .hero-img {
		transform: scale(1.03);
		filter: brightness(0.9) saturate(1);
	}
	.hero-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 2rem;
		background: linear-gradient(
			to top,
			var(--overlay-strong) 0%,
			var(--overlay-medium) 40%,
			transparent 70%
		);
	}
	.hero-title {
		font-family: var(--font-display);
		font-size: 2.6rem;
		font-weight: 700;
		color: #fff;
		letter-spacing: -0.5px;
		line-height: 1.1;
		text-shadow: 0 2px 20px rgba(0,0,0,0.5);
	}
	.hero-subtitle {
		font-family: var(--font-jp);
		font-size: 1.15rem;
		color: rgba(255,255,255,0.7);
		margin-top: 0.3rem;
		letter-spacing: 2px;
	}

	.main-content {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	.section-title {
		font-family: var(--font-display);
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1.2rem;
		letter-spacing: 0.5px;
	}

	.releases-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.release-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		overflow: hidden;
		cursor: pointer;
		transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		text-align: left;
		padding: 0;
		color: inherit;
		font: inherit;
		animation: fadeInCard 0.5s ease both;
		animation-delay: var(--delay);
		box-shadow: var(--shadow-card);
	}
	@keyframes fadeInCard {
		from { opacity: 0; transform: translateY(16px) scale(0.97); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
	.release-card:hover {
		background: var(--surface-hover);
		border-color: var(--accent-primary-muted);
		transform: translateY(-4px);
		box-shadow: var(--shadow-elevated);
	}

	.release-cover-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
	}
	.release-cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}
	.release-card:hover .release-cover {
		transform: scale(1.05);
	}
	.release-play-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0,0,0,0.4);
		opacity: 0;
		transition: opacity 0.35s ease;
		color: #fff;
	}
	.release-card:hover .release-play-overlay {
		opacity: 1;
	}

	.release-info {
		padding: 0.75rem 0.85rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.release-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.85rem;
		color: var(--text-primary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.release-title-jp {
		font-family: var(--font-jp);
		font-size: 0.72rem;
		color: var(--text-accent-muted);
	}
	.release-meta {
		font-size: 0.72rem;
		color: var(--text-secondary);
		margin-top: 0.1rem;
	}

	.view-more-btn {
		width: 100%;
		margin-top: 1rem;
		padding: 0.8rem;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-md);
		color: var(--text-primary);
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.35s ease;
		letter-spacing: 0.5px;
		box-shadow: var(--shadow-card);
	}
	.view-more-btn:hover {
		background: var(--surface-hover);
		border-color: var(--accent-primary-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-elevated);
	}

	.bio-members {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.2rem;
	}
	.member {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}
	.member-avatar {
		width: 56px;
		height: 56px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--accent-primary-muted);
		box-shadow: var(--shadow-card);
		transition: all 0.35s ease;
	}
	.member-avatar:hover {
		border-color: var(--accent-primary);
		transform: scale(1.08);
		box-shadow: var(--shadow-elevated);
	}
	.member-name {
		font-family: var(--font-display);
		font-size: 0.8rem;
		color: var(--text-accent);
		font-weight: 500;
	}

	.bio-text {
		font-size: 0.92rem;
		color: var(--text-secondary);
		line-height: 1.75;
		margin-bottom: 0.8rem;
	}
	.bio-secondary {
		color: var(--text-muted);
		font-size: 0.85rem;
	}

	@media (min-width: 640px) {
		.releases-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.2rem;
		}
	}

	@media (min-width: 768px) {
		.hero-banner {
			height: 340px;
		}
		.hero-title {
			font-size: 3.2rem;
		}
		.main-content {
			grid-template-columns: 1.3fr 1fr;
		}
	}

	@media (min-width: 1024px) {
		.hero-banner {
			height: 380px;
		}
		.releases-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.4rem;
		}
	}

	@media (min-width: 1280px) {
		.releases-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
</style>
