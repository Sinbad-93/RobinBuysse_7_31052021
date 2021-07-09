-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: projet7
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `reactions`
--

DROP TABLE IF EXISTS `reactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reactions` (
  `idreactions` int NOT NULL AUTO_INCREMENT,
  `id_parent_publication` int NOT NULL,
  `id_user` int NOT NULL,
  `reaction` enum('heart','smile','laugh') DEFAULT NULL,
  PRIMARY KEY (`idreactions`),
  KEY `id_publication_idx` (`id_parent_publication`),
  KEY `id_user_idx` (`id_user`),
  KEY `id_user_id2x` (`id_user`),
  CONSTRAINT `id_publication` FOREIGN KEY (`id_parent_publication`) REFERENCES `publications` (`id_publication`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=415 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reactions`
--

LOCK TABLES `reactions` WRITE;
/*!40000 ALTER TABLE `reactions` DISABLE KEYS */;
INSERT INTO `reactions` VALUES (281,46,36,'heart'),(282,32,36,'smile'),(283,32,36,'laugh'),(285,30,36,'smile'),(286,59,41,'smile'),(287,59,41,'heart'),(289,32,41,'smile'),(291,31,41,'heart'),(292,30,41,'heart'),(293,30,41,'smile'),(318,46,36,'laugh'),(319,32,36,'heart'),(320,31,36,'smile'),(321,31,36,'laugh'),(322,30,36,'laugh'),(323,30,36,'heart'),(324,59,37,'smile'),(325,46,37,'smile'),(326,32,37,'smile'),(327,31,37,'heart'),(328,31,37,'laugh'),(329,30,37,'heart'),(330,46,41,'smile'),(331,31,41,'laugh'),(332,59,46,'smile'),(333,46,46,'smile'),(334,32,46,'heart'),(335,31,46,'laugh'),(336,30,46,'heart'),(337,59,51,'smile'),(338,46,51,'heart'),(339,32,51,'smile'),(340,31,51,'laugh'),(341,30,51,'heart'),(342,30,51,'smile'),(403,59,36,'smile'),(405,59,36,'heart'),(408,59,36,'laugh');
/*!40000 ALTER TABLE `reactions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-09 15:05:26
