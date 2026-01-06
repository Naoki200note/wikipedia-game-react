import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = "reset123";

const db = new sqlite3.Database("ranking.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS ranking (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT,
      theme TEXT,
      score INTEGER
    )
  `);
});

app.post("/register", (req, res) => {
  const { word, theme, score } = req.body;

  if (!word || !theme || typeof score !== "number") {
    return res.status(400).json({ error: "invalid data" });
  }

  db.run(
    "INSERT INTO ranking (word, theme, score) VALUES (?, ?, ?)",
    [word, theme, score],
    () => {
      res.json({ success: true });
    }
  );
});

app.get("/ranking", (req, res) => {
  db.all(
    "SELECT word, theme, score FROM ranking ORDER BY score DESC LIMIT 10",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "db error" });

      const rankingWithRank = rows.map((item, index) => ({
        rank: index + 1,
        word: item.word,
        theme: item.theme,
        score: item.score
      }));

      res.json(rankingWithRank);
    }
  );
});

app.post("/reset", (req, res) => {
  const key = req.query.key;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: "forbidden" });
  }

  db.run("DELETE FROM ranking", (err) => {
    if (err) {
      return res.status(500).json({ error: "failed" });
    }
    res.json({ success: true });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
