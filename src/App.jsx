import React, { useState, useEffect } from 'react'
import Game from './components/Game'
import Leaderboard from './components/Leaderboard'
import './App.css'

function App() {
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [playerName, setPlayerName] = useState('')

  const handleGameOver = (finalScore) => {
    setScore(finalScore)
    setGameOver(true)
  }

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return
    
    try {
      const response = await fetch('http://localhost:3001/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: playerName, score }),
      })
      
      if (response.ok) {
        setGameOver(false)
        setScore(0)
        setPlayerName('')
      }
    } catch (error) {
      console.error('Error submitting score:', error)
    }
  }

  return (
    <div className="app">
      {!gameOver ? (
        <Game onGameOver={handleGameOver} />
      ) : (
        <div className="game-over">
          <h2>遊戲結束</h2>
          <p>得分: {score}</p>
          <input
            type="text"
            placeholder="輸入你的名字"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={handleSubmitScore}>提交分數</button>
        </div>
      )}
      <Leaderboard />
    </div>
  )
}

export default App