import { NextResponse } from "next/server";

export async function POST() {
    try {
        
    } catch (error) {
        return NextResponse.json({message: 'Something went wrong', error}, {status: 500})
    }
}