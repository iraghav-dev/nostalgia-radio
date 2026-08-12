"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Script from "next/script";
import { track } from "@vercel/analytics";

// --- Types & Base Data ---

type Track = {
  id: string;
  title: string;
  artist: string;
  film: string;
  year: string;
  duration: number;
  videoId: string;
};

// WARNING: Replace these IDs only with tracks you have the legal right to stream or embed.
const BASE_PLAYLISTS: Track[][] = [
  // Playlist 1: Modern Romance (Arijit & Melodies)
  [
    { id: "1", title: "Ae Dil Hai Mushkil", artist: "Arijit Singh", film: "Ae Dil Hai Mushkil", year: "2016", duration: 268, videoId: "vUvL328AQ4I" },
    { id: "2", title: "Channa Mereya", artist: "Arijit Singh", film: "Ae Dil Hai Mushkil", year: "2016", duration: 289, videoId: "bzSTpdcs-EI" },
    { id: "3", title: "Tum Hi Ho", artist: "Arijit Singh", film: "Aashiqui 2", year: "2013", duration: 262, videoId: "Umqb9KENgWE" },
    { id: "4", title: "Agar Tum Saath Ho", artist: "Alka Yagnik, Arijit Singh", film: "Tamasha", year: "2015", duration: 341, videoId: "sK7riqg2mrA" },
    { id: "5", title: "Tujhe Kitna Chahne Lage", artist: "Arijit Singh", film: "Kabir Singh", year: "2019", duration: 284, videoId: "cT2XGqN3E1E" },
  ],
  // Playlist 2: Rockstar / Sufi / Mohit Chauhan
  [
    { id: "6", title: "Kun Faya Kun", artist: "A.R. Rahman, Mohit Chauhan", film: "Rockstar", year: "2011", duration: 473, videoId: "T94PHkuydcw" },
    { id: "7", title: "Tum Se Hi", artist: "Mohit Chauhan", film: "Jab We Met", year: "2007", duration: 321, videoId: "mt9xg0vanLs" },
    { id: "8", title: "Pee Loon", artist: "Mohit Chauhan", film: "Once Upon A Time In Mumbaai", year: "2010", duration: 285, videoId: "0rE-l8G6vA4" },
    { id: "9", title: "Matargashti", artist: "Mohit Chauhan", film: "Tamasha", year: "2015", duration: 328, videoId: "6vKucgAeF_Q" },
    { id: "10", title: "Sadda Haq", artist: "Mohit Chauhan", film: "Rockstar", year: "2011", duration: 364, videoId: "p9DQINKZxWE" },
  ],
  // Playlist 3: 2000s/2010s Classics
  [
    { id: "11", title: "Tujh Mein Rab Dikhta Hai", artist: "Roop Kumar Rathod", film: "Rab Ne Bana Di Jodi", year: "2008", duration: 284, videoId: "qoq8B8ThgEM" },
    { id: "12", title: "Zara Sa", artist: "KK", film: "Jannat", year: "2008", duration: 304, videoId: "5zMhU9mXGA8" },
    { id: "13", title: "Khuda Jaane", artist: "KK, Shilpa Rao", film: "Bachna Ae Haseeno", year: "2008", duration: 333, videoId: "5b-G-5qW0r8" },
    { id: "14", title: "Kabira", artist: "Tochi Raina, Rekha Bhardwaj", film: "Yeh Jawaani Hai Deewani", year: "2013", duration: 223, videoId: "ueRbKSwaheA" },
    { id: "15", title: "Ilahi", artist: "Arijit Singh", film: "Yeh Jawaani Hai Deewani", year: "2013", duration: 228, videoId: "fdubeMFwuZI" },
  ]
];

// Utility: Fisher-Yates Shuffle
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// --- Module-Scoped Sub-components ---

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

