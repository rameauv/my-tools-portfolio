export function CloseActiveIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Close Window (Active)</title>
			<g filter="url(#filter0_ii_active)">
				<rect fill="url(#paint0_linear_active)" height="19" rx="2" width="19" x="2" y="2" />
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<rect
				height="18"
				rx="1.5"
				stroke="url(#paint1_linear_active)"
				strokeOpacity="0.5"
				style={{ mixBlendMode: "color-burn" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<g filter="url(#filter1_f_active)">
				<rect fill="url(#paint2_linear_active)" height="15" width="1" x="4" y="4" />
				<rect fill="url(#paint3_linear_active)" height="15" transform="rotate(-90 4 5)" width="1" x="4" y="5" />
				<rect fill="white" height="2" width="2" x="3" y="3" />
			</g>
			<path d="M7 16L16 7M7 7L16 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="filter0_ii_active"
					width="29"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="effect1_innerShadow_active" />
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow_active" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 0.666667 0 0 0 0 0.137255 0 0 0 0 0 0 0 0 1 0" />
					<feBlend in2="effect1_innerShadow_active" mode="normal" result="effect2_innerShadow_active" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="filter1_f_active"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_active" stdDeviation="1.5" />
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_active" x1="11.5" x2="11.5" y1="2" y2="21">
					<stop stopColor="#E46446" />
					<stop offset="1" stopColor="#E65D32" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_active" x1="2" x2="21" y1="2" y2="21">
					<stop stopColor="#E45F3E" />
					<stop offset="0.333822" stopColor="#EE3000" />
					<stop offset="1" stopColor="#4E1000" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_active" x1="4.5" x2="4.5" y1="4" y2="19">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_active" x1="4.5" x2="4.5" y1="5" y2="20">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function CloseInactiveIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Close Window (Inactive)</title>
			<g opacity="0.6">
				<g filter="url(#filter0_ii_inactive)">
					<rect fill="url(#paint0_linear_inactive)" height="19" rx="2" width="19" x="2" y="2" />
				</g>
				<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
				<rect
					height="18"
					rx="1.5"
					stroke="url(#paint1_linear_inactive)"
					strokeOpacity="0.5"
					style={{ mixBlendMode: "color-burn" }}
					width="18"
					x="2.5"
					y="2.5"
				/>
				<g filter="url(#filter1_f_inactive)">
					<rect fill="url(#paint2_linear_inactive)" height="15" width="1" x="4" y="4" />
					<rect fill="url(#paint3_linear_inactive)" height="15" transform="rotate(-90 4 5)" width="1" x="4" y="5" />
					<rect fill="white" height="2" width="2" x="3" y="3" />
				</g>
			</g>
			<path d="M7 16L16 7M7 7L16 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="filter0_ii_inactive"
					width="29"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="effect1_innerShadow_inactive" />
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow_inactive" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 0.666667 0 0 0 0 0.137255 0 0 0 0 0 0 0 0 1 0" />
					<feBlend in2="effect1_innerShadow_inactive" mode="normal" result="effect2_innerShadow_inactive" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="filter1_f_inactive"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_inactive" stdDeviation="1.5" />
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_inactive" x1="11.5" x2="11.5" y1="2" y2="21">
					<stop stopColor="#E46446" />
					<stop offset="1" stopColor="#E65D32" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_inactive" x1="2" x2="21" y1="2" y2="21">
					<stop stopColor="#E45F3E" />
					<stop offset="0.333822" stopColor="#EE3000" />
					<stop offset="1" stopColor="#4E1000" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_inactive" x1="4.5" x2="4.5" y1="4" y2="19">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_inactive" x1="4.5" x2="4.5" y1="5" y2="20">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function CloseHoverIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Close Window (Hover)</title>
			<g filter="url(#filter0_ii_hover)">
				<rect fill="url(#paint0_linear_hover)" height="19" rx="2" width="19" x="2" y="2" />
				<rect fill="white" fillOpacity="0.2" height="19" rx="2" width="19" x="2" y="2" />
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<rect
				height="18"
				rx="1.5"
				stroke="url(#paint1_linear_hover)"
				strokeOpacity="0.5"
				style={{ mixBlendMode: "color-burn" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<rect
				height="18"
				rx="1.5"
				stroke="#FF8484"
				strokeOpacity="0.2"
				style={{ mixBlendMode: "overlay" }}
				width="18"
				x="2.5"
				y="2.5"
			/>
			<g filter="url(#filter1_f_hover)">
				<rect fill="url(#paint2_linear_hover)" height="15" width="1" x="4" y="4" />
				<rect fill="url(#paint3_linear_hover)" height="15" transform="rotate(-90 4 5)" width="1" x="4" y="5" />
				<rect fill="white" height="2" width="2" x="3" y="3" />
			</g>
			<g filter="url(#filter2_f_hover)">
				<rect fill="#FFA07A" height="7" style={{ mixBlendMode: "color-burn" }} width="7" x="12" y="12" />
			</g>
			<path d="M7 16L16 7M7 7L16 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="filter0_ii_hover"
					width="29"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feMorphology in="SourceAlpha" operator="dilate" radius="2" result="effect1_innerShadow_hover" />
					<feOffset dx="10" dy="2" />
					<feGaussianBlur stdDeviation="4" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow_hover" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.268931 0 0 0 0 0.0793945 0 0 0 1 0" />
					<feBlend in2="effect1_innerShadow_hover" mode="normal" result="effect2_innerShadow_hover" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="filter1_f_hover"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_hover" stdDeviation="1.5" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="17"
					id="filter2_f_hover"
					width="17"
					x="7"
					y="7"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_hover" stdDeviation="2.5" />
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_hover" x1="2" x2="21" y1="2" y2="21">
					<stop stopColor="#F45555" />
					<stop offset="0.5" stopColor="#F84C39" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_hover" x1="2" x2="21" y1="2" y2="21">
					<stop stopColor="#E45F3E" />
					<stop offset="0.333822" stopColor="#EE3000" />
					<stop offset="1" stopColor="#4E1000" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint2_linear_hover" x1="4.5" x2="4.5" y1="4" y2="19">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint3_linear_hover" x1="4.5" x2="4.5" y1="5" y2="20">
					<stop stopColor="white" />
					<stop offset="1" stopColor="white" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}

export function CloseClickedIcon() {
	return (
		<svg
			className="h-full w-full"
			fill="none"
			height="22"
			viewBox="0 0 22 22"
			width="22"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>Close Window (Clicked)</title>
			<g filter="url(#filter0_ii_clicked)">
				<rect fill="#BE3C1C" height="19" rx="2" width="19" x="2" y="2" />
			</g>
			<rect height="20" rx="2.5" stroke="white" width="20" x="1.5" y="1.5" />
			<g filter="url(#filter1_f_clicked)" opacity="0.33">
				<rect fill="url(#paint0_linear_clicked)" height="15" width="1" x="4" y="4" />
			</g>
			<g filter="url(#filter1_f_clicked)" opacity="0.33">
				<rect fill="url(#paint1_linear_clicked)" height="15" transform="rotate(-90 4 5)" width="1" x="4" y="5" />
				<rect fill="black" height="2" width="2" x="3" y="3" />
			</g>
			<g filter="url(#filter2_f_clicked)" opacity="0.33">
				<rect fill="#FFA07A" height="7" style={{ mixBlendMode: "color-burn" }} width="7" x="12" y="12" />
			</g>
			<g opacity="0.5">
				<path d="M7 16L16 7M7 7L16 16" stroke="white" strokeLinecap="round" strokeWidth="2" />
			</g>
			<defs>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="26"
					id="filter0_ii_clicked"
					width="25"
					x="-1"
					y="-2"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="2" dy="2" />
					<feGaussianBlur stdDeviation="1.5" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.66 0" />
					<feBlend in2="shape" mode="normal" result="effect1_innerShadow_clicked" />
					<feColorMatrix
						in="SourceAlpha"
						result="hardAlpha"
						type="matrix"
						values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
					/>
					<feOffset dx="-2" dy="-3" />
					<feGaussianBlur stdDeviation="2" />
					<feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
					<feColorMatrix type="matrix" values="0 0 0 0 0.764706 0 0 0 0 0.254902 0 0 0 0 0.117647 0 0 0 1 0" />
					<feBlend in2="effect1_innerShadow_clicked" mode="normal" result="effect2_innerShadow_clicked" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="22"
					id="filter1_f_clicked"
					width="22"
					x="0"
					y="0"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_clicked" stdDeviation="1.5" />
				</filter>
				<filter
					colorInterpolationFilters="sRGB"
					filterUnits="userSpaceOnUse"
					height="17"
					id="filter2_f_clicked"
					width="17"
					x="7"
					y="7"
				>
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
					<feGaussianBlur result="effect1_foregroundBlur_clicked" stdDeviation="2.5" />
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_clicked" x1="4.5" x2="4.5" y1="4" y2="19">
					<stop />
					<stop offset="1" stopOpacity="0" />
				</linearGradient>
				<linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_clicked" x1="4.5" x2="4.5" y1="5" y2="20">
					<stop />
					<stop offset="1" stopOpacity="0" />
				</linearGradient>
			</defs>
		</svg>
	);
}
