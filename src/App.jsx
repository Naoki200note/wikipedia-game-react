import './App.css';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import ThemeSelector from './components/ThemeSelector';
import WordInput from './components/WordInput';
import Ranking from './components/Ranking';
import Footer from './components/Footer';

const themes = [
  "動物","虫","植物","ゲーム","国","食べ物","スポーツ","音楽",
  "映画","アニメ","番組","人物","グループ","企業"
];

const API_BASE = import.meta.env.VITE_API_BASE_URL;
const ADMIN_KEY = "reset123";

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('');
  const [ranking, setRanking] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);

  const pickRandomTheme = () => {
    const index = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[index]);
  };

  const loadRanking = async () => {
    const res = await fetch(`${API_BASE}/ranking`);
    const data = await res.json();
    setRanking(data);
  };

  const handleReset = async () => {
    if (!confirm("本当にランキングをリセットしますか？")) return;

    await fetch(`${API_BASE}/reset?key=${ADMIN_KEY}`, {
      method: "POST"
    });
    loadRanking();
  };

  useEffect(() => {
    pickRandomTheme();
    loadRanking();

    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "1") setShowAdmin(true);
  }, []);

  return (
    <div className="container">
      <Header />
      <ThemeSelector currentTheme={currentTheme} onPickTheme={pickRandomTheme} />
      <WordInput
        currentTheme={currentTheme}
        setRanking={setRanking}
        pickRandomTheme={pickRandomTheme}
      />
      <Ranking ranking={ranking} />
      <Footer onReset={handleReset} showAdmin={showAdmin} />
    </div>
  );
}
