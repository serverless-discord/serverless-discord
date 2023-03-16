/**
 * Thrown when a method is not implemented.
 */
export class NotImplementedError extends Error {
    constructor() {
        super("Not implemented");
    }
}

/**
 * Thrown when a command is not found.
 */
export class CommandNotFoundError extends Error {
    constructor() {
        super("Command not found");
    }
}

/**
 * Thrown when the interaction type is invalid.
 */
export class InvalidInteractionTypeError extends Error {
    constructor() {
        super("Invalid interaction type");
    }
}

/**
 * Thrown when the user is not authorized to execute a command.
 */
export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
    }
}