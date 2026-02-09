import { useEffect } from "react";
import { cancelRunningJobs } from "./apps/app-background-remover/internal/backgroundRemovalDB";

export function useCancelStaleRunningJobs() {
	useEffect(() => {
		cancelRunningJobs().catch((error) => {
			console.error("Failed to cancel stale running jobs:", error);
		});
	}, []);
}
