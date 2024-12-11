import React, { useState, useRef, useEffect } from 'react';
import {
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

// generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Recursive function to find and remove a node
const removeNode = (tree, targetNode) => {
  return tree.reduce((acc, node) => {
    if (node === targetNode) {
      return acc; // Remove this node
    }

    // If the node has children, recursively search and filter
    if (node.children) {
      const filteredChildren = removeNode(node.children, targetNode);
      if (filteredChildren.length > 0) {
        const newNode = { ...node, children: filteredChildren };
        acc.push(newNode);
      }
    } else {
      acc.push(node);
    }

    return acc;
  }, []);
};

// Main FileExplorer Component
const FileExplorer = ({ initialTree }) => {
  const [tree, setTree] = useState(initialTree);
  const [theme, setTheme] = useState('dark');
  const [editingNode, setEditingNode] = useState(null);
  const inputRef = useRef(null);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  // Recursive component to render tree nodes
  const TreeNode = ({ node, depth = 0, onDelete, parentNode }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const editInputRef = useRef(null);
    const isFolder = node.type === 'folder';

    useEffect(() => {
      if (isEditing && editInputRef.current) {
        editInputRef.current.focus();
        editInputRef.current.select();
      }
    }, [isEditing]);

    const handleToggleExpand = () => {
      if (isFolder) {
        setIsExpanded(!isExpanded);
      }
    };

    const handleAddNode = (type) => {
      // If current node is a file, find its parent
      const targetNode = node.type === 'folder' ? node : parentNode;

      // Ensure targetNode has children array
      if (!targetNode.children) {
        targetNode.children = [];
      }

      const newNode = type === 'folder'
        ? {
          id: generateId(),
          name: 'New Folder',
          children: [],
          type: 'folder'
        }
        : {
          id: generateId(),
          name: 'New File.txt',
          type: 'file'
        };

      // Add the new node to the correct parent
      targetNode.children.push(newNode);

      // Update tree and expand if adding to a folder
      setTree([...tree]);
      if (targetNode.type === 'folder') {
        setIsExpanded(true);
      }
    };

    const handleDeleteNode = () => {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${node.name}?`);
      if (confirmDelete) {
        const newTree = removeNode(tree, node);
        setTree(newTree);
      }
    };

    const handleStartEdit = () => {
      setIsEditing(true);
    };

    const handleSaveEdit = (e) => {
      const newName = e.target.value.trim();
      if (newName) {
        node.name = newName;
        setTree([...tree]);
      }
      setIsEditing(false);
    };

    const handleEditBlur = (e) => {
      handleSaveEdit(e);
      setIsEditing(false);
    };

    const handleEditKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleSaveEdit(e);
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    };

    return (
      <div
        className={`tree-node ${theme}-mode`}
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        <div className="node-row">
          {/* Expand/Collapse Icon */}
          {isFolder && (
            <button
              onClick={handleToggleExpand}
              className="expand-btn"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}

          {/* Node Icon */}
          {isFolder
            ? <Folder className="node-icon folder-icon" size={16} />
            : <File className="node-icon file-icon" size={16} />
          }

          {/* Node Name */}
          {isEditing ? (
            <input
              ref={editInputRef}
              defaultValue={node.name}
              onBlur={handleEditBlur}
              onKeyDown={handleEditKeyDown}
              className="edit-input"
            />
          ) : (
            <span className="node-name">{node.name}</span>
          )}

          {/* Action Buttons */}
          <div className="node-actions">
            {isFolder ? (
              <button
                onClick={() => handleAddNode('folder')}
                className="action-btn"
                title="Add Folder"
              >
                <Plus size={14} /> Folder
              </button>
            ) : null}
            <button
              onClick={() => handleAddNode('file')}
              className="action-btn"
              title="Add File"
            >
              <Plus size={14} /> File
            </button>
            <button
              onClick={handleStartEdit}
              className="action-btn"
              title="Rename"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDeleteNode}
              className="action-btn"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Render Child Nodes */}
        {isFolder && isExpanded && node.children && (
          <div className="children-container">
            {node.children.map((childNode) => (
              <TreeNode
                key={childNode.id || generateId()}
                node={childNode}
                depth={depth + 1}
                parentNode={node}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`file-explorer-container ${theme}-mode`}>
      <div className="theme-toggle">
        <button
          onClick={toggleTheme}
          className="theme-btn"
        >
          {theme === 'dark' ? <Sun size={20} color="white" /> : <Moon size={20} />}
        </button>
      </div>
      {tree.map((rootNode) => (
        <TreeNode
          key={rootNode.id || generateId()}
          node={rootNode}
        />
      ))}
    </div>
  );
};

const styles = `
  /* Base Styles */
  .file-explorer-container {
    font-family: 'Inter', sans-serif;
    border-radius: 6px;
    width: 400px;
    max-height: 600px;
    overflow-y: auto;
    position: relative;
    padding: 14px;
    padding-top: 35px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    align: center;
  }

  .theme-toggle {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 10;
  }

  .theme-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .theme-btn:hover {
    background-color: rgba(128,128,128,0.2);
  }

  /* Tree Node Styles */
  .tree-node {
    margin-bottom: 2px;
    user-select: none;
  }

  .node-row {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.2s;
    gap: 8px;
  }

  .expand-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .node-icon {
    flex-shrink: 0;
  }

  .node-name {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .node-actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .action-btn {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    padding: 2px 4px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.2s, background-color 0.2s;
  }

  .node-row:hover .action-btn {
    opacity: 1;
  }

  .edit-input {
    flex-grow: 1;
    padding: 2px 4px;
    border-radius: 3px;
    border: 1px solid;
    width: 100%;
  }

  .children-container {
    margin-left: 16px;
  }

  /* Dark Mode */
  .dark-mode {
    background-color: #1E1E1E;
    color: #D4D4D4;
  }

  .dark-mode .node-row:hover {
    background-color: rgba(255,255,255,0.1);
  }

  .dark-mode .expand-btn {
    color: #858585;
  }

  .dark-mode .folder-icon {
    color: #569CD6;
  }

  .dark-mode .file-icon {
    color: #C678DD;
  }

  .dark-mode .action-btn {
    color: #858585;
  }

  .dark-mode .action-btn:hover {
    background-color: rgba(255,255,255,0.2);
    color: #ffffff;
  }

  .dark-mode .edit-input {
    background-color: #2D2D2D;
    border-color: #3C3C3C;
    color: #D4D4D4;
  }

  /* Light Mode */
  .light-mode {
    background-color: #FFFFFF;
    color: #24292E;
  }

  .light-mode .node-row:hover {
    background-color: rgba(0,0,0,0.05);
  }

  .light-mode .expand-btn {
    color: #6A737D;
  }

  .light-mode .folder-icon {
    color: #0366D6;
  }

  .light-mode .file-icon {
    color: #6F42C1;
  }

  .light-mode .action-btn {
    color: #6A737D;
  }

  .light-mode .action-btn:hover {
    background-color: rgba(0,0,0,0.1);
    color: #24292E;
  }

  .light-mode .edit-input {
    background-color: #FFFFFF;
    border-color: #E1E4E8;
    color: #24292E;
  }
`;

const App = () => {
  const sampleTree = [
    {
      id: generateId(),
      name: 'src',
      type: 'folder',
      children: [
        {
          id: generateId(),
          name: 'components',
          type: 'folder',
          children: [
            {
              id: generateId(),
              name: 'Header.js',
              type: 'file'
            },
            {
              id: generateId(),
              name: 'Footer.js',
              type: 'file'
            }
          ]
        },
        {
          id: generateId(),
          name: 'pages',
          type: 'folder',
          children: [
            {
              id: generateId(),
              name: 'Home.js',
              type: 'file'
            },
            {
              id: generateId(),
              name: 'About.js',
              type: 'file'
            }
          ]
        }
      ]
    },
    {
      id: generateId(),
      name: 'public',
      type: 'folder',
      children: [
        {
          id: generateId(),
          name: 'index.html',
          type: 'file'
        },
        {
          id: generateId(),
          name: 'favicon.ico',
          type: 'file'
        }
      ]
    }
  ];

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop:"50px"
    }}>
      <FileExplorer initialTree={sampleTree} />
      <style>{styles}</style>
    </div >
  );
};

export default App;