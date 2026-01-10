import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function server() {
  try {
    await prisma.$connect();
    console.log("Server connected successful");

    app.listen(PORT, () => {
      console.log(`server is running port on: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

server();
