import { createContext, useContext, useState, ReactNode } from 'react'
import { PollData } from '../contracts/PollManager'

interface PollsContextType {
  polls: PollData[]
  setPolls: (polls: PollData[]) => void
  isFetchingPolls: boolean
  setIsFetchingPolls: (isFetching: boolean) => void
}

const PollsContext = createContext<PollsContextType | undefined>(undefined)

export function PollsProvider({ children }: { children: ReactNode }) {
  const [polls, setPolls] = useState<PollData[]>([])
  const [isFetchingPolls, setIsFetchingPolls] = useState(false)

  return (
    <PollsContext.Provider value={{ polls, setPolls, isFetchingPolls, setIsFetchingPolls }}>
      {children}
    </PollsContext.Provider>
  )
}

export function usePollsContext() {
  const context = useContext(PollsContext)
  if (context === undefined) {
    throw new Error('usePollsContext must be used within a PollsProvider')
  }
  return context
}
