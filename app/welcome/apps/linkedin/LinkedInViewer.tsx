import * as React from "react";
import { useState } from "react";
import { ChevronRight, Home, User, Book, Camera, MessageSquare, Music, Settings, MoreHorizontal } from "lucide-react";
import clsx from "clsx";
import { linkedinData } from "./data";
import type { LinkedInProfile } from "./types";

type Tab = "home" | "profile" | "diary" | "photo" | "guestbook";

export function LinkedInViewer() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const profile = linkedinData[0]; // Use the first profile (en_US)

  if (!profile) return <div className="p-4">No profile data found.</div>;

  return (
    <div className="@container w-full h-full bg-[#b3b3b3] p-2 @@sm:p-4 flex items-center justify-center overflow-auto font-sans select-none"
      style={{
        backgroundImage: "radial-gradient(#999 1px, transparent 1px)",
        backgroundSize: "4px 4px"
      }}
    >
      {/* Main Binder Container */}
      <div className="w-full max-w-[850px] min-h-[580px] h-auto @sm:h-[580px] bg-[#a0a0a0] rounded-lg @sm:rounded-xl p-2 @sm:p-3 shadow-2xl relative flex flex-col @sm:flex-row gap-2">
        {/* Inner White Container (The "Paper") */}
        <div className="w-full h-full bg-white rounded-lg border-2 border-white flex flex-col @sm:flex-row relative">
          
          {/* Left Panel */}
          <div className="w-full @sm:w-[240px] h-auto @sm:h-full bg-[#f0f0f0] border-b @sm:border-b-0 @sm:border-r border-gray-300 p-2 @sm:p-3 flex flex-col gap-2 @sm:gap-3 shrink-0">
             <div className="bg-white border border-gray-300 rounded p-1 text-xs text-center text-gray-500 mb-1 shadow-sm">
                TODAY <span className="text-red-500 font-bold">28</span> | TOTAL <span className="font-bold">2026</span>
             </div>
             
             <div className="flex-1 bg-white border border-gray-300 rounded p-4 flex flex-col items-center gap-4 shadow-sm relative overflow-hidden">
                {/* Profile Pic */}
                <div className="w-24 h-24 @sm:w-40 @sm:h-40 bg-gray-200 border border-gray-300 p-1 mx-auto">
                   <img 
                      src={profile.profilePicture || "/my-documents.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                   />
                </div>
                
                <div className="w-full text-center space-y-2">
                   <p className="text-xs text-blue-800 leading-relaxed border-b border-dotted border-gray-400 pb-2">
                      {profile.headline || "Software Engineer"}
                   </p>
                   
                   <div className="text-xs text-gray-600 text-left w-full px-2 space-y-1 mt-2">
                      <div className="flex items-center gap-1">
                         <span className="font-bold text-gray-800">Name</span> 
                         <span>{profile.firstName} {profile.lastName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="font-bold text-gray-800">Birth</span> 
                         <span>199X.XX.XX</span>
                      </div>
                      <div className="flex items-center gap-1">
                         <span className="font-bold text-gray-800">Sex</span> 
                         <span>Male</span>
                      </div>
                   </div>
                   
                   <div className="mt-4 w-full">
                       <div className="flex items-center justify-between text-[10px] text-gray-500 cursor-pointer hover:text-orange-500 transition-colors">
                           <span>Edit Profile</span>
                           <ChevronRight size={10} />
                       </div>
                       <div className="w-full h-px bg-gray-200 my-1" />
                       <div className="flex items-center justify-between text-[10px] text-gray-500 cursor-pointer hover:text-orange-500 transition-colors">
                           <span>History</span>
                           <ChevronRight size={10} />
                       </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Panel (Content) */}
          <div className="flex-1 h-full bg-white p-1 @sm:p-2 flex flex-col relative z-10">
             {/* Header */}
             <div className="w-full flex flex-col @sm:flex-row @sm:justify-between @sm:items-end border-b border-gray-300 pb-1 @sm:pb-2 mb-1 @sm:mb-2 px-1 @sm:px-2 gap-1">
                <div className="text-sm @sm:text-lg font-bold text-blue-900 tracking-tight">
                   {profile.firstName}'s Minihompy
                </div>
                <div className="text-[9px] @sm:text-[10px] text-gray-500 mb-0 @sm:mb-1 truncate">
                   http://www.cyworld.com/{profile.vanityName || "valentin"}
                </div>
             </div>

             {/* Content Area */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-1 @sm:p-2 bg-white">
                {activeTab === "home" && <HomeView profile={profile} />}
                {activeTab === "profile" && <ProfileView profile={profile} />}
                {activeTab === "diary" && <DiaryView profile={profile} />}
                {activeTab === "photo" && <PhotoView profile={profile} />}
                {activeTab === "guestbook" && <GuestbookView profile={profile} />}
             </div>
          </div>

          {/* Side Tabs - Desktop: Right side, Mobile: Bottom */}
          <div className="absolute -right-[76px] top-10 hidden @sm:flex flex-col gap-1 z-0">
             <TabButton active={activeTab === "home"} label="Home" onClick={() => setActiveTab("home")} />
             <TabButton active={activeTab === "profile"} label="Profile" onClick={() => setActiveTab("profile")} />
             <TabButton active={activeTab === "diary"} label="Diary" onClick={() => setActiveTab("diary")} />
             <TabButton active={activeTab === "photo"} label="Photo" onClick={() => setActiveTab("photo")} />
             <TabButton active={activeTab === "guestbook"} label="Guest" onClick={() => setActiveTab("guestbook")} />
          </div>
          
          {/* Mobile Tabs - Bottom */}
          <div className="@sm:hidden w-full flex gap-1 p-2 bg-[#f0f0f0] border-t border-gray-300 overflow-x-auto">
             <TabButton active={activeTab === "home"} label="Home" onClick={() => setActiveTab("home")} mobile />
             <TabButton active={activeTab === "profile"} label="Profile" onClick={() => setActiveTab("profile")} mobile />
             <TabButton active={activeTab === "diary"} label="Diary" onClick={() => setActiveTab("diary")} mobile />
             <TabButton active={activeTab === "photo"} label="Photo" onClick={() => setActiveTab("photo")} mobile />
             <TabButton active={activeTab === "guestbook"} label="Guest" onClick={() => setActiveTab("guestbook")} mobile />
          </div>

        </div>
      </div>
    </div>
  );
}

// -- Sub Components --

function TabButton({ label, active, onClick, mobile = false }: { label: string, active: boolean, onClick: () => void, mobile?: boolean }) {
   if (mobile) {
      return (
         <button
            onClick={onClick}
            className={clsx(
               "px-3 py-1.5 rounded-md text-[10px] @sm:text-xs border text-white transition-all flex items-center shrink-0",
               active 
                  ? "bg-white text-gray-800 border-gray-400 font-bold" 
                  : "bg-[#238db4] border-[#1b7291] hover:bg-[#2aa6d3]"
            )}
         >
            {label}
         </button>
      );
   }
   
   return (
      <button
         onClick={onClick}
         className={clsx(
            "w-[74px] h-[30px] rounded-r-md text-xs border border-l-0 text-white transition-all flex items-center pl-2 mb-0.5",
            active 
               ? "bg-white text-gray-800 border-gray-400 font-bold translate-x-[-2px] z-20 border-l border-l-white" 
               : "bg-[#238db4] border-[#1b7291] hover:bg-[#2aa6d3]"
         )}
      >
         {label}
      </button>
   );
}

function HomeView({ profile }: { profile: LinkedInProfile }) {
   return (
      <div className="flex flex-col gap-2 @sm:gap-4 h-full">
         {/* BGM Player Mock */}
         <div className="w-full bg-[#efefef] border border-gray-300 p-0.5 @sm:p-1 flex items-center justify-between text-[9px] @sm:text-[11px] rounded-sm px-1 @sm:px-2">
            <div className="flex items-center gap-0.5 @sm:gap-1 min-w-0">
                <Music size={10} className="@sm:w-3 @sm:h-3 text-gray-500 shrink-0" />
                <span className="font-bold text-gray-700 truncate">Now Playing: Developer's Life - Coding All Night.mp3</span>
            </div>
            <div className="flex gap-1 @sm:gap-2 text-gray-400 shrink-0">
               <span>◀</span><span>II</span><span>▶</span>
            </div>
         </div>

         {/* Latest Posts Preview */}
         <div className="flex gap-1 @sm:gap-2 text-[9px] @sm:text-[11px] text-gray-600 mb-1 @sm:mb-2 px-0.5 @sm:px-1">
            <span className="text-orange-500 font-bold shrink-0">News</span>
            <span className="flex-1 truncate">Updated portfolio with new projects!</span>
            <span className="text-gray-400 shrink-0 hidden @sm:inline">10.28</span>
         </div>

         {/* Miniroom */}
         <div className="w-full bg-[#c3d6e2] border border-gray-300 rounded p-2 @sm:p-4 relative h-[180px] @sm:h-[250px] shadow-inner flex flex-col items-center justify-center">
             <div className="absolute top-1 @sm:top-2 left-1 @sm:left-2 text-[9px] @sm:text-[10px] text-gray-500">My Miniroom</div>
             
             {/* Simple CSS Art Room */}
             <div className="relative w-[200px] h-[120px] @sm:w-[300px] @sm:h-[180px]">
                 {/* Floor */}
                 <div className="absolute bottom-0 w-full h-[60px] bg-[#e0cba8] border-t border-[#c0a880] transform skew-x-[-20deg] origin-bottom-left z-0"></div>
                 {/* Wall L */}
                 <div className="absolute top-0 left-0 w-[100px] h-[120px] bg-[#eef4f8] border-r border-gray-300 transform skew-y-20 origin-top-right z-0"></div>
                 {/* Wall R */}
                 <div className="absolute top-0 right-0 w-[200px] h-[120px] bg-[#dcebf5] z-0"></div>

                 {/* Avatar (Pixel-ish) */}
                 <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
                     <div className="w-8 h-8 bg-black rounded-full mb-1 border-2 border-white"></div> {/* Head */}
                     <div className="w-6 h-10 bg-blue-600 rounded-t-lg"></div> {/* Body */}
                     <div className="bg-white px-2 py-0.5 text-[9px] border border-gray-400 rounded mt-1 shadow-sm whitespace-nowrap">
                        Welcome to my home!
                     </div>
                 </div>

                 {/* Furniture: Desk */}
                 <div className="absolute bottom-16 right-10 w-16 h-10 bg-amber-800 rounded-sm z-10">
                    <div className="absolute -top-4 left-2 w-8 h-6 bg-black border-2 border-gray-600 rounded-t-md"></div> {/* Monitor */}
                 </div>
             </div>
         </div>

         {/* What's Friends Say (Headline) */}
         <div className="mt-1 @sm:mt-2 border-t border-dotted border-gray-300 pt-1 @sm:pt-2">
            <h3 className="text-[10px] @sm:text-xs font-bold text-blue-800 mb-1 @sm:mb-2">Updated News</h3>
            <div className="text-[9px] @sm:text-[11px] text-gray-600 space-y-0.5 @sm:space-y-1">
               <p>• {profile.headline}</p>
               <p>• Currently working at {profile.positions.find(p => p.isCurrent)?.companyName || "Unknown"}</p>
            </div>
         </div>
      </div>
   );
}

function ProfileView({ profile }: { profile: LinkedInProfile }) {
   return (
      <div className="p-1 @sm:p-2">
         <div className="bg-[#fcfcfc] border border-gray-200 p-2 @sm:p-4 rounded shadow-sm">
            <h2 className="text-xs @sm:text-sm font-bold text-blue-800 mb-2 @sm:mb-3 border-b border-gray-200 pb-1">Intro</h2>
            <div className="text-[10px] @sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
               {profile.headline}
            </div>
            
            <h2 className="text-xs @sm:text-sm font-bold text-blue-800 mt-4 @sm:mt-6 mb-2 @sm:mb-3 border-b border-gray-200 pb-1">Contact</h2>
            <div className="text-[10px] @sm:text-xs text-gray-700 space-y-1 @sm:space-y-2">
               {profile.locale && <p><span className="font-bold inline-block w-12 @sm:w-16">Region:</span> {profile.locale}</p>}
               {profile.vanityName && <p><span className="font-bold inline-block w-12 @sm:w-16">ID:</span> {profile.vanityName}</p>}
            </div>
         </div>
      </div>
   );
}

function DiaryView({ profile }: { profile: LinkedInProfile }) {
   return (
      <div className="space-y-4 @sm:space-y-6 p-1 @sm:p-2">
         {profile.positions.map((pos, idx) => (
            <div key={idx} className="bg-white">
               {/* Date Header */}
               <div className="flex items-center gap-1 @sm:gap-2 mb-1 @sm:mb-2">
                  <span className="text-orange-500 font-bold text-[10px] @sm:text-[11px]">
                     {pos.startDate || "Unknown"}
                  </span>
                  <div className="h-px bg-gray-200 flex-1"></div>
               </div>
               
               {/* Diary Entry */}
               <div className="bg-[#f9f9f9] p-2 @sm:p-4 border border-gray-200 rounded-sm shadow-sm">
                  <h3 className="font-bold text-xs @sm:text-sm text-gray-800 mb-1">{pos.title}</h3>
                  <div className="text-[10px] @sm:text-xs text-blue-600 mb-2 @sm:mb-3 font-semibold flex items-center gap-1 @sm:gap-2 flex-wrap">
                     {pos.companyLogo && <img src={pos.companyLogo} className="w-3 h-3 @sm:w-4 @sm:h-4 object-contain" alt="" />}
                     <span className="min-w-0">{pos.companyName}</span>
                     {pos.location && <span className="text-gray-400 font-normal text-[9px] @sm:text-[10px]">({pos.location})</span>}
                  </div>
                  
                  <div className="text-[10px] @sm:text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                     {pos.description}
                  </div>

                  {/* Skills Tags */}
                  {pos.skills && pos.skills.length > 0 && (
                     <div className="mt-2 @sm:mt-4 flex flex-wrap gap-1">
                        {pos.skills.map(skill => (
                           <span key={skill} className="bg-orange-100 text-orange-800 px-1 @sm:px-1.5 py-0.5 rounded text-[9px] @sm:text-[10px]">
                              #{skill}
                           </span>
                        ))}
                     </div>
                  )}
                  
                  {/* Images */}
                  {pos.images && pos.images.length > 0 && (
                     <div className="mt-2 @sm:mt-4 grid grid-cols-1 @sm:grid-cols-2 gap-1 @sm:gap-2">
                        {pos.images.map((img, i) => (
                           <div key={i} className="aspect-video bg-gray-100 border border-gray-200 overflow-hidden rounded-sm">
                              <img src={img} className="w-full h-full object-cover hover:scale-105 transition-transform" alt="" />
                           </div>
                        ))}
                     </div>
                  )}
               </div>
               
               {/* Footer */}
               <div className="mt-1 text-[9px] @sm:text-[10px] text-gray-400 text-right">
                   Feeling: 💻 Productive | Weather: ☀️ Sunny
               </div>
            </div>
         ))}
      </div>
   );
}

function PhotoView({ profile }: { profile: LinkedInProfile }) {
    // Combine education and diplomas into a photo gallery style
    const items = [
        ...(profile.educations || []),
        ...(profile.diplomas || [])
    ];

    return (
       <div className="grid grid-cols-1 @sm:grid-cols-2 gap-2 @sm:gap-4 p-1 @sm:p-2">
          {items.map((item: any, idx) => (
             <div key={idx} className="bg-white border border-gray-300 p-1.5 @sm:p-2 shadow-sm flex flex-col items-center text-center hover:border-orange-300 transition-colors cursor-pointer group">
                <div className="w-full aspect-square bg-gray-100 mb-1 @sm:mb-2 flex items-center justify-center overflow-hidden border border-gray-200">
                    {item.images && item.images[0] ? (
                        <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="text-gray-300 group-hover:text-orange-300 transition-colors">
                            <Camera size={24} className="@sm:w-8 @sm:h-8" />
                        </div>
                    )}
                </div>
                <h4 className="font-bold text-[10px] @sm:text-xs text-gray-800 line-clamp-1">{item.schoolName}</h4>
                <p className="text-[9px] @sm:text-[10px] text-gray-500">{item.degree || item.fieldOfStudy}</p>
                <p className="text-[9px] @sm:text-[10px] text-gray-400 mt-0.5 @sm:mt-1">{item.startDate} ~ {item.endDate}</p>
             </div>
          ))}
          
          {items.length === 0 && (
             <div className="col-span-1 @sm:col-span-2 text-center text-gray-400 py-6 @sm:py-10 text-[10px] @sm:text-xs">
                 No photos uploaded yet.
             </div>
          )}
       </div>
    );
 }

 function GuestbookView({ profile }: { profile: LinkedInProfile }) {
    const skills = profile.skills || [];
    
    return (
       <div className="space-y-3 @sm:space-y-4 p-1 @sm:p-2">
          {/* Write Entry Mock */}
          <div className="bg-[#f0f0f0] p-2 @sm:p-3 border border-gray-300 rounded-sm mb-4 @sm:mb-6">
             <div className="flex gap-1 @sm:gap-2 mb-1 @sm:mb-2">
                 <div className="w-6 h-6 @sm:w-8 @sm:h-8 bg-gray-300 rounded-full shrink-0"></div>
                 <div className="flex-1 bg-white border border-gray-300 h-6 @sm:h-8 flex items-center px-1 @sm:px-2 text-[10px] @sm:text-xs text-gray-400 min-w-0">
                     Write a message...
                 </div>
                 <button className="bg-[#238db4] text-white px-2 @sm:px-3 text-[10px] @sm:text-xs rounded-sm shrink-0 whitespace-nowrap">Ok</button>
             </div>
          </div>

          {/* Skill List as Guestbook Entries */}
          {skills.map((skill, idx) => (
             <div key={idx} className="bg-white border-b border-gray-200 pb-1.5 @sm:pb-2 mb-1.5 @sm:mb-2">
                <div className="flex justify-between items-center bg-[#f5f5f5] px-1 @sm:px-2 py-0.5 @sm:py-1 mb-1 rounded-sm flex-wrap gap-1">
                   <div className="flex items-center gap-0.5 @sm:gap-1 text-[10px] @sm:text-[11px]">
                      <span className="font-bold text-blue-800">NO. {skills.length - idx}</span>
                      <span className="text-gray-500 font-bold ml-1 @sm:ml-2">Recruiter</span>
                      <span className="text-gray-400 hidden @sm:inline">(2026.01.12)</span>
                   </div>
                   <div className="flex gap-1 text-[9px] @sm:text-[10px] text-gray-400">
                      <span>Secret</span> | <span>Delete</span>
                   </div>
                </div>
                
                <div className="flex gap-2 @sm:gap-3 px-1 @sm:px-2">
                   <div className="w-12 h-12 @sm:w-16 @sm:h-16 bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      <User size={18} className="@sm:w-6 @sm:h-6 text-gray-300" />
                   </div>
                   <div className="flex-1 text-[10px] @sm:text-xs text-gray-700 py-0.5 @sm:py-1 min-w-0">
                      <p>Wow! You are really good at <span className="font-bold text-orange-600 bg-orange-50 px-0.5 @sm:px-1">{skill}</span>!</p>
                      <p className="mt-0.5 @sm:mt-1">We should definitely hire you.</p>
                   </div>
                </div>
             </div>
          ))}
       </div>
    );
 }
