# Terminal Portfolio

An interactive, terminal-style portfolio website built with vanilla HTML, CSS, and JavaScript.

## Features

- 🖥️ Authentic terminal interface with command-line interaction
- ⚡ Lightning-fast performance (under 1MB total size)
- 📱 Fully responsive design for all devices
- 🎨 Multiple color themes (Matrix, Cyberpunk, Retro)
- ⌨️ Full keyboard navigation with history and auto-completion
- 🌐 No external dependencies - runs anywhere

## Available Commands

- `help` - Show all available commands
- `about` - Learn about me
- `skills` - View technical skills
- `projects` - See featured projects
- `experience` - Work experience
- `education` - Educational background
- `contact` - Contact information
- `resume` - Download resume
- `github` - Open GitHub profile
- `linkedin` - Open LinkedIn profile
- `clear` - Clear terminal screen

## Quick Start

1. Clone or download this repository
2. Open `index.html` in your browser
3. Start typing commands!

## Development

To run a local development server:

```bash
# Using Python (recommended)
python -m http.server 8000

# Using Node.js (if you have live-server installed)
npm install -g live-server
npm run dev
```

Then open `http://localhost:8000` in your browser.

## Customization

### Personal Information
Edit the `portfolioData` object in `script.js` to update:
- Name and title
- Contact information
- Social media links

### Adding Commands
Add new commands by extending the `commands` object in the `PortfolioTerminal` class:

```javascript
this.commands = {
    // existing commands...
    newcommand: this.newCommand.bind(this)
};

newCommand() {
    this.addToOutput('<div>Your command output here</div>');
}
```

### Styling
Modify `style.css` to change:
- Colors and themes
- Typography
- Layout and spacing
- Animations

## Browser Support

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Mobile browsers

## License

MIT License - feel free to use this for your own portfolio!

## Contributing

Pull requests welcome! Feel free to:
- Add new commands
- Improve styling
- Fix bugs
- Add features

---

Built with ❤️ by Kushagra Kaushal
