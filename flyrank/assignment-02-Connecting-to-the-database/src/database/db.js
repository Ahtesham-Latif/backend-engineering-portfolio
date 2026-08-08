import sqlite3 from 'sqlite3';
// SQLite Viewer instead of DB Browser for Sqlite
// I am using codespace so , i prefer to use SQLite Viewer extension instead of DB Browser for SQLite.
// Note: If you are using DB Browser for SQLite, you may need to change the path of the database file in the code below to match your local setup.
sqlite3.verbose();

const DB_PATH = new URL('../../tasks.db', import.meta.url);

const db = new sqlite3.Database(DB_PATH.pathname, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Failed to initialize SQLite database:', err.message);
  }
});

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `
          CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            done TEXT NOT NULL CHECK (done IN ('true', 'false')) DEFAULT 'false'
          )
        `,
        (createError) => {
          if (createError) {
            reject(createError);
            return;
          }

          db.all('SELECT id, title, done FROM tasks ORDER BY id ASC', (readError, rows) => {
            if (readError) {
              reject(readError);
              return;
            }

            const legacySeed = [
              { id: 1, title: 'Buy milk', done: 'false' },
              { id: 2, title: 'Read Express docs', done: 'true' },
              { id: 3, title: 'Complete Stage 4', done: 'false' }
            ];

            const isLegacySeed = rows.length === legacySeed.length && rows.every((row, index) => (
              Number(row.id) === legacySeed[index].id &&
              row.title === legacySeed[index].title &&
              row.done === legacySeed[index].done
            ));

            if (Number(rows.length) === 0) {
              const seedTasks = [
                ['Buy milk', 'false'],
                ['Read Express docs', 'true'],
                ['Started stage 0', 'false']
              ];

              const insertSql = 'INSERT INTO tasks (title, done) VALUES (?, ?)';
              db.run('BEGIN TRANSACTION');

              seedTasks.forEach(([title, done]) => {
                db.run(insertSql, [title, done]);
              });

              db.run('COMMIT', (commitError) => {
                if (commitError) {
                  reject(commitError);
                  return;
                }
                resolve();
              });
            } else if (isLegacySeed) {
              db.run(
                'UPDATE tasks SET title = ?, done = ? WHERE id = ?',
                ['Started stage 0', 'false', 3],
                (updateError) => {
                  if (updateError) {
                    reject(updateError);
                    return;
                  }

                  resolve();
                }
              );
            } else {
              resolve();
            }
          });
        }
      );
    });
  });
}

export { db, initializeDatabase };
