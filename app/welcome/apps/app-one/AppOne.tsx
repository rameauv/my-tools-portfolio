import { useEffect } from "react";

export function AppOne() {
    useEffect(() => {
        console.log("AppOne rendered");
    }, []);
  return (
    <div className="flex flex-col gap-4">
      <h1
        className="text-2xl font-bold text-black"
        style={{ fontFamily: "Tahoma, sans-serif" }}
      >
        Welcome to the Windows XP Portfolio 1
      </h1>
      <p
        className="text-sm text-black"
        style={{ fontFamily: "Tahoma, sans-serif" }}
      >
        This is a faithful recreation of the classic Windows XP interface built
        with React and Tailwind CSS.
      </p>
    </div>
  );
}
