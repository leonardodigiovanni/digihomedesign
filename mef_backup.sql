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
INSERT INTO `app_settings` VALUES (1,'{\"pageBg\": {\"a\": 60, \"b\": 255, \"g\": 255, \"r\": 255}, \"footerBg\": {\"a\": 100, \"b\": 47, \"g\": 0, \"r\": 63}, \"headerBg\": {\"a\": 100, \"b\": 0, \"g\": 0, \"r\": 0}, \"pageBgMode\": \"rgb\", \"bannerTesto\": \"Esperienza che dura nel tempo_____Qualità che si vede_____Soluzioni su misura per te_____Più comfort, meno sprechi_____Innovazione al servizio della casa_____Affidabilità in ogni dettaglio_____Proteggiamo il valore della tua casa_____Design, sicurezza, durata_____La qualità parte dai dettagli_____Serramenti pensati per durare_____Comfort abitativo, ogni giorno_____Risparmio energetico concreto_____Eleganza e funzionalità_____Tradizione artigiana, visione moderna_____Cura artigianale, risultati moderni_____Materiali di qualità, risultati garantiti_____Ogni progetto prende forma_____La tua casa merita il meglio_____Più luce, più comfort_____Resistenza senza compromessi_____Bellezza che protegge_____Funzionalità che arreda_____Sicurezza e stile insieme_____Prestazioni che fanno la differenza_____Lavori fatti con precisione_____Costruiti per resistere_____Il dettaglio fa la qualità_____Il comfort inizia dagli infissi_____Soluzioni intelligenti per la tua casa_____Qualità, competenza, affidabilità_____Il partner giusto per la tua casa_____Tecnologia e artigianalità_____Protezione e design su misura_____Valore aggiunto ai tuoi spazi_____Più isolamento, più benessere_____La scelta giusta per abitare meglio_____Diamo forma ai tuoi spazi_____Esperienza, innovazione, risultati_____Ogni casa ha la sua soluzione_____ Comfort e qualità senza tempo_____Nessuna brutta sorpresa_____\\r\\n\\r\\nfare categoria Ristrutturazioni per linkarla da home e porta a form contatti (progettista Giovanni)\\r\\n\\r\\nnotifiche non email\\r\\ntogliere scritta design in pdf\\r\\nno storage perche vercel è serverless tutto db\\r\\n\\r\\nsuoneria notifica arrivata\\r\\n\\r\\ncookie gestione e avvisi a norma di legge\\r\\n\\r\\nmontaggio nel preventivo\\r\\n\\r\\nin aggiungi articolo  a carrello preventivo possiamo mostrare gli schemi infissi del listino?\\r\\n\\r\\nfare wizard a categoria->marca->serie\\r\\nesempio\\r\\ninfissi->alluminio->taglio termico->marcafabbrica->serie\\r\\n\\r\\npassare le immagini a webp?\\r\\nuna volta per tutte capire come assegnare i colori ai bottoni\\r\\nprovare possibile radius esasperato\\r\\nshimmering obliquo come la spazzolatura e nero\\r\\nmodelli legali per preventivo provvisorio\\r\\nmodelli legali per preventivo definitivo\\r\\nmodelli legali per preventivo accettato\\r\\nfoglio firmato di pugno o pdf firmato digitalmente o firma tramite OTP al cell. \\r\\nper spese di stoccaggio\\r\\ncalcolo iva per infissi\\r\\ncalcolo iva per prodotti a vendere\\r\\ni 4 sfondi rgb,gold,silver, uniformarli con poca luce al centro\\r\\nchiedere sclafani se possiamo inserirlo\\r\\nogni pagina deve avere l\'aggancio a catalogo e listino (come quadri)\\r\\n\\r\\nla cta preventivo nella home manda al preventivo. li c\'è link alla guida\\r\\ncta cantiere se sloggato -> guida, se loggato c\'è il link alla guida\\r\\ncta app-> manda ai QR li c\'è la guida all\'app\\r\\n\\r\\nchi prova preventivi generando/stampando pdf mi deve arrivare comunque assieme all\'ip. se abusa blocco.\\r\\n\\r\\ncapire adempimenti, fatture, archivio, etc...\\r\\n\\r\\nagganciare stripe appena ho il cc\\r\\n\\r\\nagganciare twilio per gli sms\\r\\n\\r\\nnotifiche nell\'app ai cambi stato prev per i clienti e a diversi eventi ai dipendenti (prev,email,ordini,pagamenti,etc)\\r\\n\\r\\nci sono action accedi registratio che non funzionano\\r\\n\\r\\nse registrazioni è disabilitato come fa un cliente nuovo a vedere sconto su carrello preventivo?\\r\\n\\r\\npossiamo fare bonifici con qualche integrazione da dentro il sito?\\r\\napi banca, api stripe, per interrogarli su cosa succede?\\r\\n\\r\\ndoc legali elettricita termodinamica edilizia allacci gas\\r\\n\\r\\navvisi che  foto video documenti preventivi sulle aree personali non sono eterni, periodicamente li rimuoviamo. quindi se li vogliono conservare se li scaricano o stampano\\r\\npotrei usare il banner personalizzato all\'occorrenza :-)\\r\\n\\r\\nliberatorie pubblicazione cataloghi\\r\\n\\r\\n\\r\\nmarchi e loghi fare bene la trasparenza e i link ai siti\\r\\n\\r\\n\\r\\n\\r\\n\\r\\n\\r\\n\\r\\n-----------\", \"footerBgMode\": \"silver_d\", \"headerBgMode\": \"rgb\", \"manutenzione\": false, \"disabledPages\": [], \"bannerAbilitato\": true, \"bannerCircolare\": true, \"rolePermissions\": {\"email\": [27, 32], \"cliente\": [50, 51, 52, 53, 54], \"operaio\": [27], \"direttore\": [27], \"magazzino\": [16, 27], \"marketing\": [27, 29], \"venditore\": [27, 24, 23, 25, 26], \"dipendente\": [27, 21, 35, 28, 60, 61, 17], \"ragioniere\": [27, 21], \"commercialista\": [18, 22, 27]}, \"countdownSeconds\": 10, \"inactivityMinutes\": 20, \"loginClientiDisabilitato\": false, \"registrazioniDisabilitate\": false, \"loginDipendentiDisabilitato\": false}');
/*!40000 ALTER TABLE `app_settings` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cantieri_media`
--

LOCK TABLES `cantieri_media` WRITE;
/*!40000 ALTER TABLE `cantieri_media` DISABLE KEYS */;
INSERT INTO `cantieri_media` VALUES (1,2,'foto','1776110747546_DSC00421.JPG','albano',1,'2026-04-13 20:05:47');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_categorie`
--

LOCK TABLES `catalogo_categorie` WRITE;
/*!40000 ALTER TABLE `catalogo_categorie` DISABLE KEYS */;
INSERT INTO `catalogo_categorie` VALUES (6,'Infissi in alluminio',6,'Infissi in alluminio'),(8,'Infissi in PVC',7,'Infissi in PVC'),(9,'Verande in Alluminio',8,NULL),(10,'Persiane in Alluminio',9,NULL),(11,'Cassonetti',10,NULL),(12,'Zanzariere',11,NULL),(13,'Tapparelle',12,NULL);
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
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `catalogo_voci_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `catalogo_categorie` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_voci`
--

LOCK TABLES `catalogo_voci` WRITE;
/*!40000 ALTER TABLE `catalogo_voci` DISABLE KEYS */;
INSERT INTO `catalogo_voci` VALUES (12,6,'ALSistem','1777556466087_ALsistem-3G.pdf','2026','2026-04-30 13:41:06','3G SYSTEM REVOLUTION'),(13,8,'Generico','1778935568507_ALsistem-3G.pdf','Generico','2026-05-16 12:46:08','Generico');
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienti`
--

