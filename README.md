## BACKEND FOR FIVERR CLONE
<p align="center">
  This is the backend for my Fiverr clone.
</p>


## Description

Backend written with NestJS and Prisma.
Swagger for API documentation.
MySQL for database management.

## Running backend

####Set up database
- Set up a MySQL server on Docker

- Import SQL dump file (fiverr_db.sql). It can be found in the root folder.
___Please note that the backup database contains user accounts with unhashed password and they should be ignored. You should create new accounts instead___

####Set up environment file
- Create a ".env" file in the root folder and add the following variables:

```
DATABASE_URL="mysql://root:1234@localhost:3306/db_fiverr"
JWT_SECRET_KEY = ""
JWT_REFRESH_SECRET_KEY = ""
```
- Edit the file with appropriate info of your choosing

####Install dependencies
Use command:
```
  yarn install
```

####Run backend
Use command:
```
  yarn run:dev
```
####Test backend
Backend is set up to run on port 8080 (http://localhost:8080/)

2 ways to test backend:
- Through Swagger: http://localhost:8080/swagger
- Through Postman:
Import Fiverr.postman_collection.json file (can be found in root folder) in Postman
