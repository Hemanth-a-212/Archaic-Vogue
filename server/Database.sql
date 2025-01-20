CREATE DATABASE archaic_vogue;

CREATE TABLE product (
    id serial PRIMARY KEY,
    name varchar(225) NOT NULL,
    image varchar(225) NOT NULL,
    category varchar(100) NOT NULL,
    price numeric(10, 0) NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    available boolean DEFAULT true
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(225) NOT NULL,
    email varchar(225) NOT NULL UNIQUE,
    password varchar(100) NOT NULL UNIQUE,
    cartData jsonb NOT NULL,
    date timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

