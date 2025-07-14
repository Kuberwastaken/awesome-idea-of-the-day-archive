# Contributing to Awesome Idea of the Day Archive

First off, thank you for considering contributing to this project! 🎉 

It's people like you that make the open source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit the entire startup and entrepreneurship community.

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard.

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues as you might find that the problem has already been reported. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** 
- **Include screenshots** if applicable
- **Explain what behavior you expected** and what actually happened

### 💡 Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **Include mockups or examples** if applicable

### 🔧 Pull Requests

Good pull requests are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

**Please ask first** before embarking on any significant pull request (e.g., implementing features, refactoring code), otherwise you risk spending time working on something that might not be merged.

#### Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. **Install dependencies** with `npm install`
3. **Test your changes** by running `npm run daily-idea`
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit the pull request**

### 📝 Documentation

Improvements to documentation are always welcome! This includes:

- **README updates** - Making setup instructions clearer
- **Code comments** - Explaining complex logic
- **Usage examples** - Showing how to customize the tool
- **Troubleshooting guides** - Helping users solve common issues

## Development Setup

### Prerequisites

- Node.js (version 14 or higher)
- Git
- A GitHub account

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/awesome-idea-of-the-day-archive.git
   cd awesome-idea-of-the-day-archive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Test the capture script**
   ```bash
   npm run daily-idea
   ```

4. **Make your changes**
   - Edit `screenshot.js` for capture logic
   - Update `.github/workflows/update_images.yml` for automation
   - Modify documentation as needed

5. **Test thoroughly**
   - Run the script manually
   - Check the generated archive structure
   - Verify screenshots are captured correctly

## Coding Standards

### JavaScript Style

- Use ES6+ features where appropriate
- Write descriptive variable and function names
- Add comments for complex logic
- Handle errors gracefully
- Use async/await for asynchronous operations

### File Structure

- Keep the main capture logic in `screenshot.js`
- Organize utility functions if needed
- Maintain clean separation of concerns

### Commit Messages

Follow this format for commit messages:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
- `feat(capture): add support for custom selectors`
- `fix(archive): resolve folder creation issue on Windows`
- `docs(readme): update installation instructions`

## Areas for Contribution

We especially welcome contributions in these areas:

### 🎯 High Priority
- **Improved Content Detection** - Better ways to identify the "Idea of the Day" section
- **Error Handling** - More robust error recovery and logging
- **Performance Optimization** - Faster capture and processing
- **Cross-Platform Testing** - Ensuring compatibility across OS

### 🔮 Feature Ideas
- **Multiple Source Support** - Archive from other idea platforms
- **Content Analysis** - Extract text from images using OCR
- **Trend Detection** - Identify patterns in archived ideas
- **API Integration** - Webhook notifications for new captures
- **Search Functionality** - Full-text search across archives

### 📚 Documentation
- **Video Tutorials** - Setup and customization guides
- **Use Case Examples** - Different ways to use the archive
- **Troubleshooting** - Common issues and solutions
- **Best Practices** - Recommendations for customization

## Recognition

Contributors will be recognized in:
- **README.md** - Contributors section
- **Release Notes** - Major contributions highlighted
- **GitHub Discussions** - Community shoutouts

## Questions?

Don't hesitate to ask questions! You can:
- **Open an issue** for general questions
- **Start a discussion** for broader topics
- **Contact maintainers** directly if needed

Thank you for contributing to the awesome startup community! 🚀 