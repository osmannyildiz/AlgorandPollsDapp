import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import PollCard from './PollCard'
import PollSkeleton from './PollSkeleton'

interface Option {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  question: string
  options: Option[]
  totalVotes: number
  votedOptionId: string | null
}

interface HomePageProps {
  polls: Poll[]
  onVote: (pollId: string, optionId: string) => Promise<void>
  isLoading: boolean
}

function HomePage({ polls, onVote, isLoading }: HomePageProps) {
  if (isLoading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Active Polls</h1>
          <p className="text-gray-600">Vote on polls or create your own</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <PollSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Active Polls</h1>
        <p className="text-gray-600">Vote on polls or create your own</p>
      </div>

      {polls.length === 0 ? (
        <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-12 text-center shadow-xl">
          <p className="text-gray-600 text-lg mb-6">No polls yet. Create the first one!</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/60 transition-all duration-300 transform hover:scale-[1.02]"
          >
            <PlusCircle size={20} />
            Create Poll
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} onVote={onVote} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
