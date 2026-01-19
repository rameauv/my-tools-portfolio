import * as React from "react";
import { useState } from "react";
import { linkedinData } from "./data";

interface LinkedInIframeProps {
  profileUrl?: string;
}

export function LinkedInIframe({ profileUrl }: LinkedInIframeProps) {
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const profile = linkedinData;
  // Extract vanity name from LinkedIn URL
  const extractVanityName = (url: string): string | null => {
    const match = url.match(/\/in\/([^\/\?]+)/);
    return match ? match[1] : null;
  };
  const vanityName = profile?.personal_information?.contact?.linkedin 
    ? extractVanityName(profile.personal_information.contact.linkedin)
    : null;
  const defaultUrl = vanityName 
    ? `https://www.linkedin.com/in/${vanityName}`
    : "https://www.linkedin.com";

  const url = profileUrl || defaultUrl;

  return (
    <div className="w-full h-full bg-white relative">
      {/* Loading/Error State */}
      {(isLoading || iframeError) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center text-gray-500 text-xs p-4 max-w-md">
            {iframeError ? (
              <>
                <p className="mb-2 font-bold text-red-600">Unable to load LinkedIn profile</p>
                <p className="mb-4 text-[10px] text-gray-400">
                  LinkedIn blocks embedding in iframes for security reasons.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-xs hover:bg-blue-700 transition-colors"
                >
                  Open LinkedIn Profile in New Tab
                </a>
              </>
            ) : (
              <>
                <p className="mb-2">Loading LinkedIn profile...</p>
                <p className="text-[10px] text-gray-400">Note: LinkedIn may block embedding in iframes</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={url}
        className="w-full h-full border-0"
        title="LinkedIn Profile"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
        allow="clipboard-read; clipboard-write"
        style={{
          minHeight: "100%",
          opacity: iframeError ? 0 : 1,
        }}
        onLoad={(e) => {
          setIsLoading(false);
          // Check if iframe actually loaded content (LinkedIn will show an error page)
          try {
            const iframe = e.currentTarget;
            // Try to detect if LinkedIn blocked the iframe
            // This is a best-effort check since we can't access iframe content due to CORS
            setTimeout(() => {
              // If still loading after timeout, might be blocked
            }, 3000);
          } catch (err) {
            // Can't access iframe content due to CORS
          }
        }}
        onError={() => {
          setIframeError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
