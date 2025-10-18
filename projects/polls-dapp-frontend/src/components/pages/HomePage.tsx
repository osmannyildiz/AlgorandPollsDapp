import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { PlusCircle } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { POLL_MANAGER_CREATOR_ADDRESS } from '../../contracts/config'
import { PollData, PollManagerClient } from '../../contracts/PollManager'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import PollCard from '../PollCard'
import PollSkeleton from '../PollSkeleton'

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
  polls: PollData[]
  onVote: (pollId: string, optionId: string) => Promise<void>
  isLoading: boolean
  setPolls: (polls: PollData[]) => void
  setIsLoading: (isLoading: boolean) => void
}

function HomePage({ polls, onVote, isLoading, setPolls, setIsLoading }: HomePageProps) {
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const fetchPolls = async () => {
    setIsLoading(true)
    try {
      const appClient = await PollManagerClient.fromCreatorAndName({
        creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
        defaultSender: activeAddress ?? undefined,
        algorand,
      })

      const response = await appClient.state.box.boxMapStruct.getMap().catch((e: Error) => {
        enqueueSnackbar(`Error getting the polls: ${e.message}`, { variant: 'error' })
        return
      })

      if (!response) {
        return
      }

      setPolls(Array.from(response.values()))
    } catch (err) {
      enqueueSnackbar(`Failed to load polls. Please try again.`, { variant: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const runHelloContract = async () => {
    const appClient = await PollManagerClient.fromCreatorAndName({
      creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
      defaultSender: activeAddress ?? undefined,
      algorand,
    })

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
  }

  const runCreatePoll = async () => {
    const appClient = await PollManagerClient.fromCreatorAndName({
      creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
      defaultSender: activeAddress ?? undefined,
      algorand,
    })

    const response = await appClient.send
      .createPoll({
        args: {
          pollData: {
            question: 'What is the capital of France?',
            option_1: 'Paris',
            option_2: 'London',
            option_3: 'Berlin',
            option_4: 'Madrid',
            option_5: 'Rome',
            option_1Votes: 0n,
            option_2Votes: 0n,
            option_3Votes: 0n,
            option_4Votes: 0n,
            option_5Votes: 0n,
            voters: [],
          },
        },
        // args: {
        //   pollDataInput: {
        //     question: 'What is the capital of France?',
        //     option_1: 'Paris',
        //     option_2: 'London',
        //     option_3: 'Berlin',
        //     option_4: 'Madrid',
        //     option_5: 'Rome',
        //   },
        // },
      })
      .catch((e: Error) => {
        enqueueSnackbar(`Error calling the contract: ${e.message}`, { variant: 'error' })
        return
      })

    appClient.state.box.boxMapStruct.getMap()

    if (!response) {
      return
    }

    enqueueSnackbar(`Response from the contract: ${response.return}`, { variant: 'success' })
  }

  const test = async () => {
    const appClient = await PollManagerClient.fromCreatorAndName({
      creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
      defaultSender: activeAddress ?? undefined,
      algorand,
    })

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

    // await algorand.account.ensureFundedFromEnvironment('ADGHAQ5N6NGIWMLDC3JJH3757PLQZG6BFSMTQD3DVIKA6T6DXVMLD5TGMM', algo(10))
  }

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
        <button
          type="button"
          onClick={() => runHelloContract()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run Hello Contract
        </button>
        <button
          type="button"
          onClick={() => runCreatePoll()}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-700 rounded-xl transition-all duration-300 backdrop-blur-sm border border-violet-300/50 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Run Create Poll
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
            <PollCard key={poll.question} poll={poll} onVote={onVote} />
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
