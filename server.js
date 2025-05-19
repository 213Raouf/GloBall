const express = require("express");
const file = require('fs');
const app = express();
const path = require("path");
const session = require("express-session");
const PORT = 3000;

app.use("/html_css_js_files", express.static(path.join(__dirname, "html_css_js_files")));
app.use("/header_footer", express.static(path.join(__dirname, "header_footer")));

app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  });

app.use(session({ secret: "a-secret-key-GloBall-encryptsession-data",resave: false,
  saveUninitialized: true
}));
function displayJoinedCode(pageName, response) {
    const footer = file.readFileSync(path.join(__dirname, "header_footer", "footer.html"), "utf-8");
    const header = file.readFileSync(path.join(__dirname, "header_footer", "header.html"), "utf-8");
    const body = file.readFileSync(path.join(__dirname, "html_css_js_files", `${pageName}.html`), "utf-8");
    
    response.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${pageName}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/html_css_js_files/${pageName}.css">
          <link rel="stylesheet" href="/header_footer/header.css">

        </head>
        <body>
          ${header}
          ${body}
          
          ${footer}
          <script src="/html_css_js_files/${pageName}.js"></script>
        </body>
        </html>
    `);
}

app.use(express.urlencoded({ extended: false }));

app.get("/", (request, response) => displayJoinedCode("homePage", response));
app.listen(PORT, () => {
    console.log("Listening");
});