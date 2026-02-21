import React from "react";

export type SelectOption = {
	value: string;
	label: string;
};

export type SelectProps = {
	value: string;
	onChange: (value: string) => void;
	options: SelectOption[];
	className?: string;
};

const baseClassName = "rounded border border-gray-300 bg-white px-3 py-1.5 text-sm";

export const Select = React.memo((props: SelectProps) => {
	const className = props.className ? `${baseClassName} ${props.className}` : baseClassName;
	return (
		<select className={className} onChange={(e) => props.onChange(e.target.value)} value={props.value}>
			{props.options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	);
});
