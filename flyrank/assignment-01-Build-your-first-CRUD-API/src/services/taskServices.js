const initialTasks = {
  1: { title: 'Buy milk', done: false },
  2: { title: 'Read Express docs', done: true },
  3: { title: 'Complete Stage 4', done: false }
};

let tasks = { ...initialTasks };
let nextTaskId = 4;

function listTasks({ done, search } = {}) {
  let list = Object.entries(tasks).map(([id, task]) => ({ id: Number(id), ...task }));

  if (done !== undefined) {
    const isDone = String(done)
      .trim()
      .replace(/['"]/g, '')
      .toLowerCase() === 'true';

    list = list.filter(task => task.done === isDone);
  }

  if (search !== undefined) {
    const searchTerm = String(search)
      .trim()
      .replace(/['"]/g, '')
      .toLowerCase();

    list = list.filter(task => task.title.toLowerCase().includes(searchTerm));
  }

  return list;
}

function getTaskById(taskId) {
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return null;
  }
  return { id: taskId, ...tasks[taskId] };
}

import { BadRequestError } from '../errors.js';

function createTask(title) {
  const trimmedTitle = String(title ?? '').trim();
  if (!trimmedTitle) {
    throw new BadRequestError('Title is required and cannot be empty');
  }

  const id = nextTaskId++;
  tasks[id] = { title: trimmedTitle, done: false };
  return { id, ...tasks[id] };
}

function updateTask(taskId, data = {}) {
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return null;
  }

  if (data.title !== undefined) {
    const trimmedTitle = String(data.title).trim();
    if (!trimmedTitle) {
      throw new BadRequestError('Title cannot be empty');
    }
    tasks[taskId].title = trimmedTitle;
  }

  if (data.done !== undefined) {
    tasks[taskId].done = Boolean(data.done);
  }

  return { id: taskId, ...tasks[taskId] };
}

function deleteTask(taskId) {
  if (!Number.isInteger(taskId) || !Object.prototype.hasOwnProperty.call(tasks, taskId)) {
    return false;
  }

  delete tasks[taskId];
  return true;
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
