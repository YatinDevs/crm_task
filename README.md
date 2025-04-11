## Setting the React Vite Frontend :

> React Vite setup Documentation : https://vite.dev/guide/

        bash

        npm create vite@latest

- select folder
- select react

        bash

        npm install

  - this install necessary node_modules to run the react frontend file.

- now to run the project of react frontend

         bash

         npm run dev

- now we can run the project on browser on default port

        http://localhost:5173/

- if we want to test on mobile as well and its on same network as pc wifi

- go to package.json

        "scripts": {
        "dev": "vite --host",
        "build": "vite build",
        "lint": "eslint .",
        "preview": "vite preview"
        },

- Now delete all content inside App.jsx and App.css and index.css

  - App.jsx
  - App.css
  - index.css

- Now recreate App.jsx

        import React from "react";

        function App() {
        return <div>App</div>;
        }

        export default App;

> Tailwind CSS with Vite setup Documentation :

        https://tailwindcss.com/docs/installation/using-vite

- 01 Install Tailwind CSS

        Install tailwindcss and @tailwindcss/vite via npm.

        Terminal

                  npm install tailwindcss @tailwindcss/vite

- 2 Configure the Vite plugin

  Add the @tailwindcss/vite plugin to your Vite configuration.

        vite.config.ts

                import { defineConfig } from "vite";
                import react from "@vitejs/plugin-react";
                import tailwindcss from "@tailwindcss/vite";

                // https://vite.dev/config/
                export default defineConfig({
                plugins: [react(), tailwindcss()],
                });

- 3 Import Tailwind CSS

  Add an @import to your CSS file that imports Tailwind CSS.

  inside index.css in our case

          @import "tailwindcss";

- 4 Start your build process

  Run your build process with npm run dev or whatever command is configured in your package.json file.

  Terminal

        npm run dev

## React Router Setup :

    bash

        npm i react-router-dom

> App.jsx

        import React from "react";
        import {
        createBrowserRouter,
        createRoutesFromElements,
        Route,
        RouterProvider,
        } from "react-router-dom";

        import Layout from "./Layout/Layout";
        import Home from "./pages/Home/Home";
        import About from "./pages/About/About";
        import Contact from "./pages/Contact/Contact";

        function App() {
        // http://localhost:5173
        // http://localhost:5173/ - index
        // http://localhost:5173/about  - path about
        // http://localhost:5173/contact  - path contact
        const router = createBrowserRouter(
            createRoutesFromElements(
            <>
                <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                </Route>
            </>
            )
        );

        return <RouterProvider router={router} />;
        }

        export default App;

> Layout.jsx

                import React from "react";
                import { Outlet } from "react-router-dom";
                import Navbar from "../components/Navbar/Navbar";
                import Footer from "../components/Footer/Footer";
                function Layout() {
                return (
                    <>
                    <Navbar />
                    <Outlet />
                    <Footer />
                    </>
                );
                }

                export default Layout;

## React Zustand Setup State Management Tool

## Backend Nodejs Setup

## Setting up a Node.js environment :

1.  Install Node.js and npm

    - Download and Install Node.js:

              Visit Node.js official website and download the latest LTS version.

      - https://nodejs.org/en

             The installation includes npm (Node Package Manager).

    - Verify Installation:

                node -v
                npm -v

    - Manually Add Node.js to PATH (if needed) :

          Locate the Node.js installation directory. By default, it’s something like:

                C:\Program Files\nodejs

    - Add this directory to the PATH:

      - Press Win + R, type sysdm.cpl, and press Enter.
      - Go to the Advanced tab and click Environment Variables.
      - Under System variables, find Path and click Edit.
      - Add the path to the Node.js installation directory
        (e.g., C:\Program Files\nodejs).
      - Click OK to save.

    - Restart your terminal and try running node -v and npm -v again.

    1.  Bypass Execution Policy

        To fix this issue temporarily, you can bypass the execution policy for the current PowerShell session by running:

                Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

        After running this command, try executing npm -v again:

                 npm -v

    2.  Set Execution Policy for the Current User (Recommended)

        If you want a more permanent solution for your user account, change the execution policy to RemoteSigned, which allows locally created scripts to run while requiring remote scripts to be signed:

                Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

        Explanation:

        RemoteSigned: Allows running locally created scripts but requires remote scripts to be signed.

        CurrentUser: Applies the change only to the current user's account.

                    npm -v again to verify.

