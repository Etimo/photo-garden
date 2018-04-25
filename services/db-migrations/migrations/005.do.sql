CREATE TABLE user_google_drive_tokens (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
user_id UUID UNIQUE NOT NULL REFERENCES users,
tokens TEXT,
next_page_token TEXT
);

