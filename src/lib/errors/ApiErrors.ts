export class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

// 400 - Bad Request
export class BadRequestError extends ApiError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

// 401 - Unauthorized
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// 403 - Forbidden
export class ForbiddenError extends ApiError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

// 404 - Not Found
export class NotFoundError extends ApiError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

// 409 - Conflict
export class ConflictError extends ApiError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

// 422 - Unprocessable Entity
export class ValidationError extends ApiError {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422);
    }
}

// 500 - Internal Server Error
export class InternalServerError extends ApiError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}
