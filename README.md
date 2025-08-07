# Responsive Stopwatch Application

> A modern, feature-rich stopwatch web application with precise timing, theme switching, and data export capabilities.

## Demo

[Live Demo](https://roshan-bhadane.github.io/SCT_WD_2/)

This stopwatch application is fully responsive and follows a mobile-first design approach, ensuring optimal viewing experience across all devices from smartphones to desktop monitors.

## Features

- **Precise Timing** - Accurate stopwatch with hours, minutes, seconds, and milliseconds
- **Lap & Split Timing** - Record segment times between laps and total elapsed time
- **Timer Presets** - Quick access to common timer durations (1min, 5min, 10min, 30min, 1hr)
- **Dark/Light Theme** - Toggle between dark and light modes with persistent preferences
- **Fullscreen Mode** - Distraction-free timing experience
- **Keyboard Shortcuts** - Quick access to all functions (S, R, L, P, E)
- **Export Functionality** - Export timing data in CSV, JSON, and Text formats
- **Responsive Design** - Adapts seamlessly to all screen sizes
- **Accessibility Features** - Screen reader support and keyboard navigation

## Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - With CSS variables for theming
- **Vanilla JavaScript** - No dependencies or frameworks

## Color Palette

The application uses a carefully selected color palette that adapts between light and dark themes:

### Light Theme
- **Background**: `#f5f5f5` - Light gray background
- **Container**: `#fff` - White container background
- **Display**: `#2c3e50` - Dark blue-gray for the timer display
- **Text**: `#333` - Dark gray for general text

### Dark Theme
- **Background**: `#1a1a2e` - Deep blue-black background
- **Container**: `#16213e` - Dark blue container background
- **Display**: `#0f3460` - Rich blue for the timer display
- **Text**: `#e6e6e6` - Light gray for general text

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine:

```bash
# Clone the repository
git clone https://github.com/Roshan-Bhadane/SCT_WD_2.git

# Navigate to the project directory
cd SCT_WD_2

# Open index.html in your browser
```

## Folder Structure

```
├── index.html                # Main HTML file
├── styles.css                # CSS styles with theming
├── script.js                 # JavaScript functionality
└── README.md                 # Project documentation
```

## Usage

### Basic Operation
1. Press the **Start** button to begin timing
2. Press **Lap** to record the time since the last lap
3. Press **Split** to record the total time from the start
4. Press **Pause** to temporarily stop the timer
5. Press **Reset** to clear the timer and all recorded times

### Exporting Data
1. Record some lap or split times
2. Click the **Export** button
3. Select your preferred format (CSV, JSON, or Text)
4. The file will automatically download with a timestamped filename

## Contributing

Contributions are welcome and greatly appreciated! If you'd like to contribute to this project, please fork the repository and create a pull request with your changes. Feel free to open issues for any bugs found or enhancements you'd like to suggest.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

[Roshan Bhadane](https://github.com/Roshan-Bhadane)