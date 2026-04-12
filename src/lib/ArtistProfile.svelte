<script>
	import { albums, epsAndSingles } from '../data/tracks.js';
	import locale from '../data/locale/en.json';
	import heroImage from '../assets/images/hero.png';
	import nemukoAvatar from '../assets/images/nemuko.jpg';
	import kanoAvatar from '../assets/images/kano.jpg';

	let { onSelectAlbum } = $props();
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

	function groupByYear(releases) {
		const map = new Map();
		for (const r of releases) {
			if (!map.has(r.year)) map.set(r.year, []);
			map.get(r.year).push(r);
		}
		return [...map.entries()]
			.sort((a, b) => b[0] - a[0])
			.map(([year, items]) => ({ year, items }));
	}

	const albumsByYear = $derived(groupByYear([...albums].sort((a, b) => b.year - a.year)));
	const epsByYear = $derived(groupByYear([...epsAndSingles].sort((a, b) => b.year - a.year)));

	let globalCardIndex = 0;
</script>

<div class="artist-profile" class:visible>
	<section class="hero-banner">
		<img src={heroImage} alt="Uchu Nekoko banner" class="hero-img" />
		<div class="hero-overlay">
			<h1 class="hero-title">{locale.app.title}</h1>
			<p class="hero-subtitle">{locale.app.titleJp}</p>
		</div>
	</section>

	<div class="page-layout">
		<div class="discography-column">
			<h2 class="page-section-title">{locale.profile.releases}</h2>

			<div class="release-category">
				<h3 class="category-title">
					<span class="category-label">{locale.profile.albums}</span>
				</h3>
				{#each albumsByYear as group, gi}
					<div class="year-group">
						<div class="year-marker">
							<span class="year-label">{group.year}</span>
							<div class="year-line"></div>
						</div>
						<div class="releases-grid">
							{#each group.items as release, ri}
								<button
									class="release-card"
									style="--delay: {(gi * 0.12 + ri * 0.06)}s"
									onclick={() => handleAlbumClick(release)}
									aria-label="{release.title}"
								>
									<div class="release-cover-wrap">
										<img src={release.coverLow} alt="{release.title}" class="release-cover" loading="lazy" />
										<div class="release-play-overlay">
											<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
												<path d="M8 5v14l11-7z"/>
											</svg>
										</div>
									</div>
									<div class="release-info">
										<span class="release-title">{release.title}</span>
										<span class="release-title-jp">{release.titleJp || '\u00A0'}</span>
										<span class="release-meta">{getTypeLabel(release.type)}</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>

			<div class="release-category">
				<h3 class="category-title">
					<span class="category-label">{locale.profile.epsAndSingles}</span>
				</h3>
				{#each epsByYear as group, gi}
					<div class="year-group">
						<div class="year-marker">
							<span class="year-label">{group.year}</span>
							<div class="year-line"></div>
						</div>
						<div class="releases-grid">
							{#each group.items as release, ri}
								<button
									class="release-card"
									style="--delay: {(gi * 0.12 + ri * 0.06)}s"
									onclick={() => handleAlbumClick(release)}
									aria-label="{release.title}"
								>
									<div class="release-cover-wrap">
										<img src={release.coverLow} alt="{release.title}" class="release-cover" loading="lazy" />
										<div class="release-play-overlay">
											<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
												<path d="M8 5v14l11-7z"/>
											</svg>
										</div>
									</div>
									<div class="release-info">
										<span class="release-title">{release.title}</span>
										<span class="release-title-jp">{release.titleJp || '\u00A0'}</span>
										<span class="release-meta">{getTypeLabel(release.type)}</span>
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<aside class="biography-column">
			<div class="bio-card">
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
			</div>
		</aside>
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
		margin-bottom: 2.5rem;
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

	.page-layout {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
		align-items: start;
	}

	.page-section-title {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1.8rem;
		letter-spacing: 0.3px;
	}

	.release-category {
		margin-bottom: 2.5rem;
	}
	.release-category:last-child {
		margin-bottom: 0;
	}

	.category-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.2rem;
	}
	.category-label {
		font-family: var(--font-display);
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 2px;
		color: var(--accent-primary);
		background: var(--accent-primary-bg);
		padding: 0.25rem 0.7rem;
		border-radius: 4px;
		border: 1px solid var(--accent-primary-muted);
	}

	.year-group {
		margin-bottom: 1.5rem;
	}
	.year-group:last-child {
		margin-bottom: 0;
	}

	.year-marker {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.85rem;
	}
	.year-label {
		font-family: var(--font-display);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 1px;
		white-space: nowrap;
	}
	.year-line {
		flex: 1;
		height: 1px;
		background: var(--border-subtle);
	}

	.releases-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.85rem;
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
		display: grid;
		grid-template-rows: auto 1fr;
	}
	@keyframes fadeInCard {
		from { opacity: 0; transform: translateY(12px) scale(0.98); }
		to { opacity: 1; transform: translateY(0) scale(1); }
	}
	.release-card:hover {
		background: var(--surface-hover);
		border-color: var(--accent-primary-muted);
		transform: translateY(-3px);
		box-shadow: var(--shadow-elevated);
	}

	.release-cover-wrap {
		position: relative;
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
	}
	.release-cover {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
		display: block;
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
		padding: 0.7rem 0.8rem;
		display: grid;
		grid-template-rows: 1fr auto auto;
		gap: 0.1rem;
		min-height: 68px;
	}
	.release-title {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: 0.82rem;
		color: var(--text-primary);
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 1.3;
	}
	.release-title-jp {
		font-family: var(--font-jp);
		font-size: 0.7rem;
		color: var(--text-accent-muted);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.release-meta {
		font-size: 0.68rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		color: var(--text-secondary);
	}

	.biography-column {
		position: sticky;
		top: 1rem;
	}
	.bio-card {
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: var(--radius-lg);
		padding: 1.5rem;
		box-shadow: var(--shadow-card);
	}
	.bio-members {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.4rem;
	}
	.member {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}
	.member-avatar {
		width: 60px;
		height: 60px;
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
		font-size: 0.9rem;
		color: var(--text-secondary);
		line-height: 1.75;
		margin-bottom: 0.8rem;
	}
	.bio-secondary {
		color: var(--text-muted);
		font-size: 0.83rem;
	}

	@media (min-width: 480px) {
		.releases-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 768px) {
		.hero-banner {
			height: 320px;
		}
		.hero-title {
			font-size: 3.2rem;
		}
		.page-layout {
			grid-template-columns: 1fr 280px;
			gap: 3rem;
		}
	}

	@media (min-width: 1024px) {
		.hero-banner {
			height: 370px;
		}
		.releases-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: 1rem;
		}
		.page-layout {
			grid-template-columns: 1fr 300px;
		}
	}

	@media (min-width: 1280px) {
		.releases-grid {
			grid-template-columns: repeat(4, 1fr);
		}
		.page-layout {
			grid-template-columns: 1fr 320px;
		}
	}
</style>
