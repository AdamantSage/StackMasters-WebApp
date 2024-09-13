-- MySQL dump 10.13  Distrib 9.0.1, for Linux (x86_64)
--
-- Host: localhost    Database: stackmastersdb
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Admin`
--

DROP TABLE IF EXISTS `Admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admin` (
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admin`
--

LOCK TABLES `Admin` WRITE;
/*!40000 ALTER TABLE `Admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `Admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Assignment`
--

DROP TABLE IF EXISTS `Assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Assignment` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `module_code` varchar(10) NOT NULL,
  `assign_name` varchar(255) NOT NULL,
  `upload_date` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `assign_desc` text,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Assignment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Assignment`
--

LOCK TABLES `Assignment` WRITE;
/*!40000 ALTER TABLE `Assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Feedback` (
  `feed_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `assignment_id` int DEFAULT NULL,
  `description` text,
  `grade` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`feed_id`),
  KEY `user_id` (`user_id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `Feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `Feedback_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment` (`assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lecturer`
--

DROP TABLE IF EXISTS `Lecturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lecturer` (
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Lecturer_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lecturer`
--

LOCK TABLES `Lecturer` WRITE;
/*!40000 ALTER TABLE `Lecturer` DISABLE KEYS */;
/*!40000 ALTER TABLE `Lecturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Student`
--

DROP TABLE IF EXISTS `Student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Student` (
  `user_id` int NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `Student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Student`
--

LOCK TABLES `Student` WRITE;
/*!40000 ALTER TABLE `Student` DISABLE KEYS */;
/*!40000 ALTER TABLE `Student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Submission`
--

DROP TABLE IF EXISTS `Submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Submission` (
  `sub_id` int NOT NULL AUTO_INCREMENT,
  `sub_date` datetime NOT NULL,
  `assignment_id` int DEFAULT NULL,
  `feed_id` int DEFAULT NULL,
  PRIMARY KEY (`sub_id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `feed_id` (`feed_id`),
  CONSTRAINT `Submission_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment` (`assignment_id`),
  CONSTRAINT `Submission_ibfk_2` FOREIGN KEY (`feed_id`) REFERENCES `Feedback` (`feed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Submission`
--

LOCK TABLES `Submission` WRITE;
/*!40000 ALTER TABLE `Submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `Submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_on_Assignment`
--

DROP TABLE IF EXISTS `User_on_Assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_on_Assignment` (
  `user_id` int NOT NULL,
  `assignment_id` int NOT NULL,
  `module_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`assignment_id`),
  KEY `assignment_id` (`assignment_id`),
  CONSTRAINT `User_on_Assignment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `User_on_Assignment_ibfk_2` FOREIGN KEY (`assignment_id`) REFERENCES `Assignment` (`assignment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_on_Assignment`
--

LOCK TABLES `User_on_Assignment` WRITE;
/*!40000 ALTER TABLE `User_on_Assignment` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_on_Assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User_on_Submission`
--

DROP TABLE IF EXISTS `User_on_Submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User_on_Submission` (
  `user_id` int NOT NULL,
  `sub_id` int NOT NULL,
  `module_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`sub_id`),
  KEY `sub_id` (`sub_id`),
  CONSTRAINT `User_on_Submission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `User_on_Submission_ibfk_2` FOREIGN KEY (`sub_id`) REFERENCES `Submission` (`sub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User_on_Submission`
--

LOCK TABLES `User_on_Submission` WRITE;
/*!40000 ALTER TABLE `User_on_Submission` DISABLE KEYS */;
/*!40000 ALTER TABLE `User_on_Submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('lecturer','admin','student') NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Video`
--

DROP TABLE IF EXISTS `Video`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Video` (
  `vid_id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `path` varchar(255) NOT NULL,
  `mimetype` varchar(50) NOT NULL,
  `size` bigint NOT NULL,
  `uploadAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `compressed_path` varchar(255) DEFAULT NULL,
  `compressed_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`vid_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Video_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Video`
--

LOCK TABLES `Video` WRITE;
/*!40000 ALTER TABLE `Video` DISABLE KEYS */;
/*!40000 ALTER TABLE `Video` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-13 10:52:52
