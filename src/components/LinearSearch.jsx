import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function LinearSearch() {
  const [input, setInput] = useState('4 2 7 1 9 3 6 8')
  const [arr, setArr] = useState([4, 2, 7, 1, 9, 3, 6, 8])
  const [target, setTarget] = useState(9)
  const [current, setCurrent] = useState(-1)
  const [found, setFound] = useState(-1)
  const [eliminated, setEliminated] = useState([])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(400)
  const stopRef = useRef(false)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) return
    setArr(nums); setCurrent(-1); setFound(-1); setEliminated([]); setLog([])
  }

  async function runSearch() {
    stopRef.current = false
    setRunning(true); setLog([]); setFound(-1); setEliminated([]); setCurrent(-1)
    const addLog = msg => setLog(l => [...l, msg])
    const elim = []

    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) break
      setCurrent(i)
      addLog(`Checking index ${i}: value = ${arr[i]}`)
      await sleep(speed)

      if (arr[i] === target) {
        setFound(i)
        addLog(`✅ Found ${target} at index ${i}!`)
        setRunning(false)
        return
      } else {
        addLog(`  ${arr[i]} ≠ ${target} — skip`)
        elim.push(i)
        setEliminated([...elim])
      }
    }
    addLog(`❌ ${target} not found in array.`)
    setCurrent(-1)
    setRunning(false)
  }

  function getColor(i) {
    if (i === found) return '#10b981'
    if (i === current) return '#f59e0b'
    if (eliminated.includes(i)) return '#1e293b'
    return '#06b6d4'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Array elements..." style={{ flex: 1, minWidth: 200 }} />
        <button className="btn-outline" onClick={parseInput} disabled={running}>Set Array</button>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Search for:</span>
        <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))}
          style={{ width: 80 }} disabled={running} />
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="50" max="1000" value={1050 - speed}
          onChange={e => setSpeed(1050 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {arr.map((val, i) => (
            <div key={i} style={{
              width: 52, height: 52, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: getColor(i), borderRadius: 8, transition: 'all 0.2s',
              fontSize: 16, fontWeight: 700, color: eliminated.includes(i) ? '#475569' : '#0f172a',
              position: 'relative',
            }}>
              {val}
              <span style={{ fontSize: 9, fontWeight: 400, color: eliminated.includes(i) ? '#475569' : '#1e293b' }}>idx {i}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#f59e0b' }}>■</span> Checking</span>
          <span><span style={{ color: '#10b981' }}>■</span> Found</span>
          <span><span style={{ color: '#1e293b' }}>■</span> Eliminated</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSearch}>▶ Run Linear Search</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('✅') ? '#10b981' : l.startsWith('❌') ? '#ef4444' : 'var(--text)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
