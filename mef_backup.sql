-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: mef
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `adempimenti`
--

DROP TABLE IF EXISTS `adempimenti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adempimenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(300) NOT NULL,
  `ente` varchar(150) NOT NULL DEFAULT '',
  `periodo` varchar(100) NOT NULL DEFAULT '',
  `data_scadenza` date DEFAULT NULL,
  `incaricato` varchar(100) NOT NULL DEFAULT '',
  `stato` enum('da_fare','in_corso','completato','n_a') NOT NULL DEFAULT 'da_fare',
  `anno` smallint NOT NULL,
  `ricorrente` tinyint(1) NOT NULL DEFAULT '1',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adempimenti`
--

LOCK TABLES `adempimenti` WRITE;
/*!40000 ALTER TABLE `adempimenti` DISABLE KEYS */;
INSERT INTO `adempimenti` VALUES (1,'aaaaaaaaaaaaa','entr','30 aprile','2026-04-30','comm','n_a',2026,1,'ddddddddddddd','2026-04-10 20:44:29'),(2,'aaaaaaaaaaaaa','entr','30 aprile','2026-04-30','comm','da_fare',2027,1,'ddddddddddddd','2026-04-10 20:44:34');
/*!40000 ALTER TABLE `adempimenti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_settings`
--

DROP TABLE IF EXISTS `app_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_settings` (
  `id` int NOT NULL DEFAULT '1',
  `data` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_settings`
--

LOCK TABLES `app_settings` WRITE;
/*!40000 ALTER TABLE `app_settings` DISABLE KEYS */;
INSERT INTO `app_settings` VALUES (1,'{\"pageBg\": {\"a\": 60, \"b\": 234, \"g\": 234, \"r\": 234}, \"footerBg\": {\"a\": 100, \"b\": 47, \"g\": 0, \"r\": 63}, \"headerBg\": {\"a\": 100, \"b\": 0, \"g\": 0, \"r\": 0}, \"pageBgMode\": \"rgb\", \"bannerTesto\": \"Attenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\nAttenzione: Versione di TEST non funzionante *  *  *  *  * \\r\\n\", \"footerBgMode\": \"silver_d\", \"headerBgMode\": \"rgb\", \"manutenzione\": false, \"disabledPages\": [2119, 212, 2120, 213, 214, 215, 216, 217, 2171, 218, 219, 2201, 2202, 2203, 221, 222, 2221, 2222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272], \"bannerAbilitato\": true, \"bannerCircolare\": true, \"rolePermissions\": {\"email\": [27, 32], \"cliente\": [50, 51, 52, 53, 55], \"operaio\": [27], \"direttore\": [27], \"magazzino\": [16, 27], \"marketing\": [27, 29], \"venditore\": [27, 24, 23, 25, 26], \"dipendente\": [17, 27, 21, 35, 28, 60, 61], \"ragioniere\": [27, 21], \"commercialista\": [18, 22, 27]}, \"countdownSeconds\": 10, \"inactivityMinutes\": 20, \"loginClientiDisabilitato\": false, \"registrazioniDisabilitate\": false, \"loginDipendentiDisabilitato\": false}');
/*!40000 ALTER TABLE `app_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avvisi`
--

DROP TABLE IF EXISTS `avvisi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avvisi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `testo` text NOT NULL,
  `letto` tinyint(1) NOT NULL DEFAULT '0',
  `cestinato` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `oggetto` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avvisi`
--

LOCK TABLES `avvisi` WRITE;
/*!40000 ALTER TABLE `avvisi` DISABLE KEYS */;
INSERT INTO `avvisi` VALUES (39,1,'DIGI Home Design nasce da oltre 60 anni di esperienza nel settore della lavorazione del ferro e dell\'acciaio, avviata nei primi anni \'60 e proseguita, nei primi anni \'80, nel mondo dei serramenti.',1,0,'2026-06-07 20:49:27','test');
/*!40000 ALTER TABLE `avvisi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cantieri`
--

DROP TABLE IF EXISTS `cantieri`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cantieri` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `titolo` varchar(200) NOT NULL,
  `indirizzo` varchar(300) NOT NULL DEFAULT '',
  `stato` enum('preventivo','in_corso','completato','sospeso') NOT NULL DEFAULT 'preventivo',
  `inizio_lavori` date DEFAULT NULL,
  `fine_lavori` date DEFAULT NULL,
  `note_pubbliche` text,
  `note_interne` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `data_preventivo` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri`
--

LOCK TABLES `cantieri` WRITE;
/*!40000 ALTER TABLE `cantieri` DISABLE KEYS */;
INSERT INTO `cantieri` VALUES (1,1,'bagno e cucina','via cazzalora 3 palermo','preventivo','2025-01-01',NULL,'ddddddddddddd','ccccccc','2026-04-10 21:50:22',1,NULL),(2,1,'fffffffffffffff','via cangelosi 48, 2','in_corso',NULL,NULL,'ttttttt','yyyyyy','2026-04-10 21:50:54',1,NULL);
/*!40000 ALTER TABLE `cantieri` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cantieri_lavori`
--

DROP TABLE IF EXISTS `cantieri_lavori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cantieri_lavori` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantiere_id` int NOT NULL,
  `descrizione` varchar(300) NOT NULL,
  `qta` decimal(10,2) NOT NULL DEFAULT '1.00',
  `unita` varchar(20) NOT NULL DEFAULT 'cad',
  `prezzo_unit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sconto_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `totale` decimal(10,2) GENERATED ALWAYS AS (((`qta` * `prezzo_unit`) * (1 - (`sconto_pct` / 100)))) STORED,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `data_inizio` date DEFAULT NULL,
  `data_fine` date DEFAULT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `stato` enum('da_fare','in_corso','completato','sospeso') NOT NULL DEFAULT 'da_fare',
  PRIMARY KEY (`id`),
  KEY `cantiere_id` (`cantiere_id`),
  CONSTRAINT `cantieri_lavori_ibfk_1` FOREIGN KEY (`cantiere_id`) REFERENCES `cantieri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri_lavori`
--

LOCK TABLES `cantieri_lavori` WRITE;
/*!40000 ALTER TABLE `cantieri_lavori` DISABLE KEYS */;
INSERT INTO `cantieri_lavori` (`id`, `cantiere_id`, `descrizione`, `qta`, `unita`, `prezzo_unit`, `sconto_pct`, `visibile_cliente`, `data_inizio`, `data_fine`, `note`, `created_at`, `stato`) VALUES (2,2,'mazzetto',1.00,'cad',0.00,0.00,1,'2025-05-04',NULL,NULL,'2026-06-04 19:53:57','in_corso');
/*!40000 ALTER TABLE `cantieri_lavori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cantieri_media`
--

DROP TABLE IF EXISTS `cantieri_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cantieri_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cantiere_id` int DEFAULT NULL,
  `tipo` enum('foto','video') NOT NULL DEFAULT 'foto',
  `filename` varchar(255) NOT NULL,
  `descrizione` varchar(200) DEFAULT NULL,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `task_id` int DEFAULT NULL,
  `visto` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cantiere_id` (`cantiere_id`),
  CONSTRAINT `cantieri_media_ibfk_1` FOREIGN KEY (`cantiere_id`) REFERENCES `cantieri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri_media`
--

LOCK TABLES `cantieri_media` WRITE;
/*!40000 ALTER TABLE `cantieri_media` DISABLE KEYS */;
INSERT INTO `cantieri_media` VALUES (1,2,'foto','1776110747546_DSC00421.JPG','albano',1,'2026-04-13 20:05:47',NULL,0),(2,2,'foto','1780595217004_Nuova_immagine_bitmap.bmp','nnnnnnnnnnnn',1,'2026-06-04 17:46:57',NULL,0),(3,NULL,'foto','1780602894113_DIGIHOMEDESIGN.png',NULL,1,'2026-06-04 19:54:54',2,1),(4,NULL,'foto','1780602909238_DIGIHOMEDESIGN2222222222.png',NULL,1,'2026-06-04 19:55:09',2,1),(5,NULL,'foto','1780602923294_diff_pdf.bmp',NULL,1,'2026-06-04 19:55:23',2,1),(6,NULL,'video','1780604562666_VID-20230329-WA0002.mp4',NULL,1,'2026-06-04 20:22:42',2,1);
/*!40000 ALTER TABLE `cantieri_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_categorie`
--

DROP TABLE IF EXISTS `catalogo_categorie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_categorie` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ordine` int NOT NULL DEFAULT '0',
  `listino_categoria` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_categorie`
--

LOCK TABLES `catalogo_categorie` WRITE;
/*!40000 ALTER TABLE `catalogo_categorie` DISABLE KEYS */;
INSERT INTO `catalogo_categorie` VALUES (6,'Infissi in alluminio',6,NULL),(8,'Infissi in PVC',7,NULL),(9,'Verande in Alluminio',8,NULL),(10,'Persiane in Alluminio',9,NULL),(11,'Cassonetti',10,NULL),(12,'Zanzariere',11,NULL),(13,'Tapparelle',12,NULL),(14,'Porte corazzate',13,NULL),(15,'Quadri',14,NULL);
/*!40000 ALTER TABLE `catalogo_categorie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_voci`
--

DROP TABLE IF EXISTS `catalogo_voci`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_voci` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `nome` varchar(200) NOT NULL,
  `pdf_filename` varchar(255) NOT NULL,
  `pdf_label` varchar(200) NOT NULL DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `serie` varchar(200) NOT NULL DEFAULT '',
  `descrizione` text,
  `listino_categoria` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `catalogo_voci_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `catalogo_categorie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_voci`
--

LOCK TABLES `catalogo_voci` WRITE;
/*!40000 ALTER TABLE `catalogo_voci` DISABLE KEYS */;
INSERT INTO `catalogo_voci` VALUES (12,6,'ALSistem','1777556466087_ALsistem-3G.pdf','2026','2026-04-30 13:41:06','3G SYSTEM REVOLUTION','3G è un sistema per serramenti a taglio termico con ridottissima mostra architettonica.\r\nL’innovativo sistema a tripla guarnizione conferisce un alto isolamento termico/acustico e dona una maggiore luminosità agli ambienti.\r\nGamma di profili che comprende le soluzioni: finestra, portafinestra, wasistas in versione fermavetro e vetro ad inflare\r\n\r\n- Serie battente a taglio termico marcata CE\r\n- Sezione telaio 62 mm\r\n- Sezione anta 69 mm\r\n- Mostra architettonica nodo laterale 75 mm\r\n- Mostra architettonica nodo centrale 97 mm\r\n- Sistema di tenuta a tripla battuta\r\n- Sistema di isolamento termico con barrette ThermAL di nuova generazione\r\n- Ferramenta originale certifcata fno a 170kg di portata\r\n- Alto isolamento termico e acustico\r\n- Design minimale','Infissi in alluminio'),(14,6,'due','1779339812555_Dipinti_a_mano.pdf','2026','2026-05-21 05:03:32','tre',NULL,'Infissi in alluminio BOBO'),(15,6,'tre','1779348587069_Dipinti_a_mano.pdf','ttt','2026-05-21 07:29:47','rrr',NULL,NULL),(16,14,'Pantaleo','1780111245799_Dipinti_a_mano.pdf','2026','2026-05-29 17:26:36','Lamiera piegata','',NULL),(17,15,'Monet','1780115658812_Dipinti_a_mano.pdf','Generico','2026-05-30 04:34:18','Generico',NULL,'Quadri');
/*!40000 ALTER TABLE `catalogo_voci` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clienti`
--

DROP TABLE IF EXISTS `clienti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clienti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('fisica','giuridica') NOT NULL DEFAULT 'fisica',
  `nome` varchar(100) NOT NULL DEFAULT '',
  `cognome` varchar(100) NOT NULL DEFAULT '',
  `ragione_sociale` varchar(255) NOT NULL DEFAULT '',
  `indirizzo` varchar(255) NOT NULL DEFAULT '',
  `telefono` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(150) NOT NULL DEFAULT '',
  `pec` varchar(150) NOT NULL DEFAULT '',
  `codice_sdi` varchar(7) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `codice_fiscale` varchar(16) NOT NULL DEFAULT '',
  `partita_iva` varchar(11) NOT NULL DEFAULT '',
  `sconto_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `utente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienti`
--

LOCK TABLES `clienti` WRITE;
/*!40000 ALTER TABLE `clienti` DISABLE KEYS */;
INSERT INTO `clienti` VALUES (1,'fisica','leonardo','di giovanni','','via ernesto lugaro, 2','+3934765468185','leonardodigiovanni@tiscali.it','leonardodigiovanni@tiscali.it','httttt','2026-04-02 23:52:31','DGVLRD72T23G273I','',6.00,NULL),(2,'giuridica','','','palm inc srl','via Roberto Antiochia 3, 2','+393279991927','sd1927@libero.it','sd1927@libero.it','ghghgh','2026-04-02 23:53:01','','05555555555',10.00,NULL),(3,'fisica','cliente3','cliente3','','','3334444447','cliente3@libero.it','','','2026-05-17 09:46:13','','',5.00,18),(4,'fisica','cliente4','cliente4','','','3443333337','cliente4@libero.it','','','2026-05-17 09:59:27','','',5.00,19),(5,'fisica','aaa','aaa','','','3456789098','aaa@aaa.it','','','2026-05-18 07:11:25','','',5.00,20);
/*!40000 ALTER TABLE `clienti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contatto_otp`
--

DROP TABLE IF EXISTS `contatto_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contatto_otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cellulare` varchar(20) NOT NULL,
  `codice` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contatto_otp`
--

LOCK TABLES `contatto_otp` WRITE;
/*!40000 ALTER TABLE `contatto_otp` DISABLE KEYS */;
INSERT INTO `contatto_otp` VALUES (4,'3513322676','562999','2026-04-26 10:25:12','2026-04-26 08:15:12');
/*!40000 ALTER TABLE `contatto_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documenti_cliente`
--

DROP TABLE IF EXISTS `documenti_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documenti_cliente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `titolo` varchar(200) NOT NULL,
  `tipo` varchar(50) NOT NULL DEFAULT 'generico',
  `filename` varchar(255) NOT NULL,
  `note` text,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenti_cliente`
--

LOCK TABLES `documenti_cliente` WRITE;
/*!40000 ALTER TABLE `documenti_cliente` DISABLE KEYS */;
INSERT INTO `documenti_cliente` VALUES (1,1,'fffffffffffffff','generico','1780246509078_Dipinti_a_mano.pdf',NULL,1,'2026-05-31 16:55:09'),(2,1,'bagno','generico','1780247346426_chat-seo-trascrizione.pdf',NULL,1,'2026-05-31 17:09:06');
/*!40000 ALTER TABLE `documenti_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documenti_interni`
--

DROP TABLE IF EXISTS `documenti_interni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documenti_interni` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sezione` varchar(20) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `categoria` varchar(100) NOT NULL DEFAULT '',
  `filename` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL DEFAULT '',
  `size_bytes` int NOT NULL DEFAULT '0',
  `uploaded_by` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenti_interni`
--

LOCK TABLES `documenti_interni` WRITE;
/*!40000 ALTER TABLE `documenti_interni` DISABLE KEYS */;
INSERT INTO `documenti_interni` VALUES (2,'archivio','test','Contratti','1775321609961_omi_antiochia_omi.pdf','application/pdf',377246,'admin1','2026-04-04 18:53:29'),(3,'facsimile','esempio contrattino con clausole','Preventivi','1776110987433_Sciortino_10112024.pdf','application/pdf',308976,'admin1','2026-04-13 22:09:47');
/*!40000 ALTER TABLE `documenti_interni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_inbox`
--

DROP TABLE IF EXISTS `email_inbox`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_inbox` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) NOT NULL,
  `oggetto` varchar(255) NOT NULL,
  `corpo` text NOT NULL,
  `letto` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=435 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_inbox`
--

LOCK TABLES `email_inbox` WRITE;
/*!40000 ALTER TABLE `email_inbox` DISABLE KEYS */;
/*!40000 ALTER TABLE `email_inbox` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fatture`
--

DROP TABLE IF EXISTS `fatture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fatture` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('attiva','passiva') NOT NULL,
  `numero` varchar(50) NOT NULL,
  `data` date NOT NULL,
  `controparte` varchar(200) NOT NULL,
  `importo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `iva` decimal(5,2) NOT NULL DEFAULT '22.00',
  `totale` decimal(10,2) GENERATED ALWAYS AS ((`importo` + ((`importo` * `iva`) / 100))) STORED,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `importo_pagato` decimal(10,2) NOT NULL DEFAULT '0.00',
  `cliente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fatture`
--

LOCK TABLES `fatture` WRITE;
/*!40000 ALTER TABLE `fatture` DISABLE KEYS */;
INSERT INTO `fatture` (`id`, `tipo`, `numero`, `data`, `controparte`, `importo`, `iva`, `note`, `created_at`, `importo_pagato`, `cliente_id`) VALUES (1,'attiva','1/2026','2026-04-10','aaaaaaaaaaaaa',3.00,22.00,'aaaaaaaaaaaaaaaa','2026-04-10 18:48:15',0.00,NULL),(2,'attiva','2/2026','2026-04-10','eedddd',4.00,22.00,'rrrrrrrrrrrrrrrr','2026-04-10 18:49:48',0.00,NULL),(3,'passiva','333','2026-04-10','frfrfr',400.00,22.00,'hhhhhhhhhhhhhhh','2026-04-10 19:28:17',488.00,NULL);
/*!40000 ALTER TABLE `fatture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornitori`
--

DROP TABLE IF EXISTS `fornitori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornitori` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ragione_sociale` varchar(255) NOT NULL,
  `indirizzo` varchar(255) NOT NULL DEFAULT '',
  `telefono` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(150) NOT NULL DEFAULT '',
  `pec` varchar(150) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornitori`
--

LOCK TABLES `fornitori` WRITE;
/*!40000 ALTER TABLE `fornitori` DISABLE KEYS */;
INSERT INTO `fornitori` VALUES (2,'Alpha S.R.L.','Via Alloro 11, 90100 Palermo','091.11111111','alpha@libero.it','alpha@pec.it','2026-04-28 22:45:22'),(3,'Beta S.R.L.','Via Barnabei 22, 90100 Palermo','091.22222222','beta@libero.it','beta@pec.it','2026-04-28 22:46:43'),(4,'Gamma S.N.C.','Via Cessato 33, 90100 Palermo','091.33333333','gamma@libero.it','gamma@pec.it','2026-04-28 22:48:14'),(5,'www.ArtePerTutti.it','Via Caspiterina 12, Milano','0299999999','info@artepertutti.it','','2026-04-29 14:42:58'),(6,'EDIL SIDER S.P.A.','Via B. Croce, 26 Alcamo (TP)','0924.21588','servizioclienti@edilsiderspa.it','','2026-04-30 15:46:53');
/*!40000 ALTER TABLE `fornitori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listini`
--

DROP TABLE IF EXISTS `listini`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listini` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria` varchar(100) NOT NULL,
  `produttore` varchar(100) NOT NULL DEFAULT '',
  `descrizione` varchar(300) NOT NULL,
  `unita` varchar(30) NOT NULL,
  `prezzo_acquisto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prezzo_vendita` decimal(10,2) NOT NULL DEFAULT '0.00',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `disponibile` tinyint(1) NOT NULL DEFAULT '1',
  `preventivabile` tinyint(1) NOT NULL DEFAULT '1',
  `foto_url` varchar(500) DEFAULT NULL,
  `profilo_frontale_mm` decimal(6,2) DEFAULT NULL,
  `profilo_profondita_mm` decimal(6,2) DEFAULT NULL,
  `trasmittanza_uw` decimal(5,3) DEFAULT NULL,
  `fornitore_id` int DEFAULT NULL,
  `acquistabile` tinyint(1) NOT NULL DEFAULT '0',
  `max_acquistabile` int DEFAULT NULL,
  `sconto_articolo` decimal(5,2) NOT NULL DEFAULT '0.00',
  `schema_url` varchar(500) DEFAULT NULL,
  `serie` varchar(200) NOT NULL DEFAULT '',
  `principale` tinyint(1) NOT NULL DEFAULT '1',
  `caratteristica` tinyint(1) NOT NULL DEFAULT '1',
  `richiede_larghezza` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_altezza` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_quantita` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_piano` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_km` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_peso` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_tipo_colore` tinyint(1) NOT NULL DEFAULT '0',
  `richiede_tipo_vetro` tinyint(1) NOT NULL DEFAULT '0',
  `costante` decimal(10,4) NOT NULL DEFAULT '0.0000',
  `abbr` varchar(255) NOT NULL DEFAULT '',
  `richiede_tipo_montaggio` tinyint(1) NOT NULL DEFAULT '0',
  `minimo` decimal(10,4) DEFAULT NULL,
  `richiede_tipo_colore_acc` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listini`
--

LOCK TABLES `listini` WRITE;
/*!40000 ALTER TABLE `listini` DISABLE KEYS */;
INSERT INTO `listini` VALUES (13,'Trasporto','Generico','Trasporto gommato','pz',100.00,120.00,'','2026-04-30 09:33:16','2026-05-25 23:33:32',1,1,'/listini/13-foto-1777574599968.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,0,0,0,0,0,0.0000,'',0,NULL,0),(14,'Trasporto','Generico','Supplemento Trasporto gommato fuori il comune di Palermo','Km',10.00,20.00,'','2026-04-30 09:35:22','2026-05-25 23:33:31',1,1,'/listini/14-foto-1777574605720.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,0,1,0,0,0,0.0000,'',0,NULL,0),(15,'Trasporto','Generico','Supplemento Piano (senza ascensore)','Piano',5.00,10.00,'','2026-04-30 09:39:30','2026-05-25 23:33:30',1,1,'/listini/15-foto-1777574747410.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,1,0,0,0,0,0.0000,'',0,NULL,0),(16,'Spedizione','Generico','Spedizione con corriere DHL','kg',2.00,3.00,'','2026-04-30 09:42:16','2026-05-30 05:50:32',1,1,'/listini/16-foto-1777562061298.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,0,0,1,0,0,0.0000,'',0,NULL,0),(17,'Montaggio','Generico','Montaggio e siggillatura porta o finestra alluminio/PVC','pz',10.00,80.00,'','2026-04-30 13:18:31','2026-05-25 23:33:26',1,1,'/listini/17-foto-1777572933718.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,0,0,0,0,0,0.0000,'',0,NULL,0),(18,'Montaggio','Generico','Montaggio Porta Blindata con falsotelaio','pz',200.00,300.00,'','2026-04-30 13:19:55','2026-05-25 23:33:27',1,1,'/listini/18-foto-1777573280604.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'',1,0,0,0,1,0,0,0,0,0,0.0000,'',0,NULL,0),(19,'Montaggio','Generico','Montaggio Porta Blindata senza falsotelaio','pz',10.00,100.00,'','2026-04-30 13:21:15','2026-05-25 23:33:27',1,1,'/listini/19-foto-1777573292348.png',NULL,NULL,NULL,NULL,0,NULL,10.00,NULL,'',1,0,0,0,1,0,0,0,0,0,0.0000,'',0,NULL,0),(20,'Infissi in alluminio','ALSistem','fisso','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:50:57','2026-06-05 03:43:26',1,1,'/listini/20-foto-1777559024945.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/20-schema-1777558932766.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'Tc(F())',1,2.0000,1),(21,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:52:09','2026-06-05 03:42:37',1,1,'/listini/21-foto-1777558993079.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/21-schema-1777559087308.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(mAc(F()))',1,2.0000,1),(22,'Infissi in alluminio','ALSistem','finestra 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:54:11','2026-06-05 03:42:58',1,1,'/listini/22-foto-1777559012008.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/22-schema-1777559252330.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(cA(F())+mAc(F()))',1,2.0000,1),(23,'Infissi in alluminio','ALSistem','finestra 3 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:54:56','2026-06-05 03:43:05',1,1,'/listini/23-foto-1777559014604.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/23-schema-1777559279056.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(cA(F())+mAc(F())+Ac(F()))',1,2.0000,1),(24,'Infissi in alluminio','ALSistem','finestra abbinata 1 anta + 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:55:53','2026-06-05 03:43:19',1,1,'/listini/24-foto-1777559022197.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/24-schema-1777559120249.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(x(cAm(F()))+P+120(cA(F())+mAc(F())))',1,2.0000,1),(25,'Infissi in alluminio','ALSistem','finestra 4 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:56:54','2026-06-05 03:43:12',1,1,'/listini/25-foto-1777559019124.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/25-schema-1777559239586.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(cA(F())+cA(F())+mAc(F())+Ac(F()))',1,2.0000,1),(26,'Infissi in alluminio','ALSistem','vasistas','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:57:45','2026-06-05 03:43:54',1,1,'/listini/26-foto-1777559039792.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/26-schema-1777559318516.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(V(F()))',1,2.0000,1),(27,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta + fisso laterale','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:58:11','2026-06-05 03:42:45',1,1,'/listini/27-foto-1777559001980.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/27-schema-1777842826541.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(X(F())+P+80(mAc(F())))',1,2.0000,1),(28,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta + fisso sopraluce','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:58:43','2026-06-05 03:42:51',1,1,'/listini/28-foto-1777559008013.png',80.00,80.00,1.500,6,0,NULL,10.00,'/listini/28-schema-1777842836969.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(X(F())+T+120(mAc(F())))',1,2.0000,1),(29,'Infissi in alluminio','ALSistem','porta finestra 1 anta ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:59:12','2026-06-05 03:43:34',1,1,'/listini/29-foto-1777559028666.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/29-schema-1777559304133.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(mAc(F()+T+70(F())))',1,2.0000,1),(30,'Infissi in alluminio','ALSistem','porta finestra 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:59:54','2026-06-05 03:43:41',1,1,'/listini/30-foto-1777559032613.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/30-schema-1777559177398.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(cA(F()+T+70(F()))+mAc(F()+T+70(F())))',1,2.0000,1),(31,'Infissi in alluminio','ALSistem','porta finestra 3 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 14:00:22','2026-06-05 03:43:47',1,1,'/listini/31-foto-1777559036855.png',80.00,80.00,2.000,6,0,NULL,10.00,'/listini/31-schema-1777559200698.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'Tc(cA(F()+T+70(F()))+mAc(F()+T+70(F()))+Ac(F()+T+70(F())))',1,2.0000,1),(32,'Infissi in alluminio','ALSistem','Colore RAL 9010','--',0.00,0.00,'','2026-04-30 22:45:27','2026-05-25 23:33:11',1,1,'/listini/32-foto-1779710699897.png',NULL,NULL,NULL,6,0,NULL,-10.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,'',0,NULL,0),(33,'Infissi in alluminio','ALSistem','Colore RAL 9001','--',0.00,0.00,'','2026-04-30 22:46:37','2026-05-25 23:33:09',1,1,'/listini/33-foto-1779734722636.png',NULL,NULL,NULL,6,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,'',0,NULL,0),(34,'Infissi in alluminio','Vetro','Vetro 8-12-8 B.E.','m²',40.00,60.00,'','2026-04-30 22:48:40','2026-05-25 23:33:24',1,1,'/listini/34-foto-1779604282187.png',NULL,28.00,1.000,NULL,0,NULL,3.00,NULL,'Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,'',0,NULL,0),(35,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6','m²',45.00,66.00,'','2026-04-30 22:50:41','2026-05-25 23:33:22',1,1,'/listini/35-foto-1779604275067.png',NULL,30.00,1.000,NULL,0,NULL,0.00,NULL,'Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,'',0,NULL,0),(36,'Infissi in alluminio','Vetro','Nessun vetro','m²',0.00,0.00,'','2026-05-03 17:48:40','2026-05-25 23:33:21',1,1,'/listini/36-foto-1779604393718.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,'',0,NULL,0),(37,'Infissi in alluminio','ALSistem','Colore RAL 9070','--',0.00,0.00,'','2026-05-03 19:26:17','2026-05-25 23:33:12',1,1,'/listini/37-foto-1779599360774.png',NULL,NULL,NULL,6,0,NULL,-15.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,'',0,NULL,0),(38,'Infissi in alluminio','ALSistem','Colore RAL 9002','--',0.00,0.00,'','2026-05-03 19:31:54','2026-05-25 23:33:10',1,1,'/listini/38-foto-1779734717401.png',NULL,NULL,NULL,6,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,'',0,NULL,0),(40,'Infissi in alluminio BOBO','BOBO','finestra 1 anta ribalta','m²',99.00,122.00,'','2026-05-20 20:50:03','2026-05-25 23:39:20',1,1,'/listini/40-foto-1779734578806.png',77.00,66.00,1.000,NULL,0,NULL,0.00,NULL,'AXS33',1,0,1,1,1,0,0,0,1,1,0.0000,'R',1,NULL,0),(41,'Infissi in alluminio','ALSistem','Nessun montaggio','pz',0.00,0.00,'','2026-05-21 18:22:30','2026-05-25 23:33:16',1,1,'/listini/41-foto-1779604340560.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,0,0,0.0000,'',1,NULL,0),(42,'Infissi in alluminio','ALSistem','Montaggio e sigillatura','pz',3.00,50.00,'','2026-05-21 18:23:29','2026-05-25 23:33:15',1,1,'/listini/42-foto-1779387858862.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,0,0,0.0000,'',1,NULL,0),(43,'Infissi in alluminio','ALSistem','Colore accessori NERO','m²',0.00,0.00,'','2026-05-24 05:47:00','2026-05-25 23:33:08',1,1,'/listini/43-foto-1779602167291.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,0,0,0.0000,'',0,NULL,1),(44,'Infissi in alluminio','ALSistem','Colore accessori BIANCO','m²',0.00,0.00,'','2026-05-24 05:47:38','2026-05-25 23:33:07',1,1,'/listini/44-foto-1779602189764.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,0,0,0.0000,'',0,NULL,1),(45,'Porte corazzate','Pantaleo','Porta con lamiera piegata','pz',1000.00,2000.00,'','2026-05-29 17:29:18','2026-05-30 03:38:10',1,1,'/listini/45-foto-1780112290690.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'Generico',1,0,1,1,1,0,0,0,0,0,0.0000,'',1,NULL,0),(46,'Porte corazzate','Pantaleo','Montaggio con falsotelaio','pz',80.00,100.00,'','2026-05-30 03:22:48','2026-05-30 03:29:15',1,1,'/listini/46-foto-1780111755877.png',NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'Generico',0,1,0,0,0,0,0,0,0,0,0.0000,'',1,NULL,0),(47,'Quadri','Monet','L\'urlo','pz',100000.00,120000.00,'','2026-05-30 04:37:48','2026-05-30 13:12:54',1,1,'/listini/47-foto-1780116016319.png',NULL,NULL,NULL,NULL,1,2,0.00,NULL,'Monet',1,0,0,0,1,0,0,0,0,0,0.0000,'',1,NULL,0),(48,'Quadri','Monet','Cornice','pz',0.00,50.00,'','2026-05-30 12:45:26','2026-05-30 12:45:44',1,1,NULL,NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'Monet',0,1,0,0,0,0,0,0,0,0,0.0000,'',1,NULL,0);
/*!40000 ALTER TABLE `listini` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `magazzino`
--

DROP TABLE IF EXISTS `magazzino`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `magazzino` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descrizione` varchar(255) NOT NULL,
  `produttore` varchar(100) NOT NULL,
  `modello` varchar(100) NOT NULL,
  `costo_unitario` decimal(10,2) NOT NULL,
  `tipo_unita` varchar(50) NOT NULL,
  `giacenza` decimal(10,2) NOT NULL DEFAULT '0.00',
  `totale_caricato` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `colore` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `magazzino`
--

LOCK TABLES `magazzino` WRITE;
/*!40000 ALTER TABLE `magazzino` DISABLE KEYS */;
INSERT INTO `magazzino` VALUES (1,'anta infisso','sider','S75',15.00,'kg',1.00,7.00,'2026-04-02 21:46:22','2026-04-02 21:58:48',''),(2,'telaio','sider','S75',12.00,'kg',3.00,5.00,'2026-04-02 21:46:52','2026-04-02 21:58:52',''),(3,'cerniere nc40','azzz','nc 40',1.00,'pz',100.00,100.00,'2026-04-02 21:59:37','2026-04-02 21:59:44','');
/*!40000 ALTER TABLE `magazzino` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marketing`
--

DROP TABLE IF EXISTS `marketing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marketing` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(100) NOT NULL,
  `titolo` varchar(200) NOT NULL,
  `periodo` varchar(100) NOT NULL DEFAULT '',
  `immagine` varchar(255) DEFAULT NULL,
  `video` varchar(255) DEFAULT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marketing`
--

LOCK TABLES `marketing` WRITE;
/*!40000 ALTER TABLE `marketing` DISABLE KEYS */;
/*!40000 ALTER TABLE `marketing` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimenti_contabili`
--

DROP TABLE IF EXISTS `movimenti_contabili`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimenti_contabili` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` date NOT NULL,
  `anno` int NOT NULL,
  `tipo` enum('entrata','uscita') NOT NULL,
  `sezione_ce` varchar(100) NOT NULL,
  `sezione_sp` varchar(100) NOT NULL,
  `descrizione` text,
  `importo` decimal(10,2) NOT NULL,
  `created_by` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimenti_contabili`
--

LOCK TABLES `movimenti_contabili` WRITE;
/*!40000 ALTER TABLE `movimenti_contabili` DISABLE KEYS */;
INSERT INTO `movimenti_contabili` VALUES (1,'2026-04-01',2026,'uscita','Servizi','Debiti','lexdo.it',120.00,'admin1','2026-04-08 20:59:45'),(4,'2026-04-08',2026,'entrata','Ricavi delle vendite','Disponibilità liquide','lexdo.it',2.00,'admin1','2026-04-08 21:09:54');
/*!40000 ALTER TABLE `movimenti_contabili` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_acquisti`
--

DROP TABLE IF EXISTS `ordini_acquisti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_acquisti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `stripe_session_id` varchar(200) NOT NULL DEFAULT '',
  `username` varchar(100) NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `status` enum('pending','paid','cancelled','expired') NOT NULL DEFAULT 'pending',
  `totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `articoli_json` text NOT NULL,
  `data` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `note` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_session` (`stripe_session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_acquisti`
--

LOCK TABLES `ordini_acquisti` WRITE;
/*!40000 ALTER TABLE `ordini_acquisti` DISABLE KEYS */;
INSERT INTO `ordini_acquisti` VALUES (1,'','formicus',1,'pending',3914.00,'[{\"listino_id\":12,\"categoria\":\"Quadri\",\"produttore\":\"Artisti vari\",\"descrizione\":\"Ombre sul Mare\",\"unita\":\"pz\",\"prezzo_vendita\":3914,\"quantita\":1,\"larghezza_cm\":0,\"altezza_cm\":0,\"colore\":\"\",\"note\":\"\",\"subtotale\":3914}]','2026-04-30 02:15:32',NULL);
/*!40000 ALTER TABLE `ordini_acquisti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_clienti`
--

DROP TABLE IF EXISTS `ordini_clienti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_clienti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(50) NOT NULL DEFAULT '',
  `tipo` enum('preventivo','acquisto') NOT NULL DEFAULT 'preventivo',
  `cliente_id` int DEFAULT NULL,
  `data_ordine` date NOT NULL,
  `importo_totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `source_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sconto_cli_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_clienti`
--

LOCK TABLES `ordini_clienti` WRITE;
/*!40000 ALTER TABLE `ordini_clienti` DISABLE KEYS */;
INSERT INTO `ordini_clienti` VALUES (4,'20260605-000100','preventivo',1,'2026-06-04',450.37,100,'2026-06-05 06:28:59',6.00,1),(5,'20260605-000110','preventivo',1,'2026-06-04',1312.27,110,'2026-06-05 18:27:20',7.00,1);
/*!40000 ALTER TABLE `ordini_clienti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_clienti_articoli`
--

DROP TABLE IF EXISTS `ordini_clienti_articoli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_clienti_articoli` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordine_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `tipo_riga` enum('articolo','caratteristica') NOT NULL DEFAULT 'articolo',
  `categoria` varchar(100) NOT NULL DEFAULT '',
  `produttore` varchar(100) NOT NULL DEFAULT '',
  `serie` varchar(100) NOT NULL DEFAULT '',
  `descrizione` text NOT NULL,
  `unita` varchar(30) NOT NULL DEFAULT 'pz',
  `quantita` decimal(10,2) NOT NULL DEFAULT '1.00',
  `larghezza_cm` decimal(7,2) NOT NULL DEFAULT '0.00',
  `altezza_cm` decimal(7,2) NOT NULL DEFAULT '0.00',
  `n_ante` int NOT NULL DEFAULT '1',
  `colore` varchar(100) NOT NULL DEFAULT '',
  `prezzo_unit` decimal(10,2) NOT NULL DEFAULT '0.00',
  `sconto_art_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `sconto_cli_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prezzo_lordo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `abbr` varchar(30) NOT NULL DEFAULT '',
  `profilo_mm` decimal(5,1) NOT NULL DEFAULT '0.0',
  `foto_url` varchar(255) NOT NULL DEFAULT '',
  `bar_color` varchar(20) DEFAULT NULL,
  `bar_color_acc` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ordine_id` (`ordine_id`),
  CONSTRAINT `ordini_clienti_articoli_ibfk_1` FOREIGN KEY (`ordine_id`) REFERENCES `ordini_clienti` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_clienti_articoli`
--

LOCK TABLES `ordini_clienti_articoli` WRITE;
/*!40000 ALTER TABLE `ordini_clienti_articoli` DISABLE KEYS */;
INSERT INTO `ordini_clienti_articoli` VALUES (12,4,NULL,'articolo','Infissi in alluminio','ALSistem','','finestra 1 anta ribalta','m²',1.00,111.00,111.00,0,'',200.00,10.00,6.00,360.00,400.00,'Tc(mAc(F()))',80.0,'/listini/21-foto-1777558993079.png',NULL,NULL),(13,4,12,'caratteristica','Infissi in alluminio','ALSistem','','Colore RAL 9001','--',0.00,111.00,111.00,0,'',0.00,0.00,6.00,0.00,0.00,'',0.0,'/listini/33-foto-1779734722636.png',NULL,NULL),(14,4,12,'caratteristica','Infissi in alluminio','ALSistem','','Colore accessori NERO','m²',0.00,111.00,111.00,0,'',0.00,0.00,6.00,0.00,0.00,'',0.0,'/listini/43-foto-1779602167291.png',NULL,NULL),(15,4,12,'caratteristica','Infissi in alluminio','Vetro','','Vetro 6-18 Argon -6','m²',0.00,111.00,111.00,0,'',66.00,0.00,6.00,69.12,69.12,'',0.0,'/listini/35-foto-1779604275067.png',NULL,NULL),(16,4,12,'caratteristica','Infissi in alluminio','ALSistem','','Montaggio e sigillatura','pz',0.00,111.00,111.00,0,'',50.00,0.00,6.00,50.00,50.00,'',0.0,'/listini/42-foto-1779387858862.png',NULL,NULL),(17,5,NULL,'articolo','Infissi in alluminio','ALSistem','','finestra 1 anta ribalta','m²',1.00,200.00,140.00,0,'',200.00,10.00,7.00,504.00,560.00,'Tc(mAc(F()))',80.0,'/listini/21-foto-1777558993079.png',NULL,NULL),(18,5,NULL,'articolo','Infissi in alluminio','ALSistem','','finestra 1 anta ribalta','m²',1.00,200.00,140.00,1,'',200.00,10.00,7.00,504.00,560.00,'Tc(mAc(F()))',80.0,'/listini/21-foto-1777558993079.png',NULL,NULL),(19,5,17,'caratteristica','Infissi in alluminio','ALSistem','','Colore RAL 9070','--',1.00,0.00,0.00,1,'',0.00,-15.00,7.00,75.60,84.00,'',0.0,'/listini/37-foto-1779599360774.png',NULL,NULL),(20,5,17,'caratteristica','Infissi in alluminio','Vetro','','Vetro 8-12-8 B.E.','m²',1.00,200.00,140.00,1,'',60.00,3.00,7.00,138.52,142.80,'',0.0,'/listini/34-foto-1779604282187.png',NULL,NULL),(21,5,17,'caratteristica','Infissi in alluminio','ALSistem','','Nessun montaggio','pz',1.00,0.00,0.00,1,'',0.00,0.00,7.00,0.00,0.00,'',0.0,'/listini/41-foto-1779604340560.png',NULL,NULL),(22,5,17,'caratteristica','Infissi in alluminio','ALSistem','','Colore accessori NERO','m²',1.00,0.00,0.00,1,'',0.00,0.00,7.00,0.00,0.00,'',0.0,'/listini/43-foto-1779602167291.png',NULL,NULL),(23,5,18,'caratteristica','Infissi in alluminio','ALSistem','','Colore RAL 9010','--',1.00,0.00,0.00,1,'',0.00,-10.00,7.00,50.40,56.00,'',0.0,'/listini/32-foto-1779710699897.png',NULL,NULL),(24,5,18,'caratteristica','Infissi in alluminio','Vetro','','Vetro 8-12-8 B.E.','m²',1.00,200.00,140.00,1,'',60.00,3.00,7.00,138.52,142.80,'',0.0,'/listini/34-foto-1779604282187.png',NULL,NULL),(25,5,18,'caratteristica','Infissi in alluminio','ALSistem','','Colore accessori NERO','m²',1.00,0.00,0.00,1,'',0.00,0.00,7.00,0.00,0.00,'',0.0,'/listini/43-foto-1779602167291.png',NULL,NULL),(26,5,18,'caratteristica','Infissi in alluminio','ALSistem','','Nessun montaggio','pz',1.00,0.00,0.00,1,'',0.00,0.00,7.00,0.00,0.00,'',0.0,'/listini/41-foto-1779604340560.png',NULL,NULL);
/*!40000 ALTER TABLE `ordini_clienti_articoli` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_fornitori`
--

DROP TABLE IF EXISTS `ordini_fornitori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_fornitori` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_ordine` varchar(50) NOT NULL DEFAULT '',
  `fornitore` varchar(255) NOT NULL,
  `descrizione` text NOT NULL,
  `stato` varchar(20) NOT NULL DEFAULT 'bozza',
  `totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `data_ordine` date NOT NULL,
  `created_by` varchar(100) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `qta` decimal(10,3) NOT NULL DEFAULT '1.000',
  `prezzo_unitario` decimal(10,2) NOT NULL DEFAULT '0.00',
  `aliq_sconto` decimal(5,2) NOT NULL DEFAULT '0.00',
  `aliq_iva` decimal(5,2) NOT NULL DEFAULT '22.00',
  `fatturato` tinyint(1) NOT NULL DEFAULT '0',
  `pagato` tinyint(1) NOT NULL DEFAULT '0',
  `stato_consegna` varchar(30) NOT NULL DEFAULT 'non_consegnato',
  `data_consegna_stimata` date DEFAULT NULL,
  `data_consegna` date DEFAULT NULL,
  `ultimo_sollecito` datetime DEFAULT NULL,
  `note` text,
  `email_fornitore` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_fornitori`
--

LOCK TABLES `ordini_fornitori` WRITE;
/*!40000 ALTER TABLE `ordini_fornitori` DISABLE KEYS */;
INSERT INTO `ordini_fornitori` VALUES (1,'1','edil pisello','cerniere nc40','bozza',10.98,'2026-04-10','admin1','2026-04-11 09:42:05','2026-04-11 10:43:16',1.000,10.00,10.00,22.00,0,0,'non_consegnato',NULL,NULL,'2026-04-11 10:43:16','','sd1927@libero.it');
/*!40000 ALTER TABLE `ordini_fornitori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_note`
--

DROP TABLE IF EXISTS `ordini_note`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_note` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordine_id` int NOT NULL,
  `testo` text NOT NULL,
  `autore` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_note`
--

LOCK TABLES `ordini_note` WRITE;
/*!40000 ALTER TABLE `ordini_note` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordini_note` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordini_ricevuti`
--

DROP TABLE IF EXISTS `ordini_ricevuti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordini_ricevuti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_ordine` varchar(50) NOT NULL DEFAULT '',
  `cliente` varchar(100) NOT NULL,
  `descrizione` text NOT NULL,
  `stato` varchar(20) NOT NULL DEFAULT 'nuovo',
  `totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `data_ordine` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `cliente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordini_ricevuti`
--

LOCK TABLES `ordini_ricevuti` WRITE;
/*!40000 ALTER TABLE `ordini_ricevuti` DISABLE KEYS */;
INSERT INTO `ordini_ricevuti` VALUES (1,'44444','palm inc srl','telaio','nuovo',122.00,'2026-04-10','2026-04-11 00:46:43','2026-05-30 06:17:38',1,2),(2,'5555','di giovanni leonardo','hhhhh','nuovo',66.00,'2026-04-10','2026-04-11 00:48:32','2026-04-11 00:48:32',1,1);
/*!40000 ALTER TABLE `ordini_ricevuti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamenti_fattura`
--

DROP TABLE IF EXISTS `pagamenti_fattura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamenti_fattura` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fattura_id` int NOT NULL,
  `data` date NOT NULL,
  `importo` decimal(10,2) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fattura_id` (`fattura_id`),
  CONSTRAINT `pagamenti_fattura_ibfk_1` FOREIGN KEY (`fattura_id`) REFERENCES `fatture` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamenti_fattura`
--

LOCK TABLES `pagamenti_fattura` WRITE;
/*!40000 ALTER TABLE `pagamenti_fattura` DISABLE KEYS */;
INSERT INTO `pagamenti_fattura` VALUES (14,3,'2026-04-10',488.00,'','2026-04-10 19:28:34');
/*!40000 ALTER TABLE `pagamenti_fattura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page_visibility`
--

DROP TABLE IF EXISTS `page_visibility`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page_visibility` (
  `page_id` int NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page_visibility`
--

LOCK TABLES `page_visibility` WRITE;
/*!40000 ALTER TABLE `page_visibility` DISABLE KEYS */;
INSERT INTO `page_visibility` VALUES (1,1,'2026-03-29 09:52:11'),(2,1,'2026-03-28 22:09:46'),(3,1,'2026-03-28 22:09:46'),(4,1,'2026-03-29 09:52:11'),(5,1,'2026-03-29 09:52:11'),(6,1,'2026-03-29 09:52:11'),(7,1,'2026-03-29 09:52:11'),(8,1,'2026-03-30 01:33:54'),(9,1,'2026-03-30 01:33:54'),(10,0,'2026-03-30 14:01:40'),(11,0,'2026-03-30 14:01:40'),(12,0,'2026-03-30 14:01:40'),(13,0,'2026-03-30 14:01:40'),(14,0,'2026-03-30 14:01:40'),(15,1,'2026-03-30 01:33:54');
/*!40000 ALTER TABLE `page_visibility` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_registrations`
--

DROP TABLE IF EXISTS `pending_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_registrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `data_nascita` date NOT NULL,
  `luogo_nascita` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `cellulare` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email_code` char(6) NOT NULL,
  `phone_code` char(6) NOT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT '0',
  `phone_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_registrations`
--

LOCK TABLES `pending_registrations` WRITE;
/*!40000 ALTER TABLE `pending_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preventivi`
--

DROP TABLE IF EXISTS `preventivi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preventivi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero` varchar(50) NOT NULL DEFAULT '',
  `cliente_id` int DEFAULT NULL,
  `descrizione` text,
  `stato` enum('bozza','richiesto','in preparazione','da inviare','inviato','accettato','rifiutato','scaduto','annullato') NOT NULL DEFAULT 'bozza',
  `importo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `data` date NOT NULL,
  `validita_giorni` int NOT NULL DEFAULT '30',
  `note` text,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `creato_da` varchar(100) DEFAULT NULL,
  `sconto_cliente_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `cloned_from` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preventivi`
--

LOCK TABLES `preventivi` WRITE;
/*!40000 ALTER TABLE `preventivi` DISABLE KEYS */;
INSERT INTO `preventivi` VALUES (113,'20260607-000113',1,'Carrello','bozza',418.74,'2026-06-07',5,NULL,1,'2026-06-07 06:36:04','formicus',6.00,NULL);
/*!40000 ALTER TABLE `preventivi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preventivo_articoli`
--

DROP TABLE IF EXISTS `preventivo_articoli`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preventivo_articoli` (
  `id` int NOT NULL AUTO_INCREMENT,
  `preventivo_id` int NOT NULL,
  `tipo_prodotto` varchar(100) NOT NULL,
  `marca` varchar(100) NOT NULL DEFAULT '',
  `modello` varchar(300) NOT NULL DEFAULT '',
  `listino_id` int DEFAULT NULL,
  `prezzo_base` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unita` varchar(30) NOT NULL DEFAULT 'pz',
  `colore` varchar(100) NOT NULL DEFAULT '',
  `tipo_vetro` varchar(100) NOT NULL DEFAULT '',
  `accessori` text,
  `altezza_cm` decimal(7,2) NOT NULL DEFAULT '0.00',
  `larghezza_cm` decimal(7,2) NOT NULL DEFAULT '0.00',
  `n_ante` int NOT NULL DEFAULT '1',
  `quantita` int NOT NULL DEFAULT '1',
  `prezzo_totale` decimal(10,2) NOT NULL DEFAULT '0.00',
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sconto_articolo_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  `parent_id` int DEFAULT NULL,
  `prezzo_pre_sconto` decimal(10,2) NOT NULL DEFAULT '0.00',
  `prezzo_scontato` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=551 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preventivo_articoli`
--

LOCK TABLES `preventivo_articoli` WRITE;
/*!40000 ALTER TABLE `preventivo_articoli` DISABLE KEYS */;
INSERT INTO `preventivo_articoli` VALUES (541,112,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta',21,200.00,'m²','','',NULL,111.00,111.00,0,1,360.00,NULL,'2026-06-07 04:57:22',10.00,NULL,400.00,360.00),(542,112,'Infissi in alluminio','ALSistem','Colore RAL 9001',33,0.00,'--','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-06-07 04:57:22',0.00,541,0.00,0.00),(543,112,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6',35,66.00,'m²','','',NULL,111.00,111.00,1,1,69.12,NULL,'2026-06-07 04:57:22',0.00,541,69.12,69.12),(544,112,'Infissi in alluminio','ALSistem','Colore accessori NERO',43,0.00,'m²','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-06-07 04:57:22',0.00,541,0.00,0.00),(545,112,'Infissi in alluminio','ALSistem','Nessun montaggio',41,0.00,'pz','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-06-07 04:57:22',0.00,541,0.00,0.00),(546,113,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta + fisso laterale',27,200.00,'m²','','',NULL,100.00,100.00,1,1,360.00,NULL,'2026-06-07 06:36:04',10.00,NULL,400.00,360.00),(547,113,'Infissi in alluminio','ALSistem','Colore RAL 9010',32,0.00,'--','','',NULL,100.00,100.00,1,1,36.00,NULL,'2026-06-07 06:36:04',-10.00,546,40.00,36.00),(548,113,'Infissi in alluminio','ALSistem','Colore accessori NERO',43,0.00,'m²','','',NULL,100.00,100.00,1,1,0.00,NULL,'2026-06-07 06:36:04',0.00,546,0.00,0.00),(549,113,'Infissi in alluminio','Vetro','Vetro 8-12-8 B.E.',34,60.00,'m²','','',NULL,100.00,100.00,1,1,49.47,NULL,'2026-06-07 06:36:04',3.00,546,51.00,49.47),(550,113,'Infissi in alluminio','ALSistem','Nessun montaggio',41,0.00,'pz','','',NULL,100.00,100.00,1,1,0.00,NULL,'2026-06-07 06:36:04',0.00,546,0.00,0.00);
/*!40000 ALTER TABLE `preventivo_articoli` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preventivo_templates`
--

DROP TABLE IF EXISTS `preventivo_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preventivo_templates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) NOT NULL,
  `html` longtext NOT NULL,
  `attivo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tipo` varchar(50) NOT NULL DEFAULT 'preventivo',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preventivo_templates`
--

LOCK TABLES `preventivo_templates` WRITE;
/*!40000 ALTER TABLE `preventivo_templates` DISABLE KEYS */;
INSERT INTO `preventivo_templates` VALUES (1,'Template preventivo','<div style=\"font-family:Arial,Helvetica,sans-serif;width:794px;min-height:1050px;padding:40px 50px 90px;position:relative;background:#fff;box-sizing:border-box;\">\r\n\r\n  <!-- HEADER -->\r\n  <table style=\"width:100%;margin-bottom:20px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <img src=\"/images/header/qqqqqqqqqqqqqqqqqqq-Photoroom.png\" alt=\"Logo\" style=\"height:52px;margin-bottom:10px;display:block;\"/>\r\n        <div style=\"font-size:17px;font-weight:bold;color:#1a3a5c;\">Digi Home Design S.r.l.</div>\r\n        <div style=\"font-size:11px;color:#555;line-height:1.7;margin-top:4px;\">\r\n          Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>\r\n          P.IVA: 07407080824<br/>\r\n          Tel: +39 351 871 6731<br/>\r\n          info@digi-home-design.com\r\n        </div>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 20px;\"/>\r\n\r\n  <!-- DESTINATARIO + META -->\r\n  <table style=\"width:100%;margin-bottom:22px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;\">Data</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{data}}</div>\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:8px 0 2px;\">Rif. N°</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{numero}}</div>\r\n      </td>\r\n      <td style=\"vertical-align:top;text-align:right;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;\">Spett.le</div>\r\n        <div style=\"font-size:15px;font-weight:bold;color:#1a3a5c;\">{{cliente_nome}}</div>\r\n        <div style=\"font-size:12px;color:#555;margin-top:4px;line-height:1.6;\">{{cliente_indirizzo}}</div>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <!-- OGGETTO -->\r\n  <div style=\"font-size:13px;margin-bottom:10px;\">\r\n    <strong>Oggetto:</strong> Preventivo Ufficiale\r\n  </div>\r\n\r\n  <!-- CORPO -->\r\n  <div style=\"font-size:13px;margin-bottom:22px;line-height:1.7;\">\r\n    Gentile Cliente,<br/>\r\n    Vi rimettiamo la nostra offerta escluso IVA di:\r\n  </div>\r\n\r\n  <!-- ARTICOLI -->\r\n  {{articoli}}\r\n\r\n  <!-- TOTALE -->\r\n  <div style=\"text-align:right;margin-top:12px;padding:12px 16px;background:#f0f4fa;border-radius:4px;\">\r\n    {{totale}}\r\n  </div>\r\n\r\n  <!-- NOTE -->\r\n  {{note_block}}\r\n\r\n  <!-- FOOTER -->\r\n  <div style=\"position:absolute;bottom:24px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:8px;font-size:9px;color:#888;text-align:center;line-height:1.6;\">\r\n    Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com — PEC digi_home_design_srl@namirialpec.it\r\n  </div>\r\n\r\n</div>',1,'2026-04-20 04:23:40','2026-05-17 12:59:43','preventivo'),(2,'Template Disegno Verticale','<div style=\"font-family:Arial,Helvetica,sans-serif;width:794px;height:1123px;padding:36px 44px 50px;box-sizing:border-box;overflow:hidden;position:relative;background:#fff;\"><div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;\"><img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:40px;display:block;\" /><img src=\"/images/nome_tr.png\" alt=\"\" style=\"height:40px;display:block;\" /></div><hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 10px;\" /><div style=\"text-align:right;font-size:10px;color:#666;margin-bottom:8px;\">{{data}}</div>{{titolo}}<div style=\"display:flex;justify-content:center;\">{{svg}}</div><div style=\"position:absolute;bottom:16px;left:44px;right:44px;border-top:1px solid #ddd;padding-top:5px;font-size:8px;color:#aaa;\">Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</div></div>',1,'2026-04-23 11:14:47','2026-04-23 11:37:08','disegno_portrait'),(3,'Template Disegno Orizzontale','<div style=\"font-family:Arial,Helvetica,sans-serif;width:1123px;height:794px;padding:36px 44px 50px;box-sizing:border-box;overflow:hidden;position:relative;background:#fff;\"><div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;\"><img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:40px;display:block;\" /><img src=\"/images/nome_tr.png\" alt=\"\" style=\"height:40px;display:block;\" /></div><hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 10px;\" /><div style=\"text-align:right;font-size:10px;color:#666;margin-bottom:8px;\">{{data}}</div>{{titolo}}<div style=\"display:flex;justify-content:center;\">{{svg}}</div><div style=\"position:absolute;bottom:16px;left:44px;right:44px;border-top:1px solid #ddd;padding-top:5px;font-size:8px;color:#aaa;\">Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</div></div>',1,'2026-04-23 11:14:47','2026-04-23 11:37:08','disegno_landscape'),(5,'Template Preventivo Provvisorio','<div style=\"font-family:Arial,Helvetica,sans-serif;width:794px;min-height:1050px;padding:40px 50px 90px;position:relative;background:#fff;box-sizing:border-box;\">\r\n\r\n  <!-- HEADER -->\r\n  <table style=\"width:100%;margin-bottom:20px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <img src=\"/images/header/qqqqqqqqqqqqqqqqqqq-Photoroom.png\" alt=\"Logo\" style=\"height:52px;margin-bottom:10px;display:block;\"/>\r\n        <div style=\"font-size:17px;font-weight:bold;color:#1a3a5c;\">Digi Home Design S.r.l.</div>\r\n        <div style=\"font-size:11px;color:#555;line-height:1.7;margin-top:4px;\">\r\n          Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>\r\n          P.IVA: 07407080824<br/>\r\n          Tel: +39 351 871 6731<br/>\r\n          info@digi-home-design.com\r\n        </div>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 20px;\"/>\r\n\r\n  <!-- DESTINATARIO + META -->\r\n  <table style=\"width:100%;margin-bottom:22px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;\">Data</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{data}}</div>\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:8px 0 2px;\">Rif. N°</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{numero}}</div>\r\n      </td>\r\n      <td style=\"vertical-align:top;text-align:right;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;\">Spett.le</div>\r\n        <div style=\"font-size:15px;font-weight:bold;color:#1a3a5c;\">{{cliente_nome}}</div>\r\n        <div style=\"font-size:12px;color:#555;margin-top:4px;line-height:1.6;\">{{cliente_indirizzo}}</div>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <!-- OGGETTO -->\r\n  <div style=\"font-size:13px;margin-bottom:10px;\">\r\n    <strong>Oggetto:</strong> Preventivo Provvisorio\r\n  </div>\r\n\r\n  <!-- CORPO -->\r\n  <div style=\"font-size:13px;margin-bottom:22px;line-height:1.7;\">\r\n    Gentile Cliente,<br/>\r\n    Vi rimettiamo la nostra offerta escluso IVA di:\r\n  </div>\r\n\r\n  <!-- ARTICOLI -->\r\n  {{articoli}}\r\n\r\n  <!-- TOTALE -->\r\n  <div style=\"text-align:right;margin-top:2px;padding:2px 2px;background:#f0f4fa;border-radius:4px;\">\r\n    {{totale}}\r\n  </div>\r\n\r\n  <!-- NOTE -->\r\n  {{note_block}}\r\n\r\n  <!-- FOOTER -->\r\n  <div style=\"position:absolute;bottom:24px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:8px;font-size:9px;color:#888;text-align:center;line-height:1.6;\">\r\n    Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com — PEC digi_home_design_srl@namirialpec.it\r\n  </div>\r\n\r\n</div>',1,'2026-04-26 21:00:58','2026-05-17 13:01:52','preventivo_provvisorio');
/*!40000 ALTER TABLE `preventivo_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(20) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
INSERT INTO `site_settings` VALUES ('client_login_enabled','1','2026-03-28 19:06:13'),('employee_login_enabled','1','2026-03-29 21:14:34'),('registrations_enabled','1','2026-03-28 18:47:50'),('site_bg_b','220','2026-03-30 01:30:20'),('site_bg_g','221','2026-03-30 14:01:13'),('site_bg_r','245','2026-03-30 01:31:31');
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `token_hash` varchar(255) DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
INSERT INTO `user_sessions` VALUES (29,1,'e83d9d760d8020dd75e27d7bad2a6f7bfd6d95b799e2dec54577570febe700cf','2026-04-05 11:51:47'),(31,1,'8fa303d97a3893b74328107ed7aa243886c1dafe2ecda94e60d37c90fee6f87c','2026-04-05 21:19:29'),(34,1,'0d743a83c3ac6fa58be513fdc465034f9ceb691cce47387ad32318332a63dc68','2026-04-06 20:00:36'),(35,1,'9dd35e6d00557857ed896390e810dd715314b190bc60f8c4d227a6f742bed454','2026-04-07 08:49:40');
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'cliente',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `nome` varchar(100) DEFAULT NULL,
  `cognome` varchar(100) DEFAULT NULL,
  `data_nascita` date DEFAULT NULL,
  `luogo_nascita` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verificata` tinyint(1) NOT NULL DEFAULT '0',
  `cellulare` varchar(20) DEFAULT NULL,
  `cellulare_verificato` tinyint(1) NOT NULL DEFAULT '0',
  `cantieri_visibili` tinyint(1) NOT NULL DEFAULT '1',
  `miei_ordini_visibili` tinyint(1) NOT NULL DEFAULT '1',
  `cliente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','aaa','admin',1,'Roberto','Admini','1980-02-03','bari','admin@mef.it',0,'+39 335 0000001',0,1,1,NULL),(2,'magazziniere','aaa','magazzino',1,'Enzo','Magazzini','1980-02-03','bari','magazzino@mef.it',0,'+39 335 0000002',0,1,1,NULL),(3,'ragioniere','aaa','ragioniere',1,'Carla','Ragionieri','1980-02-03','bari','ragioniere@mef.it',0,'+39 335 0000003',0,1,1,NULL),(4,'email','aaa','email',1,'Simonetta','Emaili','1980-02-03','bari','email@mef.it',0,'+39 335 0000004',0,1,1,NULL),(5,'mariorossi','aaa','ragioniere',0,'Mario','Rossi','1980-02-03','bari','mariorossi@libero.it',0,'+39 335 0000005',0,1,1,NULL),(6,'formicus','aaa','cliente',1,'leonardo','di giovanni','1972-12-23','palermo','leonardodigiovanni@tiscali.it',1,'3476468185',1,0,1,1),(7,'mario.rossi','aaa','ragioniere',1,'Mario','Rossi','1980-03-15','Roma','mario.rossi@digihomedesign.it',1,'+39 331 1234001',1,1,1,NULL),(8,'giulia.bianchi','aaa','cliente',1,'Giulia','Bianchi','1985-07-22','Milano','giulia.bianchi@digihomedesign.it',1,'+39 331 1234002',1,1,1,NULL),(9,'luca.verdi','aaa','venditore',1,'Luca','Verdi','1990-11-08','Napoli','luca.verdi@digihomedesign.it',1,'+39 331 1234003',1,1,1,NULL),(10,'andrea.neri','aaaa','admin',1,'Andrea','Neri','1988-05-30','Torino','andrea.neri@digihomedesign.it',1,'+39 331 1234004',1,1,1,NULL),(11,'sofia.russo','aaa','direttore',1,'Sofia','Russo','1975-09-12','Firenze','sofia.russo@digihomedesign.it',1,'+39 331 1234005',1,1,1,NULL),(12,'marco.ferrari','aaa','marketing',1,'Marco','Ferrari','1992-01-25','Bologna','marco.ferrari@digihomedesign.it',1,'+39 331 1234006',1,1,1,NULL),(13,'prova','aaa','dipendente',1,'provino','provetta','2000-01-01','palermo','prova@libero.it',1,'345999999',1,1,1,NULL),(14,'zigfffff','aaa','cliente',1,'Salvatore','Di Giovanni','2010-03-19','palermo','sd1927@libero.it',1,'3555555555',1,1,1,NULL),(16,'cliente1','cliente1','cliente',1,'cliente','clienti','2010-10-10','palermo','fd393@libero.it',1,'3518716731',1,1,1,NULL),(17,'cliente2','cliente2','cliente',0,'cliente2','cliente2','2001-01-01','palermo','aledigio83@libero.it',1,'3331234567',1,1,1,NULL),(18,'cliente3','cliente3','cliente',0,'cliente3','cliente3','2001-01-01','palermo','cliente3@libero.it',1,'3334444447',1,1,1,3),(19,'cliente4','cliente4','cliente',1,'cliente4','cliente4','2001-01-01','palermo','cliente4@libero.it',1,'3443333337',1,1,1,4),(20,'aaaaaa','aaaaaaaa','cliente',1,'aaa','aaa','2001-01-01','aaa','aaa@aaa.it',1,'3456789098',1,1,1,5);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worklist`
--

DROP TABLE IF EXISTS `worklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `worklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titolo` varchar(200) NOT NULL,
  `descrizione` text,
  `assegnato_a` varchar(100) NOT NULL,
  `creato_da` varchar(100) NOT NULL,
  `priorita` enum('bassa','normale','alta','urgente') NOT NULL DEFAULT 'normale',
  `stato` enum('da_fare','in_corso','completato') NOT NULL DEFAULT 'da_fare',
  `data_scadenza` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worklist`
--

LOCK TABLES `worklist` WRITE;
/*!40000 ALTER TABLE `worklist` DISABLE KEYS */;
INSERT INTO `worklist` VALUES (1,'bagno e cucina','piastrelle nere nel bagno secondario','prova','admin1','normale','in_corso','2026-04-12','2026-04-10 23:27:25'),(2,'bagno','entro mercoledi devi mettere la fuga.','giulia.bianchi','admin1','normale','da_fare','2026-04-15','2026-04-13 20:08:11'),(3,'bagno','preventivo','admin1','admin1','normale','da_fare',NULL,'2026-05-30 04:15:35');
/*!40000 ALTER TABLE `worklist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-08 19:57:09
