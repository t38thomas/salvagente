# PRD Salvagente

**Visione sintetica del prodotto**
Salvagente è una teca digitale, uno spazio curato e contemplativo di installazione interattiva. Consiste in un contenitore web esplorabile esclusivamente tramite la presenza e il movimento del corpo (hand tracking). Nato sotto il marchio istituzionale dell'associazione **Naqah**, si presenta non come un software, ma come una *soglia*. Offre esperienze brevi e poetiche ideate per disinnescare l'ansia tecnologica e invitare l'utente a un atto di riconnessione: una riappropriazione consapevole dello spazio mentale, fisico (il proprio corpo) e digitale (l'interazione con l'algoritmo).

**Problem statement**
Nelle fiere, negli eventi e nella vita digitale quotidiana l'essere umano è sottoposto a un perpetuo sovraccarico cognitivo. Gli schermi digitali impongono comportamenti passivi, posture rigide e logiche di interazione frenetiche (scrolling, clicking). In uno spazio affollato, manca un momento di "decongestione". La tecnologia viene usata per saturare l'attenzione, anziché per sospenderla. Le persone hanno disimparato a giocare con i propri limiti spaziali in modo spontaneo.

**Product goals**
*   **Time-to-Magic immediato:** Riconoscimento della persona e risposta visiva in meno di 2 secondi, senza che questa debba capire "come funziona".
*   **Manifesto Interattivo:** Trasporre in forma esperienziale il tema della "riappropriazione degli spazi" senza spiegarlo a parole; deve essere insito nello sforzo fisico e nell'impatto visivo.
*   **Catalogo Naturale:** Offrire una navigazione che utilizzi paradigmi spaziali (raggiungere, spingere, avvicinare) al posto di paradigmi computazionali (selezionare, cliccare).
*   **Stand-alone espositivo:** Funzionare in perfetta autonomia come un totem o un'installazione, resettandosi elegantemente per il prossimo utente.

**Non-goals**
*   **Non è una tech demo astratta:** Non stiamo vendendo o esibendo la bravura tecnica della computer vision. La tecnologia deve scomparire dietro l'estetica.
*   **Nessuna persistenza:** Nessuna registrazione, nessun salvataggio, nessun account. Salvagente vive solo nel "qui e ora".
*   **Nessuna gamification tossica:** Zero punteggi, timer ansiogeni o leaderboard. Il successo è nell'esperienza stessa.
*   **Non è per il Mobile (per ora):** Esperienza e architettura vanno ottimizzate per desktop in un setup espositivo (schermo discreto/grande e webcam fissa).

**Utente tipo in contesto evento**
**"Il viandante saturato"**. Una persona che passeggia tra stand ed eventi, con l'attenzione ormai frammentata. Potrebbe non essere un utente tecnico. Prova un istintivo imbarazzo a compiere gesti plateali in pubblico ("sindrome da Kinect"). Ha pochissima pazienza per leggere istruzioni. Ha bisogno di sentirsi al sicuro, accompagnato e visivamente gratificato fin dal primissimo movimento impercettibile della mano.

**Principi UX fondamentali**
*   **Micro-Onboarding Cinematografico:** L'unica cosa che l'utente deve imparare è un gesto di innesco. Lo imparerà vedendo un'ombra a schermo o un'iconografia morbidissima prima dell'ingresso nella mini-app, mai leggendo un paragrafo.
*   **Cura del Gorilla Arm (Fatica del Braccio):** I gesti per mantenere attiva la piattaforma o navigare non devono richiedere di tenere le mani alzate per troppo tempo. L'interazione deve poter essere cullata dal basso del bacino all'altezza del petto.
*   **Forgiveness (Tolleranza Intelligente):** Se la detection fallisce o c'è un glitch, la UI non deve "scattare" o rompere l'immersione, ma sfumare (es. decadimento fluido, rallentamento, particelle che cadono come povere) per poi riprendere.
*   **Ritorno alla Sorgente (Bail out):** Uscire da una mini-app e tornare al catalogo deve essere istintivo. (Es. abbassare le mani lungo i fianchi per 3 secondi innesca il ritorno al catalogo). Nessun tasto X angolare.

