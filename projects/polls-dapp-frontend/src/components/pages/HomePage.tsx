import { useWallet } from '@txnlab/use-wallet-react'
import { PlusCircle } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usePollManager } from '../../utils/usePollManager'
import PollCard from '../PollCard'
import PollSkeleton from '../PollSkeleton'

interface Option {
  id: string
  text: string
  votes: number
}

function HomePage() {
  const { activeAddress } = useWallet()
  const { getAppClient, fetchPolls, isFetchingPolls, polls } = usePollManager()

  const runHelloContract = useCallback(async () => {
    const appClient = await getAppClient()

    const response = await appClient.send.hello({ args: { name: 'Osman' } }).catch((e: Error) => {
      enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
      return
    })

    // appClient.state.getPoll({ args: { pollId: '1' } }).catch((e: Error) => {
    //   enqueueSnackbar(`Error getting the poll: ${e.message}`, { variant: 'error' })
    //   return
    // })

    // appClient.state.

    if (!response) {
      return
    }

    enqueueSnackbar(`Response from the contract: ${response.return}`, { variant: 'success' })
  }, [getAppClient])

  const test = useCallback(async () => {
    const appClient = await getAppClient()

    // const response = await appClient.state.box.boxMapStruct.getMap().catch((e: Error) => {
    //   enqueueSnackbar(`Error getting the poll: ${e.message}`, { variant: 'error' })
    //   return
    // })

    const response = await appClient.send.voteOption_2({ args: { pollId: 1, caller: activeAddress ?? '' } }).catch((e: Error) => {
      enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
      return
    })

    console.log(response)

    if (!response) {
      return
    }

    enqueueSnackbar(`Response from the contract: ${response.return}`, { variant: 'success' })
  }, [getAppClient])

  useEffect(() => {
    fetchPolls().catch((err) => {
      enqueueSnackbar(`Failed to fetch polls. Please try again.`, { variant: 'error' })
    })
  }, [fetchPolls])

  if (isFetchingPolls) {
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
        <button
          type="button"
          onClick={() => runHelloContract()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run Hello Contract
        </button>
        <button
          type="button"
          onClick={() => test()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          test
        </button>
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
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
