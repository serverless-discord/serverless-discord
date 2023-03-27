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
  constructor(name?: string) {
    const message = name ? `Command ${name} not found` : "Command not found";
    super(message);
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

export class DiscordApiClientNotSetError extends Error {
  constructor() {
    super("DiscordApiClient not set");
  }
}

export class AsyncFeatureDisabledError extends Error {
  constructor() {
    super("Async features are disabled. Set the botToken property when initializing the router to enable them.");
  }
}