**Principi visuali e tonali**
*   **Estetica Liminale e Organica:** Zero spigoli, zero menu a tendina, niente griglie rigide. L'UI è fluida, liquida o particellare. Si fa forte uso di sfocature eleganti (glassmorphism molto misurato), gradienti scuri, profondità di campo.
*   **Dark Mode Contemplativa:** Colori di sfondo profondi e immateriali, dove gli elementi interattivi sono sorgenti di luce.
*   **Presenza di "Naqah":** Il brand organizzatore appare in calce o in forma filigranata come istituzione garante ("a Naqah space"). Non domina l'interfaccia, agisce sottovoce.
*   **Effetto Sensoriale:** Poiché per ora non avremo audio ambientale per il contesto rumoroso, tutto il peso risiede sul visual feedback, che deve far "sentire" la materia elettronica (rimbalzi in overshooting calibrati, tensioni viscoelastiche nelle gesture).

**Information architecture di alto livello**
Struttura totalmente *Flat e Circolare*. Non c'è profondità gerarchica da esplorare.
*   **Layer 0 (Core System):** Inizializzazione della camera e modello di rilevamento in background, completamente nascosto.
*   **Layer 1 (The Threshold / Il Catalogo):** Homepage di benvenuto e catalogo. Uno spazio reattivo costellato di stanze/bolle.
*   **Layer 2 (L'Esperienza):** L'isolamento dentro una precisa mini-app.

*Flow architetturale:* L1 -> L2 -> L1

**Struttura del catalogo e logica delle categorie**
Il catalogo *è* la schermata iniziale e non si presenta come un grid. Può essere una composizione di forme organiche pulsanti nello spazio digitale, che si spostano ed espandono avvicinando la mano.
Le categorie fungono indirettamente da *filtri sulle gesture richieste* e sul *tipo di riappropriazione*:
*   **Categorie Emotive (e loro mapping tecnico implicito):**
    *   **Calibra:** Esperienze incentrate sul respiro e gesti dilatati (es. spostamento lento, mano aperta/chiusa per ingrandire sfere visive).
    *   **Plasma:** Esperienze basate sull'impronta (es. pittura generativa, pinching, scultura digitale).
    *   **Infrangi:** Esperienze dinamiche relative agli ostacoli spaziali (es. deviare flussi astratti, allontanare elementi disturbanti con il dorso della mano).

**Flow utente ideale dall’ingresso all’uscita**
1.  **Attrazione Passiva:** Lo schermo autonomamente genera particelle lente. Una persona passa davanti; le particelle subiscono una deviazione gravitazionale in reazione al corpo (tracking passivo per agganciare curiosità).
2.  **Attivazione:** La persona si sofferma. Il testo respira al centro: *"Solleva la mano"*.
3.  **Il Catalogo si Palesa:** Sollevando la mano, le esperienze sbocciano sulla scena accompagnando il polso. L'utente naviga chiudendo dolcemente il pugno o tenendo la mano sospesa (hover temporale prolungato) su una miniatura per confermare.
4.  **Soglia di Atterraggio:** Scompare il resto del catalogo, si mostra dinamicamente l'istruzione chiave per 3 secondi (es. sagoma minimale di due dita che si uniscono).
5.  **Mini-App:** L'utente esplora liberamente la riappropriazione spaziale per quanto tempo desidera. Nessuna UI distrae dall'interazione.
6.  **Reset Naturale:** L'utente abbassa le braccia smettendo di interagire. Una leggera overlay scende ad avvisare: "Torniamo a galla...". Dopo 2 secondi di abbassamento, torna al Layer 1 pronto per sé o per un altro avventore.

**Requisiti funzionali**
*   **Engine CV Centralizzato:** Il sistema deve caricare una volta sola il modello di ML (es: MediaPipe/TensorFlow.js) tenendolo attivo alla radice (`window` o state manager globale), propagando le coordinate (x,y,z, topology) a tutte le mini-app come stream di dati. Nessun ricaricamento passando tra le app.
*   **Router Morbido:** Sistema di transizione tra viste che non causi freeze visivi. Niente ricaricamenti di pagina nativi del browser.
*   **State Machine Globale per Hand Gestures:** Riconoscimento "di base" a livello di shell (es. Pugno, Mano Aperta, Pinch, Mano Abbassata) accessibile trasversalmente da ogni mini-app.
*   **Idle Timeout Gestito:** Se il modello non rileva volti/mani per un tot di secondi (es. 15s), la piattaforma innesca un hard-reset al Layer 1 annullando qualsiasi stato intermedio e riportandosi allo stato "Attrazione Passiva".

**Requisiti non funzionali**
*   **Inviolabilità del Framerate:** Mai scendere sotto i 30/60fps (in base al target). La fluidità è la grammatica e il dizionario del progetto. È preferibile degradare la complessità grafica piuttosto che avere scatti sulla lettura della mano.
*   **Near-Zero Latenza Percezione:** Il mapping tra i dati della cam e la UI deve apparire istantaneo. Necessario uso estremo di lerping/easing matematico per interpolare i frame e rendere la linea continua e setosa (anche a 15fps del modello, l'interfaccia deve animare a 60fps interpolando i dati).
*   **Autonomia Assoluta:** PWA o architettura statica che possa funzionare interamente *localhost/offline* all'interno del PC espositivo, senza dipendenze cloud in tempo reale.
*   **Privacy Integrata:** Tutto vive nella RAM del browser. Lo stream sorgente non viene e non verrà mai inviato in rete né bufferizzato su disco.

**Direzione per branding e microcopy**
*   **Titolarità:** "Salvagente". Il suono comunica qualcosa per tenersi a galla; sicurezza, rifugio nel momento di affanno cognitivo del web moderno.
*   **Logo/Iconografia:** Organico. Similmente al cerchio dell'Enso giapponese ma reso fluttuante; circolare da proteggere, vuoto al centro per farci dimorare lo spazio.
*   **Microcopy Poetico e Non Computazionale:**
    *   *Evitare:* "Errore webcam", "Clicca per avviare", "Seleziona gioco", "Riprova".
    *   *Usare:* "Abbiamos bisogno della tua presenza (cam disattivata)", "Avvicinati", "Esplora", "Lascia andare", "Respira qui".

**Errori concettuali da evitare**
*   **UI invadente:** Non devono esserci menu visibili in modo permanente. Nessuna "burger menu" nell'angolo, nessuna scrollbar a destra. Niente che ricordi all'utente che sta usando un "browser".
*   **Gesti complessi obbligatori:** Non fare affidamento ai gesti "simbolici" (es: formare una V con le dita) che per i sistemi CV consumer creano troppi falsi negativi e frustrazione se l'illuminazione dello stand è debole. Puntare a macro-gesti affidabili (Palmo aperto, Pugno chiuso, Posizione della mano nello schermo X/Y).
*   **Interazione "Telecomando":** Trasformare semplicemente la mano in un puntatore del mouse (usare il naso per muovere un puntatore dritto e sbattere su bottoni classici). Dobbiamo usare collisioni organiche, magnetismo temporale o swipe larghi.

**Roadmap consigliata di costruzione**

*Fase 1: Shell & Skeleton (La Base Tecnica)*
*   Implementazione unificata della WebCam View e dell'Engine di Computer Vision a livello App Shell.
*   Generazione dei context data/signals distribuiti per consumare lo stream in modo performante.
*   Test stress ambientale e performance base senza grafica.

*Fase 2: The Threshold (Il Portale)*
*   Realizzazione dell'Home Flow: lo spazio del catalogo che galleggia.
*   Implementazione della gesture "Hover-by-time" (navigo appoggiando la mano a mezz'aria su una zona per M secondi per entrarci).
*   Mockup fittizio di 3 card di app nel catalogo.

*Fase 3: Drop and Scale (Costruzione delle App)*
*   Costruzione delle prime 2 esperienze ("Hello world" concettuali del brand), con forte accento visuale e interattivo.
*   Implementazione della logica di entrata e di uscita ("Idle" o gesto di uscita dedicato).

*Fase 4: Polish, Transizioni & Onboarding visivo*
*   Inserimento dei flash instructables prima della miniapp.
*   Tuning massiccio dei pesi inerziali (lerping) sui cursori e sul rendering organico per la perfezione fisica dell'impatto.
*   Gestione degli Edge Case estetizzati (caduta del frameletting, uscita dall'inquadratura, mani multiple).

*Fase 5: Dry-Run in Contesto (Playtest Cieco)*
*   Mettere l'app in full-screen in un ambiente semi-pubblico (ufficio/studio) SENZA dire niente alle persone target.
*   Analizzare quanto tempo impiegano a capire *che reagisce a loro* e a compiere il primo varco verso un'esperienza. Eventuale ottimizzazione sul contrasto/significanti.
