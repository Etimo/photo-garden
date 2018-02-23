CREATE EXTENSION pgcrypto;

CREATE TYPE identity_provider AS enum('Google');

CREATE TABLE "user"(
       id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
       username TEXT NOT NULL UNIQUE
);

CREATE TABLE user_identity(
       id UUID PRIMARY KEY NOT NULL,
       user_id UUID NOT NULL REFERENCES "user",
       provider identity_provider NOT NULL,
       provider_id TEXT NOT NULL,
       UNIQUE (provider, provider_id)
);

CREATE TABLE photo(
       id SERIAL PRIMARY KEY NOT NULL,
       owner UUID NOT NULL REFERENCES "user",
       url TEXT NOT NULL,
       mime_type TEXT NOT NULL
);
