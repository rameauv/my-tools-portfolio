import { useQuery } from "@tanstack/react-query";

export function useWebGpuAdapters() {
	const { data: adapters } = useQuery({
		queryKey: ['webgpu-adapters'],
		queryFn: async () => {
			try {
				if ("gpu" in navigator && navigator.gpu) {
					const gpu = navigator.gpu as { requestAdapter(options: { powerPreference: 'high-performance' | 'low-power' | undefined }): Promise<any> };
					const lowPowerAdapter = await gpu.requestAdapter({
						powerPreference: 'low-power'
					});
					const highPerformanceAdapter = await gpu.requestAdapter({
						powerPreference: 'high-performance'
					});
					console.log("lowPowerAdapter", lowPowerAdapter);
					console.log("highPerformanceAdapter", highPerformanceAdapter);
					return {
						lowPowerAdapter,
						highPerformanceAdapter,
					};
				}
				return null;
			} catch {
				return null;
			}
		},
		staleTime: Infinity, // Adapters don't change during session
		retry: false, // If WebGPU isn't available, retrying won't help
	});

	return { adapters };
}
