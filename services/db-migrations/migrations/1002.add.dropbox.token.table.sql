CREATE TABLE dropbox_tokens (
id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
user_id UUID UNIQUE NOT NULL REFERENCES users,
token TEXT,
next_page_token INTEGER DEFAULT 0
);

