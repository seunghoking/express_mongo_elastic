import mongoose from "mongoose";

export default async (URL) => {
  try {
    // When successfully connected
    mongoose.connection.on("connected", () => {
      console.log("Mongoose default connection open to " + URL);
    });
    // If the connection throws an error
    mongoose.connection.on("error", (err) => {
      console.log("Mongoose default connection error: " + err);
    });
    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose default connection disconnected");
    });

    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // False by default. Set to true to opt in to using the MongoDB driver's new connection management engine. You should set this option to true, except for the unlikely case that it prevents you from maintaining a stable connection.
    });
  } catch (error) {
    console.error(error);
  }
};
