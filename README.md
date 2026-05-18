#  Algorithm Visualizer

An interactive web application for visualizing classic computer science algorithms step by step — including sorting, searching, and pattern matching. Watch each algorithm come to life with real-time animations, color-coded states, and detailed execution logs.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

- **Step-by-step visualization** — watch every comparison, swap, and operation happen in real time
- **Adjustable speed** — slow down or speed up the animation with a slider
- **Live execution log** — see exactly what the algorithm is doing at each step
- **Custom input** — enter your own arrays, text, and patterns
- **Random input generator** — one click to generate a random test case
- **Stop anytime** — interrupt a running visualization at any point
- **Complexity info** — time and space complexity shown for every algorithm

---

## Algorithms Included

### Sorting
| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Bubble Sort | O(n²) | O(1) |
| Insertion Sort | O(n²) | O(1) |
| Merge Sort | O(n log n) | O(n) |
| Quick Sort | O(n log n) avg | O(log n) |

### Searching
| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Linear Search | O(n) | O(1) |
| Binary Search | O(log n) | O(1) |

### Pattern Matching
| Algorithm | Time Complexity | Space Complexity |
|---|---|---|
| Naive Matching | O(n·m) | O(1) |
| Rabin-Karp | O(n + m) avg | O(1) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/algorithm-visualizer.git

# Navigate into the project folder
cd algorithm-visualizer

# Install dependencies
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [React 18](https://react.dev) | UI components and state management |
| [Vite 5](https://vitejs.dev) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Smooth animations |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Monospace font for code aesthetic |

---

## 📁 Project Structure

```
algorithm-visualizer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx                  # Main layout and navigation
    ├── index.css                # Global styles and theme variables
    └── components/
        ├── BubbleSort.jsx
        ├── InsertionSort.jsx
        ├── MergeSort.jsx
        ├── QuickSort.jsx
        ├── LinearSearch.jsx
        ├── BinarySearch.jsx
        ├── NaiveMatch.jsx
        └── RabinKarp.jsx
```

---

## 🌐 Deployment

This project is deployed for free on **Vercel**.

> **Live Demo:** [https://algorithm-visualizer-yourname.vercel.app](https://algorithm-visualizer-yourname.vercel.app)

To deploy your own copy:

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New Project** → import this repo
4. Click **Deploy** — no configuration needed

---

##  Customization

### Change the color theme
Edit the CSS variables in `src/index.css`:

```css
:root {
  --accent: #7c3aed;   
  --accent2: #06b6d4;  
  --accent3: #f59e0b;
}
```

### Add a new algorithm
1. Create `src/components/YourAlgorithm.jsx`
2. Import it in `src/App.jsx`
3. Add it to the `CATEGORIES` array with its label and complexity info

---

## 📸 Screenshots

> ![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)

---
