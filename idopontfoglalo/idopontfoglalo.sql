-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 03, 2024 at 07:29 PM
-- Server version: 8.0.35
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `idopontfoglalo`
--

-- --------------------------------------------------------

--
-- Table structure for table `idopontok`
--

DROP TABLE IF EXISTS `idopontok`;
CREATE TABLE IF NOT EXISTS `idopontok` (
  `id` int NOT NULL AUTO_INCREMENT,
  `datum` date NOT NULL,
  `idopont` text NOT NULL,
  `nev` text NOT NULL,
  `taj` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `idopontok`
--

-- INSERT INTO `idopontok` (`id`, `datum`, `idopont`, `nev`, `taj`) VALUES
-- (1, '2024-05-06', '08:30', 'Pista', 12382168),
-- (2, '2024-05-06', '11:30', 'Feri', 3497279),
-- (3, '2024-05-07', '10:00', 'Jóska', 13877283),
-- (4, '2024-05-08', '15:00', 'Gézuka', 123857292),
-- (5, '2024-05-08', '12:30', 'Kis Pista', 127645263),
-- (6, '2024-05-08', '12:00', 'Nagy Ferike', 726371),
-- (7, '2024-05-08', '11:30', 'Nagy Feró', 716371);

-- --------------------------------------------------------

--
-- Table structure for table `nyitvatartas`
--

DROP TABLE IF EXISTS `nyitvatartas`;
CREATE TABLE IF NOT EXISTS `nyitvatartas` (
  `nap` int DEFAULT NULL,
  `kezd` text,
  `veg` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `nyitvatartas`
--

-- INSERT INTO `nyitvatartas` (`nap`, `kezd`, `veg`) VALUES
-- (0, '8:00', '12:00'),
-- (1, '8:00', '11:00'),
-- (2, '11:00', '14:00'),
-- (3, '14:00', '17:00'),
-- (4, '12:30', '17:00'),
-- (5, '0:00', '0:00'),
-- (6, '0:00', '0:00');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
