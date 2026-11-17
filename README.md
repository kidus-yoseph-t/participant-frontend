# Participant Bank Portal

Angular frontend for managing participant banks. It lets user sign in, browse and search participant banks, add, edit and delete them, and upload a logo for each bank. It talks to a Spring Boot REST API that is secured with Keycloak (JWT).

## Features

- Sign in through the backend's Keycloak login, with a route guard that protects all participant pages
- Participant list with live search (by bank name or BIC), sorted alphabetically
- Add and edit form built with Reactive Forms, with clear validation messages
- Logo upload (PNG or JPG) with an instant preview
- Delete with a confirmation dialog
- Global loading spinner, success and error notifications, and friendly messages for network and server errors

## Tech stack

| Area | Technology |
|---|---|
| Frontend | Angular, TypeScript, RxJS |
| Styling | Bootstrap 5 |
| Backend | Spring Boot, PostgreSQL |
| Authentication | Keycloak (OpenID Connect, JWT access tokens) |

## Prerequisites

| Tool | Notes |
|---|---|
| Node.js and npm | A current LTS version of Node.js |
| Angular CLI | `npm install -g @angular/cli` |
| Git | To clone and switch branches |
| JDK | The version required by the backend (see its `build.gradle`) |
| PostgreSQL | Running, with the database the backend is configured for |
| Keycloak | Running and reachable from the backend |

## 1. Run the backend

The backend lives in a separate repository, `participant-bank-backend`.

```bash
git clone https://github.com/Yibarek/participant-bank-backend.git
cd participant-bank-backend
git checkout branch3-auth-with-logo
```
If you want you can setup your own keycloak server by following the steps on this link
`https://www.keycloak.org/getting-started/getting-started-docker` then change the settings on
the backend for these files:

Open `src/main/resources/application.properties` 

Open `src/main/resources/application-dev.properties` 

Open `src/main/resources/application-prod.properties` 

open `src/main/java/org/multimedia/service/AuthenticationService.java`

open `src/main/java/org/multimedia/config/SecurityConfig.java` 

and change these settings:
- the Keycloak server URL, realm and client
- the resource server issuer uri
- the resource server jwk-set uri

Build the baceknd:

```bash
./gradlew build
```

Start the backend:

```bash
./gradlew bootRun
```
The API is then available at `http://localhost:9081`.

| Backend branch | What it adds |
|---|---|
| `branch1-no-auth-no-logo` | Participant CRUD, no authentication |
| `branch2-no-auth-with-logo` | Adds logo upload |
| `branch3-auth-with-logo` | Adds Keycloak authentication |

## 2. Run the frontend

```bash
git clone https://github.com/kidus-yoseph-t/participant-frontend.git
cd participant-frontend
npm install
ng serve
```

Open `http://localhost:4200`. The root URL redirects to `/login`.

Sign in with the account that exists in your Keycloak realm. For this repository it is `admin` / `Password@123` (development account only).

## Configuration

API addresses are not hardcoded in the services. They live in `src/environments/`:

| File | Used by |
|---|---|
| `environment.development.ts` | `ng serve` |
| `environment.ts` | production builds (`ng build`) |

| Setting | Meaning | Default |
|---|---|---|
| `apiUrl` | Base URL of the REST API | `http://localhost:9081/api/v1` |
| `logoBaseUrl` | Where uploaded logos are served from | `http://localhost:9081/uploads/logos/` |
| `clientId` | Keycloak client used for the login request | `acs_apis_client_api` |

To point the app at another server, edit these files. The backend must allow requests from the frontend's origin (`http://localhost:4200` in development) in its CORS settings.


## How authentication works

1. The login page sends the credentials to `POST /api/v1/auth/login`.
2. The returned access token and its expiry time are stored in `sessionStorage`.
3. An HTTP interceptor adds `Authorization: Bearer <token>` to every API request.
4. The route guard blocks `/participants` and its child routes without a valid session.
5. A 401 response, an expired token or the Logout button clears the session and returns to `/login`.

Access tokens are short-lived , so the app signs the user out soon after the token expires.
