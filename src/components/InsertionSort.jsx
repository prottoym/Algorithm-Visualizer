import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function InsertionSort() {
  const [input, setInput] = useState('29 10 14 37 13')
  const [arr, setArr] = useState([29, 10, 14, 37, 13])
  const [keyIdx, setKeyIdx] = useState(-1)
  const [comparing, setComparing] = useState([])
  const [sorted, setSorted] = useState([0])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(450)
  const stopRef = useRef(false)

  const maxVal = Math.max(...arr, 1)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) return
    setArr(nums); setSorted([0]); setKeyIdx(-1); setComparing([]); setLog([])
  }

  function randomize() {
    const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 5)
    setArr(nums); setInput(nums.join(' ')); setSorted([0]); setKeyIdx(-1); setComparing([]); setLog([])
  }

  async function runSort() {
    stopRef.current = false
    setRunning(true); setLog([]); setSorted([0])
    const a = [...arr]
    const n = a.length
    const addLog = msg => setLog(l => [...l, msg])

    for (let i = 1; i < n; i++) {
      if (stopRef.current) break
      const key = a[i]
      setKeyIdx(i)
      addLog(`── Pass ${i}: key = ${key} ──`)
      let j = i - 1

      while (j >= 0 && a[j] > key) {
        if (stopRef.current) break
        setComparing([j, j + 1])
        addLog(`  ${a[j]} > ${key} → shift right`)
        a[j + 1] = a[j]
        setArr([...a])
        await sleep(speed)
        j--
      }
      a[j + 1] = key
      setArr([...a])
      addLog(`  Placed ${key} at index ${j + 1}`)
      setSorted(Array.from({ length: i + 1 }, (_, k) => k))
      setComparing([])
      await sleep(speed)
    }

    setKeyIdx(-1)
    setSorted(Array.from({ length: a.length }, (_, i) => i))
    setRunning(false)
  }

  function getColor(i) {
    if (i === keyIdx) return '#f59e0b'
    if (comparing.includes(i)) return '#7c3aed'
    if (sorted.includes(i)) return '#10b981'
    return '#06b6d4'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Numbers separated by spaces" style={{ minWidth: 240, flex: 1 }} />
        <button className="btn-outline" onClick={parseInput} disabled={running}>Set</button>
        <button className="btn-outline" onClick={randomize} disabled={running}>Random</button>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="50" max="1000" value={1050 - speed}
          onChange={e => setSpeed(1050 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
      </div>
      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '16px 16px 8px', border: '1px solid var(--border)' }}>
        <div className="bar-container">
          {arr.map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{val}</span>
              <div style={{
                width: '100%', height: `${(val / maxVal) * 160}px`,
                background: getColor(i), borderRadius: '4px 4px 0 0', transition: 'height 0.2s, background 0.15s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#f59e0b' }}>■</span> Key element</span>
          <span><span style={{ color: '#7c3aed' }}>■</span> Comparing</span>
          <span><span style={{ color: '#10b981' }}>■</span> Sorted</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSort}>▶ Run Insertion Sort</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('──') ? 'var(--accent3)' : 'var(--text)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
