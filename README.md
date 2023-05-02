# Shopify Schema Editor

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
## Building Styles

This app uses the Tailwind CSS CLI. You should have 2 terminals, one for serving the app, and one for watching & compiling the Tailwind utility classes.

## Use this command to watch your css files in development
`npx tailwindcss -o src/assets/tailwind.css --watch`

## Use this command to build and minify your css before going live
`NODE_ENV=production npx tailwindcss -o src/assets/tailwind.css --minify`
