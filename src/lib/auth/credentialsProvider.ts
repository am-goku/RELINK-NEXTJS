import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "./authorizeUser";

const credentialsProvider = CredentialsProvider({
    name: "Credentials",
    credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
    },
    authorize: authorizeUser,
});

export default credentialsProvider;