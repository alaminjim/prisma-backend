import { prisma } from "../lib/prisma";
import { Role } from "../types";

async function seedAdmin() {
  const adminData = {
    name: "admin1",
    email: "admin1234@gmail.com",
    role: Role.ADMIN,
    password: "admin123",
  };

  const isExists = await prisma.user.findUnique({
    where: {
      email: adminData.email,
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
