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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri`
--

LOCK TABLES `cantieri` WRITE;
/*!40000 ALTER TABLE `cantieri` DISABLE KEYS */;
INSERT INTO `cantieri` VALUES (1,2,'bagno e cucina','via cazzalora 3 palermo','preventivo','2025-01-01',NULL,'ddddddddddddd','ccccccc','2026-04-10 21:50:22',1),(2,1,'fffffffffffffff','via cangelosi 48, 2','preventivo',NULL,NULL,'ttttttt','yyyyyy','2026-04-10 21:50:54',1);
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
  PRIMARY KEY (`id`),
  KEY `cantiere_id` (`cantiere_id`),
  CONSTRAINT `cantieri_lavori_ibfk_1` FOREIGN KEY (`cantiere_id`) REFERENCES `cantieri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri_lavori`
--

LOCK TABLES `cantieri_lavori` WRITE;
/*!40000 ALTER TABLE `cantieri_lavori` DISABLE KEYS */;
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
  `cantiere_id` int NOT NULL,
  `tipo` enum('foto','video') NOT NULL DEFAULT 'foto',
  `filename` varchar(255) NOT NULL,
  `descrizione` varchar(200) DEFAULT NULL,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cantiere_id` (`cantiere_id`),
  CONSTRAINT `cantieri_media_ibfk_1` FOREIGN KEY (`cantiere_id`) REFERENCES `cantieri` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri_media`
--

LOCK TABLES `cantieri_media` WRITE;
/*!40000 ALTER TABLE `cantieri_media` DISABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_categorie`
--

LOCK TABLES `catalogo_categorie` WRITE;
/*!40000 ALTER TABLE `catalogo_categorie` DISABLE KEYS */;
INSERT INTO `catalogo_categorie` VALUES (1,'marmi',1);
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
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `catalogo_voci_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `catalogo_categorie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_voci`
--

LOCK TABLES `catalogo_voci` WRITE;
/*!40000 ALTER TABLE `catalogo_voci` DISABLE KEYS */;
INSERT INTO `catalogo_voci` VALUES (1,1,'carrara','1775892243840_LEO_GPS_TRACKER.pdf','catalogo 2025','2026-04-11 07:24:04');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienti`
--

LOCK TABLES `clienti` WRITE;
/*!40000 ALTER TABLE `clienti` DISABLE KEYS */;
INSERT INTO `clienti` VALUES (1,'fisica','leonardo','di giovanni','','via ernesto lugaro, 2','+3934765468185','leonardodigiovanni@tiscali.it','leonardodigiovanni@tiscali.it','httttt','2026-04-02 23:52:31','DGVLRD72T23G273I',''),(2,'giuridica','','','palm inc srl','via Roberto Antiochia 3, 2','+393279991927','sd1927@libero.it','sd1927@libero.it','ghghgh','2026-04-02 23:53:01','','05555555555');
/*!40000 ALTER TABLE `clienti` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenti_interni`
--

LOCK TABLES `documenti_interni` WRITE;
/*!40000 ALTER TABLE `documenti_interni` DISABLE KEYS */;
INSERT INTO `documenti_interni` VALUES (2,'archivio','test','Contratti','1775321609961_omi_antiochia_omi.pdf','application/pdf',377246,'admin1','2026-04-04 18:53:29');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_inbox`
--

LOCK TABLES `email_inbox` WRITE;
/*!40000 ALTER TABLE `email_inbox` DISABLE KEYS */;
INSERT INTO `email_inbox` VALUES (1,'nuova_registrazione','Nuovo utente registrato: prova','<p><strong>Nuovo utente in attesa di attivazione</strong></p>\n      <table style=\"border-collapse:collapse;font-size:14px\">\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Username</td><td><strong>prova</strong></td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Nome</td><td>provino provetta</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Email</td><td>prova@libero.it</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Cellulare</td><td>345999999</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Data registrazione</td><td>01/04/2026, 20:13:30</td></tr>\n      </table>\n      <p style=\"margin-top:16px\">Accedi a <strong>Gestione Utenti</strong> per attivare l\'account.</p>',1,'2026-04-01 20:13:30'),(2,'nuova_registrazione','Nuovo utente: zigfffff (Salvatore Di Giovanni)','<p><strong>Nuovo utente in attesa di attivazione</strong></p>\n      <table style=\"border-collapse:collapse;font-size:14px\">\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Username</td><td><strong>zigfffff</strong></td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Nome</td><td>Salvatore Di Giovanni</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Email</td><td>sd1927@libero.it</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Cellulare</td><td>3555555555</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Data registrazione</td><td>03/04/2026, 23:07:52</td></tr>\n      </table>',1,'2026-04-03 23:07:52');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fatture`
--

