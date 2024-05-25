import React from 'react'
import ReactDOMClient from 'react-dom/client'
import { DataProvider, useData } from '../providers/DataProvider'

const Popup = (): JSX.Element => {
  const { data } = useData()
  const team = data.hints[0]?.team
  const color = team === 'red' ? '#d13030' : '#4183cc'

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      padding: '10px',
      width: '300px',
    },
    loadingText: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#555',
    },
    hintCard: {
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '5px',
      marginBottom: '15px',
      padding: '10px',
    },
    hintText: {
      fontSize: '18px',
      fontWeight: 'bold',
      margin: '5px 0',
    },
    wordsList: {
      fontSize: '14px',
      color: color,
      margin: '5px 0',
    },
    justification: {
      fontSize: '14px',
      color: '#777',
      marginTop: '10px',
    },
  }

  return (
    <div style={styles.container}>
      {data.loading && <p style={styles.loadingText}>Loading...</p>}
      {data.hints.map((hint, index) => (
        <div key={index} style={styles.hintCard}>
          <p style={styles.hintText}>{hint.hint}</p>
          <p style={styles.wordsList}>{hint.words.join(', ')}</p>
          <p style={styles.justification}>{hint.justification}</p>
        </div>
      ))}
    </div>
  )
}

const App = (): JSX.Element => {
  return (
    <DataProvider>
      <Popup />
    </DataProvider>
  )
}

const root = document.getElementById('root')!
ReactDOMClient.createRoot(root).render(<App />)
