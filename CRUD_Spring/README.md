# CRUD_Spring — Run with Docker Compose

This repo contains a Spring Boot backend and an Angular frontend. The docker-compose file launches:
- MySQL 8 (db) with database `crud_db`
- phpMyAdmin (host:8081) to manage the DB
- backend (Spring Boot) built with the included `Dockerfile`
- frontend (Angular) built and served with nginx

Quick start (Windows cmd.exe):

1) From project root:

   cd /d D:\NSBM\Angular\CRUD_Spring
   docker compose up --build -d

2) Check containers:

   docker compose ps

3) View backend logs (follow):

   docker compose logs backend --tail 200 -f

4) phpMyAdmin: http://localhost:8081 (user: root, password: my-secret-pw)
   API: http://localhost:8080/api/employees
   Frontend: http://localhost:4200

Stopping and removing containers:

   docker compose down

Notes
- If ports 3306, 8080, 8081, or 4200 are in use, stop the conflicting services or edit `docker-compose.yml`.
- The backend expects MySQL to be under hostname `db` (that's set in `application.properties`).

If anything fails during `docker compose up --build -d`, paste the `docker compose logs backend --tail 300` output here and I'll help troubleshoot.

