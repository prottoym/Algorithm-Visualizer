import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function NaiveMatch() {
  const [text, setText] = useState('AABAACAADAABAABA')
  const [pattern, setPattern] = useState('AABA')
  const [windowStart, setWindowStart] = useState(-1)
  const [matchPos, setMatchPos] = useState([])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(400)
  const stopRef = useRef(false)

  async function runMatch() {
    stopRef.current = false
    setRunning(true); setLog([]); setMatchPos([]); setWindowStart(-1)
    const addLog = msg => setLog(l => [...l, msg])
    const n = text.length, m = pattern.length
    const found = []

    for (let i = 0; i <= n - m; i++) {
      if (stopRef.current) break
      setWindowStart(i)
      const window = text.substring(i, i + m)
      addLog(`Position ${i}: checking "${window}"`)
      await sleep(speed)

      if (window === pattern) {
        found.push(i)
        setMatchPos([...found])
        addLog(`  ✅ Match found at index ${i}!`)
      } else {
        addLog(`  ✗ No match`)
      }
    }

    setWindowStart(-1)
    if (found.length === 0) addLog('❌ Pattern not found.')
    else addLog(`\nTotal ${found.length} match(es) found.`)
    setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            placeholder="Enter text..." style={{ width: '100%' }} disabled={running} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Pattern</label>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="Pattern..." style={{ width: '100%' }} disabled={running} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="50" max="1000" value={1050 - speed}
          onChange={e => setSpeed(1050 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
      </div>

      {/* Text visualization */}
      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {text.split('').map((ch, i) => {
            const inWindow = windowStart !== -1 && i >= windowStart && i < windowStart + pattern.length
            const isMatch = matchPos.some(pos => i >= pos && i < pos + pattern.length)
            return (
              <div key={i} style={{
                width: 28, height: 36, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: isMatch ? '#10b981' : inWindow ? '#7c3aed' : 'var(--surface2)',
                borderRadius: 5, transition: 'all 0.15s',
                fontSize: 14, fontWeight: 700,
                color: (isMatch || inWindow) ? '#0f172a' : 'var(--text)',
                outline: inWindow ? '1px solid #a78bfa' : 'none',
              }}>
                {ch}
                <span style={{ fontSize: 8, opacity: 0.6 }}>{i}</span>
              </div>
            )
          })}
        </div>
        {windowStart !== -1 && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            Window: <span style={{ color: '#a78bfa' }}>"{text.substring(windowStart, windowStart + pattern.length)}"</span>
            &nbsp;| Pattern: <span style={{ color: 'var(--accent2)' }}>"{pattern}"</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#7c3aed' }}>■</span> Current window</span>
          <span><span style={{ color: '#10b981' }}>■</span> Match</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runMatch} disabled={!text || !pattern}>▶ Run Naive Match</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('  ✅') ? '#10b981' : l.startsWith('❌') ? '#ef4444' : l.startsWith('  ✗') ? '#475569' : 'var(--accent3)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
