plugins {
    id("java")
}

group = "projeto.mastergreen"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    // Dependência para o driver JDBC do MySQL
    runtimeOnly 'mysql:mysql-connector-java:8.0.23'

    // JUnit para testes
    testImplementation("org.junit.jupiter:junit-jupiter:5.9.1")
}

tasks.test {
    useJUnitPlatform()
}