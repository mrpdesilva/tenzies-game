import React from 'react'

const DIE_COLORS = [
  null, // index 0 unused
  { face: 'linear-gradient(135deg, #FF6B6B 0%, #FF4757 100%)', shadow: '#c0392b', text: '#fff', held: 'linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)', heldShadow: '#a029b0' },
  { face: 'linear-gradient(135deg, #FFA94D 0%, #FF6348 100%)', shadow: '#c0392b', text: '#fff', held: 'linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)', heldShadow: '#e17055' },
  { face: 'linear-gradient(135deg, #FFD43B 0%, #FCC419 100%)', shadow: '#e67e00', text: '#5c3d00', held: 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)', heldShadow: '#00876b' },
  { face: 'linear-gradient(135deg, #69DB7C 0%, #51CF66 100%)', shadow: '#2f9e44', text: '#fff', held: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)', heldShadow: '#0652DD' },
  { face: 'linear-gradient(135deg, #4DABF7 0%, #339AF0 100%)', shadow: '#1971c2', text: '#fff', held: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)', heldShadow: '#4834d4' },
  { face: 'linear-gradient(135deg, #CC5DE8 0%, #AE3EC9 100%)', shadow: '#862e9c', text: '#fff', held: 'linear-gradient(135deg, #fd79a8 0%, #e84393 100%)', heldShadow: '#b52b77' },
]

const DOT_POSITIONS = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 22], [75, 22], [25, 50], [75, 50], [25, 78], [75, 78]],
}

function Die({ value, isHeld, hold }) {
  const colors = DIE_COLORS[value] || DIE_COLORS[1]
  const bg = isHeld ? colors.held : colors.face
  const shadowColor = isHeld ? colors.heldShadow : colors.shadow
  const dotColor = isHeld ? (value === 3 ? '#005c40' : 'rgba(255,255,255,0.92)') : 'rgba(255,255,255,0.92)'
  const dots = DOT_POSITIONS[value] || []

  return (
    <button
      onClick={hold}
      aria-pressed={isHeld}
      aria-label={`Die with value ${value}, ${isHeld ? 'held' : 'not held'}`}
      style={{
        position: 'relative',
        width: 72,
        height: 72,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: 0,
        outline: 'none',
        transition: 'transform 0.15s cubic-bezier(.34,1.56,.64,1)',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px) scale(1.08) rotate(-3deg)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
      onMouseDown={e => e.currentTarget.style.transform = 'translateY(2px) scale(0.94)'}
      onMouseUp={e => e.currentTarget.style.transform = 'translateY(-5px) scale(1.08) rotate(-3deg)'}
    >
      {/* 3D bottom layer */}
      <div style={{
        position: 'absolute',
        top: 6,
        left: 2,
        right: 2,
        bottom: 0,
        borderRadius: 16,
        background: shadowColor,
        zIndex: 0,
      }} />

      {/* Die face */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 2,
        right: 2,
        height: 68,
        borderRadius: 16,
        background: bg,
        boxShadow: isHeld
          ? `inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.2), 0 0 0 3px rgba(255,255,255,0.8), 0 0 0 5px ${shadowColor}`
          : 'inset 0 2px 8px rgba(255,255,255,0.4), inset 0 -2px 6px rgba(0,0,0,0.15)',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'box-shadow 0.2s ease',
        overflow: 'hidden',
      }}>
        {/* Shine overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '45%',
          borderRadius: '16px 16px 60% 60%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }} />

        {/* Dots SVG */}
        <svg width="68" height="68" style={{ position: 'relative', zIndex: 3 }}>
          {dots.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={`${cx}%`}
              cy={`${cy}%`}
              r={value === 1 ? 8 : 6}
              fill={value === 3 ? '#fff' : dotColor}
              style={{
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            />
          ))}
        </svg>

        {/* Held sparkle */}
        {isHeld && (
          <div style={{
            position: 'absolute',
            top: 3, right: 5,
            fontSize: 12,
            zIndex: 4,
            animation: 'spin 2s linear infinite',
          }}>✨</div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

export default Die