LOCK TABLES `clienti` WRITE;
/*!40000 ALTER TABLE `clienti` DISABLE KEYS */;
INSERT INTO `clienti` VALUES (1,'fisica','leonardo','di giovanni','','via ernesto lugaro, 2','+3934765468185','leonardodigiovanni@tiscali.it','leonardodigiovanni@tiscali.it','httttt','2026-04-02 23:52:31','DGVLRD72T23G273I','',6.00),(2,'giuridica','','','palm inc srl','via Roberto Antiochia 3, 2','+393279991927','sd1927@libero.it','sd1927@libero.it','ghghgh','2026-04-02 23:53:01','','05555555555',10.00);
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contatto_otp`
--

LOCK TABLES `contatto_otp` WRITE;
/*!40000 ALTER TABLE `contatto_otp` DISABLE KEYS */;
INSERT INTO `contatto_otp` VALUES (4,'3513322676','562999','2026-04-26 10:25:12','2026-04-26 08:15:12'),(5,'3476468185','501750','2026-05-15 05:39:32','2026-05-15 03:29:32');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documenti_cliente`
--

LOCK TABLES `documenti_cliente` WRITE;
/*!40000 ALTER TABLE `documenti_cliente` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_inbox`
--

LOCK TABLES `email_inbox` WRITE;
/*!40000 ALTER TABLE `email_inbox` DISABLE KEYS */;
INSERT INTO `email_inbox` VALUES (1,'nuova_registrazione','Nuovo utente registrato: prova','<p><strong>Nuovo utente in attesa di attivazione</strong></p>\n      <table style=\"border-collapse:collapse;font-size:14px\">\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Username</td><td><strong>prova</strong></td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Nome</td><td>provino provetta</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Email</td><td>prova@libero.it</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Cellulare</td><td>345999999</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Data registrazione</td><td>01/04/2026, 20:13:30</td></tr>\n      </table>\n      <p style=\"margin-top:16px\">Accedi a <strong>Gestione Utenti</strong> per attivare l\'account.</p>',1,'2026-04-01 20:13:30'),(2,'nuova_registrazione','Nuovo utente: zigfffff (Salvatore Di Giovanni)','<p><strong>Nuovo utente in attesa di attivazione</strong></p>\n      <table style=\"border-collapse:collapse;font-size:14px\">\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Username</td><td><strong>zigfffff</strong></td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Nome</td><td>Salvatore Di Giovanni</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Email</td><td>sd1927@libero.it</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Cellulare</td><td>3555555555</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Data registrazione</td><td>03/04/2026, 23:07:52</td></tr>\n      </table>',1,'2026-04-03 23:07:52'),(3,'contatto','Richiesta contatto: Mario Marini (mario@libero.it)','\n    <p><strong>Nome:</strong> Mario Marini</p>\n    <p><strong>Email:</strong> mario@libero.it</p>\n    <p><strong>Telefono:</strong> 0918888888</p>\n    <p><strong>Messaggio:</strong></p>\n    <p style=\"white-space:pre-wrap\">questo è un test. richiamami</p>\n  ',1,'2026-04-16 23:25:31'),(4,'contatto','Richiesta contatto: Leonardo Di Giovanni (leonardodigiovanni@tiscali.it)','\n      <p><strong>Nome:</strong> Leonardo Di Giovanni</p>\n      <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n      <p><strong>Cellulare:</strong> 3476468185</p>\n      <p><strong>Messaggio:</strong></p>\n      <p style=\"white-space:pre-wrap\">hkhgòkhgògò</p>\n    ',1,'2026-04-16 23:33:00'),(5,'partnership','Richiesta partnership: rrs — Salvatore Di Giovanni (salvodigiovanni2007@libero.it)','\n    <p><strong>Azienda:</strong> rrs</p>\n    <p><strong>Referente:</strong> Salvatore Di Giovanni</p>\n    <p><strong>Email:</strong> salvodigiovanni2007@libero.it</p>\n    <p><strong>Telefono:</strong> +393349760328</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">dddrrrrrrrrrr</p>\n  ',1,'2026-04-17 04:56:31'),(6,'contatto','Messaggio da cliente (formicus)','\n      <p><strong>Utente:</strong> formicus (cliente)</p>\n      <p><strong>Email di risposta:</strong> leonardodigiovanni@tiscali.it</p>\n      <p><strong>Messaggio:</strong></p>\n      <p style=\"white-space:pre-wrap\">ddddddddddd</p>\n    ',1,'2026-04-17 06:28:44'),(7,'ingegnere_edile','Richiesta Ingegnere Edile — leonardo di giovanni (leonardodigiovanni@tiscali.it)','\n    <p><strong>Nome:</strong> leonardo di giovanni</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> 3476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">mi serve progettare un villino a Trabia</p>\n  ',1,'2026-04-18 12:56:40'),(8,'contatto','Richiesta contatto: Leonardo Di Giovanni (leonardodigiovanni@tiscali.it)','\n      <p><strong>Nome:</strong> Leonardo Di Giovanni</p>\n      <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n      <p><strong>Cellulare:</strong> 4444444444444</p>\n      <p><strong>Messaggio:</strong></p>\n      <p style=\"white-space:pre-wrap\">rgfhfdhhdhdh</p>\n    ',1,'2026-04-18 12:58:12'),(9,'partnership','Richiesta partnership: pollo alluminio — leuccio (leonardodigiovanni@tiscali.it)','\n    <p><strong>Azienda:</strong> pollo alluminio</p>\n    <p><strong>Referente:</strong> leuccio</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> +393476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">ci occupiamo di alluminio taglio termico marche jdbgjbng</p>\n  ',1,'2026-04-18 13:01:24'),(10,'partnership','Richiesta partnership: azienda — leo (leonardodigiovanni@tiscali.it)','\n    <p><strong>Azienda:</strong> azienda</p>\n    <p><strong>Referente:</strong> leo</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> +393476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">dfsdfdfdffd</p>\n  ',1,'2026-04-20 14:43:14'),(11,'partnership','Richiesta partnership: falegnameria terzo — leonardo di giovanni (leonardodigiovanni@tiscali.it)','\n    <p><strong>Azienda:</strong> falegnameria terzo</p>\n    <p><strong>Referente:</strong> leonardo di giovanni</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> +393476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">possiamo produrre mobili</p>\n  ',1,'2026-04-20 19:24:31'),(12,'contatto','Richiesta contatto: Leonardo (leonardodigiovanni@tiscali.it)','\n      <p><strong>Nome:</strong> Leonardo</p>\n      <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n      <p><strong>Cellulare:</strong> 3476468185</p>\n      <p><strong>Messaggio:</strong></p>\n      <p style=\"white-space:pre-wrap\">asssssss</p>\n    ',1,'2026-04-26 01:10:23'),(13,'nuova_registrazione','Nuovo utente: polipo99_ (Salvatore Di Giovanni)','<p><strong>Nuovo utente in attesa di attivazione</strong></p>\n      <table style=\"border-collapse:collapse;font-size:14px\">\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Username</td><td><strong>polipo99_</strong></td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Nome</td><td>Salvatore Di Giovanni</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Email</td><td>fd393@libero.it</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Cellulare</td><td>3279991927</td></tr>\n        <tr><td style=\"padding:4px 12px 4px 0;color:#888\">Data registrazione</td><td>28/04/2026, 00:59:01</td></tr>\n      </table>',1,'2026-04-28 00:59:01'),(14,'richiesta_preventivo','Richiesta preventivo N° 20260430-000025','<strong>Richiesta preventivo N° 20260430-000025</strong><br/><br/><strong>Note del cliente:</strong><br/>ok<br/><br/><strong>Contatti forniti:</strong><br/>Email: leonardodigiovanni@tiscali.it<br/>Cellulare: +3934765468185<br/><br/><a href=\"/clienti/preventivi/25\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 11:01:00'),(15,'preventivo_inviato','Preventivo N° 20260430-000025 inviato a leonardo di giovanni','Preventivo inviato a <strong>leonardo di giovanni</strong> (leonardodigiovanni@tiscali.it).<br/><br/><a href=\"/clienti/preventivi/25\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 11:46:55'),(16,'richiesta_preventivo','Richiesta preventivo N° 20260430-000027','<strong>Richiesta preventivo N° 20260430-000027</strong><br/><br/><strong>Contatti forniti:</strong><br/>Email: leonardodigiovanni@tiscali.it<br/>Cellulare: +3934765468185<br/><br/><a href=\"/clienti/preventivi/27\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 11:51:07'),(17,'preventivo_inviato','Preventivo N° 20260430-000028 inviato a leonardo di giovanni','Preventivo inviato a <strong>leonardo di giovanni</strong> (leonardodigiovanni@tiscali.it).<br/><br/><a href=\"/clienti/preventivi/28\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 14:49:30'),(18,'richiesta_preventivo','Richiesta preventivo N° 20260430-000029','<strong>Richiesta preventivo N° 20260430-000029</strong><br/><br/><strong>Note del cliente:</strong><br/>sono il nipote dell\'ing Sclafani<br/><br/><strong>Contatti forniti:</strong><br/>Email: leonardodigiovanni@tiscali.it<br/>Cellulare: +3934765468185<br/><br/><a href=\"/clienti/preventivi/29\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 14:59:08'),(19,'preventivo_inviato','Preventivo N° 20260430-000030 inviato a leonardo di giovanni','Preventivo inviato a <strong>leonardo di giovanni</strong> (leonardodigiovanni@tiscali.it).<br/><br/><a href=\"/clienti/preventivi/30\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 15:01:58'),(20,'preventivo_accettato','Preventivo N° 20260430-000030 accettato','Il cliente ha <strong>accettato</strong> il preventivo <strong>N° 20260430-000030</strong>.<br/><br/><a href=\"/clienti/preventivi/30\" style=\"color:#1a4a8a;font-weight:bold;\">Apri preventivo →</a>',1,'2026-04-30 15:03:18'),(21,'contatto','Messaggio da admin (admin1)','\n      <p><strong>Utente:</strong> admin1 (admin)</p>\n      <p><strong>Email di risposta:</strong> leonardodigiovanni@tiscali.it</p>\n      <p><strong>Messaggio:</strong></p>\n      <p style=\"white-space:pre-wrap\">test invio interno da admin1</p>\n    ',1,'2026-05-05 11:00:37'),(22,'partnership','Richiesta partnership: Azienda 3 — leonardo di giovanni (leonardodigiovanni@tiscali.it)','\n    <p><strong>Azienda:</strong> Azienda 3</p>\n    <p><strong>Referente:</strong> leonardo di giovanni</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> +393476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">Vendiamo sogni</p>\n  ',1,'2026-05-05 11:01:42'),(23,'partnership','Richiesta partnership: Azienda 3 — leonardo di giovanni (leonardodigiovanni@tiscali.it)','\n    <p><strong>Azienda:</strong> Azienda 3</p>\n    <p><strong>Referente:</strong> leonardo di giovanni</p>\n    <p><strong>Email:</strong> leonardodigiovanni@tiscali.it</p>\n    <p><strong>Telefono:</strong> +393476468185</p>\n    <p><strong>Messaggio:</strong></p><p style=\"white-space:pre-wrap\">Vendiamo speranze</p>\n  ',1,'2026-05-05 11:02:09');
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
  `abbr` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listini`
--

LOCK TABLES `listini` WRITE;
/*!40000 ALTER TABLE `listini` DISABLE KEYS */;
INSERT INTO `listini` VALUES (13,'Trasporto','Generico','Trasporto gommato','pz',100.00,120.00,'','2026-04-30 09:33:16','2026-05-03 15:41:04',1,1,'/listini/13-foto-1777574599968.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/13-schema-1777573686223.png','',1,0,0,0,1,0,0,0,0,0,0.0000,''),(14,'Trasporto','Generico','Supplemento Trasporto gommato fuori il comune di Palermo','Km',10.00,20.00,'','2026-04-30 09:35:22','2026-05-03 15:41:02',1,1,'/listini/14-foto-1777574605720.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/14-schema-1777573682289.png','',1,0,0,0,1,0,1,0,0,0,0.0000,''),(15,'Trasporto','Generico','Supplemento Piano (senza ascensore)','Piano',5.00,10.00,'','2026-04-30 09:39:30','2026-05-03 15:40:59',1,1,'/listini/15-foto-1777574747410.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/15-schema-1777573677547.png','',1,0,0,0,1,1,0,0,0,0,0.0000,''),(16,'Spedizione','Generico','Spedizione con corriere DHL','kg',2.00,3.00,'','2026-04-30 09:42:16','2026-05-03 15:40:52',1,1,'/listini/16-foto-1777562061298.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/16-schema-1777573671868.png','',1,0,0,0,1,0,0,1,0,0,0.0000,''),(17,'Montaggio','Generico','Montaggio e siggillatura porta o finestra alluminio/PVC','pz',10.00,80.00,'','2026-04-30 13:18:31','2026-05-03 15:40:14',1,1,'/listini/17-foto-1777572933718.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/17-schema-1777573622549.png','',1,0,0,0,1,0,0,0,0,0,0.0000,''),(18,'Montaggio','Generico','Montaggio Porta Blindata con falsotelaio','pz',200.00,300.00,'','2026-04-30 13:19:55','2026-05-03 15:40:18',1,1,'/listini/18-foto-1777573280604.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/18-schema-1777573632282.png','',1,0,0,0,1,0,0,0,0,0,0.0000,''),(19,'Montaggio','Generico','Montaggio Porta Blindata senza falsotelaio','pz',10.00,100.00,'','2026-04-30 13:21:15','2026-05-03 15:40:19',1,1,'/listini/19-foto-1777573292348.png',NULL,NULL,NULL,NULL,0,NULL,10.00,'/listini/19-schema-1777573639474.png','',1,0,0,0,1,0,0,0,0,0,0.0000,''),(20,'Infissi in alluminio','ALSistem','fisso','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:50:57','2026-05-03 21:24:06',1,1,'/listini/20-foto-1777559024945.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/20-schema-1777558932766.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'F'),(21,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:52:09','2026-05-03 21:22:20',1,1,'/listini/21-foto-1777558993079.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/21-schema-1777559087308.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.8500,'R'),(22,'Infissi in alluminio','ALSistem','finestra 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:54:11','2026-05-03 21:23:09',1,1,'/listini/22-foto-1777559012008.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/22-schema-1777559252330.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'AR'),(23,'Infissi in alluminio','ALSistem','finestra 3 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:54:56','2026-05-03 21:23:28',1,1,'/listini/23-foto-1777559014604.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/23-schema-1777559279056.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'AAA'),(24,'Infissi in alluminio','ALSistem','finestra abbinata 1 anta + 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:55:53','2026-05-03 21:23:55',1,1,'/listini/24-foto-1777559022197.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/24-schema-1777559120249.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'RAA'),(25,'Infissi in alluminio','ALSistem','finestra 4 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:56:54','2026-05-03 21:23:38',1,1,'/listini/25-foto-1777559019124.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/25-schema-1777559239586.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'AAAA'),(26,'Infissi in alluminio','ALSistem','vasistas','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:57:45','2026-05-03 21:24:47',1,1,'/listini/26-foto-1777559039792.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/26-schema-1777559318516.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'V'),(27,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta + fisso laterale','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:58:11','2026-05-03 21:22:32',1,1,'/listini/27-foto-1777559001980.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/27-schema-1777842826541.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'FR'),(28,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta + fisso sopraluce','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:58:43','2026-05-03 21:22:46',1,1,'/listini/28-foto-1777559008013.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/28-schema-1777842836969.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'SR'),(29,'Infissi in alluminio','ALSistem','porta finestra 1 anta ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:59:12','2026-05-03 21:24:21',1,1,'/listini/29-foto-1777559028666.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/29-schema-1777559304133.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'P'),(30,'Infissi in alluminio','ALSistem','porta finestra 2 ante ribalta','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 13:59:54','2026-05-03 21:24:32',1,1,'/listini/30-foto-1777559032613.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/30-schema-1777559177398.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'PP'),(31,'Infissi in alluminio','ALSistem','porta finestra 3 ante','m²',100.00,200.00,'dimensioni massime L= / H=','2026-04-30 14:00:22','2026-05-03 21:24:41',1,1,'/listini/31-foto-1777559036855.png',NULL,NULL,NULL,6,0,NULL,10.00,'/listini/31-schema-1777559200698.png','3G SYSTEM REVOLUTION',1,0,1,1,1,0,0,0,1,1,0.0000,'PPP'),(32,'Infissi in alluminio','ALSistem','Colore RAL 9010','--',0.00,0.00,'','2026-04-30 22:45:27','2026-05-03 19:29:09',1,1,'/listini/32-foto-1777597348594.png',NULL,NULL,NULL,6,0,NULL,-10.00,'/listini/32-schema-1777596966248.png','3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,''),(33,'Infissi in alluminio','ALSistem','Colore RAL 9001','--',0.00,0.00,'','2026-04-30 22:46:37','2026-05-03 21:11:43',1,1,'/listini/33-foto-1777597485180.png',NULL,NULL,NULL,6,0,NULL,0.00,'/listini/33-schema-1777596971068.png','3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,''),(34,'Infissi in alluminio','Vetro','Vetro 8-12-8 B.E.','m²',40.00,60.00,'','2026-04-30 22:48:40','2026-05-03 20:35:22',1,1,'/listini/34-foto-1777597256119.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/34-schema-1777596935178.png','Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,''),(35,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6','m²',45.00,66.00,'','2026-04-30 22:50:41','2026-05-03 20:35:20',1,1,'/listini/35-foto-1777597248325.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/35-schema-1777596947861.png','Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,''),(36,'Infissi in alluminio','Vetro','Nessun vetro','m²',0.00,0.00,'','2026-05-03 17:48:40','2026-05-03 18:10:16',1,1,'/listini/36-foto-1777830566750.png',NULL,NULL,NULL,NULL,0,NULL,0.00,'/listini/36-schema-1777830586309.png','Vetro',0,1,0,0,0,0,0,0,0,1,0.0000,''),(37,'Infissi in alluminio','ALSistem','Colore RAL 9070','--',0.00,0.00,'','2026-05-03 19:26:17','2026-05-03 21:14:06',1,1,'/listini/37-foto-1777842846567.png',NULL,NULL,NULL,6,0,NULL,-15.00,'/listini/37-schema-1777836533345.png','3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,''),(38,'Infissi in alluminio','ALSistem','Colore RAL 9002','--',0.00,0.00,'','2026-05-03 19:31:54','2026-05-03 19:34:03',1,1,'/listini/38-foto-1777836767971.png',NULL,NULL,NULL,6,0,NULL,0.00,'/listini/38-schema-1777836776725.png','3G SYSTEM REVOLUTION',0,1,0,0,0,0,0,0,1,0,0.0000,''),(39,'Infissi in PVC','Generico','Generico','m²',0.00,1.00,'','2026-05-16 12:43:56','2026-05-16 12:44:27',1,1,NULL,NULL,NULL,NULL,NULL,0,NULL,0.00,NULL,'Generico',1,1,0,0,0,0,0,0,0,0,0.0000,'');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `stato` enum('bozza','richiesto','inviato','accettato','rifiutato','scaduto','annullato') NOT NULL DEFAULT 'bozza',
  `importo` decimal(10,2) NOT NULL DEFAULT '0.00',
  `data` date NOT NULL,
  `validita_giorni` int NOT NULL DEFAULT '30',
  `note` text,
  `visibile_cliente` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `creato_da` varchar(100) DEFAULT NULL,
  `sconto_cliente_pct` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preventivi`
