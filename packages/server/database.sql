CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email citext NOT NULL UNIQUE,
    username VARCHAR(28) NOT NULL UNIQUE,
    passhash VARCHAR NOT NULL
);

INSERT INTO users(username, passhash) values($1,$2);

CREATE EXTENSION citext;

INSERT INTO users(email, username, passhash) values($1,$2,$3);

CREATE TABLE groups(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL DEFAULT 'untitled group',
    description VARCHAR(255),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE participants(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    group_id INTEGER REFERENCES groups(id),
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

