import React, { useEffect, useEffectEvent, useState } from "react";

export const StatusSectionClock = React.memo(() => {
	const [formattedTime, setFormattedTime] = useState(formatTime(new Date()));

	const updateTime = useEffectEvent(() => {
		const newFormattedTime = formatTime(new Date());
		if (newFormattedTime !== formattedTime) {
			setFormattedTime(newFormattedTime);
		}
	});

	useEffect(() => {
		const timer = setInterval(updateTime, 1000);
		return () => clearInterval(timer);
	}, []);

	return (
		<div className="flex items-center gap-2">
			<span className="text-sm text-white">{formattedTime}</span>
		</div>
	);
});

function formatTime(date: Date): string {
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${hours}:${minutes}`;
}
