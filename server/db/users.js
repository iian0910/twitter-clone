import { prisma } from ".";
import bcrypt from "bcrypt";

export const createUser = (userData) => {
  // 資料建立前先將密碼轉為雜湊值
  const hasHashUserData = {
    ...userData,
    password: bcrypt.hashSync(userData.password, 10)
  }

  return prisma.user.create({
    data: hasHashUserData
  })
}

export const getUserByUsername = (username) => {
  return prisma.user.findUnique({
    where: {
      username
    }
  })
}