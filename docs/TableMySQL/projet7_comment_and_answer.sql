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
-- Table structure for table `comment_and_answer`
--

DROP TABLE IF EXISTS `comment_and_answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment_and_answer` (
  `id_comment_and_answer` int NOT NULL AUTO_INCREMENT,
  `comment` mediumtext,
  `answer` tinytext,
  `user_id` int NOT NULL,
  `date_posted` varchar(255) NOT NULL,
  `parent_id` int NOT NULL,
  `parent_id_answer` int DEFAULT NULL,
  PRIMARY KEY (`id_comment_and_answer`),
  KEY `id_publication_idx` (`parent_id`),
  KEY `_idx` (`parent_id`),
  KEY `id_idx` (`user_id`),
  CONSTRAINT `id_utilisateur` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `publications_posts` FOREIGN KEY (`parent_id`) REFERENCES `publications` (`id_publication`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_and_answer`
--

LOCK TABLES `comment_and_answer` WRITE;
/*!40000 ALTER TABLE `comment_and_answer` DISABLE KEYS */;
INSERT INTO `comment_and_answer` VALUES (83,'Waow magnifique','none',37,'mercredi 07 juillet 2021, 11:05',59,NULL),(84,'Quelles couleurs !','none',37,'mercredi 07 juillet 2021, 11:06',59,NULL),(85,'none','J\'adore oui !',41,'mercredi 07 juillet 2021, 11:06',59,84),(86,'none','Merci, je n\'y suis pour rien ^^',41,'mercredi 07 juillet 2021, 11:06',59,83),(87,'Quelqu\'un pourrait me dire la variété de fleur svp ?','none',41,'mercredi 07 juillet 2021, 11:07',59,NULL),(88,'Quel appareil photo utilises tu ?','none',36,'mercredi 07 juillet 2021, 11:07',59,NULL),(89,'none','Je vais faire des recherches ;)',36,'mercredi 07 juillet 2021, 11:08',59,87),(90,'none','J\'aurais pas dit mieux !',36,'mercredi 07 juillet 2021, 11:08',59,84),(91,'Pal mal !','none',36,'mercredi 07 juillet 2021, 15:18',46,NULL);
/*!40000 ALTER TABLE `comment_and_answer` ENABLE KEYS */;
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
