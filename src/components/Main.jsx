import React, { useEffect, useRef, useState } from 'react'
import Die from './Die'
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function Main() {
  const buttonRef = useRef(null)
  const timerRef = useRef(null)

  const generateAllNewDice = () =>
    new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }))

  const [dice, setDice] = useState(generateAllNewDice)
  const [rollCount, setRollCount] = useState(0)
  const [time, setTime] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [rolling, setRolling] = useState(false)

  const gameWon = dice.every(d => d.isHeld) && dice.every(d => d.value === dice[0].value)

  useEffect(() => {
    if (timerRunning && !gameWon) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [timerRunning, gameWon])

  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
      setTimerRunning(false)
    }
  }, [gameWon])

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0')
    const s = String(secs % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  const rollDice = () => {
    if (!gameWon) {
      if (!timerRunning) setTimerRunning(true)
      setRolling(true)
      setTimeout(() => setRolling(false), 300)
      setRollCount(c => c + 1)
      setDice(old => old.map(die =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      ))
    } else {
      setDice(generateAllNewDice())
      setRollCount(0)
      setTime(0)
      setTimerRunning(false)
    }
  }

  const hold = (id) => {
    setDice(old => old.map(die => die.id === id ? { ...die, isHeld: !die.isHeld } : die))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      fontFamily: "'Fredoka One', 'Nunito', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Floating background blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[
          { color: 'rgba(255,107,107,0.15)', size: 300, top: '5%', left: '5%', delay: '0s' },
          { color: 'rgba(78,205,196,0.12)', size: 250, top: '60%', left: '70%', delay: '1.5s' },
          { color: 'rgba(255,209,102,0.1)', size: 350, top: '30%', left: '80%', delay: '3s' },
          { color: 'rgba(199,125,255,0.13)', size: 200, top: '75%', left: '10%', delay: '2s' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            background: b.color,
            top: b.top,
            left: b.left,
            filter: 'blur(60px)',
            animation: `float 8s ease-in-out infinite`,
            animationDelay: b.delay,
          }} />
        ))}
      </div>

      {gameWon && <Confetti numberOfPieces={300} colors={['#FF6B6B','#FFD43B','#69DB7C','#4DABF7','#CC5DE8','#FFA94D']} />}

      <main style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 32,
        padding: '36px 40px',
        maxWidth: 480,
        width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}>

        {/* Title */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            margin: 0,
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #FFD43B 0%, #FF6B6B 40%, #CC5DE8 80%, #4DABF7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            lineHeight: 1,
          }}>
            TENZIES
          </h1>
          <p style={{
            margin: '8px 0 0',
            color: 'rgba(255,255,255,0.7)',
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
          }}>
            Roll until all dice match! Click a die to <strong style={{ color: '#FFD43B' }}>freeze</strong> it between rolls.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          {[
            { icon: '⏱️', label: 'Time', value: formatTime(time), color: '#4DABF7' },
            { icon: '🎲', label: 'Rolls', value: rollCount, color: '#FF6B6B' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${color}40`,
              borderRadius: 16,
              padding: '12px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 20 }}>{icon}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Nunito, sans-serif', marginTop: 2 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color, fontFamily: 'monospace', lineHeight: 1.2 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Win Banner */}
        {gameWon && (
          <div style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFD43B20, #FF6B6B20)',
            border: '2px solid #FFD43B',
            borderRadius: 16,
            padding: '12px 20px',
            textAlign: 'center',
            color: '#FFD43B',
            fontSize: 16,
            fontWeight: 700,
            animation: 'pulse 1s ease-in-out infinite',
          }}>
            🏆 Won in <span style={{ color: '#FF6B6B' }}>{rollCount} rolls</span> & <span style={{ color: '#69DB7C' }}>{formatTime(time)}</span>! 🎉
          </div>
        )}

        {/* Dice Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 72px)',
          gap: 12,
          padding: '8px 0',
          animation: rolling ? 'shake 0.3s ease' : 'none',
        }}>
          {dice.map((die) => (
            <Die
              key={die.id}
              value={die.value}
              isHeld={die.isHeld}
              hold={() => hold(die.id)}
            />
          ))}
        </div>

        {/* Roll Button */}
        <button
          ref={buttonRef}
          onClick={rollDice}
          style={{
            padding: '14px 52px',
            fontSize: 20,
            fontWeight: 900,
            fontFamily: "'Fredoka One', sans-serif",
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            background: gameWon
              ? 'linear-gradient(135deg, #FFD43B, #FF6B6B)'
              : 'linear-gradient(135deg, #FF6B6B, #CC5DE8)',
            color: '#fff',
            letterSpacing: '1px',
            boxShadow: gameWon
              ? '0 6px 0 #c0392b, 0 12px 30px rgba(255,107,107,0.5)'
              : '0 6px 0 #862e9c, 0 12px 30px rgba(204,93,232,0.5)',
            transition: 'transform 0.1s, box-shadow 0.1s',
            outline: 'none',
            textTransform: 'uppercase',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = 'translateY(3px)'
            e.currentTarget.style.boxShadow = gameWon
              ? '0 2px 0 #c0392b, 0 4px 10px rgba(255,107,107,0.4)'
              : '0 2px 0 #862e9c, 0 4px 10px rgba(204,93,232,0.4)'
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)'
          }}
        >
          {gameWon ? '🎮 New Game' : '🎲 Roll!'}
        </button>

        {/* Held hint */}
        <p style={{
          margin: 0,
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'Nunito, sans-serif',
        }}>
          {dice.filter(d => d.isHeld).length} / 10 dice held
        </p>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;700;900&display=swap');

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes shake {
          0%,100% { transform: rotate(0deg); }
          20% { transform: rotate(-3deg) scale(1.02); }
          40% { transform: rotate(3deg) scale(1.02); }
          60% { transform: rotate(-2deg); }
          80% { transform: rotate(2deg); }
        }
        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}

export default Main