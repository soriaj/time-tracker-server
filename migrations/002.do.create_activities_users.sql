CREATE TABLE activities_users (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT now() NOT NULL,
  date_modified TIMESTAMP
);

ALTER TABLE activities
  ADD COLUMN
   author_id INTEGER REFERENCES activities_users(id)
   ON DELETE SET NULL;