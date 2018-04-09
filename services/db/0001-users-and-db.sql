CREATE USER the_gardener;
CREATE DATABASE photo_garden
       WITH OWNER the_gardener;

\connect photo_garden

CREATE EXTENSION pgcrypto;
