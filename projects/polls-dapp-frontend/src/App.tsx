import { Home as HomeIcon, PlusCircle } from 'lucide-react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import ConnectWalletButtonAndModal from './components/ConnectWalletButtonAndModal'
import CreatePage from './components/pages/CreatePage'
import HomePage from './components/pages/HomePage'
import Home from './components/template/Home'

export default function App() {
  const location = useLocation()

  const handleVote = async (pollId: string, optionId: string): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      // const updatedPolls = polls.map((poll) => {
      //   if (poll.id === pollId && !poll.votedOptionId) {
      //     return {
      //       ...poll,
      //       votedOptionId: optionId,
      //       totalVotes: poll.totalVotes + 1,
      //       options: poll.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)),
      //     }
      //   }
      //   return poll
      // })

      // setPolls(updatedPolls)
    } catch (err) {
      throw new Error('Failed to submit vote. Please try again.')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 backdrop-blur-md bg-white/30 border-b border-white/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Polls</span>
            </div>
            <div className="flex space-x-2">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive('/')
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/50 scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 backdrop-blur-sm border border-white/60'
                }`}
              >
                <HomeIcon size={18} />
                <span className="font-medium">Home</span>
              </Link>
              <Link
                to="/create"
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl transition-all duration-300 ${
                  isActive('/create')
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/50 scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 backdrop-blur-sm border border-white/60'
                }`}
              >
                <PlusCircle size={18} />
                <span className="font-medium">Create</span>
              </Link>
            </div>

            <ConnectWalletButtonAndModal />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage onVote={handleVote} />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/template" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}
