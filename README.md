# Hangar
This program targets at implementing a Nuget v3 compatible package repository backend. 
The services speficiation is to be found at https://docs.microsoft.com/en-us/nuget/api/overview.

Services to implement:
- [x] Index (https://docs.microsoft.com/en-us/nuget/api/service-index)
- [X] RegistrationsBaseUrl (https://docs.microsoft.com/en-us/nuget/api/registration-base-url-resource)
- [X] SearchQueryService (https://docs.microsoft.com/en-us/nuget/api/search-query-service-resource)
- [X] PackagePublish (https://docs.microsoft.com/en-us/nuget/api/package-publish-resource)
- [X] PackageBaseAddress (https://docs.microsoft.com/en-us/nuget/api/package-base-address-resource)

Additional features:
* GitHub Oauth login and user registration at $ADDRESS/authorisation/login
* Extended SearchQueryService to return only my own packages with a query parameter ($ADDRESS/query/?my=true)

Further plans:
* API to manage users 

# Environment Variables
```
PORT=8080
DB_HOST=localhost
DB_USER=hangar
DB_PASSWORD=
DB_NAME=hangar
ADDRESS=http://localhost:8080
OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
SESSION_SECRET=
```
