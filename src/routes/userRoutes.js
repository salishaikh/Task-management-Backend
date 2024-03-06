import { Router } from "express";
import User from "../models/user.model.js";
const router = new Router();
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchuser from "../middlewares/fetchuser.js";
// Creating a user using : POST "/api/users"
router.post(
  "/register",
  // validators
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // validatr check
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const salt = await bcrypt.genSalt(10);
      const seccpass = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: seccpass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.jWT_SECRET_KEY, {
        expiresIn: 3600,
      });
      console.log(authtoken);
      res.json({ authtoken });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "User already exists" });
    }
  }
);

// logging user  : POST /api/users/login

router.post(
  "/login", // validators
  [
    body("email", "user not found").isEmail(),
    body("password", "please enter password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      // validatr check
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).send({
          message: "Invalid email or password",
        });
      }
      console.log(user);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send({
          message: "Invalid email or password",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      console.log(data);
      const authtoken = jwt.sign(data, process.env.jWT_SECRET_KEY, { expiresIn: '30d'});
      return res.send({ authtoken });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
);

// get logged user data   POST /api/users/getuser

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});
export default router;
