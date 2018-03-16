CREATE TYPE identity_provider AS enum('Google');

CREATE TABLE users(
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
username TEXT NOT NULL UNIQUE
);

CREATE TABLE user_identities(
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
user_id UUID NOT NULL REFERENCES users,
provider identity_provider NOT NULL,
provider_id TEXT NOT NULL,
UNIQUE (provider, provider_id)
);

CREATE TABLE photos(
id SERIAL PRIMARY KEY NOT NULL,
owner UUID NOT NULL REFERENCES users,
url TEXT NOT NULL,
mime_type TEXT NOT NULL
);
