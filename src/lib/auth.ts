import { getServerSession } from "next-auth";
import { ForbiddenError, UnauthorizedError } from "./errors/ApiErrors";
import { authOptions } from "./auth/authOptions";

type Role = 'user' | 'admin' | 'super-admin';

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  admin: 2,
  'super-admin': 3,
};

export async function userAuth(requiredRole: Role = 'user') {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthorizedError('You must be signed in to access this resource.');
  }

  const role = session.user.role;

  if (!ROLE_HIERARCHY[role as Role]) {
    throw new ForbiddenError('Invalid user role.');
  }

  if (ROLE_HIERARCHY[role as Role] < ROLE_HIERARCHY[requiredRole]) {
    throw new ForbiddenError('You do not have sufficient permissions.');
  }

  return session.user;
}