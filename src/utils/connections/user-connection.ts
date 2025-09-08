import { ShortUser } from "../sanitizer/user";

export function hasConnection(connections: ShortUser[], id: string): boolean {
  return connections.some((conn) => conn._id.toString() === id.toString());
}
