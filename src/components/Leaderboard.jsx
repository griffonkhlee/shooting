import React, { useState, useEffect } from 'react'

const Leaderboard = () => {
  const [scores, setScores] = useState([])

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/scores')
        if (response.ok) {
          const data = await response.json()
          setScores(data)
        }
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    fetchScores()
    const interval = setInterval(fetchScores, 10000) // 每10秒更新一次

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="leaderboard">
      <h2>排行榜</h2>
      <ul className="leaderboard-list">
        {scores.map((score, index) => (
          <li key={score._id} className="leaderboard-item">
            <span>{index + 1}. {score.name}</span>
            <span>{score.score}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Leaderboard