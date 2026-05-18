import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function MergeSort() {
  const [input, setInput] = useState('38 27 43 3 9 82 10')
  const [arr, setArr] = useState([38, 27, 43, 3, 9, 82, 10])
  const [highlights, setHighlights] = useState({})
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(500)
  const stopRef = useRef(false)

  const maxVal = Math.max(...arr, 1)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) return
    setArr(nums); setHighlights({}); setLog([])
  }

  function randomize() {
    const nums = Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 5)
    setArr(nums); setInput(nums.join(' ')); setHighlights({}); setLog([])
  }

  async function mergeSort(a, l, r, addLog) {
    if (stopRef.current || l >= r) return
    const m = Math.floor((l + r) / 2)
    await mergeSort(a, l, m, addLog)
    await mergeSort(a, m + 1, r, addLog)
    await merge(a, l, m, r, addLog)
  }

  async function merge(a, l, m, r, addLog) {
    if (stopRef.current) return
    const L = a.slice(l, m + 1)
    const R = a.slice(m + 1, r + 1)
    addLog(`Merging [${L.join(', ')}] + [${R.join(', ')}]`)

    // Highlight left and right halves
    const hmap = {}
    for (let i = l; i <= m; i++) hmap[i] = 'left'
    for (let i = m + 1; i <= r; i++) hmap[i] = 'right'
    setHighlights({ ...hmap })
    await sleep(speed)

    let i = 0, j = 0, k = l
    while (i < L.length && j < R.length) {
      if (stopRef.current) return
      if (L[i] <= R[j]) { a[k++] = L[i++] }
      else { a[k++] = R[j++] }
    }
    while (i < L.length) a[k++] = L[i++]
    while (j < R.length) a[k++] = R[j++]

    const hmap2 = {}
    for (let x = l; x <= r; x++) hmap2[x] = 'merged'
    setHighlights(prev => ({ ...prev, ...hmap2 }))
    setArr([...a])
    addLog(`  → [${a.slice(l, r + 1).join(', ')}]`)
    await sleep(speed)
    setHighlights({})
  }

  async function runSort() {
    stopRef.current = false
    setRunning(true); setLog([]); setHighlights({})
    const a = [...arr]
    const addLog = msg => setLog(l => [...l, msg])
    await mergeSort(a, 0, a.length - 1, addLog)
    if (!stopRef.current) {
      const finalH = {}
      a.forEach((_, i) => finalH[i] = 'done')
      setHighlights(finalH)
      addLog('✅ Array sorted!')
    }
    setRunning(false)
  }

  function getColor(i) {
    const h = highlights[i]
    if (h === 'done') return '#10b981'
    if (h === 'merged') return '#7c3aed'
    if (h === 'left') return '#f59e0b'
    if (h === 'right') return '#06b6d4'
    return '#334155'
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          placeholder="Numbers..." style={{ minWidth: 240, flex: 1 }} />
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
                background: getColor(i), borderRadius: '4px 4px 0 0', transition: 'all 0.25s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#f59e0b' }}>■</span> Left half</span>
          <span><span style={{ color: '#06b6d4' }}>■</span> Right half</span>
          <span><span style={{ color: '#7c3aed' }}>■</span> Merging</span>
          <span><span style={{ color: '#10b981' }}>■</span> Done</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSort}>▶ Run Merge Sort</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('✅') ? '#10b981' : l.startsWith('  →') ? '#7c3aed' : 'var(--accent3)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
