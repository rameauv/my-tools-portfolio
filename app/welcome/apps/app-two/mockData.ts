export interface GithubRepo {
  id: string;
  name: string;
  description: string;
  language: string;
  updatedAt: string;
  readmeContent: string;
}

export const mockRepos: GithubRepo[] = [
  {
    id: "1",
    name: "windows-xp-portfolio.git",
    description: "A faithful recreation of Windows XP in React",
    language: "TypeScript",
    updatedAt: "2026-01-10",
    readmeContent: `# Windows XP Portfolio

This is a portfolio website built to look like Windows XP.

## Features
- Draggable windows
- Start menu
- Taskbar
- **File Explorer**

## Tech Stack
- React
- Tailwind CSS
- React Router
`
  },
  {
    id: "2",
    name: "react-three-fiber-game.git",
    description: "A 3D game built with R3F",
    language: "JavaScript",
    updatedAt: "2025-12-15",
    readmeContent: `# 3D Web Game

A browser-based racing game using Three.js and React.

## Controls
- WASD to move
- Space to jump
`
  },
  {
    id: "3",
    name: "personal-blog.git",
    description: "My personal ramblings",
    language: "Markdown",
    updatedAt: "2026-01-01",
    readmeContent: `# My Blog

Welcome to my digital garden.

## Recent Posts
1. [Hello World](./hello)
2. [Why XP?](./xp)
`
  },
  {
    id: "4",
    name: "todo-app.git",
    description: "Yet another todo app",
    language: "TypeScript",
    updatedAt: "2025-11-20",
    readmeContent: `# Todo App

Simple, fast, effective.

- [x] Build app
- [ ] Profit
`
  }
];
