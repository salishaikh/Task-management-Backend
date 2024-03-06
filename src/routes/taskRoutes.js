import { Router } from "express";
import fetchuser from "../middlewares/fetchuser.js";
import { Task } from "../models/task.model.js";

import { body, validationResult } from "express-validator";
const router = new Router();

// ROute 1 :----> get all task using : POST "/api/notes"
router.post("/fetchtask", fetchuser, async (req, res) => {
  const task = await Task.find({ user: req.user.id });
  return res.send(task);
});

// ROute 2   :----> create task using : POST "/api/notes"
router.post(
  "/createtask",
  fetchuser,
  [
    body("title").isLength({ min: 3 }),
    body("description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const task = new Task({
        title,
        description,
        user: req.user.id,
        boardid: req.body.boardId,
      });

      const savedtask = await task.save();
      return res.status(200).send(savedtask);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// ROute 3   :----> update task using : POST "/api/notes"
router.post("/updatetask", fetchuser, async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const newtask = {};
    if (title) {
      newtask.title = title;
    }
    if (description) {
      newtask.description = description;
    }
    if (status) {
      newtask.status = status;
    }
    // find the task to be uodate
    let task = await Task.findById(req.body.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    task = await Task.findByIdAndUpdate(
      req.body.id,
      { $set: newtask },
      {
        new: true,
      }
    );
    console.log(task);
    return res.status(200).send(task);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  console.log("hvgdui");
});

// ROute 4   :----> delete task using : POST "/api/notes"
router.post("/deletetask", fetchuser, async (req, res) => {
  try {
    // find the task to be uodate
    let task = await Task.findById(req.body.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    task = await Task.findByIdAndDelete(req.body.id);
    res.status(200).send({ "success ": "task successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});
export default router;
