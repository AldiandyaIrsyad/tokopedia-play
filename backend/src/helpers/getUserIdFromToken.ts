import jwt from 'jsonwebtoken';

export function getUserIdFromToken(token: string): string {
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  const tokenString = JSON.stringify(decoded);
  const tokenObject = JSON.parse(tokenString);
  const userID = tokenObject.id;

  return userID;
}
