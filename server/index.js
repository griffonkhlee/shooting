import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// 連接MongoDB
mongoose.connect('mongodb://localhost:27017/leaderboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// 定義分數模型
const Score = mongoose.model('Score', {
  name: String,
  score: Number,
  date: { type: Date, default: Date.now }
})

// 獲取排行榜
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1 })
      .limit(10)
    res.json(scores)
  } catch (error) {
    res.status(500).json({ error: '獲取分數失敗' })
  }
})

// 提交新分數
app.post('/api/scores', async (req, res) => {
  try {
    const { name, score } = req.body
    const newScore = new Score({ name, score })
    await newScore.save()
    res.status(201).json(newScore)
  } catch (error) {
    res.status(500).json({ error: '保存分數失敗' })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`服務器運行在 http://localhost:${PORT}`)
})