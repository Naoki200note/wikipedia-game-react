export default function Ranking({ ranking }) {
    return (
      <div className="ranking">
        <h2>🏆 ランキング（上位10件）</h2>
        <ul>
          {ranking.map((item) => (
            <li key={item.rank}>
              {item.rank}位 | [{item.theme}] {item.word} : {item.score}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  