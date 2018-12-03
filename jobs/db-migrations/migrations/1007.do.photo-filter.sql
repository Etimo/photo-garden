CREATE TABLE photo_filter
(
  "photo_id" INTEGER UNIQUE REFERENCES photos(id),
  "edit" jsonb,
  PRIMARY KEY ("photo_id")
);
