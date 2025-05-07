CREATE TABLE users (
    id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE issues (
    id INT NOT NULL AUTO_INCREMENT,
    type ENUM('Road & Traffic', 'Lighting & Utilities', 'Sanitation & Waste', 'Public Safety & Security', 'Water & Sewage', 'Environment & Green Spaces', 'Noise & Nuisance', 'Animal & Wildlife', 'Signage & Street Furniture') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL,
    location POINT NOT NULL SRID 4326,
    SPATIAL INDEX location_index (location),
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    creator_id INT,
    FOREIGN KEY (creator_id)
        REFERENCES users (id),
    PRIMARY KEY (id)
);


