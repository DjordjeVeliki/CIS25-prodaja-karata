-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2025 at 07:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `prodaja_karata`
--

-- --------------------------------------------------------

--
-- Table structure for table `dogadjaji`
--

CREATE TABLE `dogadjaji` (
  `id` int(11) NOT NULL,
  `naziv` varchar(255) NOT NULL,
  `opis` text DEFAULT NULL,
  `datum` datetime NOT NULL,
  `cena` decimal(10,2) NOT NULL,
  `kategorija` varchar(100) DEFAULT NULL,
  `mesto` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dogadjaji`
--

INSERT INTO `dogadjaji` (`id`, `naziv`, `opis`, `datum`, `cena`, `kategorija`, `mesto`) VALUES
(1, 'Bajaga i Instruktori', 'Open-air koncert.', '2025-09-21 20:00:00', 2500.00, 'Koncert', 'Beograd'),
(2, 'Joksimović Sympho', 'Pop-simfo veče.', '2025-10-10 20:30:00', 3200.00, 'Koncert', 'Novi Sad'),
(3, 'Dubioza Kolektiv', 'Energični nastup.', '2025-11-01 21:00:00', 2800.00, 'Koncert', 'Niš'),
(4, 'Van Gogh Unplugged', 'Akustično veče.', '2025-10-25 20:00:00', 2300.00, 'Koncert', 'Kragujevac'),
(5, '4 Tenora', 'Gala vokalni koncert.', '2025-12-05 19:30:00', 3500.00, 'Koncert', 'Subotica'),
(6, 'Hamlet', 'Šekspir, klasična postavka.', '2025-10-03 19:30:00', 1800.00, 'Pozorište', 'Beograd'),
(7, 'Kir Janja', 'Nušić, komedija.', '2025-09-30 20:00:00', 1500.00, 'Pozorište', 'Novi Sad'),
(8, 'Koštana', 'Bora Stanković, drama.', '2025-11-12 19:00:00', 1600.00, 'Pozorište', 'Niš'),
(9, 'Balkanski špijun', 'Kultna komedija.', '2025-10-18 20:00:00', 1700.00, 'Pozorište', 'Kragujevac'),
(10, 'Profesionalac', 'Savremena drama.', '2025-12-02 19:30:00', 1900.00, 'Pozorište', 'Subotica'),
(11, 'Partizan – Zvezda', 'Fudbalski derbi.', '2025-10-05 18:30:00', 2200.00, 'Sport', 'Beograd'),
(12, 'Vojvodina – TSC', 'Superliga meč.', '2025-09-27 17:00:00', 1200.00, 'Sport', 'Novi Sad'),
(13, 'KK Niš – KK Bor', 'Košarkaški duel.', '2025-11-08 19:00:00', 900.00, 'Sport', 'Niš'),
(14, 'Radnički – Metalac', 'Rukometna utakmica.', '2025-10-20 18:00:00', 700.00, 'Sport', 'Kragujevac'),
(15, 'Spartak – Bačka', 'Prijateljska utakmica.', '2025-12-10 16:00:00', 600.00, 'Sport', 'Subotica'),
(16, 'IT Days 2025', 'Web, cloud i AI.', '2025-11-15 10:00:00', 4900.00, 'Konferencije', 'Beograd'),
(17, 'StartUp Summit', 'Preduzetništvo & investicije.', '2025-10-22 09:30:00', 4500.00, 'Konferencije', 'Novi Sad'),
(18, 'Data Science Forum', 'Analitika i ML.', '2025-11-28 09:00:00', 5200.00, 'Konferencije', 'Niš'),
(19, 'DevOps Day', 'CI/CD i platforme.', '2025-10-17 10:00:00', 4300.00, 'Konferencije', 'Kragujevac'),
(20, 'CyberSec Balkan', 'Bezbednost i SOC.', '2025-12-12 09:00:00', 5600.00, 'Konferencije', 'Subotica'),
(21, 'Porodični dan u muzeju', 'Radionice za decu.', '2025-09-28 11:00:00', 700.00, 'Porodični', 'Beograd'),
(22, 'Filmsko jutro', 'Animirani klasici.', '2025-10-06 10:30:00', 500.00, 'Porodični', 'Novi Sad'),
(23, 'Dečji teatar – Zvonar Bogorodičine crkve', 'Mjuzikl.', '2025-11-09 12:00:00', 800.00, 'Porodični', 'Niš'),
(24, 'Lego Day', 'Kreativne radionice.', '2025-10-19 11:30:00', 600.00, 'Porodični', 'Kragujevac'),
(25, 'Zimska bajka', 'Novogodišnji program.', '2025-12-20 12:00:00', 900.00, 'Porodični', 'Subotica'),
(26, 'Savremena umetnost – retrospektiva', 'Izložba mladih autora.', '2025-09-25 18:00:00', 400.00, 'Izložba', 'Beograd'),
(27, 'Fotografija Vojvodine', 'Tematska postavka.', '2025-10-11 18:00:00', 350.00, 'Izložba', 'Novi Sad'),
(28, 'Arheologija juga', 'Artefakti i makete.', '2025-11-06 17:00:00', 300.00, 'Izložba', 'Niš'),
(29, 'Grafike i crteži', 'Umetnička grafika.', '2025-10-23 18:30:00', 450.00, 'Izložba', 'Kragujevac'),
(30, 'Seoba ptica', 'Prirodnjačka postavka.', '2025-12-03 17:30:00', 250.00, 'Izložba', 'Subotica');

-- --------------------------------------------------------

--
-- Table structure for table `kategorije`
--

CREATE TABLE `kategorije` (
  `naziv` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategorije`
--

INSERT INTO `kategorije` (`naziv`) VALUES
('Izložba'),
('Koncert'),
('Konferencije'),
('Porodični'),
('Pozorište'),
('Sport');

-- --------------------------------------------------------

--
-- Table structure for table `kuponi`
--

CREATE TABLE `kuponi` (
  `code` varchar(64) NOT NULL,
  `type` enum('percent','fixed') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min` decimal(10,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `kuponi`
--

INSERT INTO `kuponi` (`code`, `type`, `value`, `min`, `description`) VALUES
('BIG15', 'percent', 15.00, 3000.00, '15% za veće porudžbine'),
('FIX200', 'fixed', 200.00, NULL, 'Fiksni popust 200 RSD'),
('FIX500', 'fixed', 500.00, 2500.00, '500 RSD iznad 2500 RSD'),
('TEST10', 'percent', 10.00, 1000.00, '10% popusta preko 1000 RSD'),
('WELCOME5', 'percent', 5.00, NULL, '5% dobrodošlice');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dogadjaji`
--
ALTER TABLE `dogadjaji`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_datum` (`datum`),
  ADD KEY `idx_naziv` (`naziv`),
  ADD KEY `fk_dog_kat` (`kategorija`);

--
-- Indexes for table `kategorije`
--
ALTER TABLE `kategorije`
  ADD PRIMARY KEY (`naziv`);

--
-- Indexes for table `kuponi`
--
ALTER TABLE `kuponi`
  ADD PRIMARY KEY (`code`),
  ADD KEY `idx_type` (`type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dogadjaji`
--
ALTER TABLE `dogadjaji`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dogadjaji`
--
ALTER TABLE `dogadjaji`
  ADD CONSTRAINT `fk_dog_kat` FOREIGN KEY (`kategorija`) REFERENCES `kategorije` (`naziv`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
