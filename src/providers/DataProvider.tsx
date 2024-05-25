import React, { useEffect, useMemo, useState } from 'react'
import c from '../scripts/Chrome'
import { Children, ChatGptResponse, Hint } from '../types'
import { getOuterHtml } from '../scripts/execute-scripts'
import { BoardHandler } from '../scripts/BoardHandler'

interface DataContextProps {
  data: ChatGptResponse
  setData: React.Dispatch<React.SetStateAction<ChatGptResponse>>
}

const DataContext = React.createContext({} as DataContextProps)

export const DataProvider = ({ children }: Children) => {
  const [data, setData] = useState<ChatGptResponse>({
    hints: [],
    rawResponse: '',
    loading: true,
  })

  const dataMemo = useMemo(
    () => ({
      data,
      setData,
    }),
    [data]
  )

  useEffect(() => {
    const fetchData = async () => {
      const { id } = await c.getActiveTab()
      if (id) {
        const document = await c.executeScript<string>(id, getOuterHtml)
        const board = new BoardHandler(document)

        const response = await c.sendAskChatGptMessage(
          board.generateHintPrompt()
        )

        const jsonStart = response.indexOf('```json')
        const jsonEnd = response.indexOf('```', jsonStart + 1)
        const responseJson = response.slice(jsonStart + 7, jsonEnd)

        const hints = JSON.parse(responseJson) as Hint[]

        setData({
          hints,
          rawResponse: response,
          loading: false,
        })
      }
    }

    fetchData().catch(console.error)
  }, [])

  return (
    <DataContext.Provider value={dataMemo}>{children}</DataContext.Provider>
  )
}

export const useData = () => React.useContext(DataContext)
