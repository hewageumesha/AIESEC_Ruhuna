-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 06, 2025 at 05:31 AM
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
-- Database: `taskmanagement`
--

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `task_id` int(11) NOT NULL,
  `deadline_date` datetime(6) NOT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `task_name` varchar(100) NOT NULL,
  `work_of_status` varchar(255) NOT NULL,
  `user_user_id` int(11) DEFAULT NULL,
  `priority` enum('HIGH','MEDIUM','LOW') DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `assigned_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`task_id`, `deadline_date`, `description`, `task_name`, `work_of_status`, `user_user_id`, `priority`, `assigned_to`, `assigned_by`) VALUES
(2, '2025-04-30 05:30:00.000000', 'task 99', 'task99', 'completed', 2, 'LOW', NULL, NULL),
(3, '2025-05-15 05:30:00.000000', 'task 005', 'task 05', 'completed', 2, 'LOW', NULL, NULL),
(10, '2025-05-02 00:00:00.000000', 'hello', 'hi', '', 4, 'MEDIUM', NULL, NULL),
(87, '2025-05-23 05:30:00.000000', 'task54', 'task 54', 'pending', 1, 'HIGH', 2, NULL),
(88, '2025-05-16 05:30:00.000000', 'task', 'task999', 'in-progress', 1, 'HIGH', 1, 1),
(89, '2025-05-22 05:30:00.000000', 'task91', 'task 91', 'completed', 1, 'LOW', 1, 1),
(90, '2025-05-02 05:30:00.000000', 'make a ep folder', 'task 5', 'completed', 1, 'MEDIUM', 1, 1),
(91, '2025-05-29 05:30:00.000000', 'task', 'task', 'in-progress', 1, 'LOW', 1, 1),
(92, '2025-05-08 05:30:00.000000', 'hellooo', 'task4000', 'in-progress', 1, 'MEDIUM', 1, 1),
(95, '2025-05-15 05:30:00.000000', 'task 03', 'task 03', 'completed', 1, 'LOW', 4, 1),
(97, '2025-05-22 05:30:00.000000', 'task 03', 'task 03', 'completed', 1, 'LOW', 2, 1),
(98, '2025-05-31 05:30:00.000000', 'task76', 'task 43', 'in-progress', 1, 'HIGH', 2, 1),
(99, '2025-06-24 05:30:00.000000', 'dey', 'task 03', 'in-progress', 1, 'HIGH', 1, 1),
(103, '2025-07-10 05:30:00.000000', 'Task created from Postman', 'Test task', 'pending', 1, 'HIGH', 1, 1),
(104, '2025-07-08 05:30:00.000000', 'end', 'end', 'in-progress', 1, 'HIGH', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `task_proofs`
--

CREATE TABLE `task_proofs` (
  `proof_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `upload_date` datetime(6) NOT NULL,
  `task_id` int(11) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `uploaded_at` datetime(6) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `no_of_task` int(11) DEFAULT 0,
  `password` varchar(30) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `role` varchar(255) NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `no_of_task`, `password`, `user_name`, `role`, `id`) VALUES
(1, 98, 'ashfa', 'ashfa', 'LCP', 1),
(2, 2, 'krish', 'krish', 'LCVP', 2),
(4, 4, 'kk', 'kk', 'TL', 3),
(5, 0, 'Tim', 'Tim', 'Member', 4);

-- --------------------------------------------------------

--
-- Table structure for table `user_seq`
--

CREATE TABLE `user_seq` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_seq`
--

INSERT INTO `user_seq` (`next_val`) VALUES
(151);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `FK4ordojk2hmfawex6xkaqhynvj` (`user_user_id`),
  ADD KEY `FKqe4qg10osjw9r6rnusrtvou25` (`assigned_to`),
  ADD KEY `FKmnnt877hjxma4gu4jkwpxwtwg` (`assigned_by`);

--
-- Indexes for table `task_proofs`
--
ALTER TABLE `task_proofs`
  ADD PRIMARY KEY (`proof_id`),
  ADD KEY `FKns2qqh2rb3w2vn2jf4dc4cfa2` (`task_id`),
  ADD KEY `FKjbv7fin2ee90muymer7q8d4pi` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `UK_lqjrcobrh9jc8wpcar64q1bfh` (`user_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `task_proofs`
--
ALTER TABLE `task_proofs`
  MODIFY `proof_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FK4ordojk2hmfawex6xkaqhynvj` FOREIGN KEY (`user_user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FKmnnt877hjxma4gu4jkwpxwtwg` FOREIGN KEY (`assigned_by`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FKqe4qg10osjw9r6rnusrtvou25` FOREIGN KEY (`assigned_to`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `task_proofs`
--
ALTER TABLE `task_proofs`
  ADD CONSTRAINT `FKjbv7fin2ee90muymer7q8d4pi` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FKns2qqh2rb3w2vn2jf4dc4cfa2` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
