ALTER TABLE activities
  DROP COLUMN IF EXISTS author_id;

DROP TABLE IF EXISTS activities_users;