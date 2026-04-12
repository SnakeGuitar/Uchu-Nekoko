<script>
	import { themeState, toggleTheme } from '../stores/themeStore.svelte.js';
	import locale from '../data/locale/en.json';
</script>

<button
	class="theme-toggle"
	onclick={toggleTheme}
	aria-label={themeState.mode === 'dark' ? locale.theme.toggleLight : locale.theme.toggleDark}
	title={themeState.mode === 'dark' ? locale.theme.toggleLight : locale.theme.toggleDark}
>
	{#if themeState.mode === 'dark'}
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icon">
			<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
		</svg>
	{:else}
		<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icon">
			<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 150;
		background: var(--surface-raised);
		border: 1px solid var(--border-subtle);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.35s ease;
		box-shadow: var(--shadow-card);
		color: var(--text-secondary);
	}
	.theme-toggle:hover {
		background: var(--surface-hover);
		color: var(--text-primary);
		transform: scale(1.1) rotate(15deg);
		box-shadow: var(--shadow-elevated);
	}
	.icon {
		transition: transform 0.4s ease;
	}
	.theme-toggle:hover .icon {
		transform: rotate(-15deg);
	}
</style>
