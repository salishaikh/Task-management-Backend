import mongoose from "mongoose";

const connectmongo = async () => {
  try {
    mongoose.connect(`${process.env.MONGOO_URL}`);
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB!!!");
    });
  } catch (error) {
    console.error("ERROR: " + error);
  }
};
export default connectmongo;
