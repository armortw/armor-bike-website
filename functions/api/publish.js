<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>ARMOR BIKE — Store</title>
<link rel="stylesheet" href="styles.css">
<style>
  html, body { margin: 0; padding: 0; background: var(--surface-page); color: var(--text-body); }
  body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
  * { box-sizing: border-box; }
  ::selection { background: var(--blue-100); }
</style>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
  <script src="_ds_bundle.js"></script>
  <script src="store-data.js"></script>
  <script type="text/babel" src="store-app.jsx"></script>
</body>
</html>
