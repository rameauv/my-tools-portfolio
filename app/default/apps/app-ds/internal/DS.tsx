import { Palette } from "lucide-react";
import React from "react";
import { Button } from "../../shared/ds/Button";
import { MenuBar } from "../../shared/ds/MenuBar";

export const DS = React.memo(function DS() {
	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#ece9d8]">
			<MenuBar />
			<div className="flex-1 overflow-y-auto p-6">
				<section className="mb-8">
					<h2 className="mb-3 font-semibold text-black text-sm">MenuBar</h2>
					<p className="mb-4 text-black/70 text-xs">Classic menu strip (shown above).</p>
				</section>
				<section className="mb-8">
					<h2 className="mb-3 font-semibold text-black text-sm">Button</h2>
					<div className="flex flex-wrap items-center gap-3">
						<Button onClick={() => {}}>Default</Button>
						<Button disabled>Disabled</Button>
						<Button icon={<Palette className="h-3.5 w-3.5" />} onClick={() => {}}>
							With icon
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
});
