# 🌐 SchoolNexus Web Interface

> Web interface for SchoolNexus.

This project was scaffolded using [Vite](https://vitejs.dev/). **ReactJS** is used for the frontend and **Bootstrap 5** for styling.

## Getting Started

First, make a copy of `.env.example` and rename it to `.env`. Make changes to the environment variables as needed.

To get started, run the following commands _(make sure all commands below are run in the same directory as this README file)_:

```bash
# Install dependencies
npm install

# Start server
npm run dev
```

## FAQ

### Why was React used? Why not Vue, Svelte, or plain HTML/CSS/JS?

React was chosen for its popularity, extensive community support, and the fact that it allows developers to create large web applications that can update data and content **without reloading** the page. It also allows for the creation of **reusable UI components**, which improves the extensibility and maintainability of the codebase. This will also make it easier to create a mobile app in the future using React Native.

Plain HTML/CSS/JS is a valid choice for simple websites or applications, but as the complexity of the project increases in the future, it can become challenging to manage and scale.

### Why was Vite used? Why not Create-React-App, Next.js, or Gatsby?

Vite was chosen for its **speed and simplicity**. It is a build tool that aims to provide a faster and leaner development experience for modern web projects. Next.js and Gatsby are great for server-side rendering and static site generation respectively, but are not necessary for this project. CRA was also considered, but ultimately rejected due to its slower performance compared to Vite.