2.  Install PostgreSQL 16 and PGAdmin4

    - Download and Install PostgreSQL:

          Visit PostgreSQL official website and install the latest version.

      - https://www.postgresql.org/download/
      - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

    - Setup PostgreSQL:

            During installation, set up a password for the postgres user.
            Use pgAdmin or CLI to manage your database.

3.  Setting Up github repository :

        echo "# website-template-app" >> README.md
        git init
        git add README.md
        git commit -m "first commit"
        git branch -M main
        git remote add origin https://github.com/YatinDevs/website-template-app.git
        git push -u origin main

## Folder Structure

        App/
        ├── config/
        │ └── db.js
        ├── controller/
        │ ├── authController.js
        │ └── adminController.js
        ├── middleware/
        │ ├── authMiddleware.js
        │ └── adminMiddleware.js
        ├── models/
        │ ├── User.js
        │ └── Admin.js
        ├── routes/
        │ ├── authRoutes.js
        │ └── adminRoutes.js
        ├── index.js

## Setup Backend (Server) :

- Tech Stack : Nodejs + Expressjs + Postgres + Docker

> Setup Node App with PostgresSQL ORM

1.  Create Node Project :

    - Install Dependencies :

            npm init or npm init -y

    - this creates package.json file which has all the dependencies our backend requires
    - this file we write scripts to run our files
    - install express and pg packages

    npm i nodemon

    - for continous developement updates

    npm i express

    - to setup server

# Database Connection

- create config folder

  - inside create db.config.js

         module.exports = {
        HOST: process.env.DB_HOST,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASSWORD,
        DB: process.env.DB_NAME,
        PORT: process.env.DB_PORT,
        dialect: "postgres",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        //   ssl: true,
        };

- create utils folder

  - inside create db.js

        const { Sequelize } = require("sequelize");

        const dbConfig = require("../config/db.config");

        const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        timezone: "+05:30",
        pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
        },
        // dialectOptions: {
        // ssl: {
        // require: true,
        // rejectUnauthorized: false,
        // },
        // },
        });

        module.exports = sequelize;

    - defining connection in index.js

            // db setup
            const sequelize = require("./utils/db");

      npm install

      npm i cookie-parser body-parser

      Middleware Parses Attaches Data to Common Use Cases
      cookie-parser Cookies (Cookie header) req.cookies Session management, tracking
      body-parser Request body (e.g., JSON) req.body API requests, form submissions

npm i cors morgan body-parser
npm i nodemon
npm i dotenv
npm run dev or npm start

- Folder Structuring :

        Add .gitignore
        Add App folder
        - config
        - controller
        - middleware
        - models
        - routes
        - index.js

- create server script and run it

2.  Setup Database to Node server :

            npm i pg
            npm i sequelize

    - created config folder -> db.config.js -> configuration with env

            # Postgres - Docker Configuration env
            POSTGRESDB_USER=postgres
            POSTGRESDB_ROOT_PASSWORD=12345
            POSTGRESDB_DATABASE=lite-server_db
            POSTGRESDB_LOCAL_PORT=5433
            POSTGRESDB_DOCKER_PORT=5432

            # Hosted db / Local db - Configuration env
            DB_HOST=localhost
            DB_USER=postgres
            DB_PASSWORD=root
            DB_NAME=webtempapp-db
            DB_PORT=5433

    - created utils folder -> db.js -> configured db with sequelize

    - index.js -> dotenv config for env

    - sequelize -> authentication -> synchronization with models -> port connection

## Authentication

- Install Dependencies :

               npm install express sequelize pg pg-hstore bcryptjs jsonwebtoken cookie-parser cors dotenv nodemon

      <!--

      {
        "username" : "yatin",
        "email" : "c.yatin727@gmail.com",
        "password" : "9594515799"
      }
      {
          "message": "User created and logged in successfully",
          "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzZXIiLCJpYXQiOjE3MzgxMjcxNDksImV4cCI6MTczODEyODA0OX0.l2V7d0cQmKDDpjO2PIMTrq6cynpA6pmE-h7lh_lMBOo",
          "userDetails": {
              "role": "user",
              "id": 1,
              "username": "yatin",
              "email": "c.yatin727@gmail.com",
              "password": "$2a$10$tFV.j3VMsRpn/shk4KMww.VUwYpeAKXIeDNisoMkRR4rnBSFtACce",
              "updatedAt": "2025-01-29T05:05:49.611Z",
              "createdAt": "2025-01-29T05:05:49.611Z"
          }
       }

      -->

