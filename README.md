# React File Explorer

## Overview

This is a dynamic, interactive File Explorer component built with React. It provides a user-friendly interface for managing a hierarchical file and folder structure with features like:

- Adding folders and files
- Renaming nodes
- Deleting nodes
- Expanding and collapsing folders
- Dark and light theme toggle

## Features

### 🌟 Key Capabilities
- **Hierarchical Tree Structure**: Supports nested folders and files
- **Dynamic Manipulation**: 
  - Add new folders and files
  - Rename existing nodes
  - Delete nodes with confirmation
- **Theme Switching**: Toggle between dark and light modes
- **Responsive Design**: Clean, modern UI with hover effects and intuitive interactions

### 🎨 Themes
- Dark mode (default)
- Light mode
- Easy theme switching with a sun/moon toggle button

## Installation

1. Clone the repository
```bash
git clone [https://github.com/yourusername/react-file-explorer.git](https://github.com/ashishharswal-dev/File-Structure.git)
```

2. Install dependencies
```bash
cd react-file-explorer
npm install
```

3. Start the development server
```bash
npm start
```

## Usage

```jsx
import FileExplorer from './FileExplorer';

const App = () => {
  const initialTree = [
    {
      id: 'unique-id-1',
      name: 'src',
      type: 'folder',
      children: [
        // Your file and folder structure
      ]
    }
  ];

  return <FileExplorer initialTree={initialTree} />;
};
```

## Props

- `initialTree` (required): An array of objects representing the initial file/folder structure
  - Each object should have:
    - `id`: Unique identifier
    - `name`: Display name
    - `type`: 'folder' or 'file'
    - `children` (optional): Array of child nodes for folders

## Dependencies

- React
- Lucide React Icons

## Customization

The component uses CSS variables and class-based theming, making it easy to customize:
- Modify the `styles` constant in the component
- Extend existing dark/light mode classes
- Add your own theme variations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Links

Project Demo: [react-file-explorer](https://file-structure.vercel.app/)
