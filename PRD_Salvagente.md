# Product Requirements Document (PRD) - Salvagente

***

### 1. Visione sintetica del prodotto
**Salvagente** è una piattaforma interattiva e contemplativa, pensata per spazi fisici condivisi. Tramite la computer vision e il body/hand-tracking, trasforma il corpo umano nell'unico controller necessario per esplorare un ecosistema di mini-esperienze digitali. Promuove la "riappropriazione degli spazi mentali, fisici e digitali" abbattendo la barriera delle UI rigide: il sistema reagisce in modo organico e fluido alla presenza umana, divenendo esso stesso uno spazio arioso, vitale e senza confini.

### 2. Problem statement
Negli ambienti digitali classici, l'interazione è mediata da device esterni o costretta all'interno di interfacce rigide (a griglia) che impongono un enorme carico cognitivo all'utente, allontanandolo dalla consapevolezza del proprio respiro e fisicità. Negli eventi pubblici, le installazioni digitali affrontano tassi di abbandono elevati a causa di un *onboarding* faticoso, istruzioni incomprensibili scritte in piccolo, e una mancanza di feedback immediato tra corpo e macchina che inibisce la spontaneità.

### 3. Product goals
*   **Meraviglia istantanea (*Time-to-Wow < 3s*)**: Il sistema deve attrarre visivamente e far capire all'utente che sta reagendo al suo corpo in pochissimi istanti.
*   **Fluidità esplorativa**: Permettere la navigazione naturale dello spazio e la selezione di percorsi (le mini-app) senza percezioni di sforzo tecnologico.
*   ***Zero-friction Onboarding***: Eliminare tutorial testuali invasivi, click a vuoto e procedure di login, supportando una fruizione "hit-and-run" in contesti dinamici come eventi o mostre.
*   **Emersione coerente del Brand**: Stabilire "Salvagente" come entità dotata di identità viva e respirante, con l'identità istituzionale di Naqah percepita chiaramente ma con garbo.

### 4. Non-goals
*   NON è una piattaforma di utilità basata su form e tabelle.
*   NON traccia, raccoglie o salva dati sensibili per sessioni successive o Analytics legati alle identità (niente account utente o log in).
*   NON usa interazioni faticose prolungate che possano generare il "Gorilla Arm effect" (esaurimento muscolare da braccio alzato).
*   NON è un'esperienza competitiva, gamificata con punteggi, o focalizzata sull'adrenalina.

### 5. Utente tipo in contesto evento
L'**Esploratore Curioso**: è in movimento in un ambiente rumoroso o affollato. Ha un'attenzione frammentata e un perimetro decisionale limitato. Cerca, per induzione, momenti di evasione, relax o un banale svago artistico. Se il sistema lo ingaggia reagendo armonicamente alla sua presenza, è disposto a rallentare e dedicare dai 2 ai 5 minuti di totale attenzione immersiva. Se l'interfaccia sembra difficile o si sente giudicato, abbandona.

### 6. Perché la scelta delle bolle fluttuanti è coerente con Salvagente
Il concetto di bolla evoca leggerezza, aria, assenza di margini spigolosi e organicità. Riformula il confine rigido dello schermo web in uno specchio d'acqua o nell'atmosfera di gravità zero. Andare incontro a una bolla significa cercare un respiro prolungato. Le bolle si muovono e fluttuano reagendo allo spazio attorno a loro: un perfetto specchio concettuale della "riappropriazione spaziale", contrapposta alla logica oppressiva di una cartella desktop statica e senza vita. 

