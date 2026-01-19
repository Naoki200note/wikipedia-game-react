import { useState } from 'react';

const themeKeywords = {
  動物: ["動物","哺乳類","魚類","鳥類","爬虫類","両生類","生息"],
  虫: ["虫","昆虫","節足動物","幼虫","成虫"],
  植物: ["植物","花","自生","被子植物","裸子植物","草","木"],
  ゲーム: ["ゲーム","コンピュータゲーム","コンピューターゲーム","ビデオゲーム","ソフト","ハード","アーケード"],
  国: ["国","共和国","王国","国家","国旗"],
  食べ物: ["食べ物","料理","食品","食材","調理","野菜","果物","フルーツ"],
  スポーツ: ["スポーツ","競技","選手","大会"],
  音楽: ["音楽","曲","アルバム","演奏","歌"],
  映画: ["映画","監督","主演","公開"],
  アニメ: ["アニメ","漫画","原作","放送","声優"],
  番組: ["番組","放送","制作","出演","司会","テレビ","ラジオ"],
  人物: ["人物","出身","生年月日","経歴"],
  グループ: ["グループ","団体","組織","バンド","チーム","コンビ","トリオ"],
  企業: ["企業","会社","設立","事業","本社"]
};

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function WordInput({ currentTheme, setRanking, pickRandomTheme }) {
  const [word, setWord] = useState("");

  const handleRegister = async () => {
    const trimmedWord = word.trim();
    if (!trimmedWord) {
      alert("言葉を入力してください");
      return;
    }

    try {
      const wikiRes = await fetch(
        "https://ja.wikipedia.org/api/rest_v1/page/summary/" +
        encodeURIComponent(trimmedWord)
      );
      if (!wikiRes.ok) {
        alert("Wikipediaの記事が見つかりませんでした");
        return;
      }

      const data = await wikiRes.json();
      if (!data.extract) {
        alert("本文を取得できませんでした");
        return;
      }

      const text = data.extract;
      const keywords = themeKeywords[currentTheme] || [];
      const isMatch = keywords.some(k => text.includes(k));
      if (!isMatch) {
        alert("テーマに合っていない可能性があります");
        return;
      }

      const count = text.length;

      const registerRes = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: trimmedWord,
          theme: currentTheme,
          score: count
        })
      });

      if (!registerRes.ok) {
        alert("ランキング登録に失敗しました");
        return;
      }

      const rankingRes = await fetch(`${API_BASE}/ranking`);
      const rankingData = await rankingRes.json();
      setRanking(rankingData);

      setWord("");
      pickRandomTheme();

    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    }
  };

  return (
    <div className="word-input">
      <input
        type="text"
        placeholder="Wikipediaにある言葉を入力"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button onClick={handleRegister}>
        🔍 Wikipediaで調べてスコア登録
      </button>
    </div>
  );
}
