import Demo from "@/components/ui/demo";

export const metadata = {
  title: "Halftone Wordmark Footer Demo | Cosmos Gaming",
  description: "Interactive halftone wordmark canvas footer component demo.",
};

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col justify-end">
      <div className="py-20 text-center space-y-4 max-w-xl mx-auto px-4">
        <span className="text-xs font-mono uppercase tracking-widest text-[#ea580c]">
          Interactive Canvas Demo
        </span>
        <h1 className="text-3xl font-['Space_Grotesk',sans-serif] font-bold text-white uppercase">
          Halftone Wordmark Footer
        </h1>
        <p className="text-sm text-zinc-400">
          Move your cursor over the wordmark below to displace the halftone dots on springs.
          Click anywhere on the wordmark to ripple a shockwave ring.
        </p>
      </div>

      <div className="w-full">
        <Demo />
      </div>
    </div>
  );
}

