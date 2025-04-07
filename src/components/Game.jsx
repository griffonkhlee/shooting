import React, { useEffect, useRef } from 'react'

const Game = ({ onGameOver }) => {
  const canvasRef = useRef(null)
  const gameStateRef = useRef({
    player: {
      x: 50,
      y: 300,
      width: 50,
      height: 30,
      speed: 5,
      bullets: []
    },
    enemies: [],
    score: 0,
    gameLoop: null,
    keys: {}
  })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const gameState = gameStateRef.current

    const handleKeyDown = (e) => {
      gameState.keys[e.key] = true
    }

    const handleKeyUp = (e) => {
      gameState.keys[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    const spawnEnemy = () => {
      const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 30),
        width: 30,
        height: 30,
        speed: 3
      }
      gameState.enemies.push(enemy)
    }

    const shoot = () => {
      const bullet = {
        x: gameState.player.x + gameState.player.width,
        y: gameState.player.y + gameState.player.height / 2,
        width: 10,
        height: 5,
        speed: 7
      }
      gameState.player.bullets.push(bullet)
    }

    const checkCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y
    }

    const update = () => {
      // Player movement
      if (gameState.keys['ArrowUp'] && gameState.player.y > 0) {
        gameState.player.y -= gameState.player.speed
      }
      if (gameState.keys['ArrowDown'] && gameState.player.y < canvas.height - gameState.player.height) {
        gameState.player.y += gameState.player.speed
      }
      if (gameState.keys[' ']) {
        shoot()
      }

      // Update bullets
      gameState.player.bullets = gameState.player.bullets.filter(bullet => {
        bullet.x += bullet.speed
        return bullet.x < canvas.width
      })

      // Update enemies
      gameState.enemies = gameState.enemies.filter(enemy => {
        enemy.x -= enemy.speed

        // Check collision with bullets
        gameState.player.bullets.forEach((bullet, bulletIndex) => {
          if (checkCollision(bullet, enemy)) {
            gameState.score += 10
            gameState.player.bullets.splice(bulletIndex, 1)
            return false
          }
        })

        // Check collision with player
        if (checkCollision(gameState.player, enemy)) {
          clearInterval(gameState.gameLoop)
          onGameOver(gameState.score)
          return false
        }

        return enemy.x > -enemy.width
      })

      // Spawn enemies
      if (Math.random() < 0.02) {
        spawnEnemy()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw player
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(
        gameState.player.x,
        gameState.player.y,
        gameState.player.width,
        gameState.player.height
      )

      // Draw bullets
      ctx.fillStyle = '#ffff00'
      gameState.player.bullets.forEach(bullet => {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height)
      })

      // Draw enemies
      ctx.fillStyle = '#ff0000'
      gameState.enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
      })

      // Draw score
      ctx.fillStyle = '#ffffff'
      ctx.font = '20px Arial'
      ctx.fillText(`得分: ${gameState.score}`, 10, 30)
    }

    const gameLoop = () => {
      update()
      draw()
    }

    gameState.gameLoop = setInterval(gameLoop, 1000 / 60)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      clearInterval(gameState.gameLoop)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="game-canvas"
    />
  )
}

export default Game