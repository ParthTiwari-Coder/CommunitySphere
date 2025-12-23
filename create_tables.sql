
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    fullname VARCHAR(100),
    prn VARCHAR(30),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_tech (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    fullname VARCHAR(100),
    prn VARCHAR(30),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_cultural (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    fullname VARCHAR(100),
    prn VARCHAR(30),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE club_sports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    fullname VARCHAR(100),
    prn VARCHAR(30),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
