import ClientApp from "./ClientApp";

export default function Page() {
  return (
    <main className="relative flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      {/* 1. Fixed background div (pure image, no overlays) */}
      <div className="hero-bg fixed inset-0 -z-20"></div>
      
      {/* 2. Interactive Layer */}
      <ClientApp />
    </main>
  );
}
