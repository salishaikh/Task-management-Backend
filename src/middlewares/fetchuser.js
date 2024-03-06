import jwt from "jsonwebtoken";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({
      message: "Invalid token cvf",
    });
  }
  try {
    const data = jwt.verify(token, process.env.jWT_SECRET_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Invalid token",
    });
  }
};

export default fetchuser;