# Admin Credentials

                {
                "username" : "Yatin Chaudhari",
                "email" : "c.yatin727@gmail.com",
                "password" : "9594515799"

                }

<!--
 tanstack query
 tankstack table
-->

# React Vite + Node.js + PostgreSQL Setup

## React Vite Frontend Setup

> Official Vite Documentation: https://vite.dev/guide/

### 1. Create Vite App

```bash
npm create vite@latest
```

- Select a folder
- Choose "react"

```bash
npm install
```

- Installs necessary `node_modules`.

### 2. Run the Project

```bash
npm run dev
```

- Project runs on [http://localhost:5173/](http://localhost:5173/)

### 3. Access on Mobile (Same Network)

Update `package.json`:

```json
"scripts": {
  "dev": "vite --host",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### 4. Clean Boilerplate

- Delete contents of:

  - `App.jsx`
  - `App.css`
  - `index.css`

- Recreate `App.jsx`:

```jsx
import React from "react";

function App() {
  return <div>App</div>;
}

export default App;
```

---

## Tailwind CSS with Vite

> Tailwind Setup: https://tailwindcss.com/docs/installation/using-vite

### 1. Install Tailwind

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2. Configure Vite

```js
// vite.config.ts or vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 3. Import Tailwind CSS

Add to `index.css`:

```css
@import "tailwindcss";
```

### 4. Run Dev Server

```bash
npm run dev
```

---

## React Router Setup

```bash
npm i react-router-dom
```

### App.jsx

```jsx
import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import Layout from "./Layout/Layout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
```

### Layout.jsx

```jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
```

---

## Zustand State Management

_(Placeholder for Zustand setup)_

---

## Backend Node.js Setup

### 1. Node.js Environment

- Download & install Node.js: https://nodejs.org/en
- Verify installation:

```bash
node -v
npm -v
```

- Set Execution Policy (for Windows PowerShell):

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### 2. PostgreSQL & pgAdmin

- Download: https://www.postgresql.org/download/
- Install & set password for `postgres` user.

---

## GitHub Repository Setup

```bash
echo "# website-template-app" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/YatinDevs/website-template-app.git
git push -u origin main
```

---

## Project Folder Structure

```
App/
├── config/
│   └── db.js
├── controller/
│   ├── authController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
├── models/
│   ├── User.js
│   └── Admin.js
├── routes/
│   ├── authRoutes.js
│   └── adminRoutes.js
└── index.js
```

---

## Setup Node Server with PostgreSQL

### 1. Create Node Project

```bash
npm init -y
npm install express cors dotenv body-parser morgan cookie-parser nodemon
```

### 2. Setup PostgreSQL ORM

```bash
npm i pg sequelize pg-hstore
```

### .env File

```env
# Postgres - Docker Configuration
db_user=postgres
db_pass=12345
db_name=lite-server_db
db_port=5433

# Localhost Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=webtempapp-db
DB_PORT=5433
```

### Database Config

**config/db.config.js**

```js
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  PORT: process.env.DB_PORT,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
```

**utils/db.js**

```js
const { Sequelize } = require("sequelize");
const dbConfig = require("../config/db.config");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  timezone: "+05:30",
  pool: dbConfig.pool,
});

module.exports = sequelize;
```

---

## Authentication Setup

### Install Dependencies

```bash
npm install bcryptjs jsonwebtoken
```

### Example Response (Signup/Login)

```json
{
  "message": "User created and logged in successfully",
  "accessToken": "<JWT_TOKEN>",
  "userDetails": {
    "role": "user",
    "id": 1,
    "username": "yatin",
    "email": "c.yatin727@gmail.com"
  }
}
```

---

## Admin Credentials (Example)

```json
{
  "username": "Yatin Chaudhari",
  "email": "c.yatin727@gmail.com",
  "password": "9594515799"
}
```

---

## Notes

- TanStack Query & TanStack Table can be integrated optionally for advanced state/data management.
