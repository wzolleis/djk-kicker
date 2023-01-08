# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- [Netlify Functions](https://www.netlify.com/products/functions/)

## Netlify Setup

1. Install the [Netlify CLI](https://www.netlify.com/products/dev/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

# Projekt Setup
* Projekt auschecken
* npm install
* schema.prisma auf die gewünschte DB setzen.
  * z.B. sqlite:  
  ```
  datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
  }
  ```
* Im Root Verzeichnis eine .env-Datei anlegen
* Ein Muster für die env-Datei gibt es auf Anfrage
* DB-Schema erzeugen
```
npx prisma db push
```
* DB mit Testdaten füttern
```
npm run setup
```
* Anwendung lokal starten
```
npm run dev
```

## Development

The Remix dev server starts your app in development mode, rebuilding assets on file changes. To start the Remix dev server:

```sh
npm run dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

The Netlify CLI builds a production version of your Remix App Server and splits it into Netlify Functions that run locally. This includes any custom Netlify functions you've developed. The Netlify CLI runs all of this in its development mode.

```sh
netlify dev
```

Open up [http://localhost:3000](http://localhost:3000), and you should be ready to go!

Note: When running the Netlify CLI, file changes will rebuild assets, but you will not see the changes to the page you are on unless you do a browser refresh of the page. Due to how the Netlify CLI builds the Remix App Server, it does not support hot module reloading.

## Deployment

### Build

* Prüfen, ob in schema.prisma als Provider *mysql* eingetragen ist
```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
* Build starten (css, schema, remix...)
```sh
 npm run build
 ``` 

### Netlify
```sh
# preview deployment
netlify deploy --build

# production deployment
netlify deploy --build --prod
```
