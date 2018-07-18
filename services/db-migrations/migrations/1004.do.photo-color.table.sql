CREATE TABLE photo_color (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
photo_id INTEGER UNIQUE NOT NULL REFERENCES photos,
r INTEGER NOT NULL,
g INTEGER NOT NULL,
b INTEGER NOT NULL,
a INTEGER NOT NULL
);
