const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('uchu-theme') : null;

export const themeState = $state({
	mode: stored || 'dark'
});

export function toggleTheme() {
	themeState.mode = themeState.mode === 'dark' ? 'light' : 'dark';
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('uchu-theme', themeState.mode);
	}
	document.documentElement.setAttribute('data-theme', themeState.mode);
}

export function initTheme() {
	document.documentElement.setAttribute('data-theme', themeState.mode);
}
