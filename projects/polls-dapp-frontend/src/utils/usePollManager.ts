import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useCallback, useEffect, useState } from 'react'
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

  const [polls, setPolls] = useState<PollData[]>([])
  const [isFetchingPolls, setIsFetchingPolls] = useState(false)

  const getAppClient = useCallback(async () => {
    const appClient = await PollManagerClient.fromCreatorAndName({
      creatorAddress: POLL_MANAGER_CREATOR_ADDRESS,
      defaultSender: activeAddress ?? undefined,
      algorand,
    })
    return appClient
  }, [activeAddress])

  const fetchPolls = useCallback(async () => {
    console.log('fetchPolls')
    setIsFetchingPolls(true)
    try {
      const appClient = await getAppClient()
      const response = await appClient.state.box.boxMapStruct.getMap()
      console.log('polls response', Array.from(response.values()))

      if (!response) {
        setIsFetchingPolls(false)
        return
      }

      setPolls(Array.from(response.values()).sort((a, b) => Number(b.id) - Number(a.id)))
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
      return response
    },
    [getAppClient],
  )

  useEffect(() => {
    algorand.setDefaultSigner(transactionSigner)
  }, [transactionSigner])

  return { getAppClient, polls, isFetchingPolls, fetchPolls, createPoll }
}
