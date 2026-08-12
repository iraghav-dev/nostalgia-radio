import ClientApp from "./ClientApp";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1. Fixed background div */}
      <div className="hero-bg fixed inset-0 -z-20"></div>
      
      {/* 1b. Soft black gradient overlay (kept so the white text remains readable) */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>
      
      {/* (The artificial grain overlay has been completely removed to restore image clarity) */}

      {/* 3 & 4. Interactive Layer */}
      <ClientApp />
    </main>
  );
}
