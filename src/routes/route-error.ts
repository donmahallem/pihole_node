import { ValidationError } from 'jsonschema';

export class RouteError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }

    public static fromValidatorError(error: ValidationError | ValidationError[]): RouteError {
        if (Array.isArray(error)) {
            return this.fromValidatorError(error[0]);
        }
        return new RouteError(401, error.message);
    }
}