-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: db_fiverr
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gig_id` int DEFAULT NULL,
  `commenter_id` int DEFAULT NULL,
  `comment_date` datetime DEFAULT NULL,
  `content` varchar(1000) DEFAULT NULL,
  `rating` decimal(10,2) DEFAULT NULL,
  `removed` tinyint(1) DEFAULT '0',
  `backup` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `gig_id` (`gig_id`),
  KEY `commenter_id` (`commenter_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`gig_id`) REFERENCES `gig` (`gig_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`commenter_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,41,14,'2024-06-07 16:10:51','Nice',4.50,0,NULL),(2,45,14,'2024-06-07 16:11:25','Just ok',3.00,0,NULL),(3,46,4,'2024-06-10 09:29:44','Great!',4.50,1,NULL);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig`
--

DROP TABLE IF EXISTS `gig`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig` (
  `gig_id` int NOT NULL AUTO_INCREMENT,
  `gig_name` varchar(250) DEFAULT NULL,
  `reviews` int DEFAULT NULL,
  `price` int DEFAULT NULL,
  `photo` varchar(4000) DEFAULT NULL,
  `gig_desc` text,
  `short_gig_desc` varchar(500) DEFAULT NULL,
  `rating` decimal(10,2) DEFAULT NULL,
  `subcategory` int DEFAULT NULL,
  `seller_id` int DEFAULT NULL,
  `removed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`gig_id`),
  KEY `seller_id` (`seller_id`),
  KEY `subcategory` (`subcategory`),
  CONSTRAINT `gig_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `gig_ibfk_2` FOREIGN KEY (`subcategory`) REFERENCES `gig_subcategory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig`
--

LOCK TABLES `gig` WRITE;
/*!40000 ALTER TABLE `gig` DISABLE KEYS */;
INSERT INTO `gig` VALUES (41,'Professional Logo Design',150,50,NULL,'I will create a professional logo for your business.','Professional logo design service.',4.90,11,1,0),(42,'Illustration for Books',85,100,NULL,'High-quality illustrations for books and comics.','Book and comic illustrations.',4.80,2,2,0),(43,'Custom Web Design',120,300,NULL,'Custom web design tailored to your needs.','Custom web design service.',4.70,3,3,0),(44,'Game Character Design',75,200,NULL,'Designing characters for video games.','Game character design service.',4.60,4,4,0),(45,'E-commerce Website Development',200,500,NULL,'Build a fully functional e-commerce website.','E-commerce website development.',4.90,5,5,0),(46,'WordPress Website Setup',110,250,NULL,'Setup and customization of WordPress websites.','WordPress website setup.',4.80,6,6,0),(47,'Website Maintenance Services',90,150,NULL,'Ongoing maintenance for your website.','Website maintenance service.',4.70,7,7,0),(48,'SEO Optimization',130,200,NULL,'Optimize your website for search engines.','SEO optimization service.',4.80,8,8,0),(49,'Social Media Marketing',140,180,NULL,'Social media strategy and content creation.','Social media marketing service.',4.70,9,9,0),(50,'Data Analysis and Reporting',60,250,NULL,'Analyze and report your business data.','Data analysis and reporting service.',4.50,10,10,0),(51,'YouTube Channel Management',80,300,NULL,'Manage and grow your YouTube channel.','YouTube channel management service.',4.60,11,1,0),(52,'Blog Content Writing',100,100,NULL,'Write engaging blog posts for your site.','Blog content writing service.',4.80,12,2,0),(53,'Proofreading and Editing',150,75,NULL,'Professional proofreading and editing.','Proofreading and editing service.',4.90,13,3,0),(54,'eBook Formatting and Publishing',70,120,NULL,'Format and publish your eBook.','eBook formatting and publishing service.',4.70,14,4,0),(55,'Video Editing Services',110,350,NULL,'Editing services for your video content.','Video editing service.',4.80,15,5,0),(56,'Promotional Video Production',95,400,NULL,'Create promotional videos for marketing.','Promotional video production service.',4.60,16,6,0),(57,'2D Animation Services',130,500,NULL,'Create 2D animations for various needs.','2D animation service.',4.90,17,7,0),(58,'Music Composition and Production',85,250,NULL,'Compose and produce original music.','Music composition and production service.',4.70,18,8,0),(59,'Audio Mixing and Mastering',60,150,NULL,'Professional audio mixing and mastering.','Audio mixing and mastering service.',4.50,19,9,0),(60,'Voice Over Services',120,200,NULL,'Professional voice over for various projects.','Voice over service.',4.80,20,10,1),(61,'Test',10,200,'D:\\BackEnd\\Fiverr BE\\public\\gigImg\\1717762844526_colin-2x.jpg','Test Test Test','Test',3.40,21,1,0),(62,'Test 2',0,100,NULL,'Test','Test',NULL,21,1,1);
/*!40000 ALTER TABLE `gig` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig_category`
--

DROP TABLE IF EXISTS `gig_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig_category`
--

LOCK TABLES `gig_category` WRITE;
/*!40000 ALTER TABLE `gig_category` DISABLE KEYS */;
INSERT INTO `gig_category` VALUES (1,'Graphics & Design'),(2,'Digital Marketing'),(3,'Writing & Translation'),(4,'Video & Animation'),(5,'Music & Audio'),(6,'Programming & Tech'),(7,'Business'),(8,'Consulting'),(9,'Data'),(10,'AI Services');
/*!40000 ALTER TABLE `gig_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig_order`
--

DROP TABLE IF EXISTS `gig_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `gig_id` int DEFAULT NULL,
  `buyer_id` int DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `removed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `gig_id` (`gig_id`),
  KEY `buyer_id` (`buyer_id`),
  CONSTRAINT `gig_order_ibfk_1` FOREIGN KEY (`gig_id`) REFERENCES `gig` (`gig_id`),
  CONSTRAINT `gig_order_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig_order`
--

LOCK TABLES `gig_order` WRITE;
/*!40000 ALTER TABLE `gig_order` DISABLE KEYS */;
INSERT INTO `gig_order` VALUES (1,41,1,'2024-06-07 14:56:13',0,0),(2,45,14,'2024-07-06 17:00:00',0,0),(3,54,4,'2024-06-07 15:00:41',1,0);
/*!40000 ALTER TABLE `gig_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gig_subcategory`
--

DROP TABLE IF EXISTS `gig_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gig_subcategory` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(100) DEFAULT NULL,
  `subcategory_photo` varchar(4000) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `subcategory_items` text,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `gig_subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `gig_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gig_subcategory`
--

LOCK TABLES `gig_subcategory` WRITE;
/*!40000 ALTER TABLE `gig_subcategory` DISABLE KEYS */;
INSERT INTO `gig_subcategory` VALUES (1,'Logo & Brand Identity',NULL,1,NULL),(2,'Art & Illustration',NULL,1,NULL),(3,'Web & Art Design',NULL,1,NULL),(4,'Product & Gaming',NULL,1,NULL),(5,'Website Development',NULL,6,NULL),(6,'Website Platforms',NULL,6,NULL),(7,'Website Maintenance',NULL,6,NULL),(8,'Search',NULL,2,NULL),(9,'Social',NULL,2,NULL),(10,'Analytics & Strategy',NULL,2,NULL),(11,'Channel Specific',NULL,2,NULL),(12,'Content Writing',NULL,3,NULL),(13,'Editing & Critique',NULL,3,NULL),(14,'Book & eBook Publishing',NULL,3,NULL),(15,'Editing & Post-Production',NULL,4,NULL),(16,'Social & Marketing Videos',NULL,4,NULL),(17,'Animation',NULL,4,NULL),(18,'Music Production & Writing',NULL,5,NULL),(19,'Audio Engineering & Post Production',NULL,5,NULL),(20,'Voice Over & Narration',NULL,5,NULL),(21,'Print Design','D:\\BackEnd\\Fiverr BE\\public\\subcategoryImg\\1717750157562_logo-fiverr.png',1,'Flyer Design, Brochure Design');
/*!40000 ALTER TABLE `gig_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(250) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birthday` varchar(20) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  `skill` text,
  `certification` text,
  `avatar` varchar(4000) DEFAULT NULL,
  `refresh_token` varchar(4000) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Alice Smith','alice.smith@example.com','password123','123-456-7890','15/04/1990','FEMALE','USER',NULL,NULL,NULL,NULL),(2,'Bob Johnson','bob.johnson@example.com','qwerty123','234-567-8901','22/08/1985','MALE','USER',NULL,NULL,NULL,NULL),(3,'Charlie Brown','charlie.brown@example.com','zxcvbn123','345-678-9012','05/12/1975','MALE','ADMIN',NULL,NULL,NULL,NULL),(4,'Diana Prince','diana.prince@example.com','wonderwoman1','456-789-0123','14/02/1988','FEMALE','USER',NULL,NULL,NULL,NULL),(5,'Eve Adams','eve.adams@example.com','evesecret','567-890-1234','01/01/1995','FEMALE','USER',NULL,NULL,NULL,NULL),(6,'Frank Wright','frank.wright@example.com','frankpassword','678-901-2345','30/07/1992','MALE','USER',NULL,NULL,NULL,NULL),(7,'Grace Hopper','grace.hopper@example.com','codegrace','789-012-3456','09/12/1906','FEMALE','ADMIN',NULL,NULL,NULL,NULL),(8,'Henry Ford','henry.ford@example.com','modelt123','890-123-4567','30/07/1863','MALE','USER',NULL,NULL,NULL,NULL),(9,'Ivy Green','ivy.green@example.com','plantlover','901-234-5678','23/05/1993','NONBINARY','USER',NULL,NULL,NULL,NULL),(10,'Jack White','jack.white@example.com','whitestripes','012-345-6789','10/10/1980','MALE','USER',NULL,NULL,NULL,NULL),(11,'John Doe','john.doe@gmail.com','John123@','123-456-7891','01/01/1990','MALE','USER','','','',NULL),(14,'John Doe','john.doe55@gmail.com','$2b$10$/yvCnyr/4vVRyczF8Gi.FOURz4trUtk77/S6vHi0bsmc/zKbxm02i','123-456-7892','01/01/1990','MALE','ADMIN','HTML, CSS, ReactJS','Cert 1, Cert 2','D:\\BackEnd\\Fiverr BE\\public\\avatar\\1717667323950_colin-2x.jpg',NULL),(16,'John Doe','john.doe6@gmail.com','John123@','123-456-7892','01/01/1990','FEMALE','ADMIN','HTML, CSS, ReactJS','Cert 1, Cert 2','',NULL),(19,'Jane Doe','john.doe123@gmail.com','Jane123@','123-456-7891','01/01/1990','FEMALE','USER',NULL,NULL,NULL,NULL),(20,'Janett D. Doe','janett.doe1@gmail.com','$2b$10$ZUAFPbMxGmZFi4sgoWvTOu9FOjddtOAdn1ialRnMivW8p5e.FvK8i','123-456-7892','01/01/1990','FEMALE','ADMIN','HTML, CSS, ReactJS','Cert 1, Cert 2',NULL,NULL),(21,'John Doe','john.doe5@gmail.com','$2b$10$rtkkPxeKezEx0ETo5lt84OwdMOppLROlUDRQgbP0z1T8zljdraJPi','123-456-7891','05/01/1995','MALE','USER','','','',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-13 14:14:43
