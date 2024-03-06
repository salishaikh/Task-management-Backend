import { Router } from "express";
import { Board } from "../models/board.model.js";

import { body, validationResult } from "express-validator";
import fetchuser from "../middlewares/fetchuser.js";

const router = new Router();

// ROute 1 :----> get all bosrd using : POST "/api/bpard"
router.post("/fetchboard", fetchuser, async (req, res) => {
  try {
    const board = await Board.find({ user: req.user.id });
    return res.status(200).send(board);
  } catch (error) {
    console.log(error);
  }
});
// ROute 2   :----> create board using : POST "/api/board"
router.post(
  "/createboard",
  fetchuser,
  [body("title").isLength({ min: 3 })],
  async (req, res) => {
    try {
      const { title } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const task = new Board({
        title,
        user: req.user.id,
      });

      const savedtask = await task.save();
      return res.status(200).send(savedtask);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);
// ROute 3   :----> delete board using : POST "/api/board"

router.post("/deleteboard", fetchuser, async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.body.id);
    return res.status(200).json({ message: "board deleted" });
  } catch (error) {
    console.log(error.message);
  }
});
// ROute 4  :----> update board using : POST "/api/board"
router.post("/updateboard", fetchuser, async (req, res) => {
  try {
    const { title } = req.body;
    const newboard = {};
    if (title) {
      newboard.title = title;
    }
   
    // find the task to be uodate
    let board = await Board.findById(req.body.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    console.log(board);
    board = await Board.findByIdAndUpdate(
      req.body.id,
      { $set: newboard },
      {
        new: true,
      }
    );
    return res.status(200).send(board);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});
export default router;
