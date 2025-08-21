import { getServerSession } from "next-auth";
import { ForbiddenError, UnauthorizedError } from "./errors/ApiErrors";
import { authOptions } from "./auth/authOptions";
import { getUserById } from "./controllers/userController";
import { getErrorMessage } from "./errors/errorResponse";

type Role = 'user' | 'admin' | 'super-admin';

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 1,
  admin: 2,
  'super-admin': 3,
};

export async function userAuth(requiredRole: Role = 'user') {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new UnauthorizedError('You must be signed in to access this resource.');
    }

    // Verify user exists in DB
    const user = await getUserById(session.user.id);

    if (!user) {
      throw new UnauthorizedError('You must be signed in to access this resource.');
    }

    const role = user.role;

    if (!ROLE_HIERARCHY[role as Role]) {
      throw new ForbiddenError('Invalid user role.');
    }

    if (ROLE_HIERARCHY[role as Role] < ROLE_HIERARCHY[requiredRole]) {
      throw new ForbiddenError('You do not have sufficient permissions.');
    }

    return session.user;
  } catch (error) {
    throw new UnauthorizedError(getErrorMessage(error) || 'You must be signed in to access this resource.');
  }
}