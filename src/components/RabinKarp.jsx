import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

const d = 256, q = 101

export default function RabinKarp() {
  const [text, setText] = useState('GEEKS FOR GEEKS')
  const [pattern, setPattern] = useState('GEEKS')
  const [windowStart, setWindowStart] = useState(-1)
  const [matchPos, setMatchPos] = useState([])
  const [falseMatch, setFalseMatch] = useState(-1)
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(450)
  const [patternHash, setPatternHash] = useState(null)
  const [currentHash, setCurrentHash] = useState(null)
  const stopRef = useRef(false)

  async function runRK() {
    stopRef.current = false
    setRunning(true); setLog([]); setMatchPos([]); setFalseMatch(-1)
    const addLog = msg => setLog(l => [...l, msg])
    const n = text.length, m = pattern.length
    if (m > n) { addLog('Pattern longer than text!'); setRunning(false); return }

    let p = 0, t = 0, h = 1
    for (let i = 0; i < m - 1; i++) h = (h * d) % q
    for (let i = 0; i < m; i++) {
      p = (d * p + pattern.charCodeAt(i)) % q
      t = (d * t + text.charCodeAt(i)) % q
    }
    setPatternHash(p)
    addLog(`Pattern hash: ${p}`)

    const found = []
    for (let i = 0; i <= n - m; i++) {
      if (stopRef.current) break
      setWindowStart(i); setCurrentHash(t)
      const window = text.substring(i, i + m)
      addLog(`Pos ${i}: "${window}" → hash=${t}`)
      await sleep(speed)

      if (p === t) {
        if (window === pattern) {
          found.push(i); setMatchPos([...found])
          addLog(`  ✅ Match at index ${i}!`)
        } else {
          setFalseMatch(i)
          addLog(`  ⚠ Hash match but false positive!`)
          await sleep(speed / 2)
          setFalseMatch(-1)
        }
      } else {
        addLog(`  ✗ Hash mismatch — skip`)
      }

      if (i < n - m) {
        t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q
        if (t < 0) t += q
      }
    }

    setWindowStart(-1)
    if (found.length === 0) addLog('❌ Pattern not found.')
    else addLog(`\n${found.length} match(es) found.`)
    setRunning(false)
  }

  return (
    <div className="space-y-4">
      <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--muted)', border: '1px solid var(--border)' }}>
        Rabin-Karp uses rolling hashes to skip windows without character comparison. Watch for false positives (hash match but no real match).
      </div>
      <div className="flex flex-wrap gap-3">
        <div style={{ flex: 2 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Text</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            style={{ width: '100%' }} disabled={running} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 4 }}>Pattern</label>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)}
            style={{ width: '100%' }} disabled={running} />
        </div>
      </div>

      {/* Hash display */}
      {patternHash !== null && (
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
            Pattern hash: <span style={{ color: 'var(--accent2)', fontWeight: 700 }}>{patternHash}</span>
          </div>
          {currentHash !== null && (
            <div style={{
              background: 'var(--surface2)', border: `1px solid ${currentHash === patternHash ? '#10b981' : 'var(--border)'}`,
              borderRadius: 8, padding: '8px 14px', fontSize: 13
            }}>
              Window hash: <span style={{ color: currentHash === patternHash ? '#10b981' : '#f59e0b', fontWeight: 700 }}>{currentHash}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {text.split('').map((ch, i) => {
            const inWindow = windowStart !== -1 && i >= windowStart && i < windowStart + pattern.length
            const isMatch = matchPos.some(pos => i >= pos && i < pos + pattern.length)
            const isFalse = falseMatch !== -1 && i >= falseMatch && i < falseMatch + pattern.length
            return (
              <div key={i} style={{
                width: 28, height: 36, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: isMatch ? '#10b981' : isFalse ? '#f59e0b' : inWindow ? '#7c3aed' : 'var(--surface2)',
                borderRadius: 5, transition: 'all 0.15s', fontSize: 14, fontWeight: 700,
                color: (isMatch || isFalse || inWindow) ? '#0f172a' : 'var(--text)',
              }}>
                {ch}
                <span style={{ fontSize: 8, opacity: 0.6 }}>{i}</span>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#7c3aed' }}>■</span> Window</span>
          <span><span style={{ color: '#f59e0b' }}>■</span> False positive</span>
          <span><span style={{ color: '#10b981' }}>■</span> Match</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="50" max="1000" value={1050 - speed}
          onChange={e => setSpeed(1050 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
      </div>
      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runRK} disabled={!text || !pattern}>▶ Run Rabin-Karp</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('  ✅') ? '#10b981' : l.startsWith('  ⚠') ? '#f59e0b' : l.startsWith('❌') ? '#ef4444' : l.startsWith('Pattern') ? 'var(--accent2)' : 'var(--text)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
