import * as React from "react";
import { useState } from "react";
import { cn } from "~/utils/cn";
import { CloseActiveIcon, CloseClickedIcon, CloseHoverIcon, CloseInactiveIcon } from "./icons/CloseButtonIcons";
import {
	MaximizeActiveIcon,
	MaximizeClickedIcon,
	MaximizeHoverIcon,
	MaximizeInactiveIcon,
} from "./icons/MaximizeIcons";
import {
	MinimizeActiveIcon,
	MinimizeClickedIcon,
	MinimizeHoverIcon,
	MinimizeInactiveIcon,
} from "./icons/MinimizeIcons";

export const WindowHeader = React.memo(
	(props: {
		title?: string;
		onClose?: () => void;
		onMinimize?: () => void;
		onMouseDown?: (e: React.MouseEvent) => void;
		onMaximize?: () => void;
		isFocused: boolean;
		isMobile: boolean;
	}) => {
		return (
			<div
				className={cn(
					"flex cursor-move select-none items-center justify-between px-2 py-1",
					props.isFocused
						? "bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6]"
						: "bg-linear-to-b from-[#7a96df] via-[#9db9eb] to-[#7a96df]",
					props.isMobile && "cursor-default",
				)}
				onMouseDown={props.isMobile ? undefined : props.onMouseDown}
			>
				<div className="pointer-events-none flex items-center gap-2 overflow-hidden">
					<span
						className={cn("truncate font-bold text-sm shadow-sm", props.isFocused ? "text-white" : "text-[#dbe1f1]")}
					>
						{props.title ?? "Window"}
					</span>
				</div>
				<div className="relative z-10 flex items-center gap-1">
					<MinimizeButton isFocused={props.isFocused} onClick={props.onMinimize} />
					{!props.isMobile && <MaximizeButton isFocused={props.isFocused} onClick={props.onMaximize} />}
					<CloseButton isFocused={props.isFocused} onClick={props.onClose} />
				</div>
			</div>
		);
	},
);

const MINIMIZE_ICONS = {
	active: <MinimizeActiveIcon />,
	inactive: <MinimizeInactiveIcon />,
	hover: <MinimizeHoverIcon />,
	clicked: <MinimizeClickedIcon />,
};

const MAXIMIZE_ICONS = {
	active: <MaximizeActiveIcon />,
	inactive: <MaximizeInactiveIcon />,
	hover: <MaximizeHoverIcon />,
	clicked: <MaximizeClickedIcon />,
};

const CLOSE_ICONS = {
	active: <CloseActiveIcon />,
	inactive: <CloseInactiveIcon />,
	hover: <CloseHoverIcon />,
	clicked: <CloseClickedIcon />,
};

export const MinimizeButton = React.memo(function MinimizeButton(props: { isFocused: boolean; onClick?: () => void }) {
	return <WindowControlButton icons={MINIMIZE_ICONS} isFocused={props.isFocused} onClick={props.onClick} />;
});

export const MaximizeButton = React.memo(function MaximizeButton(props: { isFocused: boolean; onClick?: () => void }) {
	return <WindowControlButton icons={MAXIMIZE_ICONS} isFocused={props.isFocused} onClick={props.onClick} />;
});

export const CloseButton = React.memo(function CloseButton(props: { isFocused: boolean; onClick?: () => void }) {
	return <WindowControlButton icons={CLOSE_ICONS} isFocused={props.isFocused} onClick={props.onClick} />;
});

function WindowControlButton(props: {
	isFocused: boolean;
	onClick?: () => void;
	icons: {
		active: React.ReactNode;
		inactive: React.ReactNode;
		hover: React.ReactNode;
		clicked: React.ReactNode;
	};
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);

	const renderIcon = () => {
		if (!props.isFocused) {
			return props.icons.inactive;
		}

		if (isPressed) {
			return props.icons.clicked;
		}

		if (isHovered) {
			return props.icons.hover;
		}

		return props.icons.active;
	};

	return (
		<button
			className="flex h-[21px] w-[21px] cursor-pointer items-center justify-center border-none bg-transparent outline-none"
			onMouseDown={(_e) => {
				setIsPressed(true);
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				setIsPressed(false);
			}}
			onMouseUp={() => {
				setIsPressed(false);
				props.onClick?.();
			}}
			type="button"
		>
			{renderIcon()}
		</button>
	);
}
