"use client";

import Link from "next/link";
import { ArrowRight, Zap, Lock, DollarSign, Image, Wand2, Layout, SlidersHorizontal, DownloadCloud, MousePointer2 } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto bg-[#f4f6f9] text-[#202632] selection:bg-[#0f62d6] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#dfe3e9]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0f62d6] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold leading-none">C</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Chitra</h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/pratiklamichhane/chitra" target="_blank" rel="noopener noreferrer" className="text-[#687487] hover:text-[#202632] font-medium transition text-sm">
              GitHub
            </a>
            <Link
              href="/studio"
              className="px-5 py-2 bg-[#0f62d6] hover:bg-[#0b55bd] text-white rounded-lg font-medium transition shadow-sm text-sm"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-300/20 blur-[100px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#ebedf1] rounded-full shadow-[0_2px_8px_rgba(25,34,48,0.04)] text-sm font-medium text-[#687487]">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Open Source • Browser-Native • Zero Cost
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
            Professional Photos <br />
            <span className="text-[#0f62d6]">Without the Price Tag</span>
          </h2>

          <p className="text-xl text-[#687487] mb-10 max-w-2xl mx-auto leading-relaxed">
            Chitra is an AI-powered photo booth that runs entirely in your browser. Remove backgrounds, beautify photos, and export print-ready sheets—all locally, all free.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/studio"
              className="px-8 py-4 bg-[#0f62d6] hover:bg-[#0b55bd] text-white font-semibold rounded-xl flex items-center gap-2 transition shadow-[0_4px_14px_rgba(15,98,214,0.25)] group text-lg"
            >
              Start Creating Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>

          {/* Abstract Dashboard Mockup */}
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-[#dfe3e9] bg-white shadow-[0_18px_44px_rgba(25,34,48,0.12)] overflow-hidden aspect-[16/9] sm:aspect-[16/10] flex flex-col">
            {/* Fake Browser/App Toolbar */}
            <div className="h-12 bg-[#f8fafc] border-b border-[#dfe3e9] flex items-center px-4 gap-2 w-full shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              <div className="mx-auto bg-white border border-[#ebedf1] rounded-md px-24 py-1.5 shadow-sm"></div>
            </div>
            
            {/* Fake App Layout */}
            <div className="flex flex-1 overflow-hidden bg-[#f4f6f9]">
              {/* Fake Sidebar */}
              <div className="w-16 md:w-64 bg-white border-r border-[#dfe3e9] flex flex-col p-4 gap-4 shrink-0">
                <div className="h-8 bg-[#f4f6f9] rounded-md w-full mb-4"></div>
                <div className="h-20 border border-[#ebedf1] rounded-lg w-full flex items-center justify-center bg-[#f8fafc]">
                  <Image className="w-6 h-6 text-[#687487]" />
                </div>
                <div className="h-20 border border-[#ebedf1] rounded-lg w-full flex items-center justify-center bg-[#f8fafc]">
                  <Wand2 className="w-6 h-6 text-[#687487]" />
                </div>
                <div className="h-20 border border-[#ebedf1] rounded-lg w-full flex items-center justify-center bg-[#f8fafc]">
                  <Layout className="w-6 h-6 text-[#687487]" />
                </div>
              </div>
              
              {/* Fake Canvas Area */}
              <div className="flex-1 p-8 grid place-items-center relative">
                <div className="absolute inset-0 pattern-grid opacity-50"></div>
                {/* Fake Sheet Mockup */}
                <div className="bg-white shadow-xl max-w-sm w-full aspect-[3/4] p-4 grid grid-cols-2 gap-4 border border-[#dfe3e9] relative z-10 scale-90 md:scale-100">
                  <div className="bg-[#f0f3f8] rounded w-full h-full flex items-center justify-center overflow-hidden relative">
                    <div className="absolute bottom-0 w-16 h-20 bg-[#dfe3e9] rounded-t-full rounded-b-none"></div>
                    <div className="absolute top-4 w-10 h-12 bg-[#cbd2df] rounded-full"></div>
                  </div>
                  <div className="bg-[#f0f3f8] rounded w-full h-full flex items-center justify-center overflow-hidden relative">
                    <div className="absolute bottom-0 w-16 h-20 bg-[#dfe3e9] rounded-t-full rounded-b-none"></div>
                    <div className="absolute top-4 w-10 h-12 bg-[#cbd2df] rounded-full"></div>
                  </div>
                  <div className="bg-[#f0f3f8] rounded w-full h-full flex items-center justify-center overflow-hidden relative">
                    <div className="absolute bottom-0 w-16 h-20 bg-[#dfe3e9] rounded-t-full rounded-b-none"></div>
                    <div className="absolute top-4 w-10 h-12 bg-[#cbd2df] rounded-full"></div>
                  </div>
                  <div className="bg-[#f0f3f8] rounded w-full h-full flex items-center justify-center overflow-hidden relative">
                    <div className="absolute bottom-0 w-16 h-20 bg-[#dfe3e9] rounded-t-full rounded-b-none"></div>
                    <div className="absolute top-4 w-10 h-12 bg-[#cbd2df] rounded-full"></div>
                  </div>
                </div>
                
                {/* Floating Tooltips */}
                <div className="absolute top-1/4 right-1/4 bg-white px-3 py-2 rounded-lg shadow-lg border border-[#dfe3e9] flex items-center gap-2 z-20 animate-bounce">
                  <Wand2 className="w-4 h-4 text-[#0f62d6]" />
                  <span className="text-xs font-bold text-[#687487]">Beautify Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        .pattern-grid {
          background-image: linear-gradient(to right, #dfe3e9 1px, transparent 1px), linear-gradient(to bottom, #dfe3e9 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />

      {/* How it Works - Alternating Feature Section */}
      <section className="py-24 px-6 bg-white border-y border-[#dfe3e9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 whitespace-pre-line">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">How Chitra Works</h3>
            <p className="text-lg text-[#687487]">Three simple steps to professional ID photos.</p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-[#0f62d6]/10 text-[#0f62d6] rounded-xl flex items-center justify-center font-bold text-xl">1</div>
                <h4 className="text-3xl font-bold">Upload & Auto-Remove Background</h4>
                <p className="text-lg text-[#687487] leading-relaxed">
                  Drop your photo into the canvas. Chitra’s on-device AI instantly detects the subject and removes the background without sending your data to any server. Complete privacy.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#f4f6f9] rounded-2xl border border-[#ebedf1] p-8 aspect-video flex items-center justify-center shadow-inner relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/40 pattern-grid"></div>
                <div className="z-10 bg-white p-6 rounded-xl shadow-lg border border-[#dfe3e9] flex flex-col items-center gap-4 group-hover:scale-105 transition-transform duration-500">
                  <Image className="w-12 h-12 text-[#0f62d6]" />
                  <span className="font-semibold px-4 py-1.5 bg-[#f4f6f9] rounded-md text-sm border border-[#ebedf1]">Drag & drop image here</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-[#0f62d6]/10 text-[#0f62d6] rounded-xl flex items-center justify-center font-bold text-xl">2</div>
                <h4 className="text-3xl font-bold">Beautify & Retouch</h4>
                <p className="text-lg text-[#687487] leading-relaxed">
                  Use our suite of smart tools to perfect the image. Apply the Beautify filter to smooth out skin imperfections, fine-tune the background color, and use the manual cleanup tool for pixel-perfect results.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#f4f6f9] rounded-2xl border border-[#ebedf1] p-8 aspect-video relative overflow-hidden shadow-inner flex items-center justify-center gap-4">
                 <div className="absolute inset-0 bg-white/40"></div>
                 {/* Fake UI controls */}
                 <div className="z-10 bg-white w-64 p-4 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-[#dfe3e9] space-y-4">
                    <div className="flex justify-between text-sm font-bold text-[#687487] border-b pb-2"><span className="flex items-center gap-2"><Wand2 size={16}/> Beautify</span></div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-[#687487]">Strength</span> <span className="font-bold">45%</span></div>
                      <div className="w-full h-2 bg-[#f4f6f9] rounded-full overflow-hidden border border-[#ebedf1]"><div className="w-[45%] h-full bg-[#0f62d6]"></div></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-[#0f62d6]/10 text-[#0f62d6] rounded-xl flex items-center justify-center font-bold text-xl">3</div>
                <h4 className="text-3xl font-bold">Layout & High-Quality Export</h4>
                <p className="text-lg text-[#687487] leading-relaxed">
                  Select your required photo dimensions (e.g., 35x45mm) and paper size. Chitra automatically calculates the optimal grid layout. Export as a 300-DPI PDF or JPEG ready for any professional printer.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#f4f6f9] rounded-2xl border border-[#ebedf1] p-8 aspect-video relative overflow-hidden shadow-inner flex items-center justify-center">
                 <div className="absolute inset-0 bg-white/40 pattern-grid"></div>
                 <div className="z-10 grid grid-cols-3 gap-2 bg-white p-4 shadow-xl border border-[#dfe3e9]">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-12 h-16 bg-[#0f62d6]/10 border border-[#0f62d6]/20 rounded-sm"></div>
                    ))}
                 </div>
                 <div className="absolute right-8 bottom-8 bg-[#0f62d6] text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 font-medium text-sm">
                    <DownloadCloud size={16} /> Download PDF
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-24 px-6 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose Chitra?</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 p-10 bg-white border border-[#dfe3e9] rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f4f6f9] border border-[#ebedf1] rounded-xl flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-[#202632]" />
              </div>
              <h4 className="text-2xl font-bold mb-3">100% Private, 100% Local</h4>
              <p className="text-[#687487] text-lg leading-relaxed max-w-md">
                We use WebAssembly to run sophisticated AI models entirely inside your browser. No photos are ever uploaded to a server. Your privacy is guaranteed by design.
              </p>
            </div>

            <div className="col-span-1 p-10 bg-white border border-[#dfe3e9] rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 bg-[#f4f6f9] border border-[#ebedf1] rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="w-6 h-6 text-[#202632]" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Zero Cost</h4>
              <p className="text-[#687487] leading-relaxed">
                Because it runs on your machine, there are zero server costs—meaning it's completely free for you.
              </p>
            </div>

            <div className="col-span-1 p-10 bg-[#0f62d6] text-white border border-[#0b55bd] rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Lightning Fast</h4>
              <p className="text-blue-100 leading-relaxed">
                Experience instant feedback. No network requests mean zero latency when applying filters or calculating layouts.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 p-10 bg-white border border-[#dfe3e9] rounded-3xl shadow-sm hover:shadow-md transition relative overflow-hidden">
               <div className="w-12 h-12 bg-[#f4f6f9] border border-[#ebedf1] rounded-xl flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-6 h-6 text-[#202632]" />
              </div>
              <h4 className="text-2xl font-bold mb-3">Pro-Level Capabilities</h4>
              <p className="text-[#687487] text-lg leading-relaxed max-w-md relative z-10">
                Packed with features studios pay hundreds for: dynamic sheet generation, pixel-perfect cropping, custom feathering, and high DPI PDF rendering.
              </p>
              
              <MousePointer2 className="absolute right-10 bottom-10 w-24 h-24 text-[#f4f6f9] z-0" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0f62d6]"></div>
        <div className="absolute inset-0 opacity-10 pattern-grid"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to start creating?</h3>
          <p className="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Join the creators using Chitra for their professional photo needs. No signup required, works instantly.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/studio"
              className="px-10 py-4 bg-white text-[#0f62d6] hover:bg-slate-50 font-bold rounded-xl transition shadow-[0_4px_14px_rgba(0,0,0,0.1)] text-lg"
            >
              Launch App
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dfe3e9] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0f62d6] flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold leading-none">C</span>
            </div>
            <h4 className="font-bold text-[#202632] tracking-tight">Chitra</h4>
          </div>
          
          <p className="text-[#687487] text-sm text-center md:text-left">
            Made with ❤️ for photographers, studios, and everyone who needs professional photos.
          </p>

          <div className="flex items-center gap-6 text-sm font-medium text-[#687487]">
            <Link href="/studio" className="hover:text-[#0f62d6] transition">App</Link>
            <a href="https://github.com/pratiklamichhane/chitra" target="_blank" rel="noopener noreferrer" className="hover:text-[#0f62d6] transition">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

