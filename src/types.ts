export type Message = {
  action: 'askChatGpt'
  data: string
}

export type ChatGptResponse = {
  hints: Hint[]
  rawResponse: string
  loading: boolean
}

export type Children = {
  children: React.ReactNode
}

export type Board = {
  cells: Cell[][]
  turn: Team
}

export type Team = 'blue' | 'red' | 'neutral' | 'assassin'

export type Cell = {
  word: string
  team: Team
  revealed: boolean
}

export type Hint = {
  team: 'red' | 'blue'
  hint: string
  words: string[]
  number: number
  justification: string
}
