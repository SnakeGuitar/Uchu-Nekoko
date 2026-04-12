const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('uchu-volume') : null;

export const playerState = $state({
	currentView: 'profile',
	currentAlbumId: null,
	playing: false,
	currentTrack: 0,
	currentTime: 0,
	duration: 0,
	volume: stored ? parseFloat(stored) : 0.8,
	queueAlbumId: null,
	queue: [],
	expanded: false
});
