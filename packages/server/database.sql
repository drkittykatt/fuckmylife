CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email citext NOT NULL UNIQUE,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

INSERT INTO users(username, passhash) values($1,$2);

CREATE EXTENSION citext;

INSERT INTO users(email, username, passhash) values($1,$2,$3);