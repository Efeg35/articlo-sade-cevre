-- profiles tablosuna credits sütunu ekler
ALTER TABLE profiles
ADD COLUMN credits integer NOT NULL DEFAULT 3; 