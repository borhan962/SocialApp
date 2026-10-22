export default function AuthInformation() {
  return (
    <>
    <section className="order-2 w-full max-w-xl text-center lg:order-1 lg:text-left">
        <h1 className="hidden text-5xl font-extrabold tracking-tight text-[#00298d] dark:text-blue-400 sm:text-6xl lg:block">Route Posts</h1>
        <p className="hidden mt-4 text-2xl font-medium leading-snug text-slate-800 dark:text-slate-200 lg:block">
            Connect with friends and the world around you on Route Posts.
        </p>
        
        <div className="mt-6 rounded-2xl border border-[#c9d5ff] dark:border-slate-700/80 bg-white/80 dark:bg-slate-800/80 p-4 shadow-sm backdrop-blur sm:p-5 transition-colors">
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#00298d] dark:text-blue-400">About Route Academy</p>
            <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Egypt's Leading IT Training Center Since 2012</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                Route Academy is the premier IT training center in Egypt, established in 2012. We specialize in delivering high-quality training courses in programming, web development, and application development. We've identified the unique challenges people may face when learning new technology and made efforts to provide strategies to overcome them.
            </p>
            
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#c9d5ff] dark:border-slate-700 bg-[#f2f6ff] dark:bg-slate-900/60 px-3 py-2 transition-colors">
                    <p className="text-base font-extrabold text-[#00298d] dark:text-blue-400">2012</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Founded</p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] dark:border-slate-700 bg-[#f2f6ff] dark:bg-slate-900/60 px-3 py-2 transition-colors">
                    <p className="text-base font-extrabold text-[#00298d] dark:text-blue-400">40K+</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Graduates</p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] dark:border-slate-700 bg-[#f2f6ff] dark:bg-slate-900/60 px-3 py-2 transition-colors">
                    <p className="text-base font-extrabold text-[#00298d] dark:text-blue-400">50+</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Partner Companies</p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] dark:border-slate-700 bg-[#f2f6ff] dark:bg-slate-900/60 px-3 py-2 transition-colors">
                    <p className="text-base font-extrabold text-[#00298d] dark:text-blue-400">5</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Branches</p>
                </div>
                <div className="rounded-xl border border-[#c9d5ff] dark:border-slate-700 bg-[#f2f6ff] dark:bg-slate-900/60 px-3 py-2 transition-colors">
                    <p className="text-base font-extrabold text-[#00298d] dark:text-blue-400">20</p>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">Diplomas Available</p>
                </div>
            </div>
        </div>
    </section>
    </>
  )
}
