import React, { useState, useRef } from 'react'

function sleep(ms) { return new Promise(res => setTimeout(res, ms)) }

export default function QuickSort() {
  const [input, setInput] = useState('10 80 30 90 40 50 70')
  const [arr, setArr] = useState([10, 80, 30, 90, 40, 50, 70])
  const [pivot, setPivot] = useState(-1)
  const [comparing, setComparing] = useState([])
  const [sorted, setSorted] = useState([])
  const [log, setLog] = useState([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(500)
  const stopRef = useRef(false)
  const sortedRef = useRef(new Set())

  const maxVal = Math.max(...arr, 1)

  function parseInput() {
    const nums = input.trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length < 2) return
    setArr(nums); setPivot(-1); setComparing([]); setSorted([]); setLog([])
    sortedRef.current = new Set()
  }

  function randomize() {
    const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 5)
    setArr(nums); setInput(nums.join(' ')); setPivot(-1); setComparing([]); setSorted([]); setLog([])
    sortedRef.current = new Set()
  }

  async function partition(a, low, high, addLog) {
    const piv = a[high]
    setPivot(high)
    addLog(`Pivot: ${piv} at index ${high}`)
    let i = low - 1

    for (let j = low; j < high; j++) {
      if (stopRef.current) return i
      setComparing([j])
      addLog(`  Compare ${a[j]} with pivot ${piv}`)
      await sleep(speed)

      if (a[j] < piv) {
        i++
        ;[a[i], a[j]] = [a[j], a[i]]
        setArr([...a])
        addLog(`  Swap ${a[j]} ↔ ${a[i]}`)
        await sleep(speed / 2)
      }
    }
    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
    setArr([...a])
    addLog(`Pivot ${piv} placed at final position ${i + 1}`)
    sortedRef.current.add(i + 1)
    setSorted([...sortedRef.current])
    setPivot(-1)
    setComparing([])
    return i + 1
  }

  async function quickSort(a, low, high, addLog) {
    if (stopRef.current || low >= high) return
    const pi = await partition(a, low, high, addLog)
    await quickSort(a, low, pi - 1, addLog)
    await quickSort(a, pi + 1, high, addLog)
  }

  async function runSort() {
    stopRef.current = false
    sortedRef.current = new Set()
    setRunning(true); setLog([]); setSorted([])
    const a = [...arr]
    const addLog = msg => setLog(l => [...l, msg])
    await quickSort(a, 0, a.length - 1, addLog)
    if (!stopRef.current) {
      setSorted(Array.from({ length: a.length }, (_, i) => i))
      addLog('✅ Array sorted!')
    }
    setRunning(false)
  }

  function getColor(i) {
    if (sorted.includes(i)) return '#10b981'
    if (i === pivot) return '#ef4444'
    if (comparing.includes(i)) return '#7c3aed'
    return '#06b6d4'
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
                background: getColor(i), borderRadius: '4px 4px 0 0', transition: 'all 0.2s',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: 'var(--muted)' }}>
          <span><span style={{ color: '#ef4444' }}>■</span> Pivot</span>
          <span><span style={{ color: '#7c3aed' }}>■</span> Comparing</span>
          <span><span style={{ color: '#10b981' }}>■</span> Sorted</span>
        </div>
      </div>
      <div className="flex gap-2">
        {!running
          ? <button className="btn" onClick={runSort}>▶ Run Quick Sort</button>
          : <button className="btn" style={{ background: '#ef4444' }} onClick={() => stopRef.current = true}>■ Stop</button>
        }
      </div>
      <div className="log-box">
        {log.length === 0
          ? <span style={{ color: 'var(--muted)' }}>// Logs will appear here...</span>
          : log.map((l, i) => (
            <div key={i} style={{ color: l.startsWith('Pivot') ? '#f59e0b' : l.startsWith('✅') ? '#10b981' : 'var(--text)', marginBottom: 2 }}>{l}</div>
          ))}
      </div>
    </div>
  )
}
