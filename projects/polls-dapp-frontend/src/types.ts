export interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  votedOptionId: string | null
}
