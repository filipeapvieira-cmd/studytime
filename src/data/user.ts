import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: number) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    return null;
  }
};

export const createUser = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const user = await db.user.create({ data });
    return user;
  } catch (error) {
    return null;
  }
};
