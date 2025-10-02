import { SupportedWallet, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { Home as HomeIcon, PlusCircle } from 'lucide-react'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import CreatePage from './components/CreatePage'
import HomePage from './components/HomePage'
import Toast from './components/Toast'
import { Poll } from './types'
import { getAlgodConfigFromViteEnvironment, getKmdConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

let supportedWallets: SupportedWallet[]
if (import.meta.env.VITE_ALGOD_NETWORK === 'localnet') {
  const kmdConfig = getKmdConfigFromViteEnvironment()
  supportedWallets = [
    {
      id: WalletId.KMD,
      options: {
        baseServer: kmdConfig.server,
        token: String(kmdConfig.token),
        port: String(kmdConfig.port),
      },
    },
  ]
} else {
  supportedWallets = [
    { id: WalletId.DEFLY },
    { id: WalletId.PERA },
    { id: WalletId.EXODUS },
    // If you are interested in WalletConnect v2 provider
    // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
  ]
}

export default function App() {
  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletManager = new WalletManager({
    wallets: supportedWallets,
    defaultNetwork: algodConfig.network,
    networks: {
      [algodConfig.network]: {
        algod: {
          baseServer: algodConfig.server,
          port: algodConfig.port,
          token: String(algodConfig.token),
        },
      },
    },
    options: {
      resetNetwork: true,
    },
  })

  const location = useLocation()
  const navigate = useNavigate()
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mockPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'What is your favorite programming language?',
      options: [
        { id: 'opt1', text: 'JavaScript', votes: 24 },
        { id: 'opt2', text: 'Python', votes: 18 },
        { id: 'opt3', text: 'TypeScript', votes: 31 },
        { id: 'opt4', text: 'Rust', votes: 12 },
      ],
      totalVotes: 85,
      votedOptionId: null,
    },
    {
      id: '2',
      question: 'Best time to code?',
      options: [
        { id: 'opt1', text: 'Morning', votes: 15 },
        { id: 'opt2', text: 'Afternoon', votes: 8 },
        { id: 'opt3', text: 'Evening', votes: 22 },
        { id: 'opt4', text: 'Night', votes: 35 },
      ],
      totalVotes: 80,
      votedOptionId: null,
    },
    {
      id: '3',
      question: 'Preferred development environment?',
      options: [
        { id: 'opt1', text: 'VS Code', votes: 45 },
        { id: 'opt2', text: 'IntelliJ IDEA', votes: 20 },
        { id: 'opt3', text: 'Vim', votes: 12 },
      ],
      totalVotes: 77,
      votedOptionId: null,
    },
  ])

  const fetchPolls = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setPolls([...mockPolls])
    } catch (err) {
      setError('Failed to load polls. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const handleVote = async (pollId: string, optionId: string): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const updatedPolls = polls.map((poll) => {
        if (poll.id === pollId && !poll.votedOptionId) {
          return {
            ...poll,
            votedOptionId: optionId,
            totalVotes: poll.totalVotes + 1,
            options: poll.options.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)),
          }
        }
        return poll
      })

      setPolls(updatedPolls)
    } catch (err) {
      throw new Error('Failed to submit vote. Please try again.')
    }
  }

  const handleCreatePoll = async (question: string, options: string[]): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const newPoll: Poll = {
        id: Date.now().toString(),
        question,
        options: options.map((text, index) => ({
          id: `opt${index + 1}`,
          text,
          votes: 0,
        })),
        totalVotes: 0,
        votedOptionId: null,
      }
      setPolls((prevPolls) => [newPoll, ...prevPolls])
      navigate('/')
    } catch (err) {
      throw new Error('Failed to create poll. Please try again.')
    }
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider manager={walletManager}>
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    Polls
                  </span>
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
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<HomePage polls={polls} onVote={handleVote} isLoading={isLoading} />} />
              <Route path="/create" element={<CreatePage onCreatePoll={handleCreatePoll} />} />
            </Routes>
          </main>

          {error && <Toast message={error} onClose={() => setError(null)} />}
        </div>
      </WalletProvider>
    </SnackbarProvider>
  )
}
