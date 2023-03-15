export class NotImplementedError extends Error {
    constructor() {
        super("Not implemented");
    }
}

export class CommandNotFoundError extends Error {
    constructor() {
        super("Command not found");
    }
}

export class InvalidInteractionTypeError extends Error {
    constructor() {
        super("Invalid interaction type");
    }
}

export class UnauthorizedError extends Error {
    constructor() {
        super("Unauthorized");
    }
}