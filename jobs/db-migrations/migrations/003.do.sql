ALTER TABLE photos ADD COLUMN provider_id TEXT;
ALTER TABLE photos ADD CONSTRAINT provider_id_unique UNIQUE (provider, provider_id);
