import ClientApp from "./ClientApp";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1. Fixed background div */}
      <div className="hero-bg fixed inset-0 -z-20"></div>
      
      {/* 1b. Black gradient overlay */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-b from-black/35 via-transparent to-black/80 pointer-events-none"></div>
      
      {/* 2. Fixed grain overlay */}
      <div className="grain-overlay fixed inset-0 -z-10 opacity-30 mix-blend-overlay pointer-events-none"></div>

      {/* 3 & 4. Interactive Layer */}
      <ClientApp />
    </main>
  );
}