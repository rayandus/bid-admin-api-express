# Bid Admin API Demo (ExpressJs Version)

Bid Admin API is a back-end API that provides programmatic access to the database for the Bid Demo Project. It allows developers to create, read, update, and delete data. The API is RESTful and uses JSON as the data format.

## Project Overview

For more details on the architecture, authentication flow, plans or to do's, please check [here](https://rma-demo.notion.site/Bid-Demo-Project-9cf3e25d70e44f4b868499aeb89fd81a)


## Prerequisite

1. Node Package Manager (npm)
1. Node Version Manager (nvm)
1. Pnpm
1. (Optional) Docker

## Setup

1. Clone [bid-admin-api-express](https://github.com/rayandus/bid-admin-api-express) repo in your local

1. Go to project root directory and install

   ```bash
   cd bid-admin-api-express
   git checkout main
   nvm install
   pnpm install
   ```

1. Start the application without Docker

   ```bash
   pnpm start:dev
   ```

   > The api will run on port `3000` by default with suffix `api`. E.g. `http://localhost:3010/api`

   or

   ```bash
   PORT=3000 pnpm start:dev
   ```

   > Just replace `PORT=3000` to your choice of port

1. Or, start the application with Docker. Launch Docker engine as needed.

   ```bash
   docker-compose up
   ```

1. 


1. Validate if api is working

  > ⚠️ Prerequisite: Working MongoDB connection

  ```bash
  curl -X GET 'http://localhost:3000/api'
  ```

## Database & JWT Authentication

Database used is MongoDB hosted in Azure. However, the database connection string is not included for security purposes. Please set up your own MongoDB database (cloud or local) for development purposes.

To change the database and jwt configuration:

1. Create a `.env` in the root directory

1. Add this variable with the new connection string

  ```bash
  JWT_SECRET=anykeyhere
  MONGO_DB_CONNSTR=mongodb://instance:password@host.com:10255/dbname?ssl=true&retrywrites=false...
  ```

## More about this project

1. Built with ExpressJs and TypeScript

1. Database used is MongoDB hosted in Azure

1. Mongoose for the Object Data Mapper

## Extra notes
