export default function Footer({ onReset, showAdmin }) {
    if (!showAdmin) return null;
  
    return (
      <footer>
        <button onClick={onReset}>
          管理者用：ランキングリセット
        </button>
      </footer>
    );
  }
  