--

LOCK TABLES `preventivi` WRITE;
/*!40000 ALTER TABLE `preventivi` DISABLE KEYS */;
INSERT INTO `preventivi` VALUES (47,'20260505-000047',1,'Carrello','bozza',1893.12,'2026-05-05',30,NULL,1,'2026-05-05 15:35:16','formicus',6.00),(48,'20260505-000048',1,'Carrello','bozza',1893.12,'2026-05-05',30,NULL,1,'2026-05-05 15:43:40','formicus',6.00);
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=143 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preventivo_articoli`
--

LOCK TABLES `preventivo_articoli` WRITE;
/*!40000 ALTER TABLE `preventivo_articoli` DISABLE KEYS */;
INSERT INTO `preventivo_articoli` VALUES (125,47,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta',21,200.00,'m²','','',NULL,211.00,122.00,0,1,463.36,NULL,'2026-05-05 15:35:16',10.00,NULL),(126,47,'Infissi in alluminio','ALSistem','Colore RAL 9001',33,0.00,'--','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-05-05 15:35:16',0.00,125),(127,47,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6',35,66.00,'m²','','',NULL,211.00,122.00,1,1,169.90,NULL,'2026-05-05 15:35:16',0.00,125),(128,47,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta',21,200.00,'m²','','',NULL,211.00,133.00,1,2,1010.27,NULL,'2026-05-05 15:35:16',10.00,NULL),(129,47,'Infissi in alluminio','ALSistem','Colore RAL 9001',33,0.00,'--','','',NULL,0.00,0.00,1,2,0.00,NULL,'2026-05-05 15:35:16',0.00,128),(130,47,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6',35,66.00,'m²','','',NULL,211.00,133.00,1,2,370.43,NULL,'2026-05-05 15:35:16',0.00,128),(132,47,'Infissi in alluminio','ALSistem','Colore RAL 9002',38,0.00,'--','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-05-05 15:35:16',0.00,131),(133,47,'Infissi in alluminio','Vetro','Nessun vetro',36,0.00,'m²','','',NULL,44.00,44.00,1,1,0.00,NULL,'2026-05-05 15:35:16',0.00,131),(135,47,'Infissi in alluminio','ALSistem','Colore RAL 9002',38,0.00,'--','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-05-05 15:35:16',0.00,134),(136,47,'Infissi in alluminio','Vetro','Nessun vetro',36,0.00,'m²','','',NULL,122.00,44.00,1,1,0.00,NULL,'2026-05-05 15:35:16',0.00,134),(137,48,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta',21,200.00,'m²','','',NULL,211.00,122.00,0,1,463.36,NULL,'2026-05-05 15:43:40',10.00,NULL),(138,48,'Infissi in alluminio','ALSistem','Colore RAL 9001',33,0.00,'--','','',NULL,0.00,0.00,1,1,0.00,NULL,'2026-05-05 15:43:40',0.00,137),(139,48,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6',35,66.00,'m²','','',NULL,211.00,122.00,1,1,169.90,NULL,'2026-05-05 15:43:40',0.00,137),(140,48,'Infissi in alluminio','ALSistem','finestra 1 anta ribalta',21,200.00,'m²','','',NULL,211.00,133.00,0,2,1010.27,NULL,'2026-05-05 15:43:40',10.00,NULL),(141,48,'Infissi in alluminio','ALSistem','Colore RAL 9001',33,0.00,'--','','',NULL,0.00,0.00,1,2,0.00,NULL,'2026-05-05 15:43:40',0.00,140),(142,48,'Infissi in alluminio','Vetro','Vetro 6-18 Argon -6',35,66.00,'m²','','',NULL,211.00,133.00,1,2,370.43,NULL,'2026-05-05 15:43:40',0.00,140);
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
INSERT INTO `preventivo_templates` VALUES (1,'Template preventivo','<div style=\"font-family:Arial,Helvetica,sans-serif;width:794px;min-height:1050px;padding:40px 50px 90px;position:relative;background:#fff;box-sizing:border-box;\">\r\n\r\n  <!-- HEADER -->\r\n  <table style=\"width:100%;margin-bottom:20px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:52px;margin-bottom:10px;display:block;\"/>\r\n        <div style=\"font-size:17px;font-weight:bold;color:#1a3a5c;\">Digi Home Design S.r.l.</div>\r\n        <div style=\"font-size:11px;color:#555;line-height:1.7;margin-top:4px;\">\r\n          Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>\r\n          P.IVA: 07407080824<br/>\r\n          Tel: +39 351 871 6731<br/>\r\n          info@digi-home-design.com\r\n        </div>\r\n      </td>\r\n      <td style=\"vertical-align:top;text-align:right;width:50%;\">\r\n        <img src=\"/images/nome_tr.png\" alt=\"Logo 2\" style=\"height:52px;\"/>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 20px;\"/>\r\n\r\n  <!-- DESTINATARIO + META -->\r\n  <table style=\"width:100%;margin-bottom:22px;border-collapse:collapse;\">\r\n    <tr>\r\n      <td style=\"vertical-align:top;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;\">Data</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{data}}</div>\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin:8px 0 2px;\">Rif. N°</div>\r\n        <div style=\"font-size:13px;font-weight:bold;\">{{numero}}</div>\r\n      </td>\r\n      <td style=\"vertical-align:top;text-align:right;width:50%;\">\r\n        <div style=\"font-size:10px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px;\">Spett.le</div>\r\n        <div style=\"font-size:15px;font-weight:bold;color:#1a3a5c;\">{{cliente_nome}}</div>\r\n        <div style=\"font-size:12px;color:#555;margin-top:4px;line-height:1.6;\">{{cliente_indirizzo}}</div>\r\n      </td>\r\n    </tr>\r\n  </table>\r\n\r\n  <!-- OGGETTO -->\r\n  <div style=\"font-size:13px;margin-bottom:10px;\">\r\n    <strong>Oggetto:</strong> Bozza di preventivo\r\n  </div>\r\n\r\n  <!-- CORPO -->\r\n  <div style=\"font-size:13px;margin-bottom:22px;line-height:1.7;\">\r\n    Gentile Cliente,<br/>\r\n    Vi rimettiamo la nostra offerta escluso IVA di:\r\n  </div>\r\n\r\n  <!-- ARTICOLI -->\r\n  {{articoli}}\r\n\r\n  <!-- TOTALE -->\r\n  <div style=\"text-align:right;margin-top:22px;padding:12px 16px;background:#f0f4fa;border-radius:4px;\">\r\n    <div style=\"font-size:11px;color:#555;margin-bottom:2px;\">Totale offerta (escluso IVA)</div>\r\n    <div style=\"font-size:22px;font-weight:bold;color:#1a3a5c;\">€ {{totale}}</div>\r\n  </div>\r\n\r\n  <!-- NOTE -->\r\n  {{note_block}}\r\n\r\n  <!-- FOOTER -->\r\n  <div style=\"position:absolute;bottom:24px;left:50px;right:50px;border-top:1px solid #ddd;padding-top:8px;font-size:9px;color:#888;text-align:center;line-height:1.6;\">\r\n    Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com — PEC digi_home_design_srl@namirialpec.it\r\n  </div>\r\n\r\n</div>',1,'2026-04-20 04:23:40','2026-04-28 19:34:07','preventivo'),(2,'Template Disegno Verticale','<div style=\"font-family:Arial,Helvetica,sans-serif;width:794px;height:1123px;padding:36px 44px 50px;box-sizing:border-box;overflow:hidden;position:relative;background:#fff;\"><div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;\"><img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:40px;display:block;\" /><img src=\"/images/nome_tr.png\" alt=\"\" style=\"height:40px;display:block;\" /></div><hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 10px;\" /><div style=\"text-align:right;font-size:10px;color:#666;margin-bottom:8px;\">{{data}}</div>{{titolo}}<div style=\"display:flex;justify-content:center;\">{{svg}}</div><div style=\"position:absolute;bottom:16px;left:44px;right:44px;border-top:1px solid #ddd;padding-top:5px;font-size:8px;color:#aaa;\">Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</div></div>',1,'2026-04-23 11:14:47','2026-04-23 11:37:08','disegno_portrait'),(3,'Template Disegno Orizzontale','<div style=\"font-family:Arial,Helvetica,sans-serif;width:1123px;height:794px;padding:36px 44px 50px;box-sizing:border-box;overflow:hidden;position:relative;background:#fff;\"><div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;\"><img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:40px;display:block;\" /><img src=\"/images/nome_tr.png\" alt=\"\" style=\"height:40px;display:block;\" /></div><hr style=\"border:none;border-top:2px solid #1a3a5c;margin:0 0 10px;\" /><div style=\"text-align:right;font-size:10px;color:#666;margin-bottom:8px;\">{{data}}</div>{{titolo}}<div style=\"display:flex;justify-content:center;\">{{svg}}</div><div style=\"position:absolute;bottom:16px;left:44px;right:44px;border-top:1px solid #ddd;padding-top:5px;font-size:8px;color:#aaa;\">Digi Home Design S.r.l. — Via Roberto Antiochia 3, 90121 Palermo (PA) — P.IVA 07407080824 — Tel +39 351 871 6731 — info@digi-home-design.com</div></div>',1,'2026-04-23 11:14:47','2026-04-23 11:37:08','disegno_landscape'),(5,'Template Preventivo Provvisorio','<table style=\"width:100%;margin-bottom:14px;border-collapse:collapse;\"><tr><td style=\"vertical-align:top;width:50%;\"><img src=\"/images/dg-t.png\" alt=\"Logo\" style=\"height:46px;margin-bottom:7px;display:block;\"/><div style=\"font-size:15px;font-weight:bold;color:#1a3a5c;\">Digi Home Design S.r.l.</div><div style=\"font-size:10px;color:#555;line-height:1.55;margin-top:3px;\">Via Roberto Antiochia 3, 90121 Palermo (PA)<br/>P.IVA: 07407080824 &nbsp;|&nbsp; Tel: +39 351 871 6731<br/>info@digi-home-design.com</div></td><td style=\"vertical-align:top;text-align:right;width:50%;\"><img src=\"/images/nome_tr.png\" alt=\"Logo 2\" style=\"height:46px;\"/></td></tr></table><hr style=\"border:none;border-top:2px solid #3a3a5c;margin:0 0 12px;\"/><table style=\"width:100%;margin-bottom:12px;border-collapse:collapse;\"><tr><td style=\"vertical-align:top;width:50%;\"><div style=\"font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px;\">Data</div><div style=\"font-size:12px;font-weight:bold;\">{{data}}</div><div style=\"margin-top:10px;display:inline-block;background:#3a3a5c;color:#fff;font-size:10px;font-weight:bold;letter-spacing:.08em;padding:3px 10px;border-radius:3px;\">PREVENTIVO PROVVISORIO</div></td><td style=\"vertical-align:top;text-align:right;width:50%;\"><div style=\"font-size:9px;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:3px;\">Spett.le</div><div style=\"font-size:13px;font-weight:bold;color:#1a3a5c;\">{{cliente_nome}}</div></td></tr></table><div style=\"font-size:12px;margin-bottom:6px;\"><strong>Oggetto:</strong> Preventivo provvisorio</div><div style=\"font-size:11px;margin-bottom:8px;padding:8px 12px;background:#f5f5f0;border-left:3px solid #3a3a5c;line-height:1.5;color:#555;\">I prezzi indicati sono a listino e potrebbero variare in base alle dimensioni effettive e al sopralluogo tecnico. Il preventivo definitivo verrà emesso successivamente.</div><div style=\"font-size:12px;margin-bottom:14px;line-height:1.6;\">Vi rimettiamo la nostra stima indicativa dei seguenti articoli:</div>',1,'2026-04-26 21:00:58','2026-04-26 21:00:58','preventivo_provvisorio');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin1','aaa','admin',1,'Roberto','Admini','1980-02-03','bari','admin@mef.it',0,'+39 335 0000001',0,1,1),(2,'magazziniere','aaa','magazzino',1,'Enzo','Magazzini','1980-02-03','bari','magazzino@mef.it',0,'+39 335 0000002',0,1,1),(3,'ragioniere','aaa','ragioniere',1,'Carla','Ragionieri','1980-02-03','bari','ragioniere@mef.it',0,'+39 335 0000003',0,1,1),(4,'email','aaa','email',1,'Simonetta','Emaili','1980-02-03','bari','email@mef.it',0,'+39 335 0000004',0,1,1),(5,'mariorossi','aaa','ragioniere',0,'Mario','Rossi','1980-02-03','bari','mariorossi@libero.it',0,'+39 335 0000005',0,1,1),(6,'formicus','aaa','cliente',1,'leonardo','di giovanni','1972-12-23','palermo','leonardodigiovanni@tiscali.it',1,'3476468185',1,0,1),(7,'mario.rossi','aaa','ragioniere',1,'Mario','Rossi','1980-03-15','Roma','mario.rossi@digihomedesign.it',1,'+39 331 1234001',1,1,1),(8,'giulia.bianchi','aaa','cliente',1,'Giulia','Bianchi','1985-07-22','Milano','giulia.bianchi@digihomedesign.it',1,'+39 331 1234002',1,1,1),(9,'luca.verdi','aaa','venditore',1,'Luca','Verdi','1990-11-08','Napoli','luca.verdi@digihomedesign.it',1,'+39 331 1234003',1,1,1),(10,'andrea.neri','aaaa','admin',1,'Andrea','Neri','1988-05-30','Torino','andrea.neri@digihomedesign.it',1,'+39 331 1234004',1,1,1),(11,'sofia.russo','aaa','direttore',1,'Sofia','Russo','1975-09-12','Firenze','sofia.russo@digihomedesign.it',1,'+39 331 1234005',1,1,1),(12,'marco.ferrari','aaa','marketing',1,'Marco','Ferrari','1992-01-25','Bologna','marco.ferrari@digihomedesign.it',1,'+39 331 1234006',1,1,1),(13,'prova','aaa','dipendente',1,'provino','provetta','2000-01-01','palermo','prova@libero.it',1,'345999999',1,1,1),(14,'zigfffff','aaa','cliente',1,'Salvatore','Di Giovanni','2010-03-19','palermo','sd1927@libero.it',1,'3555555555',1,1,1),(15,'polipo99_','polipo99','cliente',1,'Salvatore','Di Giovanni','2026-04-13','palermo','fd393@libero.it',1,'3279991927',1,1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worklist`
--

LOCK TABLES `worklist` WRITE;
/*!40000 ALTER TABLE `worklist` DISABLE KEYS */;
INSERT INTO `worklist` VALUES (1,'bagno e cucina','piastrelle nere nel bagno secondario','prova','admin1','normale','in_corso','2026-04-12','2026-04-10 23:27:25'),(2,'bagno','entro mercoledi devi mettere la fuga.','giulia.bianchi','admin1','normale','da_fare','2026-04-15','2026-04-13 20:08:11');
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

-- Dump completed on 2026-05-16 17:38:04
