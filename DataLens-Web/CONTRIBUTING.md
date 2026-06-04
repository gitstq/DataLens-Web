# Contributing to DataLens-Web

Thank you for your interest in contributing to DataLens-Web! This document provides guidelines for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Open `index.html` in your browser to test changes

## Development Guidelines

### Code Style
- Use 2-space indentation for JavaScript and CSS
- Use single quotes for JavaScript strings
- Add meaningful comments for complex logic
- Keep functions focused and small (< 50 lines when possible)

### File Structure
```
DataLens-Web/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles
├── js/
│   ├── app.js          # Main controller
│   ├── parser.js       # Data format parsers
│   ├── visualizer.js   # Visualization engines
│   ├── transformer.js  # Format conversion & queries
│   ├── codegen.js      # Code generation
│   ├── exporter.js     # Export functionality
│   └── i18n.js         # Internationalization
├── .gitignore
├── LICENSE
└── README.md
```

### Commit Messages
Follow the Angular commit convention:
- `feat: add new feature`
- `fix: fix a bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: maintenance tasks`

### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly in multiple browsers
4. Submit a PR with a clear description

## Reporting Issues

When reporting bugs, please include:
- Browser name and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Sample data that triggers the issue (if applicable)

## Feature Requests

Feature requests are welcome! Please describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternative solutions you've considered

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
