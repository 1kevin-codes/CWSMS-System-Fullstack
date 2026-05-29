-- CWSMS database
DROP DATABASE IF EXISTS CWSMS;
CREATE DATABASE CWSMS;
USE CWSMS;

CREATE TABLE Package (
  PackageNumber     INT AUTO_INCREMENT PRIMARY KEY,
  PackageName       VARCHAR(100) NOT NULL,
  PackageDescription VARCHAR(255) NOT NULL,
  PackagePrice      DECIMAL(10,2) NOT NULL
);

CREATE TABLE Car (
  PlateNumber  VARCHAR(20) PRIMARY KEY,
  CarType      VARCHAR(50) NOT NULL,
  CarSize      VARCHAR(50) NOT NULL,
  DriverName   VARCHAR(100) NOT NULL,
  PhoneNumber  VARCHAR(20) NOT NULL
);

CREATE TABLE ServicePackage (
  RecordNumber  INT AUTO_INCREMENT PRIMARY KEY,
  ServiceDate   DATE NOT NULL,
  PlateNumber   VARCHAR(20) NOT NULL,
  PackageNumber INT NOT NULL,
  FOREIGN KEY (PlateNumber)   REFERENCES Car(PlateNumber)       ON DELETE CASCADE,
  FOREIGN KEY (PackageNumber) REFERENCES Package(PackageNumber) ON DELETE RESTRICT
);

CREATE TABLE Payment (
  PaymentNumber INT AUTO_INCREMENT PRIMARY KEY,
  AmountPaid    DECIMAL(10,2) NOT NULL,
  PaymentDate   DATE NOT NULL,
  RecordNumber  INT NOT NULL UNIQUE,
  FOREIGN KEY (RecordNumber) REFERENCES ServicePackage(RecordNumber) ON DELETE CASCADE
);

CREATE TABLE Users (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Seed packages
INSERT INTO Package (PackageName, PackageDescription, PackagePrice) VALUES
  ('Basic wash',   'Exterior hand wash',              5000),
  ('Classic wash', 'Interior hand wash',             10000),
  ('Premium wash', 'Exterior and Interior hand wash', 20000);

-- Default login: admin / admin123
INSERT INTO Users (username, password) VALUES ('admin', 'admin123');
