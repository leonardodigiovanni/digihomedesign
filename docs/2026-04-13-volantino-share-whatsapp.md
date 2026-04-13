# Volantino — Condivisione WhatsApp

**Data:** 2026-04-13  
**Stato:** completato

## Obiettivo

Aggiungere un pulsante "Condividi su WhatsApp" nella pagina volantino che usa la Web Share API per inviare il file JPG direttamente a un contatto WhatsApp (o qualunque altra app di condivisione del dispositivo).

## Approccio tecnico

1. Al click, generare il canvas (stessa logica dell'export JPG)
2. Convertire il canvas in `Blob` → `File` (JPEG)
3. Chiamare `navigator.share({ files: [file], title: 'Volantino DIGI Home Design' })`
   - Su mobile (Android Chrome, iOS Safari): apre il pannello nativo → l'utente sceglie WhatsApp (o altro)
   - Su desktop dove la Web Share API non supporta file (`navigator.canShare` → false): mostrare un messaggio "Funziona sul cellulare — scarica il file e condividilo manualmente"
4. Gestire l'eventuale `AbortError` (utente ha annullato) senza mostrare errori

## File coinvolti

- `app/volantino/volantino-client.tsx` — aggiunta funzione `handleShareWhatsApp` e relativo pulsante

## UI

- Nuovo pulsante "Condividi WhatsApp" affiancato agli altri due (JPG / PDF)
- Stato di caricamento durante la generazione del canvas (stessa durata del JPG)
- Messaggio inline sotto i pulsanti se la Web Share API non è disponibile

## Note

- Nessun backend necessario
- Nessun pacchetto aggiuntivo (usa API browser nativa)
- Su iOS il pannello share mostra WhatsApp solo se l'app è installata
