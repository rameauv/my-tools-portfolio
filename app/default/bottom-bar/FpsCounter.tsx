import React, { startTransition, useEffect, useRef, useState } from "react";

export const FpsCounter = React.memo(() => {
	const lastTimeRef = useRef<number>(0);
	const lastUpdateTimeRef = useRef<number>(0);
	const rafIdRef = useRef<number | null>(null);
	const [fps, setFps] = useState(0);

	useEffect(() => {
		function updateFps() {
			rafIdRef.current = requestAnimationFrame(updateFps);
			const now = performance.now();
			if (lastTimeRef.current === 0) {
				lastTimeRef.current = now;
				return;
			}
			if (lastUpdateTimeRef.current === 0 || lastUpdateTimeRef.current + 1000 < now) {
				const lastTime = lastTimeRef.current;
				lastUpdateTimeRef.current = now;
				startTransition(() => {
					setFps(Math.floor(1000 / (now - lastTime)));
				});
			}
			lastTimeRef.current = now;
		}
		updateFps();
		return () => {
			if (rafIdRef.current !== null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, []);
	return (
		<div>
			<span className="text-sm text-white tabular-nums">FPS: {fps}</span>
		</div>
	);
});