LOCK TABLES `fatture` WRITE;
/*!40000 ALTER TABLE `fatture` DISABLE KEYS */;
INSERT INTO `fatture` (`id`, `tipo`, `numero`, `data`, `controparte`, `importo`, `iva`, `note`, `created_at`, `importo_pagato`) VALUES (1,'attiva','1/2026','2026-04-10','aaaaaaaaaaaaa',3.00,22.00,'aaaaaaaaaaaaaaaa','2026-04-10 18:48:15',0.00),(2,'attiva','2/2026','2026-04-10','eedddd',4.00,22.00,'rrrrrrrrrrrrrrrr','2026-04-10 18:49:48',0.00),(3,'passiva','333','2026-04-10','frfrfr',400.00,22.00,'hhhhhhhhhhhhhhh','2026-04-10 19:28:17',488.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornitori`
--

LOCK TABLES `fornitori` WRITE;
/*!40000 ALTER TABLE `fornitori` DISABLE KEYS */;
INSERT INTO `fornitori` VALUES (1,'palm inc','via cangelosi 48, 2','+393881739676','leonardo.digiova@tiscali.it','leonardo.digiova@pecpec.it','2026-04-02 23:43:39');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listini`
--

LOCK TABLES `listini` WRITE;
/*!40000 ALTER TABLE `listini` DISABLE KEYS */;
INSERT INTO `listini` VALUES (1,'infissi','palazzolo','2 ante','m²',100.00,200.00,'hhhhhhhhhhhhhhhhhh','2026-04-11 07:32:46','2026-04-11 07:38:41',1);
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
INSERT INTO `ordini_ricevuti` VALUES (1,'44444','palm inc srl','telaio','nuovo',122.00,'2026-04-10','2026-04-11 00:46:43','2026-04-11 00:47:32',1,2),(2,'5555','di giovanni leonardo','hhhhh','nuovo',66.00,'2026-04-10','2026-04-11 00:48:32','2026-04-11 00:48:32',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_registrations`
--

LOCK TABLES `pending_registrations` WRITE;
/*!40000 ALTER TABLE `pending_registrations` DISABLE KEYS */;
/*!40000 ALTER TABLE `pending_registrations` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','aaa','admin',1,'Roberto','Admini','1980-02-03','bari','admin@mef.it',0,'+39 335 0000001',0,1,1),(2,'magazziniere','aaa','magazzino',1,'Enzo','Magazzini','1980-02-03','bari','magazzino@mef.it',0,'+39 335 0000002',0,1,1),(3,'ragioniere','aaa','ragioniere',1,'Carla','Ragionieri','1980-02-03','bari','ragioniere@mef.it',0,'+39 335 0000003',0,1,1),(4,'email','aaa','email',1,'Simonetta','Emaili','1980-02-03','bari','email@mef.it',0,'+39 335 0000004',0,1,1),(5,'mariorossi','aaa','ragioniere',1,'Mario','Rossi','1980-02-03','bari','mariorossi@libero.it',0,'+39 335 0000005',0,1,1),(6,'formicus','aaa','cliente',1,'leonardo','di giovanni','1972-12-23','palermo','leonardodigiovanni@tiscali.it',1,'3476468185',1,1,1),(7,'mario.rossi','aaa','ragioniere',1,'Mario','Rossi','1980-03-15','Roma','mario.rossi@digihomedesign.it',1,'+39 331 1234001',1,1,1),(8,'giulia.bianchi','aaa','commercialista',1,'Giulia','Bianchi','1985-07-22','Milano','giulia.bianchi@digihomedesign.it',1,'+39 331 1234002',1,1,1),(9,'luca.verdi','aaa','venditore',1,'Luca','Verdi','1990-11-08','Napoli','luca.verdi@digihomedesign.it',1,'+39 331 1234003',1,1,1),(10,'andrea.neri','aaa','operaio',1,'Andrea','Neri','1988-05-30','Torino','andrea.neri@digihomedesign.it',1,'+39 331 1234004',1,1,1),(11,'sofia.russo','aaa','direttore',1,'Sofia','Russo','1975-09-12','Firenze','sofia.russo@digihomedesign.it',1,'+39 331 1234005',1,1,1),(12,'marco.ferrari','aaa','marketing',1,'Marco','Ferrari','1992-01-25','Bologna','marco.ferrari@digihomedesign.it',1,'+39 331 1234006',1,1,1),(13,'prova','aaa','dipendente',1,'provino','provetta','2000-01-01','palermo','prova@libero.it',1,'345999999',1,1,1),(14,'zigfffff','aaa','cliente',1,'Salvatore','Di Giovanni','2010-03-19','palermo','sd1927@libero.it',1,'3555555555',1,1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worklist`
--

LOCK TABLES `worklist` WRITE;
/*!40000 ALTER TABLE `worklist` DISABLE KEYS */;
INSERT INTO `worklist` VALUES (1,'bagno e cucina','piastrelle nere nel bagno secondario','prova','admin1','normale','in_corso','2026-04-12','2026-04-10 23:27:25');
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

-- Dump completed on 2026-04-11 12:34:51
