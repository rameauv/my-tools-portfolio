export const wallpapers = {
	bliss: {
		fallback: "/assets/wallpapers/bliss/wallpaper.jpg",
		sizes: {
			640: "/assets/wallpapers/bliss/wallpaper-640w.webp",
			1024: "/assets/wallpapers/bliss/wallpaper-1024w.webp",
			1280: "/assets/wallpapers/bliss/wallpaper-1280w.webp",
			1920: "/assets/wallpapers/bliss/wallpaper-1920w.webp",
			2560: "/assets/wallpapers/bliss/wallpaper-2560w.webp",
			3840: "/assets/wallpapers/bliss/wallpaper-3840w.webp",
		},
	},
} as const;

export function getWallpaperSrcSet(
	wallpaper: (typeof wallpapers)[keyof typeof wallpapers],
): string {
	return Object.entries(wallpaper.sizes)
		.map(([width, url]) => `${url} ${width}w`)
		.join(",\n\t\t\t");
}

export function getWallpaperSizes(
	wallpaper: (typeof wallpapers)[keyof typeof wallpapers],
): Array<{ width: number; url: string }> {
	return Object.entries(wallpaper.sizes).map(([width, url]) => ({
		width: Number.parseInt(width, 10),
		url,
	}));
}
