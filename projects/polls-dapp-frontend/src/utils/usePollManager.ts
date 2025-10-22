import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useCallback, useEffect } from 'react'
import { usePollsContext } from '../contexts/PollsContext'
import { POLL_MANAGER_CREATOR_ADDRESS } from '../contracts/config'
import { PollData, PollManagerClient } from '../contracts/PollManager'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from './network/getAlgoClientConfigs'

const algodConfig = getAlgodConfigFromViteEnvironment()
const indexerConfig = getIndexerConfigFromViteEnvironment()
const algorand = AlgorandClient.fromConfig({
  algodConfig,
  indexerConfig,
})

export function usePollManager() {
  const { transactionSigner, activeAddress } = useWallet()
  const { polls, setPolls, isFetchingPolls, setIsFetchingPolls } = usePollsContext()

  const getAppClient = useCallback(async () => {
    const appClient = await PollManagerClient.fromCreatorAndName({
      creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
      defaultSender: activeAddress ?? undefined,
      algorand,
    })
    return appClient
  }, [activeAddress])

  const fetchPolls = useCallback(async () => {
    setIsFetchingPolls(true)
    try {
      const appClient = await getAppClient()
      const response = await appClient.state.box.boxMapStruct.getMap()

      if (!response) {
        setIsFetchingPolls(false)
        return
      }

      const newPolls = Array.from(response.values()).sort((a, b) => Number(b.id) - Number(a.id))
      setPolls(newPolls)
    } catch (error) {
      console.error('Error fetching polls:', error)
      throw error
    } finally {
      setIsFetchingPolls(false)
    }
  }, [getAppClient])

  const createPoll = useCallback(
    async (pollData: PollData) => {
      const appClient = await getAppClient()
      const response = await appClient.send.createPoll({ args: { pollData } })
      console.log('createPoll response', response)
      return response
    },
    [getAppClient],
  )

  const vote = useCallback(
    async (pollId: bigint, option: number) => {
      const appClient = await getAppClient()

      let methodToCall
      switch (option) {
        case 1:
          methodToCall = appClient.send.voteOption_1
          break
        case 2:
          methodToCall = appClient.send.voteOption_2
          break
        case 3:
          methodToCall = appClient.send.voteOption_3
          break
        case 4:
          methodToCall = appClient.send.voteOption_4
          break
        case 5:
          methodToCall = appClient.send.voteOption_5
          break
        default:
          throw new Error('Invalid option')
      }

      const response = await methodToCall({ args: { pollId, caller: activeAddress ?? '' } })
      console.log('vote response', response)
      return response
    },
    [getAppClient],
  )

  useEffect(() => {
    algorand.setDefaultSigner(transactionSigner)
  }, [transactionSigner])

  return { getAppClient, polls, isFetchingPolls, fetchPolls, createPoll, vote }
}
