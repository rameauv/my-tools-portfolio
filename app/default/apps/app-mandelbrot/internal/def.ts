import type { AppDef } from "../../AppDef";
import { Mandelbrot } from "./Mandelbrot";

export const def: AppDef = {
	appId: "MANDELBROT",
	title: "WebGL Mandelbrot",
	iconSrc:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%230f172a'/%3E%3Ccircle cx='50' cy='50' r='28' fill='none' stroke='%2322d3ee' stroke-width='6'/%3E%3Cpath d='M26 50c8-14 40-14 48 0-8 14-40 14-48 0z' fill='none' stroke='%23a78bfa' stroke-width='6'/%3E%3C/svg%3E",
	component: Mandelbrot,
	groupingId: "MANDELBROT",
	defaultWidth: 900,
	defaultHeight: 600,
};
