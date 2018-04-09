-- Unleash db
CREATE USER unleash;
CREATE DATABASE unleash
       WITH OWNER unleash;

-- Garden db
CREATE USER the_gardener;
CREATE DATABASE photo_garden
       WITH OWNER the_gardener;

\connect photo_garden

CREATE EXTENSION pgcrypto;

