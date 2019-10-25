CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE actvities (
   id uuid PRIMARY KEY DEFAULT uuid_generate_v4() UNIQUE,
   summary TEXT NOT NULL,
   company TEXT NOT NULL,
   customer_name TEXT,
   description TEXT,
   date TIMESTAMP DEFAULT now() NOT NULL
);