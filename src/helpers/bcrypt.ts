import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const bcrypt = {
  hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hashedPassword}`;
  },
  compare(password: string, encrypted: string) {
    const [salt, hashed] = encrypted.split(":");
    const hashedPassword = scryptSync(password, salt, 64);
    const bufferedEcnrypted = Buffer.from(hashed, "hex");
    return timingSafeEqual(hashedPassword, bufferedEcnrypted);
  },
};

export default bcrypt;
