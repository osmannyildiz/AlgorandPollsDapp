import { useWallet } from '@txnlab/use-wallet-react'
import { Check, Users } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useCallback, useMemo, useState } from 'react'
import { PollData } from '../contracts/PollManager'
import { usePollManager } from '../utils/usePollManager'

interface PollCardProps {
  poll: PollData
}

function PollCard({ poll }: PollCardProps) {
  const { activeAddress } = useWallet()
  const { vote, fetchPolls } = usePollManager()

  const [selectedOption, setSelectedOption] = useState<1 | 2 | 3 | 4 | 5 | null>(null)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async () => {
    if (!selectedOption || !activeAddress || hasVoted) {
      return
    }

    setIsVoting(true)
    try {
      const response = await vote(poll.id, selectedOption)
      console.log('response', response)

      fetchPolls().catch((err) => {
        enqueueSnackbar(`Failed to fetch polls. Please try again.`, { variant: 'error' })
      })
    } catch (err) {
      enqueueSnackbar(`Failed to submit vote. Please try again.`, { variant: 'error' })
    } finally {
      setIsVoting(false)
    }
  }

  const getPercentage = useCallback(
    (votes: number) => {
      // const totalVotes = Number(poll.option_1Votes) + Number(poll.option_2Votes) + Number(poll.option_3Votes) + Number(poll.option_4Votes) + Number(poll.option_5Votes)
      const totalVotes = poll.voters.length
      if (totalVotes === 0) return 0
      return Math.round((votes / totalVotes) * 100)
    },
    [poll],
  )

  const options = useMemo(
    () => [
      { id: 1 as const, text: poll.option_1, votes: Number(poll.option_1Votes) },
      { id: 2 as const, text: poll.option_2, votes: Number(poll.option_2Votes) },
      { id: 3 as const, text: poll.option_3, votes: Number(poll.option_3Votes) },
      { id: 4 as const, text: poll.option_4, votes: Number(poll.option_4Votes) },
      { id: 5 as const, text: poll.option_5, votes: Number(poll.option_5Votes) },
    ],
    [poll],
  )

  const hasVoted = useMemo(() => activeAddress && poll.voters.includes(activeAddress), [poll.voters, activeAddress])

  return (
    <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl p-6 shadow-xl transition-shadow duration-300 hover:shadow-2xl flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight">{poll.question}</h3>

      <div className="space-y-3 mb-6 flex-grow">
        {options.map((option) => {
          const percentage = getPercentage(option.votes)
          const isSelected = selectedOption === option.id
          // const isVotedOption = poll.votedOptionId === option.id
          const isVotedOption = false

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
                        // isVotedOption ? 'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg' : 'bg-gray-400'
                        'bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg'
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
          <span className="text-sm font-medium">{poll.voters.length} votes</span>
        </div>
        {!hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selectedOption || !activeAddress || isVoting}
            className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:scale-105 disabled:from-gray-300 disabled:to-gray-300 disabled:shadow-none disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            {activeAddress ? (isVoting ? 'Voting...' : 'Vote') : 'Connect wallet to vote'}
          </button>
        )}
        {hasVoted && <span className="text-sm font-semibold text-violet-600 bg-violet-100 px-4 py-2 rounded-lg">Voted</span>}
      </div>
    </div>
  )
}

export default PollCard
