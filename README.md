![Agreena](https://agreena.com/wp-content/uploads/2021/06/agreena-logo.svg)

# Certificates service
This is a microservice built for Agreena platform to handle the ownership of carbon certificates.

## How does it work
Core dependencies:
- [Express](http://expressjs.com) as web framework for serving HTTP requests.
- [TSOA](https://github.com/lukeautry/tsoa) for generating routes and OpenAPI.
- [tsyringe](https://github.com/microsoft/tsyringe) Dependency injection framework.
- [node-postgres](https://node-postgres.com/) for interacting with PostgreSQL database.

## How to run it

### Prerrequisites
- You will need a PostgreSQL instance up and running for storing data.
- Create your own `.env` file with the required variables. A `.env.example` file is provided.

### Seed database
If it's the first time you are running the service, its recommendable to insert some seeds in the database. Two npm scripts are provided:
- `npm run seeds:create` will generate some random users and certificates and will store them in the `seeds` folder. An example is provided with the repository.
- `npm run seeds:insert` will insert the seeds from the previous step in the Database.

### Start the server
For development purposes, run `npm run dev`. Everytime you run this command, it will first recreate the OpenAPI file in `api/openapi.yaml` and the TSOA file `src/common/Routes.ts` (which is the core for serving endpoints) through `npm run spec`; for more info, check the [tsoa docs](https://tsoa-community.github.io/docs/getting-started.html). This script will automatically reload the server everytime a file inside `src` is modified and saved.

If you want to run the compiled Javascript, first run `npm run build` (which will also run `npm run spec` and then `npm run start`).

Also, a `Dockerfile` is provided to build the service Docker image, and a `docker-compose.yaml` to get started. It's all together in the npm script `npm run start:docker`, but if it's the first time you're running it, don't forget to seed the database first.

### How to use
Once your server is up and running, you can navigate to `http://localhost:3000/api/docs` to check the OpenAPI and the available endpoints.

### How to develop
This service is organized following a Domain Driven Design philosophy. There are two main domains: `Users` and `Certificates`, and each corresponding domain has its files contained inside the `src/domains` folder. In these folders, we split the logic between the Controller (for managing routes), Service (where our business logic is stored) and Repository (data access layer); and also the corresponding models.

### Testing
It is a work in progress, code is not fully tested. Library used for testing is [Jest](https://jestjs.io/), you can run the unit tests with the command `npm run test`. If you want to check the code coverage, a `npm run test:cover` script is also included.

### Further improvements
Right now, user **passwords are stored raw in the database**, which is one of the worst things you can do. It should be replaced with password hashing; package `bcrypt` is included for this feature.


--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------


# NodeJS recruitment test task

### Carbon Certificates application API
Create the API containing endpoints:
1. Login
2. List of available Carbon certificates (*no owner*)
3. List of owned Carbon certificates (*owned by current user*)
4. Transfer my own Carbon certificate to the another existing user (*based on the User ID parameter*)

##### Data informations
**Carbon certificate** should contain the following data:
- Unique ID
- Country
- Status:
  - `available` (*no owner*)
  - `owned` (*owner is present and certificate hasn't been transferred*)
  - `transferred` (*owner is present and certificate has been transferred from one owner to another*)
- Owner (*relation to existing user, can be empty*)

##### Requirements
- Application should be written with strong typing (*TypeScript*)
- Framework is free of choice
- Authentication should be implemented (*type/package if free of choice*)
- Seeds should be included (*100 random certificates, 5 random users with certificates and 5 without them*)
- Tests have to be included

### Good luck!

