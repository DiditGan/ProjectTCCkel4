-- Update the barang table to ensure image_url is VARCHAR(255)
ALTER TABLE barang MODIFY COLUMN image_url VARCHAR(255) COMMENT 'Stores relative path to the image file';

-- Update the users table to ensure profile_picture is VARCHAR(255)
ALTER TABLE users MODIFY COLUMN profile_picture VARCHAR(255) COMMENT 'Stores relative path to the profile image file';

-- Update the messages table to ensure image_url is VARCHAR(255)
ALTER TABLE messages MODIFY COLUMN image_url VARCHAR(255) COMMENT 'Stores relative path to the message image file';
