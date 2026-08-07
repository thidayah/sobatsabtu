// Deklarasi ambient untuk import side-effect CSS (mis. `import './globals.css'`).
// Tanpa ini, TypeScript / language server melaporkan
// "Cannot find module or type declarations for side-effect import".
declare module '*.css';
