export interface WindowContentProps<TData = unknown> {
	id: number;
	data?: TData;
	api: {
		onSetCanCloseStatusProvider: (id: number, provider: () => Promise<{ text: string } | null>) => void;
	};
}
