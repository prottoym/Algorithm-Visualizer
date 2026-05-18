import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function BinarySearch() {
  const [input, setInput] = useState('2 5 8 12 16 23 38 56 72 91')
  const [arr, setArr] = useState([2, 5, 8, 12, 16, 23, 38, 56, 72, 91])
  const [target, setTarget] = useState(23)
  const [left, setLeft] = useState(-1)
  const [right, setRight] = useState(-1)
  const [mid, setMid] = useState(-1)
  const [found, setFound] = useState(-1)
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(600)
  const stopRef = useRef(false)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b)
    setArr(nums); setInput(nums.join(' ')); setLeft(-1); setRight(-1); setMid(-1); setFound(-1); setLog([])
  }

  async function runSearch() {
    stopRef.current = false
    setRunning(true); setLog([]); setFound(-1)
    const addLog = msg => setLog(l => [...l, msg])
    let lo = 0, hi = arr.length - 1

    while (lo <= hi) {
      if (stopRef.current) break
      const m = Math.floor((lo + hi) / 2)
      setLeft(lo); setRight(hi); setMid(m)
      addLog(`Left=${lo}, Right=${hi}, Mid=${m} → value=${arr[m]}`)
      await sleep(speed)

      if (arr[m] === target) {
        setFound(m)
        addLog(`✅ Found ${target} at index ${m}!`)
        setRunning(false)
        return
      } else if (arr[m] < target) {
        addLog(`  ${arr[m]} < ${target} → Go Right`)
        lo = m + 1
      } else {
        addLog(`  ${arr[m]} > ${target} → Go Left`)
        hi = m - 1
      }
    }
    addLog(`❌ ${target} not found.`)
    setLeft(-1); setRight(-1); setMid(-1)
    setRunning(false)
  }

  function getColor(i) {
    if (i === found) return '#10b981'
    if (i === mid) return '#f59e0b'
    if (left !== -1 && i >= left && i <= right) return '#7c3aed'
    return '#1e293b'
  }

  return (
    <div className="space-y-4">
      <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'var(--muted)', border: '1px solid var(--border)' }}>
        ℹ️ Array must be sorted. Input will be auto-sorted when you click Set.
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Sorted numbers..." style={{ flex: 1, minWidth: 200 }} />
        <button className="btn-outline" onClick={parseInput} disabled={running}>Set &amp; Sort</button>
      </div>
      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Search for:</span>
        <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))}
          style={{ width: 80 }} disabled={running} />
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="100" max="1200" value={1300 - speed}
          onChange={e => setSpeed(1300 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {arr.map((val, i) => (
            <div key={i} style={{
              width: 48, height: 48, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: getColor(i), borderRadius: 8, transition: 'all 0.3s',
              fontSize: 14, fontWeight: 700,
              color: (i === found || i === mid || (left !== -1 && i >= left && i <= right)) ? '#0f172a' : '#475569',
              outline: i === mid ? '2px solid #f59e0b' : 'none',
            }}>
              {val}
              <span style={{ fontSize: 8, fontWeight: 400 }}>
                {i === left ? 'L' : ''}{i === right ? 'R' : ''}{i === mid ? 'M' : ''}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#7c3aed' }}>■</span> Search range</span>
          <span><span style={{ color: '#f59e0b' }}>■</span> Mid</span>
          <span><span style={{ color: '#10b981' }}>■</span> Found</span>
          <span><span style={{ color: '#1e293b' }}>■</span> Eliminated</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSearch}>▶ Run Binary Search</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('✅') ? '#10b981' : l.startsWith('❌') ? '#ef4444' : l.startsWith('  ') ? '#06b6d4' : 'var(--accent3)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
