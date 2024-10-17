CREATE TABLE IF NOT EXISTS `login` (
    id CHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_at TIMESTAMP
);

INSERT INTO `login` (id, username, password, email, phone, created_at, login_at)
VALUES (UUID(), 'dimas', '123456', 'dimas@mail.com', '08123456780', NOW(), NOW());
