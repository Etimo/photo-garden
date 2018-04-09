CREATE TYPE photo_provider AS enum('Google');
ALTER TABLE photos ADD COLUMN provider photo_provider;
ALTER TABLE photos ADD COLUMN original JSONB;
