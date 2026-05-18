import React, { useState, useRef } from 'react'

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms))
}

export default function BubbleSort() {
  const [input, setInput] = useState('64 34 25 12 22 11 90')
  const [arr, setArr] = useState([64, 34, 25, 12, 22, 11, 90])
  const [comparing, setComparing] = useState([])
  const [swapped, setSwapped] = useState([])
  const [sorted, setSorted] = useState([])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(400)
  const stopRef = useRef(false)

  const maxVal = Math.max(...arr, 1)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) return
    setArr(nums)
    setComparing([])
    setSwapped([])
    setSorted([])
    setLog([])
  }

  function randomize() {
    const nums = Array.from({ length: 10 }, () => Math.floor(Math.random() * 95) + 5)
    setArr(nums)
    setInput(nums.join(' '))
    setComparing([])
    setSwapped([])
    setSorted([])
    setLog([])
  }

  async function runSort() {
    stopRef.current = false
    setRunning(true)
    setLog([])
    setSorted([])

    const a = [...arr]
    const n = a.length
    const sortedSet = new Set()
    const addLog = msg => setLog(l => [...l, msg])

    for (let i = 0; i < n - 1; i++) {
      if (stopRef.current) break
      addLog(`── Pass ${i + 1} ──`)
      let didSwap = false

      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) break
        setComparing([j, j + 1])
        addLog(`Compare [${a[j]}] vs [${a[j + 1]}]`)
        await sleep(speed)

        if (a[j] > a[j + 1]) {
          setSwapped([j, j + 1])
          addLog(`  ↕ Swap ${a[j]} ↔ ${a[j + 1]}`)
          ;[a[j], a[j + 1]] = [a[j + 1], a[j]]
          setArr([...a])
          didSwap = true
          await sleep(speed)
        } else {
          addLog(`  ✓ No swap needed`)
        }
        setSwapped([])
      }

      sortedSet.add(n - 1 - i)
      setSorted([...sortedSet])

      if (!didSwap) {
        addLog('✅ No swaps — array sorted!')
        for (let k = 0; k < n - 1 - i; k++) sortedSet.add(k)
        setSorted([...sortedSet])
        break
      }
    }

    setComparing([])
    setSwapped([])
    setSorted(Array.from({ length: a.length }, (_, i) => i))
    setRunning(false)
  }

  function stop() {
    stopRef.current = true
  }

  function getColor(i) {
    if (sorted.includes(i)) return '#10b981'
    if (swapped.includes(i)) return '#f59e0b'
    if (comparing.includes(i)) return '#7c3aed'
    return '#06b6d4'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter numbers separated by spaces"
          className="flex-1 min-w-48"
          style={{ minWidth: 240 }}
        />
        <button className="btn-outline" onClick={parseInput} disabled={running}>Set Array</button>
        <button className="btn-outline" onClick={randomize} disabled={running}>Random</button>
      </div>

      <div className="flex items-center gap-3">
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Speed</span>
        <input type="range" min="50" max="1000" value={1050 - speed}
          onChange={e => setSpeed(1050 - Number(e.target.value))}
          className="speed-slider" style={{ width: 100 }} />
        <span style={{ color: 'var(--muted)', fontSize: 12 }}>Fast</span>
      </div>

      {/* Bar chart */}
      <div style={{ background: 'var(--surface)', borderRadius: 10, padding: '16px 16px 8px', border: '1px solid var(--border)' }}>
        <div className="bar-container">
          {arr.map((val, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{val}</span>
              <div style={{
                width: '100%',
                height: `${(val / maxVal) * 160}px`,
                background: getColor(i),
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.2s, background 0.15s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#7c3aed' }}>■</span> Comparing</span>
          <span><span style={{ color: '#f59e0b' }}>■</span> Swapping</span>
          <span><span style={{ color: '#10b981' }}>■</span> Sorted</span>
          <span><span style={{ color: '#06b6d4' }}>■</span> Unsorted</span>
        </div>
      </div>

      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSort}>▶ Run Bubble Sort</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={stop}>■ Stop</button>
        }
      </div>

      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('──') ? 'var(--accent3)' : l.startsWith('  ↕') ? '#f59e0b' : l.startsWith('✅') ? '#10b981' : 'var(--text)', marginBottom: 2 }}>{l}</div>
          ))
        }
      </div>
    </div>
  )
}
