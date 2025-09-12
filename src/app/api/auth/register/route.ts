import User from "@/models/User";
import { hashPassword } from "@/lib/hash";
import { connectDB } from "@/lib/db/mongoose";
import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors/errorResponse";


export async function POST(req: Request) {
    try {

        const { email, username, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await connectDB();

        //Checking is email already in use or not
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        //Checking is username already in user or not
        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            return NextResponse.json({ error: "Username already exists" }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        return NextResponse.json({ message: "User created", user: newUser }, { status: 201 });

    } catch (error) {
        return handleApiError(error);
    }
}
