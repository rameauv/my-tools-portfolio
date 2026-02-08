export function PreviewLink(props: { href: string }) {
	return (
		<a
			className="inline-block h-[23px] cursor-default bg-[#ece9d8] px-3 py-1 align-middle font-normal text-[11px] text-black leading-[19px] transition-all"
			href={props.href}
			onMouseDown={(e) => {
				e.currentTarget.style.borderTop = "2px solid #aca899";
				e.currentTarget.style.borderLeft = "2px solid #aca899";
				e.currentTarget.style.borderBottom = "2px solid #ece9d8";
				e.currentTarget.style.borderRight = "2px solid #ece9d8";
				e.currentTarget.style.paddingLeft = "13px";
				e.currentTarget.style.paddingTop = "3px";
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.borderTop = "2px solid #f5f2e5";
				e.currentTarget.style.borderLeft = "2px solid #f5f2e5";
				e.currentTarget.style.borderBottom = "2px solid #8b8774";
				e.currentTarget.style.borderRight = "2px solid #8b8774";
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.borderTop = "2px solid #ece9d8";
				e.currentTarget.style.borderLeft = "2px solid #ece9d8";
				e.currentTarget.style.borderBottom = "2px solid #aca899";
				e.currentTarget.style.borderRight = "2px solid #aca899";
				e.currentTarget.style.paddingLeft = "12px";
				e.currentTarget.style.paddingTop = "2px";
			}}
			onMouseUp={(e) => {
				e.currentTarget.style.borderTop = "2px solid #f5f2e5";
				e.currentTarget.style.borderLeft = "2px solid #f5f2e5";
				e.currentTarget.style.borderBottom = "2px solid #8b8774";
				e.currentTarget.style.borderRight = "2px solid #8b8774";
				e.currentTarget.style.paddingLeft = "12px";
				e.currentTarget.style.paddingTop = "2px";
			}}
			rel="noopener noreferrer"
			style={{
				fontFamily: "Tahoma, sans-serif",
				borderTop: "2px solid #ece9d8",
				borderLeft: "2px solid #ece9d8",
				borderBottom: "2px solid #aca899",
				borderRight: "2px solid #aca899",
			}}
			target="_blank"
		>
			Preview
		</a>
	);
}
