UPDATE users SET password_hash = '$2a$10$Q5S2onpa/IYS5F2ED.uyeuqJEFxpKm3FCv9vSmpVuUzda8FCi5AGy' WHERE email LIKE '%@devschool.local';
SELECT email FROM users;