function Clock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    
    const update = () => setTime(formatter.format(new Date()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return <div className="w-16" />;

  const parts = time.split(":");
  if (parts.length !== 2) return <div>{time}</div>;

  return (
    <span>
      {parts[0]}<span className="animate-blink">:</span>{parts[1]}
    </span>
  );
}

function TopRow() {
  return (
    <div className="fixed top-0 inset-x-0 flex justify-between items-start z-50 text-white/80 text-sm font-medium pt-[max(1rem,env(safe-area-inset-top))] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] w-full">
      <div className="w-24"><Clock /></div>
      
      <div className="flex flex-col items-center flex-1">
        <span>Live</span>
        <span className="text-xs text-white/50">42 listening</span>
      </div>
      
      <div className="flex gap-5 w-24 justify-end items-center">
        {/* Instagram Icon */}
        <a href="#" className="hover:text-white transition" aria-label="Instagram">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        
        {/* X (Twitter) Icon */}
        <a href="#" className="hover:text-white transition" aria-label="X">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

function Seekbar({ progress, duration, onSeek }: { progress: number; duration: number; onSeek: (p: number) => void }) {
  const barRef = useRef<HTMLDivElement>(null);
  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const updateSeek = (clientX: number) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onSeek(p * duration);
    };
    
    updateSeek(e.clientX);

    const onPointerMove = (moveEvt: PointerEvent) => updateSeek(moveEvt.clientX);
    const onPointerUp = () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div 
      className="relative h-[24px] flex items-center group cursor-pointer touch-none w-full"
      onPointerDown={handlePointerDown}
      ref={barRef}
    >
      <div className="absolute inset-x-0 h-[3px] bg-white/15 rounded-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 bg-accent rounded-full" style={{ width: `${percent}%` }} />
      </div>
      <div 
        className="absolute h-3 w-3 bg-accent rounded-full top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 shadow-[0_0_10px_var(--color-accent)] pointer-events-none" 
        style={{ left: `calc(${percent}% - 6px)` }} 
      />
    </div>
  );
}

function Transport({ isPlaying, onToggle, onPrev, onNext, isMobile = false }: { isPlaying: boolean; onToggle: () => void; onPrev: () => void; onNext: () => void; isMobile?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <button onClick={onPrev} className="text-white/70 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
      </button>
      
      <button 
        onClick={onToggle} 
        className={isMobile 
          ? "w-[52px] h-[52px] rounded-full bg-gradient-to-b from-accent/80 to-accent ring-1 ring-white/25 shadow-[0_4px_12px_rgba(245,158,11,0.5)] flex items-center justify-center text-black"
          : "text-white hover:scale-105 transition-transform"
        }
      >
        {isPlaying ? (
           <svg width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        ) : (
           <svg width={isMobile ? 24 : 32} height={isMobile ? 24 : 32} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        )}
      </button>

      <button onClick={onNext} className="text-white/70 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
      </button>
    </div>
  );
}

function TrackInfo({ track }: { track: Track }) {
  return (
    <div className="flex flex-col min-w-0 flex-1">
      <div className="text-[15px] font-semibold truncate">{track.title}</div>
      <div className="text-[12.5px] text-white/70 truncate">{track.artist}</div>
    </div>
  );
}

// --- Main Client Component ---

export default function ClientApp() {
  // Shuffle playlist sequence and individual track lists on mount
  const [playlistOrder, setPlaylistOrder] = useState<number[]>(() => shuffleArray([0, 1, 2]));
  const [shuffledPlaylists, setShuffledPlaylists] = useState<Track[][]>(() => 
    BASE_PLAYLISTS.map(pl => shuffleArray(pl))
  );

  const [queueIndex, setQueueIndex] = useState(0); // Index within playlistOrder
  const [trackIdx, setTrackIdx] = useState(0);     // Index within current active playlist
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const ytPlayerRef = useRef<any>(null);

  const currentPlaylistId = playlistOrder[queueIndex];
  const activePlaylist = shuffledPlaylists[currentPlaylistId];
  const activeTrack = activePlaylist[trackIdx];

  // YouTube Engine Setup
  useEffect(() => {
    (window as any).onYouTubeIframeAPIReady = () => {
      ytPlayerRef.current = new (window as any).YT.Player("youtube-player", {
        height: "90",
        width: "160",
        videoId: activeTrack.videoId,
        playerVars: { 
          playsinline: 1, 
          controls: 0, 
          disablekb: 1, 
          fs: 0, 
          rel: 0 
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (e: any) => {
            if (e.data === 1) setIsPlaying(true);
            if (e.data === 2) setIsPlaying(false);
            if (e.data === 0) handleNext(); // Auto-advance track/playlist on ENDED
          },
          onError: (e: any) => {
            track("Track Error", { videoId: activeTrack.videoId, code: e.data });
            handleNext();
          }
        },
      });
    };
  }, []);

  // Sync track changes to YT Player
  useEffect(() => {
    if (!isReady || !ytPlayerRef.current) return;
    if (isPlaying) {
      ytPlayerRef.current.loadVideoById(activeTrack.videoId);
    } else {
      ytPlayerRef.current.cueVideoById(activeTrack.videoId);
    }
  }, [queueIndex, trackIdx, isReady]);

  // Progress Ticker
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime) {
        setProgress(ytPlayerRef.current.getCurrentTime());
        setDuration(ytPlayerRef.current.getDuration() || 0);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleTogglePlay = useCallback(() => {
    if (!ytPlayerRef.current) return;
    if (isPlaying) ytPlayerRef.current.pauseVideo();
    else ytPlayerRef.current.playVideo();
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    if (!ytPlayerRef.current) return;
    ytPlayerRef.current.seekTo(time, true);
    setProgress(time);
  }, []);

  // Automatic/Manual Track and Playlist Shifting Logic
  const handleNext = useCallback(() => {
    if (trackIdx < activePlaylist.length - 1) {
      // Next track in the current playlist
      setTrackIdx((prev) => prev + 1);
    } else {
      // Current playlist finished, shift to the next shuffled playlist
      setQueueIndex((prevQueue) => {
        const nextQueue = prevQueue + 1;
        if (nextQueue >= playlistOrder.length) {
          // All playlists finished: Reshuffle playlists and tracks, then restart
          setPlaylistOrder(shuffleArray([0, 1, 2]));
          setShuffledPlaylists(BASE_PLAYLISTS.map(pl => shuffleArray(pl)));
          return 0;
        }
        return nextQueue;
      });
      setTrackIdx(0); // Reset track position for the new playlist
    }
  }, [trackIdx, activePlaylist.length, playlistOrder.length]);

  const handlePrev = useCallback(() => {
    if (trackIdx > 0) {
      setTrackIdx((prev) => prev - 1);
    } else {
      // Go to previous playlist's last track
      setQueueIndex((prevQueue) => {
        const prevQueueTarget = prevQueue === 0 ? playlistOrder.length - 1 : prevQueue - 1;
        const targetPlaylist = shuffledPlaylists[playlistOrder[prevQueueTarget]];
        setTrackIdx(targetPlaylist.length - 1);
        return prevQueueTarget;
      });
    }
  }, [trackIdx, playlistOrder, shuffledPlaylists]);

  return (
    <>
      <Script src="https://www.youtube.com/iframe_api" strategy="afterInteractive" />
      <TopRow />

      {/* The Player Wrapper */}
      <div className="fixed bottom-0 inset-x-0 pb-[max(2rem,env(safe-area-inset-bottom))] px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] w-full max-w-xl mx-auto z-50 flex flex-col justify-end">
        
        {/* DESKTOP PILL */}
        <div className="glass-panel hidden sm:flex rounded-full p-3 pr-5 items-center gap-4 w-full relative">
          <div className="w-[80px] h-[80px] shrink-0" />
          
          <div className="w-[120px] shrink-0">
            <TrackInfo track={activeTrack} />
          </div>
          
          <div className="flex-1 px-2">
            <Seekbar progress={progress} duration={duration} onSeek={handleSeek} />
          </div>
          
          <div className="text-[10.5px] tabular-nums text-white/70 whitespace-nowrap shrink-0">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
          
          <div className="shrink-0 ml-2">
            <Transport isPlaying={isPlaying} onToggle={handleTogglePlay} onPrev={handlePrev} onNext={handleNext} />
          </div>
        </div>

        {/* MOBILE CARD */}
        <div className="glass-panel flex sm:hidden flex-col rounded-[26px] p-4 gap-4 w-full relative">
          <div className="flex items-center gap-4">
             <div className="w-[64px] h-[64px] shrink-0" />
             <TrackInfo track={activeTrack} />
          </div>
          
          <Seekbar progress={progress} duration={duration} onSeek={handleSeek} />
          
          <div className="flex items-center justify-between w-full">
            <div className="text-[10.5px] tabular-nums text-white/70">
               {formatTime(progress)} / {formatTime(duration)}
            </div>
            <Transport isMobile isPlaying={isPlaying} onToggle={handleTogglePlay} onPrev={handlePrev} onNext={handleNext} />
          </div>
        </div>

        {/* VINYL ARTWORK CONTAINER */}
        <div 
          className="absolute rounded-full overflow-hidden pointer-events-none 
                     top-4 left-4 w-[64px] h-[64px] 
                     sm:top-3 sm:left-3 sm:w-[80px] sm:h-[80px] 
                     animate-spin-slow"
          style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
        >
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[90px]">
               <div id="youtube-player" />
           </div>
           
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black/70 ring-2 ring-white/40 rounded-full z-10" />
        </div>

      </div>
    </>
  );
}
