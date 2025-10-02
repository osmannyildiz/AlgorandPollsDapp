import { Check, Users } from 'lucide-react'
import { useState } from 'react'

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

interface PollCardProps {
  poll: Poll
  onVote: (pollId: string, optionId: string) => void
}

function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const hasVoted = poll.votedOptionId !== null

  const handleVote = () => {
    if (selectedOption && !hasVoted) {
      onVote(poll.id, selectedOption)
    }
  }

  const getPercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">{poll.question}</h3>

      <div className="space-y-3 mb-6 flex-grow">
        {poll.options.map((option) => {
          const percentage = getPercentage(option.votes)
          const isSelected = selectedOption === option.id
          const isVotedOption = poll.votedOptionId === option.id

          return (
            <div key={option.id}>
              {!hasVoted ? (
                <button
                  onClick={() => setSelectedOption(option.id)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 hover:scale-[1.02] ${
                    isSelected
                      ? 'bg-violet-500/30 border-violet-500 backdrop-blur-sm shadow-lg scale-[1.02]'
                      : 'bg-white/50 border-white/60 hover:bg-white/70 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{option.text}</span>
                    {isSelected && (
                      <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                        <Check size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${isVotedOption ? 'text-violet-600' : 'text-gray-800'}`}>{option.text}</span>
                    <div className="flex items-center gap-2">
                      {isVotedOption && (
                        <div className="w-6 h-6 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                      <span className="font-bold text-violet-600">{percentage}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isVotedOption ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg' : 'bg-gray-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
        <div className="flex items-center gap-2 text-gray-600">
          <Users size={18} />
          <span className="text-sm font-medium">{poll.totalVotes} votes</span>
        </div>
        {!hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedOption
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Vote
          </button>
        )}
        {hasVoted && <span className="text-sm font-semibold text-violet-600 bg-violet-100 px-4 py-2 rounded-lg">Voted</span>}
      </div>
    </div>
  )
}

export default PollCard
