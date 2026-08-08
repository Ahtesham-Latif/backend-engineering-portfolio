import { db } from '../database/db.js';
import { BadRequestError } from '../errors.js';

const initialTasks = {
  1: { title: 'Buy milk', done: false },
  2: { title: 'Read Express docs', done: true },
  3: { title: 'Complete Stage 4', done: false }
};

let tasks = { ...initialTasks };
let nextTaskId = 4;

function taskFromRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    done: row.done === 'true' || row.done === true
  };
}

function listTasks({ done, search } = {}) {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT id, title, done FROM tasks';
    const params = [];
    const clauses = [];

    if (done !== undefined) {
      const normalizedDone = String(done)
        .trim()
        .replace(/['"]/g, '')
        .toLowerCase();

      if (normalizedDone !== 'true' && normalizedDone !== 'false') {
        reject(new BadRequestError('done must be true or false'));
        return;
      }

      clauses.push('done = ?');
      params.push(normalizedDone);
    }

    if (search !== undefined) {
      const normalizedSearch = String(search)
        .trim()
        .replace(/['"]/g, '');

      clauses.push('title LIKE ?');
      params.push(`%${normalizedSearch}%`);
    }

    if (clauses.length > 0) {
      sql += ` WHERE ${clauses.join(' AND ')}`;
    }

    sql += ' ORDER BY id ASC';

    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows.map(taskFromRow));
    });
  });
}

function getTaskById(taskId) {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(taskId)) {
      resolve(null);
      return;
    }

    db.get('SELECT id, title, done FROM tasks WHERE id = ?', [taskId], (error, row) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(taskFromRow(row));
    });
  });
}

function createTask(title) {
  return new Promise((resolve, reject) => {
    const trimmedTitle = String(title ?? '').trim();
    if (!trimmedTitle) {
      reject(new BadRequestError('Title is required and cannot be empty'));
      return;
    }

    db.run(
      'INSERT INTO tasks (title, done) VALUES (?, ?)',
      [trimmedTitle, 'false'],
      function onInsert(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          id: this.lastID,
          title: trimmedTitle,
          done: false
        });
      }
    );
  });
}

function updateTask(taskId, data = {}) {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(taskId)) {
      resolve(null);
      return;
    }

    db.get('SELECT id FROM tasks WHERE id = ?', [taskId], (existError, row) => {
      if (existError) {
        reject(existError);
        return;
      }

      if (!row) {
        resolve(null);
        return;
      }

      const fields = [];
      const params = [];

      if (data.title !== undefined) {
        const trimmedTitle = String(data.title ?? '').trim();
        if (!trimmedTitle) {
          reject(new BadRequestError('Title cannot be empty'));
          return;
        }

        fields.push('title = ?');
        params.push(trimmedTitle);
      }

      if (data.done !== undefined) {
        const normalizedDone = String(data.done ?? '')
          .trim()
          .toLowerCase();

        if (normalizedDone === 'true' || normalizedDone === '1' || data.done === true) {
          fields.push('done = ?');
          params.push('true');
        } else if (normalizedDone === 'false' || normalizedDone === '0' || data.done === false) {
          fields.push('done = ?');
          params.push('false');
        } else {
          reject(new BadRequestError('done must be true or false'));
          return;
        }
      }

      if (fields.length === 0) {
        db.get('SELECT id, title, done FROM tasks WHERE id = ?', [taskId], (readError, selectedRow) => {
          if (readError) {
            reject(readError);
            return;
          }

          resolve(taskFromRow(selectedRow));
        });
        return;
      }

      const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
      db.run(sql, [...params, taskId], (updateError) => {
        if (updateError) {
          reject(updateError);
          return;
        }

        db.get('SELECT id, title, done FROM tasks WHERE id = ?', [taskId], (readError, selectedRow) => {
          if (readError) {
            reject(readError);
            return;
          }

          resolve(taskFromRow(selectedRow));
        });
      });
    });
  });
}

function deleteTask(taskId) {
  return new Promise((resolve, reject) => {
    if (!Number.isInteger(taskId)) {
      resolve(false);
      return;
    }

    db.get('SELECT id FROM tasks WHERE id = ?', [taskId], (checkError, row) => {
      if (checkError) {
        reject(checkError);
        return;
      }

      if (!row) {
        resolve(false);
        return;
      }

      db.run('DELETE FROM tasks WHERE id = ?', [taskId], (deleteError) => {
        if (deleteError) {
          reject(deleteError);
          return;
        }

        resolve(true);
      });
    });
  });
}

function resetTasks() {
  tasks = { ...initialTasks };
  nextTaskId = 4;
}

function getStats() {
  const total = Object.keys(tasks).length;
  const done = Object.values(tasks).filter(task => task.done === true).length;
  return { total, done, open: total - done };
}

export { listTasks, getTaskById, createTask, updateTask, deleteTask, resetTasks, getStats };
