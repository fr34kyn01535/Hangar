# Hangar
This program targets at implementing a Nuget v3 compatible package repository backend. 
The services speficiation is to be found at https://docs.microsoft.com/en-us/nuget/api/overview.

Services to implement:
- [x] Index
- [X] RegistrationsBaseUrl
- [X] SearchQueryService
- [X] PackagePublish
- [X] PackageBaseAddress

Further plans:
* API to manage users 
* Endpoint to list a users repositories
* Implement JWT / Oauth

# Environment Variables
```
PORT=8080
DB_HOST=localhost
DB_USER=hangar
DB_PASSWORD=
DB_NAME=hangar
ADDRESS=http://localhost:8080
```
