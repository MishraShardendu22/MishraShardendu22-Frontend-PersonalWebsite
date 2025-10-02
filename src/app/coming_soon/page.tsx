import { Clock, Rocket, Dribbble, Users } from 'lucide-react'

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(139,92,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-violet-500/30 rounded-full blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-violet-600 to-purple-700 p-8 rounded-3xl shadow-2xl">
              <Rocket className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
          <Dribbble className="w-4 h-4 text-violet-400" />
          <span className="text-violet-300 text-sm font-medium">Under Construction</span>
        </div>

        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
            Coming Soon
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-slate-400 mb-4 max-w-2xl mx-auto font-light">
          Revealing accounts soon
        </p>
        <p className="text-base text-slate-500 max-w-xl mx-auto">
          We`re crafting something special for you. Stay tuned for updates!
        </p>

        <div className="flex items-center justify-center my-12">
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent w-full max-w-md"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-violet-500/50 transition-colors">
            <div className="bg-violet-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Clock className="w-7 h-7 text-violet-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">In Progress</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Building something amazing for you
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/50 transition-colors">
            <div className="bg-purple-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Users className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Community</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connect with like-minded people
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 hover:border-fuchsia-500/50 transition-colors">
            <div className="bg-fuchsia-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Dribbble className="w-7 h-7 text-fuchsia-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Features</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Packed with exciting new tools</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-3 mt-16">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Development</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 rounded-full border border-slate-700/50">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-300 text-sm">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
