export function MaximizeActiveIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Maximize Window (Active)</title>
			<g filter="url(#maximize_active_filter0)">
				<rect
					fill="url(#maximize_active_paint0)"
					height="19"
					rx="2"
					width="19"
					x="2"
					y="2"
				/>
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<rect
				height="18"
				rx="1.5"
				stroke="url(#maximize_active_paint1)"
				strokeOpacity="0.5"
				style={{ mixBlendMode: "color-burn" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<g filter="url(#maximize_active_filter1)">
				<rect
					fill="url(#maximize_active_paint2)"
					height="15"
					width="1"
					x="4"
					y="4"
				/>
				<rect
					fill="url(#maximize_active_paint3)"
					height="15"
					transform="rotate(-90 4 5)"
					width="1"
					x="4"
					y="5"
				/>
				<rect fill="white" height="2" width="2" x="3" y="3" />
			</g>
			<path
				d="M16 6.00049C16.5523 6.00049 17 6.4482 17 7.00049V17.0005H6V7.00049C6 6.4482 6.44772 6.00049 7 6.00049H16ZM7 9.00049V16.0005H16V9.00049H7Z"
				fill="white"
			/>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="maximize_active_filter0"
					width="31"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.33 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0313726 0 0 0 0 0.266667 0 0 0 0 0.764706 0 0 0 1 0"
					/>
					<feBlend
						in2="effect1_innerShadow"
						mode="normal"
						result="effect2_innerShadow"
					/>
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="maximize_active_filter1"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.5" />
				</filter>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_active_paint0"
					x1="11.5"
					x2="11.5"
					y1="2"
					y2="21"
				>
					<stop offset="0.33" stopColor="#225FF5" />
					<stop offset="0.66" stopColor="#256BF8" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_active_paint1"
					x1="2"
					x2="21"
					y1="2"
					y2="21"
				>
					<stop stopColor="#004CFF" />
					<stop offset="0.5" stopColor="#0047EE" />
					<stop offset="1" stopColor="#00174E" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_active_paint2"
					x1="4.5"
					x2="4.5"
					y1="4"
					y2="19"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_active_paint3"
					x1="4.5"
					x2="4.5"
					y1="5"
					y2="20"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function MaximizeInactiveIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Maximize Window (Inactive)</title>
			<g opacity="0.6">
				<g filter="url(#maximize_inactive_filter0)">
					<rect
						fill="url(#maximize_inactive_paint0)"
						height="19"
						rx="2"
						width="19"
						x="2"
						y="2"
					/>
				</g>
				<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
				<rect
					height="18"
					rx="1.5"
					stroke="url(#maximize_inactive_paint1)"
					strokeOpacity="0.5"
					style={{ mixBlendMode: "color-burn" }}
					width="18"
					x="2.5"
					y="2.5"
				/>
				<g filter="url(#maximize_inactive_filter1)">
					<rect
						fill="url(#maximize_inactive_paint2)"
						height="15"
						width="1"
						x="4"
						y="4"
					/>
					<rect
						fill="url(#maximize_inactive_paint3)"
						height="15"
						transform="rotate(-90 4 5)"
						width="1"
						x="4"
						y="5"
					/>
					<rect fill="white" height="2" width="2" x="3" y="3" />
				</g>
			</g>
			<path
				d="M16 6.00049C16.5523 6.00049 17 6.4482 17 7.00049V17.0005H6V7.00049C6 6.4482 6.44772 6.00049 7 6.00049H16ZM7 9.00049V16.0005H16V9.00049H7Z"
				fill="white"
			/>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="maximize_inactive_filter0"
					width="31"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.33 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0313726 0 0 0 0 0.266667 0 0 0 0 0.764706 0 0 0 1 0"
					/>
					<feBlend
						in2="effect1_innerShadow"
						mode="normal"
						result="effect2_innerShadow"
					/>
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="maximize_inactive_filter1"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.5" />
				</filter>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_inactive_paint0"
					x1="11.5"
					x2="11.5"
					y1="2"
					y2="21"
				>
					<stop offset="0.33" stopColor="#225FF5" />
					<stop offset="0.66" stopColor="#256BF8" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_inactive_paint1"
					x1="2"
					x2="21"
					y1="2"
					y2="21"
				>
					<stop stopColor="#004CFF" />
					<stop offset="0.5" stopColor="#0047EE" />
					<stop offset="1" stopColor="#00174E" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_inactive_paint2"
					x1="4.5"
					x2="4.5"
					y1="4"
					y2="19"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_inactive_paint3"
					x1="4.5"
					x2="4.5"
					y1="5"
					y2="20"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function MaximizeHoverIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Maximize Window (Hover)</title>
			<g filter="url(#maximize_hover_filter0)">
				<rect
					fill="url(#maximize_hover_paint0)"
					height="19"
					rx="2"
					width="19"
					x="2"
					y="2"
				/>
				<rect
					fill="white"
					fillOpacity="0.2"
					height="19"
					rx="2"
					width="19"
					x="2"
					y="2"
				/>
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<rect
				height="18"
				rx="1.5"
				stroke="url(#maximize_hover_paint1)"
				strokeOpacity="0.5"
				style={{ mixBlendMode: "color-burn" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<rect
				height="18"
				rx="1.5"
				stroke="#A7C4FF"
				strokeOpacity="0.2"
				style={{ mixBlendMode: "overlay" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<g filter="url(#maximize_hover_filter1)">
				<rect
					fill="url(#maximize_hover_paint2)"
					height="15"
					width="1"
					x="4"
					y="4"
				/>
				<rect
					fill="url(#maximize_hover_paint3)"
					height="15"
					transform="rotate(-90 4 5)"
					width="1"
					x="4"
					y="5"
				/>
				<rect fill="white" height="2" width="2" x="3" y="3" />
			</g>
			<g filter="url(#maximize_hover_filter2)">
				<rect
					fill="#3EB4FF"
					height="7"
					style={{ mixBlendMode: "color-burn" }}
					width="7"
					x="12"
					y="12"
				/>
			</g>
			<path
				d="M16 6.00049C16.5523 6.00049 17 6.4482 17 7.00049V17.0005H6V7.00049C6 6.4482 6.44772 6.00049 7 6.00049H16ZM7 9.00049V16.0005H16V9.00049H7Z"
				fill="white"
			/>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="maximize_hover_filter0"
					width="31"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.33 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0313726 0 0 0 0 0.266667 0 0 0 0 0.764706 0 0 0 1 0"
					/>
					<feBlend
						in2="effect1_innerShadow"
						mode="normal"
						result="effect2_innerShadow"
					/>
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="maximize_hover_filter1"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.5" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="17"
					id="maximize_hover_filter2"
					width="17"
					x="7"
					y="7"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="2.5" />
				</filter>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_hover_paint0"
					x1="11.5"
					x2="11.5"
					y1="2"
					y2="21"
				>
					<stop offset="0.33" stopColor="#225FF5" />
					<stop offset="0.66" stopColor="#256BF8" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_hover_paint1"
					x1="2"
					x2="21"
					y1="2"
					y2="21"
				>
					<stop stopColor="#004CFF" />
					<stop offset="0.5" stopColor="#0047EE" />
					<stop offset="1" stopColor="#00174E" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_hover_paint2"
					x1="4.5"
					x2="4.5"
					y1="4"
					y2="19"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_hover_paint3"
					x1="4.5"
					x2="4.5"
					y1="5"
					y2="20"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function MaximizeClickedIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Maximize Window (Clicked)</title>
			<g filter="url(#maximize_clicked_filter0)">
				<rect
					fill="url(#maximize_clicked_paint0)"
					height="19"
					rx="2"
					width="19"
					x="2"
					y="2"
				/>
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<g filter="url(#maximize_clicked_filter1)" opacity="0.33">
				<rect
					fill="url(#maximize_clicked_paint1)"
					height="15"
					width="1"
					x="4"
					y="4"
				/>
				<rect
					fill="url(#maximize_clicked_paint2)"
					height="15"
					transform="rotate(-90 4 5)"
					width="1"
					x="4"
					y="5"
				/>
				<rect fill="black" height="2" width="2" x="3" y="3" />
			</g>
			<g filter="url(#maximize_clicked_filter2)">
				<rect
					fill="#3EB4FF"
					fillOpacity="0.33"
					height="7"
					style={{ mixBlendMode: "color-burn" }}
					width="7"
					x="12"
					y="12"
				/>
			</g>
			<path
				d="M16 6.00049C16.5523 6.00049 17 6.4482 17 7.00049V17.0005H6V7.00049C6 6.4482 6.44772 6.00049 7 6.00049H16ZM7 9.00049V16.0005H16V9.00049H7Z"
				fill="white"
			/>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="maximize_clicked_filter0"
					width="25"
					x="-2"
					y="-3"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0313726 0 0 0 0 0.266667 0 0 0 0 0.764706 0 0 0 1 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="2" dy="2" />
					<feGaussianBlur stdDeviation="1.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.66 0"
					/>
					<feBlend
						in2="effect1_innerShadow"
						mode="normal"
						result="effect2_innerShadow"
					/>
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="maximize_clicked_filter1"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.5" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="17"
					id="maximize_clicked_filter2"
					width="17"
					x="6"
					y="6"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="2.5" />
				</filter>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_clicked_paint0"
					x1="1"
					x2="20"
					y1="1"
					y2="20"
				>
					<stop offset="0.33" stopColor="#0051BE" />
					<stop offset="0.701822" stopColor="#004DB2" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_clicked_paint1"
					x1="4.5"
					x2="4.5"
					y1="4"
					y2="19"
				>
					<stop />
					<stop offset="1" stopOpacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_clicked_paint2"
					x1="4.5"
					x2="4.5"
					y1="5"
					y2="20"
				>
					<stop />
					<stop offset="1" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function MaximizeDisabledIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Maximize Window (Disabled)</title>
			<g opacity="0.5">
				<g filter="url(#maximize_disabled_filter0)">
					<rect
						fill="url(#maximize_disabled_paint0)"
						height="19"
						rx="2"
						width="19"
						x="2"
						y="2"
					/>
				</g>
				<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
				<rect
					height="18"
					rx="1.5"
					stroke="url(#maximize_disabled_paint1)"
					strokeOpacity="0.5"
					style={{ mixBlendMode: "color-burn" }}
					width="18"
					x="2.5"
					y="2.5"
				/>
				<g filter="url(#maximize_disabled_filter1)">
					<rect
						fill="url(#maximize_disabled_paint2)"
						height="15"
						width="1"
						x="4"
						y="4"
					/>
					<rect
						fill="url(#maximize_disabled_paint3)"
						height="15"
						transform="rotate(-90 4 5)"
						width="1"
						x="4"
						y="5"
					/>
					<rect fill="white" height="2" width="2" x="3" y="3" />
				</g>
			</g>
			<g opacity="0.5">
				<path
					d="M16 6.00049C16.5523 6.00049 17 6.4482 17 7.00049V17.0005H6V7.00049C6 6.4482 6.44772 6.00049 7 6.00049H16ZM7 9.00049V16.0005H16V9.00049H7Z"
					fill="white"
				/>
			</g>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="maximize_disabled_filter0"
					width="31"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.33 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix
						type="matrix"
						values="0 0 0 0 0.0313726 0 0 0 0 0.266667 0 0 0 0 0.764706 0 0 0 1 0"
					/>
					<feBlend in2="shape" mode="normal" result="effect2_innerShadow" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="maximize_disabled_filter1"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend
						in="SourceGraphic"
						in2="BackgroundImageFix"
						mode="normal"
						result="shape"
					/>
					<feGaussianBlur result="effect1_foregroundBlur" stdDeviation="1.5" />
				</filter>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_disabled_paint0"
					x1="11.5"
					x2="11.5"
					y1="2"
					y2="21"
				>
					<stop offset="0.33" stopColor="#225FF5" />
					<stop offset="0.66" stopColor="#256BF8" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_disabled_paint1"
					x1="2"
					x2="21"
					y1="2"
					y2="21"
				>
					<stop stopColor="#004CFF" />
					<stop offset="0.5" stopColor="#0047EE" />
					<stop offset="1" stopColor="#00174E" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_disabled_paint2"
					x1="4.5"
					x2="4.5"
					y1="4"
					y2="19"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient
					gradientUnits="userSpaceOnUse"
					id="maximize_disabled_paint3"
					x1="4.5"
					x2="4.5"
					y1="5"
					y2="20"
				>
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}
