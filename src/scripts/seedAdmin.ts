import { prisma } from "../lib/prisma";
import { Role } from "../types";

async function seedAdmin() {
  if (!process.env.USER_EMAIL) {
    throw new Error("USER_EMAIL environment variable is not set");
  }

  const adminData = {
    name: process.env.USER_NAME,
    email: process.env.USER_EMAIL,
    role: Role.ADMIN,
    password: process.env.USER_PASS,
  };

  const isExists = await prisma.user.findUnique({
    where: {
      email: process.env.USER_EMAIL,
    },
  });

  if (isExists) {
    throw new Error("User already exists");
  }

  const createData = await fetch(
    "http://localhost:5000/api/auth/sign-up/email",
    {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        origin: "http://localhost:4000",
      },
      body: JSON.stringify(adminData),
    }
  );
  if (createData.ok) {
    await prisma.user.update({
      where: {
        email: adminData.email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
}

seedAdmin();
