export default function ThemeSelector({ currentTheme, onPickTheme }) {
    return (
      <div className="theme-selector">
        <button onClick={onPickTheme}>🎲 テーマを決める</button>
        <p className="theme">
          現在のテーマ：<strong>{currentTheme || '---'}</strong>
        </p>
      </div>
    );
  }
  