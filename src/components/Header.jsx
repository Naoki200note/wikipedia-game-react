export default function Header() {
    return (
      <header>
        <h1>📚 Wikipedia文字数ランキングゲーム</h1>
        <p className="description">
          ランダムに選ばれたテーマに合う言葉を入力してください。<br />
          Wikipediaの記事概要の文字数がスコアになります。
        </p>
        <p class="note">
        ※ スコアはWikipedia記事の要約文の文字数です
        </p>       
      </header>
    );
  }
  