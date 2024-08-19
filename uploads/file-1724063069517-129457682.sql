-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 13, 2024 at 11:13 AM
-- Server version: 10.11.7-MariaDB-cll-lve
-- PHP Version: 8.3.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hancecyb_stock`
--

-- --------------------------------------------------------

--
-- Table structure for table `store_products`
--

CREATE TABLE `store_products` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `date` datetime NOT NULL,
  `expdate` datetime DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` float NOT NULL,
  `sales_price` float NOT NULL,
  `product_pic` varchar(25) NOT NULL,
  `status` varchar(45) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `store_id` int(11) DEFAULT NULL,
  `shelf_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `store_products`
--

INSERT INTO `store_products` (`id`, `name`, `date`, `expdate`, `quantity`, `unit_price`, `sales_price`, `product_pic`, `status`, `categories_id`, `store_id`, `shelf_id`) VALUES
(284, 'Tishert', '2023-07-06 13:59:28', NULL, 50, 300, 350, 'placeholder.jpeg', '1', 35, 243, NULL),
(285, 'shoes', '2023-07-06 14:00:07', NULL, 10, 1500, 2200, 'placeholder.jpeg', '1', 35, 244, NULL),
(286, 'dress', '2023-07-06 12:57:59', NULL, 15, 1500, 2000, 'placeholder.jpeg', '1', 35, 243, NULL),
(287, 'Coca', '2023-07-06 14:26:59', NULL, 24, 20, 25, 'placeholder.jpeg', '1', 40, 249, NULL),
(288, 'iphone 12', '2023-07-06 13:35:07', NULL, 0, 70000, 75000, 'placeholder.jpeg', '1', 52, 245, NULL),
(289, 'apple juice ', '2023-07-06 13:33:11', NULL, 4, 54, 57, 'placeholder.jpeg', '1', 51, 245, NULL),
(290, 'pen ', '2023-07-06 13:32:05', NULL, 10, 10, 12, 'placeholder.jpeg', '1', 50, 245, NULL),
(291, 'Jojo', '2023-07-06 19:39:25', NULL, 300, 80, 100, 'placeholder.jpeg', '1', 40, 251, NULL),
(292, 'korkoro', '2023-07-07 03:41:40', NULL, 22466, 285, 360, 'placeholder.jpeg', '1', 30, 253, NULL),
(293, 'mismar', '2023-07-07 03:42:20', NULL, 45033, 3, 5, 'placeholder.jpeg', '1', 30, 253, NULL),
(294, 'medosha', '2023-07-07 03:43:18', NULL, 4007, 243, 250, 'placeholder.jpeg', '1', 30, 253, NULL),
(295, 'kelem', '2023-07-07 03:19:11', NULL, 1, 600, 600, 'placeholder.jpeg', '1', 30, 253, NULL),
(296, 'apple', '2023-07-07 13:06:12', NULL, 17, 50, 54, 'placeholder.jpeg', '1', 56, 254, NULL),
(297, 'med', '2023-07-07 14:45:57', NULL, 990, 200, 300, 'placeholder.jpeg', '1', 24, 255, NULL),
(298, 'mismar', '2023-07-08 10:31:15', NULL, 12, 50, 60, 'placeholder.jpeg', '1', 60, 258, NULL),
(299, 'cement', '2023-07-08 10:35:09', NULL, 50, 500, 600, 'placeholder.jpeg', '1', 60, 257, NULL),
(300, 'phone ', '2023-07-07 13:48:24', NULL, 104, 19500, 21000, 'placeholder.jpeg', '1', 24, 264, NULL),
(301, 'miniscert', '2023-07-09 07:50:28', NULL, 120, 1800, 2000, 'placeholder.jpeg', '1', 35, 259, NULL),
(302, 'magnisum', '2023-07-09 07:52:08', NULL, 200, 100, 150, 'placeholder.jpeg', '1', 35, 260, NULL),
(303, 'vitamin', '2023-07-09 07:53:06', NULL, 180, 200, 300, 'placeholder.jpeg', '1', 35, 261, NULL),
(304, 'panadol', '2023-07-09 07:53:52', NULL, 520, 50, 80, 'placeholder.jpeg', '1', 35, 262, NULL),
(305, 'vactrim', '2023-07-09 07:55:42', NULL, 565, 100, 150, 'placeholder.jpeg', '1', 35, 263, NULL),
(306, 'medicament', '2023-07-09 06:23:09', NULL, 80, 300, 350, 'placeholder.jpeg', '1', 35, 262, NULL),
(307, 'magnisium', '2023-07-09 12:54:32', NULL, 40, 100, 150, 'placeholder.jpeg', '1', 35, 260, NULL),
(308, 'Iphone', '2023-07-09 18:03:23', NULL, 2000, 15000, 20000, 'placeholder.jpeg', '1', 47, 273, NULL),
(309, 'furniture ', '2023-07-09 18:05:56', NULL, 500, 15000, 18000, 'placeholder.jpeg', '1', 45, 272, NULL),
(310, 'Jar', '2023-07-10 06:16:21', NULL, 20, 150, 175, 'placeholder.jpeg', '1', 55, 256, NULL),
(311, 'kelem', '2023-07-10 06:45:13', NULL, 10, 250, 300, 'placeholder.jpeg', '1', 60, 277, NULL),
(312, 'oil', '2023-07-10 07:48:43', NULL, 100, 1000, 1500, 'placeholder.jpeg', '1', 45, 271, NULL),
(313, 'furniture ', '2023-07-10 07:50:47', NULL, 100, 12000, 18000, 'placeholder.jpeg', '1', 45, 267, NULL),
(314, 'iphone', '2023-07-10 07:54:25', NULL, 200, 15000, 20000, 'placeholder.jpeg', '1', 45, 270, NULL),
(315, 'moya biscuits ', '2023-07-10 07:56:52', NULL, 10000000, 15, 20, 'placeholder.jpeg', '1', 31, 280, NULL),
(316, 'flour ', '2023-07-10 07:58:23', NULL, 10000000, 75, 80, 'placeholder.jpeg', '1', 31, 280, NULL),
(317, 'moya biscuits fasting ', '2023-07-10 07:59:35', NULL, 200000, 15, 20, 'placeholder.jpeg', '1', 31, 280, NULL),
(318, 'moya biscuits chocolate ', '2023-07-10 08:00:14', NULL, 200000, 15, 20, 'placeholder.jpeg', '1', 31, 280, NULL),
(319, 'duru body soap ', '2023-07-10 08:01:40', NULL, 1000, 80, 100, 'placeholder.jpeg', '1', 30, 281, NULL),
(320, 'duru hand soap ', '2023-07-10 08:02:27', NULL, 100, 120, 130, 'placeholder.jpeg', '1', 30, 281, NULL),
(321, 'duru hand sanitizer ', '2023-07-10 08:03:13', NULL, 100, 100, 110, 'placeholder.jpeg', '1', 30, 281, NULL),
(322, 'red garment', '2023-07-10 08:04:31', NULL, 1090, 1180, 1200, 'placeholder.jpeg', '1', 30, 282, NULL),
(323, 'cotex t-shirt ', '2023-07-10 08:07:26', NULL, 200, 268, 299, 'placeholder.jpeg', '1', 30, 282, NULL),
(324, 'cotex tuta', '2023-07-10 08:08:47', NULL, 190, 390, 399, 'placeholder.jpeg', '1', 30, 282, NULL),
(325, 'water glass', '2023-07-10 08:10:37', NULL, 5000, 590, 600, 'placeholder.jpeg', '1', 30, 279, NULL),
(326, 'tea cup ', '2023-07-10 08:11:10', NULL, 600, 480, 500, 'placeholder.jpeg', '1', 30, 279, NULL),
(327, 'Nike sport shoes ', '2023-07-10 08:32:55', NULL, 78, 1800, 2000, 'placeholder.jpeg', '1', 30, 278, NULL),
(328, 'white Nike air force ', '2023-07-10 08:33:52', NULL, 80, 1900, 2100, 'placeholder.jpeg', '1', 30, 278, NULL),
(329, 'black Nike air force 38', '2023-07-10 08:34:41', NULL, 60, 1800, 2000, 'placeholder.jpeg', '1', 30, 278, NULL),
(330, 'Nike sportswear ', '2023-07-10 08:35:27', NULL, 30, 1800, 2000, 'placeholder.jpeg', '1', 30, 278, NULL),
(331, 'Nike t-shirt ', '2023-07-10 08:36:01', NULL, 73, 750, 800, 'placeholder.jpeg', '1', 30, 278, NULL),
(332, 'HP laptop', '2023-07-10 11:42:48', NULL, 90, 1750, 1800, 'placeholder.jpeg', '1', 30, 283, NULL),
(333, 'lala', '2023-07-10 10:50:10', NULL, 1, 699, 800, 'placeholder.jpeg', '1', 24, 264, NULL),
(334, 'Buna', '2023-07-11 12:10:53', NULL, 200, 450, 500, 'placeholder.jpeg', '1', 59, 284, NULL),
(335, 'ceramic ', '2023-07-11 12:25:15', NULL, 200, 700, 800, 'placeholder.jpeg', '1', 60, 257, NULL),
(336, 'New Product 1', '2023-07-13 09:56:06', NULL, 10, 100, 120, 'placeholder.jpeg', '1', 55, 285, NULL),
(337, 'new Product 2', '2023-07-13 10:30:23', NULL, 12, 50, 80, 'placeholder.jpeg', '1', 55, 285, NULL),
(338, 'mntaf', '2023-07-14 08:43:41', NULL, 50, 1000, 1500, 'placeholder.jpeg', '1', 60, 257, NULL),
(339, 'wenber', '2023-07-15 11:29:38', NULL, 100, 2000, 3000, 'placeholder.jpeg', '1', 60, 257, NULL),
(340, 'Tv ', '2023-07-15 10:31:25', NULL, 20, 20000, 25000, 'placeholder.jpeg', '1', 60, 257, NULL),
(341, 'tv ', '2023-07-16 15:27:49', NULL, 0, 20000, 28000, 'placeholder.jpeg', '1', 64, 286, NULL),
(342, 'mobile', '2023-07-16 15:29:33', NULL, 0, 70, 80, 'placeholder.jpeg', '1', 65, 286, NULL),
(343, 'iphone7', '2023-07-16 15:34:43', NULL, 7, 8000, 8999, 'placeholder.jpeg', '1', 64, 286, NULL),
(344, 'Brakes', '2023-07-27 20:55:11', NULL, 5, 12000, 12500, 'placeholder.jpeg', '1', 55, 289, NULL),
(345, 'Radiator', '2023-07-27 19:52:32', NULL, 2, 2800, 3000, 'placeholder.jpeg', '1', 55, 289, NULL),
(346, 'iphone', '2023-07-29 13:34:58', NULL, 30, 30, 300, 'placeholder.jpeg', '1', 69, 242, NULL),
(347, 'pros', '2023-07-29 15:14:29', NULL, 650, 69, 67, 'placeholder.jpeg', '1', 70, 290, NULL),
(348, 'Table ', '2023-07-29 16:06:28', NULL, 5, 20000, 21000, 'placeholder.jpeg', '1', 55, 288, NULL),
(349, 'Radiator', '2023-07-27 19:52:32', NULL, 1, 2800, 3000, 'placeholder.jpeg', '1', 55, 292, NULL),
(350, 'foam', '2023-08-03 09:20:26', NULL, 15, 15000, 20000, 'placeholder.jpeg', '1', 35, 293, NULL),
(351, 'foam', '2023-08-03 09:29:00', NULL, 15, 15500, 20000, 'placeholder.jpeg', '1', 35, 294, NULL),
(352, 'goma', '2023-08-03 09:35:14', NULL, 50, 200000, 250000, 'placeholder.jpeg', '1', 35, 295, NULL),
(353, 'washing machine', '2023-08-03 14:34:44', NULL, 19, 2000000, 2450000, 'placeholder.jpeg', '1', 35, 298, NULL),
(354, 'washing machine', '2023-08-03 14:37:56', NULL, 15, 20000, 25000, 'placeholder.jpeg', '1', 35, 299, NULL),
(355, 'MO 2', '2023-08-04 12:44:33', NULL, 15, 8000, 8500, 'placeholder.jpeg', '1', 71, 296, NULL),
(356, 'iphone', '2023-08-04 19:31:32', NULL, 4, 22.3, 24, 'placeholder.jpeg', '1', 75, 300, NULL),
(357, 'spring iveco back', '2023-08-06 16:28:09', NULL, 98, 800, 1500, 'placeholder.jpeg', '1', 24, 255, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `store_products`
--
ALTER TABLE `store_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id_idx` (`store_id`),
  ADD KEY `categories_id_idx` (`categories_id`),
  ADD KEY `s_p_shelf_id_idx` (`shelf_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `store_products`
--
ALTER TABLE `store_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=358;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `store_products`
--
ALTER TABLE `store_products`
  ADD CONSTRAINT `c_id` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`category_id`),
  ADD CONSTRAINT `s_p_shelf_id` FOREIGN KEY (`shelf_id`) REFERENCES `shelf` (`id`),
  ADD CONSTRAINT `store_id` FOREIGN KEY (`store_id`) REFERENCES `branch` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
