ALTER TABLE photos ADD COLUMN url TEXT NOT NULL;
ALTER TABLE photos ADD COLUMN url_thumbnail TEXT NOT NULL;
ALTER TABLE photos DROP COLUMN extension;
