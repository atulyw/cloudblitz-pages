# Trainer Batch Update System

A single-page static website for trainers to post batch updates to WhatsApp groups.

## Features

- **Dynamic Curriculum Loading**: Loads course data from YAML files
- **Form Validation**: Real-time validation with helpful error messages
- **WhatsApp Integration**: Direct sharing to WhatsApp Web
- **Local Storage**: Saves preferences and recent messages
- **Responsive Design**: Works on desktop and mobile devices
- **Search & Filter**: Quick filtering of subtopics
- **Recent Updates**: View and copy previous messages

## File Structure

```
/
├── index.html          # Main UI
├── styles.css          # Responsive styles
├── app.js             # All logic
├── data/
│   └── cdec-ai-topics.yaml  # Curriculum data
└── README.md          # This file
```

## Usage

1. Open `index.html` in a web browser or serve via HTTP server
2. Fill in the training session details
3. Select course and module from YAML data
4. Choose topics covered
5. Generate and share message via WhatsApp

## YAML Schema

```yaml
topics:
  - name: "course-name"
    main_topics:
      - name: "Module Name"
        subtopics:
          - "Topic 1"
          - "Topic 2"
```

## Requirements

- Modern web browser with JavaScript enabled
- HTTP server (for YAML loading) - use `python3 -m http.server 8000`
- Internet connection (for js-yaml CDN)

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

MIT License
