# Backend multi-stage Dockerfile
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace
# copy mvnw and .mvn first (for offline wrapper), then pom and source
COPY mvnw ./
COPY mvnw.cmd ./
COPY .mvn .mvn
COPY pom.xml ./
COPY src ./src
RUN chmod +x ./mvnw || true
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app
# copy jar built by maven
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
