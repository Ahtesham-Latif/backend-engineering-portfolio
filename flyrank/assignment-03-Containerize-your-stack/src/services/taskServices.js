import { pool } from '../database/db.js';
import { BadRequestError } from '../errors.js';

function taskFromRow(row) {
  if (!row) {
    return null;
  }

  return {
    id: Number(row.id),
    title: row.title,
    done: row.done === 'true' || row.done === true
  };
}

async function listTasks({ done, search } = {}) {
  let sql = 'SELECT id, title, done FROM tasks';
  const params = [];
  const clauses = [];

  if (done !== undefined) {
    const normalizedDone = String(done)
      .trim()
      .replace(/['"]/g, '')
      .toLowerCase();

    if (normalizedDone !== 'true' && normalizedDone !== 'false') {
      throw new BadRequestError('done must be true or false');
    }

    clauses.push(`done = $${params.length + 1}`);
    params.push(normalizedDone === 'true');
  }

  if (search !== undefined) {
    const normalizedSearch = String(search)
      .trim()
      .replace(/['"]/g, '');

    clauses.push(`title ILIKE $${params.length + 1}`);
    params.push(`%${normalizedSearch}%`);
  }

  if (clauses.length > 0) {
    sql += ` WHERE ${clauses.join(' AND ')}`;
  }

  sql += ' ORDER BY id ASC';

  const result = await pool.query(sql, params);
  return result.rows.map(taskFromRow);
}

async function getTaskById(taskId) {
  if (!Number.isInteger(taskId)) {
    return null;
  }

  const result = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);
  return taskFromRow(result.rows[0]);
}

async function createTask(title) {
  const trimmedTitle = String(title ?? '').trim();

  if (!trimmedTitle) {
    throw new BadRequestError('Title is required and cannot be empty');
  }

  const result = await pool.query(
    'INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING id, title, done',
    [trimmedTitle]
  );

  return taskFromRow(result.rows[0]);
}

async function updateTask(taskId, data = {}) {
  if (!Number.isInteger(taskId)) {
    return null;
  }

  const existing = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
  if (existing.rows.length === 0) {
    return null;
  }

  const fields = [];
  const params = [];

  if (data.title !== undefined) {
    const trimmedTitle = String(data.title ?? '').trim();
    if (!trimmedTitle) {
      throw new BadRequestError('Title cannot be empty');
    }

    fields.push(`title = $${params.length + 1}`);
    params.push(trimmedTitle);
  }

  if (data.done !== undefined) {
    const normalizedDone = String(data.done ?? '')
      .trim()
      .toLowerCase();

    if (normalizedDone === 'true' || normalizedDone === '1' || data.done === true) {
      fields.push(`done = $${params.length + 1}`);
      params.push(true);
    } else if (normalizedDone === 'false' || normalizedDone === '0' || data.done === false) {
      fields.push(`done = $${params.length + 1}`);
      params.push(false);
    } else {
      throw new BadRequestError('done must be true or false');
    }
  }

  if (fields.length === 0) {
    const result = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);
    return taskFromRow(result.rows[0]);
  }

  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = $${params.length + 1}`;
  await pool.query(sql, [...params, taskId]);

  const result = await pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [taskId]);
  return taskFromRow(result.rows[0]);
}

async function deleteTask(taskId) {
  if (!Number.isInteger(taskId)) {
    return false;
  }

  const existing = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);
  if (existing.rows.length === 0) {
    return false;
  }

  await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);
  return true;
}

async function resetTasks() {
  const defaultTasks = [
    { title: 'Buy milk', done: false },
    { title: 'Read Express docs', done: true },
    { title: 'Complete Stage 4', done: false }
  ];

  await pool.query('DELETE FROM tasks');

  for (const task of defaultTasks) {
    await pool.query('INSERT INTO tasks (title, done) VALUES ($1, $2)', [task.title, task.done]);
  }

  return true;
}

async function getStats() {
  const result = await pool.query(
    'SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE done = true)::int AS done FROM tasks'
  );

  const total = Number(result.rows[0].total);
  const done = Number(result.rows[0].done);

  return {
    total,
    done,
    open: total - done
  };
}

export { listTasks, getTaskById, createTask, updateTask, deleteTask, resetTasks, getStats };
