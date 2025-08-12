import { NextResponse } from 'next/server';
import { ApiError } from './ApiErrors';

export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
        return NextResponse.json(
            { error: error.message },
            { status: error.statusCode }
        );
    }

    if (error instanceof Error) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }

    return NextResponse.json(
        { error: 'Unexpected error occurred' },
        { status: 500 }
    );
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        // Standard JS Error object
        return error.message;
    }

    if (typeof error === "string") {
        // Directly a string error
        return error;
    }

    try {
        // In case it's an object with a 'message' property
        return JSON.stringify(error);
    } catch {
        // Fallback if JSON.stringify fails
        return "Unknown error occurred";
    }
}
