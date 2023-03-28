# Contributing

Thank you for taking the time to help contribute to this project!

## Development

### Linting

Linting is enforced and run on every pull request. Run the following command to lint the code:

```
npm run lint
```

Automatically fix linting errors:

```
npm run lint:fix
```

### Testing

Tests are run on every pull request and must pass before merging. Run the following command to execute the unit tests:

```
npm run test
```

Run tests with coverage:

```
npm run test:coverage
```

Run the following to run integration tests which require more setup:

```
npm run test:integration
```

### Building

The Typescript files are built with sourcemaps for the npm package. Run the following command to build to javascript:

```
npm run build
```

### Versioning and Publishing

Versioning follows normal semantic versioning, and it's handled by running the appropriate npm version <level> command. Publishing is done via GitHub releases, where each release triggers a GitHub action that deploys to npm. This project is
currently in prerelease status so all versions will be patches until a more production ready release.