### 7. Principi UX fondamentali
*   **Reattività ambientale**: Il mondo digitale non "aspetta di essere cliccato", ma oscilla, si sposta o si illumina non appena individua lo scheletro/mano dell'utente.
*   **Tolleranza spaziale (*Forgiving Hitboxes*)**: Le bolle hanno un'apertura magnetica. Il puntamento non dev'essere millimetrico (l'utente potrebbe tremare e muoversi).
*   **Profondità, non Scorrimento**: Non esiste la *scroll bar*. Si viaggia sull'asse Z (avvicinamento) o facendo fluttuare/muovere l'ambiente e facendo emergere elementi nuovi tramite parallasse.
*   **Rivelazione progressiva**: Il rumore visivo è mantenuto al minimo assoluto. Le informazioni dettagliate appaiono solo quando l'attenzione si concentra intenzionalmente su una specifica bolla.

### 8. Principi visuali e tonali
*   **Materia e Atmosfera**: Uso diffuso di layer atmosferici, profondità di campo (DOF), blur morbidi, materiali ispirati al glassmorphism o semitrasparenze liquide con color-grading calmi e meditativi (crepuscolo, alba, abissi caldi).
*   **UI Diegetica**: Non ci sono "pulsanti rettangolari", ma oggetti di scena con i quali interagire.
*   **Tipografia Evocativa**: Font san-serif moderni geometrici oppure contrasti eleganti usando serif di grandi dimensioni, per infondere pulizia e alta leggibilità. 
*   **Tono di voce**: Calmo, imperativo ma sussurrato, astratto.

### 9. Information architecture di alto livello
*   **Modalità Attesa (Attract Loop)**: Un ambiente pulsante silenzioso. Scritte flebili incitano il passante.
*   **L'Ecosistema (Root - Catalogo a bolle)**: L'ambiente multidimensionale esplorabile, le app fluttuano attorno.
*   **Lo Stato di Fuoco (Hover Detail)**: La bolla selezionata emerge, le altre arretrano fuori fuoco.
*   **L'Inabissamento (Transizione)**: La bolla copre lo schermo fluido e si apre la mini-app.
*   **Il Nucleo (La Mini-app)**: L'esperienza focalizzata.
*   **La Risalita (Ritorno)**: Con un gesto universale predefinito o tramite un orb sempre presente, si espande la scena e si torna al catalogo.

### 10. Flow utente ideale dall’aggancio iniziale all’uscita
1.  **Aggancio**: L'utente passa davanti al display. Il sistema, riconoscendolo, accende un fascio visivo o il suo riflesso nel background virtuale si deforma e lo inquadra al centro.
2.  **Apprendimento motore**: L'utente alza involontariamente la mano. Vede immediatamente un pointer morbido (es. un anello di luce) specchiare il moto dell'indice.
3.  **Esplorazione**: Facendo spostare l'anello luminoso nello spazio tridimensionale sposta l'ambiente. Passa vicinissimo a una bolla che si ingrandisce del 20%.
4.  **Innesco dell'Informazione**: Fermandosi sopra la bolla, compare il contesto della mini-app e la CTA fluttuante.
5.  **Pinch Action**: L'utente chiude pollice e indice. Un anello visivo di "caricamento interazione" si completa in 300-500ms al fine di evitare le chiusure accidentali da rumore algoritmico.
6.  **Submersion e Terminazione**: Entra nell'app, compie la sua esperienza e, a fine ciclo (o con uscita di emergenza), viene rimbalzato dolcemente in superficie, pronto per la prossima bolla o per abbandonare l'area.

### 11. Struttura concettuale del catalogo a bolle
Il browser non inquadra una "pagina", ma una "finestra stagna" che affaccia su uno scenario 2.5D/3D (es. usando shader WebGL, Three.js/React-Three-Fiber o logiche spaziali in librerie fisiche).
Le bolle hanno fisicità: orbitano pigramente, reagiscono l'una all'altra se appaiate. La navigazione del catalogo è determinata dalla cinetica della mano e non soffre restrizioni numeriche (se la collezione di esperienze cresce, l'universo diventa semplicemente più denso nei livelli non a fuoco). I confini dello schermo non sono respingenti ma porosi; le bolle possono fluttuare in "fuori onda" a destra per rientrare misteriosamente da sinistra.

### 12. Come l’utente scopre, comprende e seleziona una bolla
Il processo meccanico si suddivide in tre attriti crescenti:
*   **Magnetismo di scoperta**: Il pointer attrae impercettibilmente la bolla più vicina se l'intenzionalità della mano va nella sua direzione.
*   **Focus State calmo**: Una volta intersecata l'area di Hitbox, la bolla arresta il suo percorso organico, stabilizzando la visuale. L'utente *comprende* di avere un oggetto sotto mira.
*   **Intention Catching (Pinch to fill)**: Il gesto di chiusura delle dita attiva un *fill bar* o un cerchio di risonanza sulla bolla ("Hold to confirm"). Se si lascia la presa, il caricamento svanisce istantaneamente e dolcemente per preservare lo stato naturale delle cose; se esplode, l'azione parte.

### 13. Come mostrare gesto richiesto, descrizione e tipo esperienza prima dell’apertura
Sotto l'azione di *Hover/Focus State*, la bolla innesca una transizione materica elegante sul suo guscio protettivo:
*   Apre un "HUD diegetico" o un velo satinato (Glass/Blur) subito di fianco o sotto. 
*   **Titolo in evidenza** con la tipografia decisa del brand (es. "Risveglio").
*   **Descrizione** sottile, massimo dieci parole per restare scansionabili (es. "Scaccia la nebbia soffiando o muovendo le tue mani.").
*   **Gesto Richiesto**: A fianco del blocco testo o sul pulsante sorge un'icona semantica minimale e la dicitura del "Genere" stilizzata a tag (es. `[ ✨ Contemplativo ]` + `( Icona Pinch ) Pinch per immergerti`). L'iconografia del body tracking è essenziale allo svincolo logico del tutorialing, e dev'essere elegantissima.

### 14. Requisiti funzionali
*   Uso stringente del client-side inference per la computer vision (es. MediaPipe o simili), evitando invio di flussi live su server (fondamentale per la privacy su suolo espositivo).
*   Fluid management & shader engine (es. WebGL) capace di caricare e gestire le fisiche orbitali del main menu mantenendosi coerente con framerate stabili e ottime performances di calcolo.
*   Modulare ad Architettura "Container/Guest": Salvagente come Shell deve importare con stabilità il canvas o la vista delle singole mini-app come componenti child/iframe isolati, salvando lo state dell'app ospitante (event-bus registrati in globale).
*   Eventi uniformati e globali sulle gesturalità primarie (`onPinchStart`, `onPinchEnd`, `onHandLost`) da esporre come design system API al team di sviluppo delle mini-app.

### 15. Requisiti non funzionali
*   **Alta Performance / Bassa Latenza**: Obbligo di stabilità del framerate a +45fps. Droppare frame in un'installazione spaziale-cinetica induce mal di mare e la sensazione del "giocattolo guasto".
*   **Fallback temporizzato (Auto-Idle Timeout)**: Qualora un utente abbandoni l'esposizione fisicamente mentre era in mezzo all'uso di un'esperienza o tenendo incastrata l'AI, il sistema deve contare X secondi di assenza scheletro/viso per ripristinare soft lo stream iniziale di Salvagente.
*   **Zero motion-sickness e accessibilità ottica**: Niente stroboscopia, nessuna deviazione cromatica spinta o interfacce epilettiche tra le transizioni del container delle app e della root principale.

### 16. Direzione per branding e microcopy
**Gerarchia:**
*   Il wordmark di **Salvagente** primeggia con stile. Il lettering è morbido, accogliente e respirante, con molto spazio interlettera o un peso tipografico che sa farsi guardare senza aggredire l'occhio.
*   Il logo o l'etichetta di **Naqah** è inserita nelle core zones perimetrali (esempio in fondo allo schermo con un "*Presented by / A project by Naqah*") in opacità non intrusiva ma di grande riconoscibilità culturale dal vivo. Non offusca mai le bolle.

**Microcopy:**
*   Vocabolario empatico, positivo e non freddorso-tecnico (Mai: "Loading Data...", "Detecting Hand", "Error 404").
*   Evocare lo spostamento (Sì: "Torna a respirare", "Lasciati andare", "Sfiora per aprire"). 

### 17. Errori concettuali da evitare
*   **La Sindrome della 'Finta Freccina'**: Imporre la freccia del mouse disegnata o una riproduzione vettoriale di una mano (cursor mode) che si muove per lo schermo distrugge la magia visiva. Optare piuttosto per una scia chimica di luce morbida, particelle o deformatori spaziali legati al tracking della mano.
*   **Carousel Invisibile o Cover Flow banale**: Ridurre le bolle ad un mero *slick carousel* che scivola solo destra-sinistra lede totalmente l'idea di "assenza spaziale". Il menu *deve* avere gravità z o simulazioni simil-particellari.
*   **Costrizioni o "Muri di gomma" violenti**: Rimanendo incastrati nel telaio dello schermo. Se il catalogo reagisce alla profondità corporea, le bolle devono scivolare con *friction* e peso ponderati come astri. 
*   **BabelGestalt – La torre di Babele Gestuale**: Obbligare gli utenti a compiere gesti non previsti o mai istruiti nella vista a bolle. Si apprende all'entrata che si può stringere e muovere, si naviga e vive fino all'epilogo sfruttando un vocabolario noto e unificato.  

### 18. Roadmap consigliata di costruzione
1.  **Fase 1: Skeleton & Tracking Proof of Concept**: Validazione tecnica. Si crea l'environment puro, un canvas nero e si inserisce solo il modulo AI (MediaPipe o simile) tarando i framerates e calcolando la logica degli eventi pointer + pinch da telecamera (gestione rumore e smooth data points).
2.  **Fase 2: La Macchina del Respiro (Fisica)**: Si crea concettualmente l'universo del menu root. Utilizzando il tool 3d (es. React Three Fiber), si posizionano sfere volumetriche prive d'input con regole fisiche spaziali (fluidodinamica di base, repulsione e gravitazione) e si setta un renderer che ispiri alta suggestività emozionale allo sguardo.
3.  **Fase 3: Bridging Input & Interface**: Aggancio del pointer della telecamera alle hitbox delle bolle. Implementazione del sistema di *Magnetic Hover* e dell'UX UI *Pinch-to-Fill* per la conferma e l'apertura delle informazioni semantiche di testo per la scoperta delle app, con lo scaffolding dei Guest Components in React.
4.  **Fase 4: Transizioni e Integrazioni App**: Progettazione dell'effettiva animazione che connette il Root Ecosistema alla singola mini-experience isolata, con gestione degli stati di ripristino ("Ritorna/Esci" e la chiusura per timeout corporeo).
5.  **Fase 5: Fine Tuning Sensoriale e Stress Test ambientali**: Passaggio conclusivo di calibrazione dell'Attract Loop, inserimento dei loghi e stili di Naqah. Calibrazione in camera o ufficio con illuminazione estrema. Test con pubblico passivo inesperto per verificare l'immediatezza reale delle istruzioni in-app senza il costrutto verbale umano.
