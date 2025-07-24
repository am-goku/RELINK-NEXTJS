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
