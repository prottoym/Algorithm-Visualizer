import React, { useState } from 'react'
import BubbleSort from './components/BubbleSort'
import InsertionSort from './components/InsertionSort'
import MergeSort from './components/MergeSort'
import QuickSort from './components/QuickSort'
import LinearSearch from './components/LinearSearch'
import BinarySearch from './components/BinarySearch'
import NaiveMatch from './components/NaiveMatch'
import RabinKarp from './components/RabinKarp'

const CATEGORIES = [
  {
    id: 'sort',
    label: 'Sorting',
    icon: '⬆',
    color: '#7c3aed',
    algorithms: [
      { id: 'bubble', label: 'Bubble Sort', component: BubbleSort, complexity: 'O(n²)', space: 'O(1)' },
      { id: 'insertion', label: 'Insertion Sort', component: InsertionSort, complexity: 'O(n²)', space: 'O(1)' },
      { id: 'merge', label: 'Merge Sort', component: MergeSort, complexity: 'O(n log n)', space: 'O(n)' },
      { id: 'quick', label: 'Quick Sort', component: QuickSort, complexity: 'O(n log n)', space: 'O(log n)' },
    ]
  },
  {
    id: 'search',
    label: 'Searching',
    icon: '🔍',
    color: '#06b6d4',
    algorithms: [
      { id: 'linear', label: 'Linear Search', component: LinearSearch, complexity: 'O(n)', space: 'O(1)' },
      { id: 'binary', label: 'Binary Search', component: BinarySearch, complexity: 'O(log n)', space: 'O(1)' },
    ]
  },
  {
    id: 'pattern',
    label: 'Pattern Matching',
    icon: '🔎',
    color: '#f59e0b',
    algorithms: [
      { id: 'naive', label: 'Naive Match', component: NaiveMatch, complexity: 'O(n·m)', space: 'O(1)' },
      { id: 'rabinkarp', label: 'Rabin-Karp', component: RabinKarp, complexity: 'O(n+m)', space: 'O(1)' },
    ]
  }
]

export default function App() {
  const [activeCat, setActiveCat] = useState('sort')
  const [activeAlgo, setActiveAlgo] = useState('bubble')

  const category = CATEGORIES.find(c => c.id === activeCat)
  const algo = category?.algorithms.find(a => a.id === activeAlgo)
  const Component = algo?.component

  function selectCat(catId) {
    setActiveCat(catId)
    const cat = CATEGORIES.find(c => c.id === catId)
    if (cat) setActiveAlgo(cat.algorithms[0].id)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }} className="grid-pattern">
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, background: 'var(--accent)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 700
            }}>P</div>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.5px' }}>AlgoViz </span>

          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Algorithm Visualizer
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero */}
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-1px', lineHeight: 1.15 }}>
            <span style={{ color: 'var(--accent)' }}>Algorithm</span> Visualizer
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            Step-by-step interactive visualization of sorting, searching, and pattern matching algorithms
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--surface)', borderRadius: 10, padding: 6, border: '1px solid var(--border)' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => selectCat(cat.id)} style={{
              flex: 1, padding: '10px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
              background: activeCat === cat.id ? cat.color : 'transparent',
              color: activeCat === cat.id ? 'white' : 'var(--muted)',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Sidebar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Algorithms
            </div>
            {category?.algorithms.map(a => (
              <button key={a.id} onClick={() => setActiveAlgo(a.id)} style={{
                display: 'block', width: '100%', padding: '12px 14px',
                border: 'none', borderBottom: '1px solid var(--border)',
                background: activeAlgo === a.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                borderLeft: activeAlgo === a.id ? '3px solid var(--accent)' : '3px solid transparent',
                color: activeAlgo === a.id ? 'var(--text)' : 'var(--muted)',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 13, cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontWeight: activeAlgo === a.id ? 600 : 400 }}>{a.label}</div>
                <div style={{ fontSize: 11, marginTop: 2, color: category.color, opacity: 0.8 }}>
                  Time: {a.complexity}
                </div>
              </button>
            ))}

            {/* Complexity box */}
            {algo && (
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Complexity</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>Time</span>
                    <span style={{ color: 'var(--accent2)', fontWeight: 600 }}>{algo.complexity}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--muted)' }}>Space</span>
                    <span style={{ color: 'var(--accent3)', fontWeight: 600 }}>{algo.space}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main panel */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{algo?.label}</h2>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{category?.label} Algorithm</div>
              </div>
              <div style={{
                fontSize: 12, background: 'rgba(124,58,237,0.1)', color: category?.color,
                border: `1px solid ${category?.color}44`, borderRadius: 6, padding: '4px 10px',
              }}>
                {algo?.complexity}
              </div>
            </div>
            {Component && <Component key={activeAlgo} />}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: 40,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={() => window.open("https://github.com/prottoym", "_blank")}
            style={{
              padding: '10px 18px',
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = "0.85"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
