import * as taskService from '../services/taskServices.js';
import { NotFoundError } from '../errors.js';

export async function listTasks(req, res, next) {
  try {
    const list = await taskService.listTasks({ done: req.query.done, search: req.query.search });
    res.status(200).json({ list });
  } catch (error) {
    next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      throw new NotFoundError(`Task ${req.params.id} not found`);
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export function createTask(req, res, next) {
  try {
    const task = taskService.createTask(req.body.title);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export function updateTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const existingTask = taskService.getTaskById(taskId);
    if (!existingTask) {
      throw new NotFoundError(`Task ${req.params.id} not found`);
    }

    const task = taskService.updateTask(taskId, { title: req.body.title, done: req.body.done });
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
}

export function deleteTask(req, res, next) {
  try {
    const taskId = Number(req.params.id);
    const deleted = taskService.deleteTask(taskId);
    if (!deleted) {
      throw new NotFoundError(`Task ${req.params.id} not found`);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export function getStats(req, res, next) {
  try {
    res.status(200).json(taskService.getStats());
  } catch (error) {
    next(error);
  }
}

export function resetTasks(req, res, next) {
  try {
    taskService.resetTasks();
    const list = taskService.listTasks();
    res.status(200).json({ message: 'tasks reset', tasks: list });
  } catch (error) {
    next(error);
  }
}
