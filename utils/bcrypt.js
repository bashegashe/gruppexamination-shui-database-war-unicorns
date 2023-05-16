import bcrypt from 'bcrypt';

export const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
}

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
}