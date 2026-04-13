# Salvagente: Miniapps Concept V1

## 1. Direzione Creativa Generale delle Mini-App di Salvagente

La piattaforma Salvagente non è pensata per "giocare" o compiere task utilitaristici. È un simulatore di presenza. La root experience (catalogo a bolle) stabilisce il patto: si usa lo spazio fisico per navigare lo spazio digitale. Le mini-app (Moduli) portano questo patto alle sue estreme conseguenze.

Ogni mini-app deve ruotare attorno a un singolo concetto legato alla "riappropriazione degli spazi mentali, fisici e digitali":
- **Pulizia visiva e mentale:** eliminare il rumore.
- **Riallineamento temporale:** costringere l'utente a muoversi lentamente.
- **Consapevolezza del limite:** dimostrare che il mondo digitale può essere effimero e riposante, anziché persistente e stressante.

**Vincoli UX/UI imposti:**
- Nessun tutorial on-screen: l'interazione (puntamento/pinch) deve produrre feedback immediati.
- Niente UI fittissima o bottoni minuscoli.
- Focus assoluto sul feedback visivo e sulla latenza azzerata (illusion of control).

---

## 2. 20 Idee Strutturate

### 1. Spazzaneve Digitale
1. **Nome:** Spazzaneve Digitale
2. **One-liner:** Cancella il rumore passando la mano come su un vetro appannato.
3. **Intenzione:** Catarsi visiva, sollievo, pulizia.
4. **Tema:** Riappropriarsi dello spazio mentale eliminando il sovraccarico di dati.
5. **Interazione:** Wiping continuo ("gomma" radiale).
6. **Gesture:** Pointer movement continuo.
7. **Flusso:** 1) Schermo saturo di testo caotico o UI fittizie impazzite. 2) Il pointer funge da area di pulizia. 3) L'utente passa la mano svelando uno sfondo vuoto monocromatico. 4) A schermo pulito, breve pausa. 5) Uscita.
8. **Output visivo:** Disintegrazione in particelle del layer sovrastante, reveal in maschera.
9. **In evento:** Gesto catartico plateale.
10. **Come mini-app:** Modulo isolato (Canvas 2D con masking).
11. **Fattibilità tecnica:** Alta.
12. **Rischi UX:** Noia se lo schermo è troppo grande da pulire.
13. **Semplificazione:** Usare un layer coprente uniforme anziché oggetti DOM complessi.
14. **Varianti:** Pulire nuvole digitali per rivelare un paesaggio calmo.
15. **Perché nel catalogo:** È l'ingresso antistress per eccellenza.
**(Voti: Coerenza 10 | Visiva 8 | Chiarezza 10 | Robusta 9 | V1 10 | Evento 9 | Modulo 10 | Multi: 9 - Tot: 75) - P.Forte: Immediatezza. P.Debole: Poco rigiocabile. Rischio: Fatica muscolare. Scintilla: Particelle lussuose al passaggio.**

### 2. Acqua Quieta
1. **Nome:** Acqua Quieta
2. **One-liner:** Lo specchio si increspa se ti muovi, si rasserena se ti fermi.
3. **Intenzione:** Disciplina fisica, contemplazione.
4. **Tema:** Imparare l'importanza della stasi corporea contro l'iper-cinesi.
5. **Interazione:** Assenza di movimento.
6. **Gesture:** Tracking della "velocity" del pointer (più è bassa, più l'acqua è calma).
7. **Flusso:** 1) Schermo mostra il camera feed distorto da turbolenze fluide. 2) Movimenti della mano generano onde violente. 3) L'utente capisce di doversi fermare. 4) Fermando la mano, le increspature svaniscono in 4 secondi rivelando un riflesso cristallino.
8. **Output visivo:** WebGL o CSS displacement shader sul camera feed.
9. **In evento:** La tensione di stare fermi in un luogo caotico è magneticamente potente.
10. **Come mini-app:** Usa il feed raw della videocamera applicando un post-processing shader.
11. **Fattibilità tecnica:** Media (shader performanti).
12. **Rischi UX:** Il noise intrinseco di MediaPipe potrebbe impedire la stasi "perfetta".
13. **Semplificazione:** Usare un threshold di "velocità accettabile" molto permissivo.
14. **Varianti:** Cambia i colori dell'acqua col passaggio del tempo.
15. **Perché nel catalogo:** Lavora in opposizione totale al "fare", insegnando il "non fare".
**(Voti: Coerenza 10 | Visiva 10 | Chiarezza 9 | Robusta 7 | V1 8 | Evento 10 | Modulo 8 | Multi: 8 - Tot: 70) - P.Forte: L'impatto "magico" del riflesso. P.Debole: Dipende dalla luminosità locale. Rischio: Tremore del tracking. Scintilla: Saturazione dinamica dell'acqua.**

### 3. Tensione Elastica
1. **Nome:** Tensione Elastica
2. **One-liner:** Tira un nodo invisibile dello schermo e rilascialo per generare un'onda cromatica.
3. **Intenzione:** Soddisfazione visivo-tattile, rilascio di tensione (flick).
4. **Tema:** Trasformare un'azione di trattenimento in un rilascio liberatorio.
5. **Interazione:** Pinch, Drag, Release.
6. **Gesture:** Pinch (hold) -> Move -> Release.
7. **Flusso:** 1) Griglia piana 2D a schermo. 2) Hover sul centro curva la griglia come un lenzuolo. 3) Pinch afferra il centro. 4) Trascinando indietro si crea tensione (distorsione visiva forte). 5) Rilasciando, lo scatto esplode in armonia di colori.
8. **Output visivo:** Modello di fisica "spring" vettoriale.
9. **In evento:** La teatralità del gesto di tirar l'arco è perfetta per chi guarda da fuori.
10. **Come mini-app:** Usa una libreria physics o bezier pura slegata dal resto.
11. **Fattibilità tecnica:** Alta.
12. **Rischi UX:** Un falso positivo di rilascio del pinch rompe subito la magia.
13. **Semplificazione:** Usare un raggio di "snap" molto alto per compensare track persi.
14. **Varianti:** Tirare corde che emettono suoni al rilascio (arpa digitale).
15. **Perché nel catalogo:** Enfatizza e si allena sulla gestualità fondamentale del Pinch di Salvagente.
**(Voti: Coerenza 8 | Visiva 9 | Chiarezza 10 | Robusta 8 | V1 10 | Evento 9 | Modulo 10 | Multi: 10 - Tot: 74) - P.Forte: Sensazione tattile del virtuale. P.Debole: Tematicamente leggero. Rischio: Perdita del pinch drop. Scintilla: Distorsione profonda dello spazio circostante prima del rilascio.**

### 4. Raccogliere la Luce
1. **Nome:** Raccogliere la Luce
2. **One-liner:** Attrai frammenti col palmo, uniscili in una sfera con un pinch.
3. **Intenzione:** Ordine dal caos, cura, focalizzazione.
4. **Tema:** Ricompattare i propri pensieri dispersi nello spazio digitale.
5. **Interazione:** Puntamento magnetico e sintesi.
6. **Gesture:** Pointer + Pinch (Trigger state).
7. **Flusso:** 1) Particelle caotiche fluttuano slegate. 2) Muovere la mano lentamente le "magnetizza" attirandole verso il pointer. 3) Avendone raccolte abbastanza, si chiude il pinch. 4) Si fondono in una grande bolla armonica che galleggia placida.
8. **Output visivo:** Canvas 2D basato su regole di swarm/flocking e attrazione gravitazionale.
9. **In evento:** Movimenti ampi e fluidi a braccia aperte.
10. **Come mini-app:** Logica particellare isolatissima e solida.
11. **Fattibilità tecnica:** Altissima.
12. **Rischi UX:** Similitudine a un salvaschermo se le particelle non hanno "peso" inerziale.
13. **Semplificazione:** Calcolo distanza radiale base senza flocking complesso.
14. **Varianti:** Cambiare la luce in base a quante particelle prendi.
15. **Perché nel catalogo:** Declina il Pinch non come click, ma come "contenimento".
**(Voti: Coerenza 9 | Visiva 8 | Chiarezza 9 | Robusta 10 | V1 10 | Evento 8 | Modulo 10 | Multi: 10 - Tot: 74) - P.Forte: Stabilità tecnica. P.Debole: Leggermente cliché (effetti particellari). Rischio: Nessuno. Scintilla: Fisica fluida stile miele viscoso, non punti sterili.**

### 5. Gravità Inversa
1. **Nome:** Gravità Inversa
2. **One-liner:** Solleva le mani per far cadere scatole verso il soffitto, chiudi il pinch per annullare.
3. **Intenzione:** Percezione di potere divino, padronanza delle regole fisiche.
4. **Tema:** Decostruire e ribaltare le costrizioni dello spazio fisico.
5. **Interazione:** Attrazione assiale.
6. **Gesture:** Move alto/basso + Pinch (rilascio gravità standard).
7. **Flusso:** 1) Scatole isometriche ammassate sul fondo. 2) Spostando il pointer verso l'alto dello schermo, si inverte la gravità gravitazionale localizzata. 3) Le scatole fluttuano su lente. 4) Pinzando, il "legame" si rompe e crollano realisticamente in basso.
8. **Output visivo:** Matter.js + Canvas per rendering 2.5D solido.
9. **In evento:** Il drop finale è fragoroso visivamente, eccellente per catturare sguardi.
10. **Come mini-app:** È una sandbox physics con un singolo input esterno (gravity Y inversion).
11. **Fattibilità tecnica:** Alta.
12. **Rischi UX:** Non c'è uno scopo chiaro se non guardare la fisica.
13. **Semplificazione:** Limitare gli oggetti a primitive leggere.
14. **Varianti:** Gravità radiale (attrarre tutto al centro del pointer).
15. **Perché nel catalogo:** Genera caos puro misurato da un Input precisissimo.
**(Voti: Coerenza: 7 | Visiva: 9 | Chiarezza: 10 | Robusta: 9 | V1: 9 | Evento: 10 | Modulo: 10 | Multi: 10 - Tot: 74) - P.Forte: Causa-effetto titanica. P.Debole: Tematicamente slegato dalla riappropriazione. Rischio: Corsa alle performance Canvas. Scintilla: Sonorizzazione generativa dello scontro dei blocchi.**

### 6. Geometria del Respiro
1. **Nome:** Geometria del Respiro
2. **One-liner:** Usa le due mani per "stirare" uno spazio vuoto finché non diventa il tuo polmone visivo.
3. **Intenzione:** Calibrazione interna.
4. **Tema:** Riconquista dello spazio corporeo usando l'intelligenza spaziale.
5. **Interazione:** Puntamento duale (Bimanuale).
6. **Gesture:** Distanza tra Pointer (Right) e Pointer (Left) - *richiede tracciamento multi-hand*.
7. **Flusso:** 1) Forma asimmetrica chiusa. 2) Con le due mani sblocchi i poli. 3) Inspira allargando le braccia, espira stringendole. 4) Se il ritmo è fluido (3s - 3s), la forma vibra in modo armonico, se troppo veloce "tossisce" digitalmente.
8. **Output visivo:** Grafica vettoriale pura SVG o distorsioni shader.
9. **In evento:** Costringe lo "stand in place" frontale assoluto.
10. **Come mini-app:** L'unica vera sfida di matematica multi-pointer pura.
11. **Fattibilità tecnica:** Media (se il multi-hand è supportato bene da CV v1).
12. **Rischi UX:** Difficoltà nel dare l'onboarding sul "usa due mani" senza testo.
13. **Semplificazione:** Tornare a singola mano: altezza Y della singola mano guida il volume.
14. **Varianti:** Cambia tonalità e volume al variare della distanza.
15. **Perché nel catalogo:** Inserisce il corpo e non solo la mano come controller.
**(Voti: Coerenza: 10 | Visiva: 7 | Chiarezza: 6 | Robusta: 7 | V1: 8 | Evento: 9 | Modulo: 9 | Multi: 9 - Tot: 65) - P.Forte: Connessione bio-fisica. P.Debole: Affidabilità tracciamento 2 mani. Rischio: Drop di una mano = riavvia gesto. Scintilla: Feedback fantasma guida quando l'utente si perde.**

### 7. Orologio di Sabbia
1. **Nome:** Orologio di Sabbia
2. **One-liner:** Trattieni la polvere digitale restando immobile, crolla se tremi.
3. **Intenzione:** Focus muscolare zen.
4. **Tema:** Preservare la memoria corporea dal rumore dell'ambiente.
5. **Interazione:** Posizione mantenuta (Hold position).
6. **Gesture:** Pointer + Bassa velocity.
7. **Flusso:** 1) Una cascata di sabbia digitale cade dall'alto. 2) Il pointer funge da piccolo "piatto". 3) L'utente deve prendere la sabbia centrandosi. 4) Più si sta fermi, più si impila. 5) Un micro tremore forte inclina il piatto e distrugge il mucchio.
8. **Output visivo:** Sandbox falling sand engine (come vecchi webgames falling sand).
9. **In evento:** Un gioco di equilibrio immediato.
10. **Come mini-app:** Render engine cellulare autonomo su grid 2D.
11. **Fattibilità tecnica:** Alta (ci sono script leggerissimi per cellulare automata falling sand).
12. **Rischi UX:** Frustrazione innescata dalle scarse condizioni di stabilità tracking fiera.
13. **Semplificazione:** La sabbia cade su un piano visivo senza complessi calcoli fisici laterali.
14. **Varianti:** Se raccogli 10 secondi di sabbia, essa solidifica in un cristallo.
15. **Perché nel catalogo:** Aggiunge un gradiente di difficoltà che richiede la fusione mente-hardware.
**(Voti: Coerenza 9 | Visiva 8 | Chiarezza 10 | Robusta 8 | V1 9 | Evento 9 | Modulo 10 | Multi: 10 - Tot: 73) - P.Forte: Paradigma del gioco d'equilibrio applicato all'arte. P.Debole: Tremore naturale penalizzante. Rischio: Frustrazione pura anziché zen. Scintilla: Sabbia luminescente e refrattiva in 2.5D.**

### 8. Lente della Calma
1. **Nome:** Lente della Calma
2. **One-liner:** Usa la lente della mano per svelare l'eleganza dietro una facciata rumorosa.
3. **Intenzione:** Rivelazione, guarigione ottica.
4. **Tema:** Ritrovare lo spazio mentale "scremando" l'apparenza digitale caotica.
5. **Interazione:** Esplorazione spaziale.
6. **Gesture:** Movimento base (Hovering).
7. **Flusso:** 1) Schermo denso di rumore statico/glitch video (incluso camera feed rovinato). 2) La mano è il centro di una grande "lente d'ingrandimento" sfuocata ai bordi. 3) Dentro quel raggio radiale, la realtà è perfetta, a colori sublimi, rallentata. 4) Passare la mano rivela lo scarto.
8. **Output visivo:** CSS mask-image combinato a doppio stream video/canvas ritardato.
9. **In evento:** Effetto ottico immediato che strega i passanti ("guarda cosa vede sotto").
10. **Come mini-app:** Struttura DOM sovrapposta.
11. **Fattibilità tecnica:** Altissima e a 60fps garantiti.
12. **Rischi UX:** Nessuno, è tecnicamente banale e intuitiva blind.
13. **Semplificazione:** (Intrinsecamente minimale).
14. **Varianti:** Rivelare messaggi nascosti invece del video reale.
15. **Perché nel catalogo:** L'esperienza più accessibile di tutte. Nessun fail state.
**(Voti: Coerenza 9 | Visiva 10 | Chiarezza 10 | Robusta 10 | V1 10 | Evento 9 | Modulo 10 | Multi: 10 - Tot: 78) - P.Forte: Magia garantita 100%. P.Debole: Meccanicamente poco innovativa. Rischio: Che sembri un tool standard CSS. Scintilla: Effetto di crono-rallentamento locale della webcam dentro la lente.**

### 9. Traccia Indelebile
1. **Nome:** Traccia Indelebile
2. **One-liner:** Dipingi col fumo volumetrico lo spazio digitale; sparisce appena ti annoi.
3. **Intenzione:** Sottolineo della transitorietà, bellezza dell'effimero.
4. **Tema:** Non si può possedere, ma solo abitare lo spazio per un istante.
5. **Interazione:** Calligrafia spaziale.
6. **Gesture:** Pinch prolungato + Movimento.
7. **Flusso:** 1) Buio. Pinch attivato fa sgorgare "inchiostro" fluttuante. 2) Cursore dipinge con uno spessore che cambia con la velocità. 3) Lasciando pinch, il tratto rimane visibile. 4) Dopo 5 secondi esatti evapora in pulviscolo atmosferico ascendente.
8. **Output visivo:** Ribbon generation su bezier con shader di erosione alfa.
9. **In evento:** Le persone faranno facce, firme, disegni di sé. Grande performatività.
10. **Come mini-app:** Motore vettoriale su canvas locale.
11. **Fattibilità tecnica:** Media (l'erosione procedurale è tricky in rendering base).
12. **Rischi UX:** Scollamento tra intenzione del disegno e latenza punta del dito (se c'è smoothing eccessivo).
13. **Semplificazione:** Fading out di opacity uniforme globale, invece di erosione disordinata.
14. **Varianti:** Uso di polvere luminescente invece di fumo.
15. **Perché nel catalogo:** Esalta la creatività generativa della persona riducendo il muro di vetro.
**(Voti: Coerenza 8 | Visiva 9 | Chiarezza 10 | Robusta 8 | V1 9 | Evento 10 | Modulo 9 | Multi: 8 - Tot: 71) - P.Forte: Espressiva. P.Debole: Semplice Drawing Tool. Rischio: Gli utenti si stuferanno in 10s se l'inchiostro non è visivamente spettacolare. Scintilla: L'erosione deve comportarsi fisicamente come inchiostro vero dilavato in acqua.**

### 10. Costruire il Vuoto
1. **Nome:** Costruire il Vuoto
2. **One-liner:** Tira via muri visivi di dati fino a crearti una vera "finestra".
3. **Intenzione:** Decostruzione liberatoria.
4. **Tema:** Riappropriarsi fisicamente asportando materiale opprimente.
5. **Interazione:** Grab and toss (Spostamento asintotico fuori schermo).
6. **Gesture:** Pinch + Movimento rapido out of bounds.
7. **Flusso:** 1) Un muro di mattonelle 2.5D (fake windows, fake dati). 2) Hover evidenzia una mattonella. 3) Pinch la fissa. 4) Lancio rapido a lato la spazza via e rivela l'azzurro/buio visivo e profondo. 5) Spacca un po' di "prigione" per fare respirare lo schermo.
8. **Output visivo:** Griglia CSS/DOM e semplici spring animations di throw out.
9. **In evento:** Il flick laterale della mano è violento, leggibile, sfogante per tutti.
10. **Come mini-app:** Stato della matrice di griglia isolato.
11. **Fattibilità tecnica:** Alta (DOM manipulation base, collision box banale).
12. **Rischi UX:** Incertezza fisica nel "flick" e pinch drop.
13. **Semplificazione:** Se rileva pointer down e poi "exit" veloce su asse X, elimina senza reale fisica vettoriale in drag attivo.
14. **Varianti:** Tirare le tende anziché rompere piastrelle.
15. **Perché nel catalogo:** È il modulo ludico per far sfogare l'energia prima della stasi.
**(Voti: Coerenza 9 | Visiva 8 | Chiarezza 10 | Robusta 8 | V1 9 | Evento 10 | Modulo 10 | Multi: 9 - Tot: 73) - P.Forte: Interazione aggressiva ma pulita. P.Debole: Meno estetico di altri module artistici. Rischio: Calcolo fine del drop-out. Scintilla: Rivelare un panorama in Parallasse totale dai buchi.**

### 11. Eco Cromatico
1. **Nome:** Eco Cromatico
2. **One-liner:** Il cursore dipinge l'ambiente ma sempre con 1 secondo di ritardo sulla tua mano: non devi anticipare, devi abituarti.
3. **Intenzione:** Dissonanza temporale e accoglienza del passato recente.
4. **Tema:** Spazio temporale: smettere di rincorrere l'immediato.
5. **Interazione:** Puntamento dislocato.
6. **Gesture:** Pointer + ritardo implementato artificialmente.
7. **Flusso:** 1) Lo schermo mostra te stesso in real time. 2) Un cursore di luce bellissima traccia scie, ma segue la posizione che la tua mano aveva 1 secondo fa. 3) Il cervello combatte, poi apprezza la danza a due che fa col passato.
8. **Output visivo:** Scia organica in post proccessing sopra il camera feed.
9. **In evento:** Creerà confusione momentanea poi grande fascinazione corporea.
10. **Come mini-app:** Array storage storico delle coordinate salvato in React State frametime.
11. **Fattibilità tecnica:** Altissima (banale circular buffer di posizioni).
12. **Rischi UX:** Può sembrare un bug ("il sistema ha lag").
13. **Semplificazione:** Evidente differenziazione visiva tra pointer vero trasparente e eco visibile.
14. **Varianti:** 3 echi a framerate diverso che si inseguono.
15. **Perché nel catalogo:** Manipola una variabile di sistema geniale senza scrivere una riga di WebGL complesso.
**(Voti: Coerenza 9 | Visiva 7 | Chiarezza 8 | Robusta 10 | V1 10 | Evento 7 | Modulo 10 | Multi: 10 - Tot: 71) - P.Forte: Concettualmente elevato e zero sforzo dev. P.Debole: Estetica legata solo al trail. Rischio: Frustrazione e chiusura immediata perché interpretato come bug. Scintilla: Disegnare una linea sottile tra la mano reale e l'eco (tipo collare del cane invisibile).**

### 12. Equilibrio di Lame
1. **Nome:** Equilibrio di Perno
2. **One-liner:** Una retta instabile è bilanciata al centro. Devi trovare il baricentro con minimi movimenti di polso.
3. **Intenzione:** Micromovimento e centratura totale.
4. **Tema:** Costruire uno spazio mentale di equilibrio puro al millimetro.
5. **Interazione:** Steering asse X.
6. **Gesture:** Movimenti orizzontali impercettibili (precision tracking).
7. **Flusso:** 1) Linea sottile dritta reclinata a caso (tiltata). 2) Un fulcro centrale. 3) Muovendo X il pointer fa spingere la linea o inclinare. L'obiettivo è riaverla a 0 gradi flat. 4) Raggiunto lo zero perfetto per 3 secondi si fonde in orizzonte azzurro e l'app si placa.
8. **Output visivo:** Canvas line math / rotate origin CSS puro.
9. **In evento:** Causa rigidità fisica, contrasto bellissimo.
10. **Come mini-app:** Mini physics asse Z/X.
11. **Fattibilità tecnica:** Alta (dipende solo da smoothing del core CV su asse X).
12. **Rischi UX:** Smoothing di Salvagente Core potrebbe azzoppare i micromovimenti necessari per bilanciare.
13. **Semplificazione:** Range di vincita "0 gradi" portato a +/- 5 gradi per non stancare.
14. **Varianti:** Pallina che ronza sulla barra.
15. **Perché nel catalogo:** La massima esaltazione dell'accuratezza del CV di Naqah.
**(Voti: Coerenza 10 | Visiva 6 | Chiarezza 9 | Robusta 7 | V1 9 | Evento 8 | Modulo 10 | Multi: 9 - Tot: 68) - P.Forte: Meccanica di precisione estrema. P.Debole: Graficamente minimale/povera se non trattata bene. Rischio: Latenza pointer rende impossibile l'incastro. Scintilla: Che la linea sia uno specchio curvo che si raddrizza rivelando una visuale pazzesca.**

### 13. Sincronia Liquida
1. **Nome:** Sincronia Liquida
2. **One-liner:** Due masse circolari a schermo. Una comandata da te, una dal sistema. Fai combaciare il loro moto.
3. **Intenzione:** Sintonizzazione su ritmi diversi dal proprio.
4. **Tema:** Adattarsi all'ambiente e riconnettersi trovando un ritmo comune.
5. **Interazione:** Inseguimento / Follow the lead.
6. **Gesture:** Pointer move lento (Matching speed).
7. **Flusso:** 1) Forma target galleggia placida disegnando curve a otto. 2) Il tuo pointer comanda un blob liquido. 3) Cerchi le stesse traiettorie tenendoti sopra il target. 4) Man mano che la sovrapposizione è costante, i blob si fondono, lo schermo divampa in luminosità calda e genera un accordo.
8. **Output visivo:** SVG Gooey filter / Metabal render 2D.
9. **In evento:** Richiede la danza del braccio fluida e ritmata come per fare tai-chi.
10. **Come mini-app:** Lavora su array X/Y e calcolo differenziale e bounding box continuo.
11. **Fattibilità tecnica:** Alta (Gooey SVG nativo su browser o canvas banale).
12. **Rischi UX:** Se le masse si scompongono troppo in fretta genera stress.
13. **Semplificazione:** Mettere il target invisibile tranne quando sbagli (sei fuori area), svelandolo se premi per ritrovare rotta.
14. **Varianti:** La massa respinge il pointer forte se non entri col piglio/velocità giusta.
15. **Perché nel catalogo:** Infonde uno stato di flow, la transizione per eccellenza per mente tranquilla.
**(Voti: Coerenza 9 | Visiva 8 | Chiarezza 10 | Robusta 10 | V1 10 | Evento 10 | Modulo 10 | Multi: 9 - Tot: 76) - P.Forte: Tai-Chi visuale. P.Debole: Concetto lineare e guidato. Rischio: Perdita di interesse rapido dopo fusione riuscita. Scintilla: Design dei Blob estremamente fotorealistico tipo vetro fuso/mercurio.**

### 14. Finestra Prospettica
1. **Nome:** Finestra Prospettica
2. **One-liner:** Guarda la stanza che sta dietro lo schermo muovendo la mano fisicamente ai margini.
3. **Intenzione:** Profondità e apertura dello spazio percepito.
4. **Tema:** Lo spazio digitale non è piatto, inganna lo stomaco ed estende la stanza fisica nell'altrove.
5. **Interazione:** Off-axis Projection Perspective (Parallax head tracking applicato a hand tracking).
6. **Gesture:** Posizione assoluta X/Y pointer mappata su inclinazione camera 3D o parallasse di livelli base.
7. **Flusso:** 1) L'esperienza simula la finestra verso uno spazio gigante (una radura 3D renderizzata in parallasse). 2) Muovendo la mano estrema X o estrema Y la camera ruota guardando lo spazio e le cose nascoste dietro la crepa della finestra.
8. **Output visivo:** Sistema multi-livello in CSS Transform 3d `perspective` con easing pazzeschi oppure React Three fiber.
9. **In evento:** Svela tridimensionalità sul piano 2.5D. Illusionismo puro.
10. **Come mini-app:** È l'apoteosi del layer management DOM 3D limitato a un box di stato.
11. **Fattibilità tecnica:** Alta (Parallax CSS è solidissimo in framework moderni React).
12. **Rischi UX:** Non c'è un'azione da fare a parte "guardare intorno".
13. **Semplificazione:** Usare DIV a 5 livelli z-index traslati in CSS X/Y inverso rispetto al pointer, zero WebGL.
14. **Varianti:** Cambiare tipo di panorama in base all'ora dell'installazione.
15. **Perché nel catalogo:** Enfatizza l'ambiente rispetto all'azione, allargando i muri angusti della venue.
**(Voti: Coerenza 9 | Visiva 10 | Chiarezza 10 | Robusta 10 | V1 10 | Evento 10 | Modulo 10 | Multi: 10 - Tot: 79) - P.Forte: Meraviglioso dal punto di vista prospettico, WOW garantito. P.Debole: Passiva, si fruisce solo per guardare. Rischio: Arte asset da preparare perfetti (illustrazioni layerizzate). Scintilla: Aggiungere profondità di campo variabile sulle linee Z (focus del blur che dipende dal pinch in/out).**

### 15. Nuvola di Nodi
1. **Nome:** Nuvola di Nodi
2. **One-liner:** Decostruisci una rete neurale digitale complessa pinchando al centro ed estraendo la sua radice.
3. **Intenzione:** Sbrogliare una matassa (intellettuale), alleviare pesantezza informatica.
4. **Tema:** Disinnescare la complessità del mondo digitale moderno.
5. **Interazione:** Pinch and Pull out prolungato.
6. **Gesture:** Pinch -> lunghissimo movimento lineare in allontanamento dal centro per sfilacciare.
7. **Flusso:** 1) Sfera fittissima simil Plexus Data. 2) Hover sul nucleo la accende. 3) Pinch la afferra. 4) Tirando lentissimamente (serve pazienza fìsica), l'ammasso perde i nodi collaterali. 5) Si sfilaccia fino a restare un nudo filo bianco innocuo.
8. **Output visivo:** Canvas 2D rete particles edges-based (tipo particles.js ma reverse-attractor).
9. **In evento:** Chiede lo sforzo di tirar via un lenzuolo pesante, con le spalle.
10. **Come mini-app:** Lavora su logica matematica vettoriale lineare.
11. **Fattibilità tecnica:** Media (il ricalcolo plexus realtime può laggare in browser weak).
12. **Rischi UX:** Lag pesantissimo del framework particles a 60fps sotto sforzo.
13. **Semplificazione:** Sfilacciare non proceduralmente ma su stage animati reattivi della "distanza drag" dal pinch start. (Keyframes).
14. **Varianti:** -
15. **Perché nel catalogo:** La vera antitesi alla complessità strutturale dei nodi IT.
**(Voti: Coerenza 8 | Visiva 9 | Chiarezza 9 | Robusta 6 | V1 7 | Evento 8 | Modulo 10 | Multi: 9 - Tot: 66) - P.Forte: Metafora della decostruzione eccellente. P.Debole: Frame drop estremo su Plexus. Rischio: Impossibilità del pull prolungato. Scintilla: Che il pull richieda una traiettoria a spirale per funzionare.**

### 16. Muro Sfuocato (Vetro del Confine)
1. **Nome:** Muro Sfuocato
2. **One-liner:** Tenta di passare un "muro di vetro" visivo con la presenza della mano prolungata.
3. **Intenzione:** Pazienza e ostinazione quieta.
4. **Tema:** Spingere via l'opacità del limite fra fisico e digitale.
5. **Interazione:** Permanenza spaziale e ingrandimento zona sicura.
6. **Gesture:** Pointer hovering statico (Time based).
7. **Flusso:** 1) Totalmente bluriato bianco/grigio opaco fittissimo glassmorphism. 2) Piazzando la mano in un punto, il raggio di `backdrop-filter: blur(0px)` si espande a ritmo di lumaca (1 pixel di raggio al secondo). 3) L'utente deve stare lì 10 secondi per svelare l'enorme orizzonte sotto (immagine maestosa di un'opera o il proprio volto).
8. **Output visivo:** CSS transition su `mask-image: radial-gradient(circle at X Y, transparent SIZE, full)`. Glassmorphism DOM. 
9. **In evento:** La sfida è non andarsene fino a non aver visto "il premio".
10. **Come mini-app:** Minimalista, zero engine complicati. Pura estetica CSS.
11. **Fattibilità tecnica:** Altissima e solidissima.
12. **Rischi UX:** Troppo passiva, noiosa.
13. **Semplificazione:** Già basilare.
14. **Varianti:** Cambiando area il timer di espansione aumenta.
15. **Perché nel catalogo:** Sfida al pubblico la capacità di stare su "un task" noioso anziché fare skip.
**(Voti: Coerenza 10 | Visiva 8 | Chiarezza 10 | Robusta 10 | V1 10 | Evento 8 | Modulo 10 | Multi: 10 - Tot: 76) - P.Forte: Anti-TikTok design (no gratificazione istantanea). P.Debole: Frustrante per chi ha fretta. Rischio: Glassmorfismo drop FPS su schermi 4k se non usando filtri webgl. Scintilla: Effetto di sbriciolamento del ghiaccio finto invece del semplice blur.**

### 17. Danza Spaziale
1. **Nome:** Danza Spaziale
2. **One-liner:** Lo spazio ti riflette solo ed esclusivamente se ti muovi come se ballassi, fluidamente. I gesti scattosi rovinano il dipinto.
3. **Intenzione:** Movimento ritmico artistico.
4. **Tema:** Il corpo non è un mouse rottame; è uno strumento di pittura.
5. **Interazione:** Analisi delle derivate spaziali.
6. **Gesture:** Smoothing trajectory detector.
7. **Flusso:** 1) Piatto/vuoto. 2) Inizia a scorrere la mano senza scatti né soste e la vernice digitale scende elegante dal pointer coprendo la telecamera. 3) Se cambi bruscamente angolo (accellerazione forte) o ti fermi bruscamente, il dipinto esplode e riparte. Cosi disegni con dolcezza infinita.
8. **Output visivo:** Spline curves vettoriali con pennello spessore pressione.
9. **In evento:** Forza una performatività incredibile.
10. **Come mini-app:** Lavora sull'history dei dati raw (filtro low pass in input al canvas).
11. **Fattibilità tecnica:** Alta (esiste già base logica Salvagente per il velocity damping).
12. **Rischi UX:** Frustrazione immensa se si incastra su falsi positivi di scatto dovuti alla videocamera.
13. **Semplificazione:** Lo scatto fa solo sbiadire parzialmente, non annulla del tutto il lavoro.
14. **Varianti:** Se la traccia è un anello chiuso diventa un fiore.
15. **Perché nel catalogo:** Valorizza il feedback algoritmico Salvagente v1 come puro tool estetico.
**(Voti: Coerenza 10 | Visiva 9 | Chiarezza 8 | Robusta 8 | V1 10 | Evento 10 | Modulo 10 | Multi: 9 - Tot: 74) - P.Forte: Espressione artistica elevata garantita dalle regole d'ingaggio stringenti. P.Debole: Curva di apprendimento un po' dura. Rischio: Tracking failure rovinano la prova. Scintilla: Sonoro in armonia coi pennelli.**

### 18. Bolla di Memoria
1. **Nome:** Bolla di Memoria (Rewind)
2. **One-liner:** Passa sulle tracce luminose generate precedentemente: riavvolgi il nastro dei gesti di chi ti ha preceduto.
3. **Intenzione:** Riconnessione umana e traccia storica.
4. **Tema:** Riappropriazione degli spazi tramite la presenza tangibile di altre vite digitali passate in quello spazio di fiera.
5. **Interazione:** Tracing (follow path).
6. **Gesture:** Pointer hovering su un path visivo + playback.
7. **Flusso:** 1) Filamenti galleggiano cristallizzati nello schermo. 2) Se poni il pointer esatto su quel percorso dormiente, lo "risvegli" eseguendo a ritroso la forma originaria. Scintille partono.
8. **Output visivo:** Glowing path vector SVG animato con mask progressivo.
9. **In evento:** Lavora in diacronia reale installativa (chi gioca prima lascia per chi gioca ora).
10. **Come mini-app:** NECESSITA di uno Shared State (o backend locale localStorage, violando parzialmente il patto "niente backend/persistenza v1 pura").
11. **Fattibilità tecnica:** Bassa - v1 non prevede persistenza eventi o backend Firebase per via architetturale chiestamente low-code.
12. **Rischi UX:** Non compatibile con v1 strict offline.
13. **Semplificazione:** Fake paths. Linee pregenerate bellissime che devi ripercorrere per farle suonare ("Music loop tracking").
14. **Varianti:** Ripercorrere l'orbita di pianeti. 
15. **Perché nel catalogo:** Aggiunge una sfida di destrezza fine visuo-spaziale, calmissima.
**(Voti: Coerenza 8 | Visiva 8 | Chiarezza 9 | Robusta 5 | V1 2 | Evento 9 | Modulo 3 | Multi: 2 - Tot: 46) - P.Forte: Sensazione poetica immensa. P.Debole: Violazione architetturale v1 no backend o fallback su percorsi finti palesi. Rischio: Latenza tracciamento rende il seguire la linea frustrante come l'esame del cursore di Windows. Scintilla: Trasformarlo in accordatura di un grammofono visivo (devi girare lungo la forma di un cerchio).**

### 19. Scudo Morbido
1. **Nome:** Scudo Morbido
2. **One-liner:** Difendi la quiete della tua figura allargando lo scudo radiante fino a che niente di stressante penetra lo schermo.
3. **Intenzione:** Repulsione dello stress, senso di "luogo sicuro".
4. **Tema:** Edificare barriere morbide ma ferme contro l'interruzione e l'assalto dei dati esterni.
5. **Interazione:** Allargamento zona (espansione asse Y vs Pinch hold).
6. **Gesture:** Pinch and Hold centralizzato per "caricare" lo scudo.
7. **Flusso:** 1) Camera feed al centro di un oceano di spam visivo/animazioni caotiche che piove addosso. 2) Facendo pinch al centro (sul tuo petto/viso), un "campo di forza" circolare bianco perlaceo si innesca. 3) Tenendo chiuso ed espirando, lo scudo si allarga proceduralmente spingendo ai bordi esterni lo sporco di dati e glitch. 4) Una volta spinto tutto fuori, lo scudo cristallizza, proteggendoti permanentemente (e il pinch può terminare sfociando in vittoria visiva).
8. **Output visivo:** Canvas 2d con fisica particellare reverse (magnetismo contrario per array repulsivo).
9. **In evento:** Sforzo titanico di volontà "Hold the line".
10. **Come mini-app:** Engine solido gravity based invertito o semplice mask radiale basato su contatore di hold.
11. **Fattibilità tecnica:** Alta. Repulsor node su librerie base.
12. **Rischi UX:** Scudo cade se il pinch sfarfalla per sensore debole.
13. **Semplificazione:** Il raggio cresce costantemente fintanto che il pointer sta in un ring centrale (senza richiedere pinch fisso, che è pesante e soggetto a drop).
14. **Varianti:** Cambiare la tipologia di assalitori da text a spike.
15. **Perché nel catalogo:** Introduce il timer/hold come meccanica fondamentale per variare dal semplice "pointer touch and release".
**(Voti: Coerenza 10 | Visiva 9 | Chiarezza 10 | Robusta 8 | V1 9 | Evento 10 | Modulo 10 | Multi: 10 - Tot: 76) - P.Forte: Narrazione di autodifesa perfetta per il concept. P.Debole: Gesto fisico stancante. Rischio: Ripetitivo una volta capito il trucco. Scintilla: Sostituire il pinch hold col mantenimento della mano apertissima (espansione dell'anima).**

### 20. Battito
1. **Nome:** Battito / Culla Pungente
2. **One-liner:** Una forma frastagliata vibra a caso. Cullala con il movimento dolce finché non torna rotonda e calma.
3. **Intenzione:** Abbattere ansia, accarezzamento calmante.
4. **Tema:** Riappropriarsi di se stessi disinnescando lo stato di "freakout" interno.
5. **Interazione:** Soothing movement (passaggio laterale curvo).
6. **Gesture:** Hovering su asse curvo come "accarezzare".
7. **Flusso:** 1) Forma centrale dentata (Noise/Spike sphere SVG) trema caotica e fa casino in rosso scuro. 2) Passando lentamente a mezza luna sopra (X axis parabola stroke), la forma smette temporaneamente di pungere. 3) Ripetere la carezza costante disinnesca un layer alla volta: da dentato a poligonale, a stella, a cerchio liscio enorme azzurro e dorato vibrante stasi. 
8. **Output visivo:** SVG animate noise parameters o morphing procedurale basato su stroke pattern rec e count accumulo relax.
9. **In evento:** Un loop ipnotico, rincuora gli altri "stiamo prendendoci cura".
10. **Come mini-app:** Tracker logica pattern pass, niente engine complessi, tutto CSS e SVG.
11. **Fattibilità tecnica:** Altissima e solida.
12. **Rischi UX:** Incomprensione del movimento se non suggerito (L'utente potrebbe cliccare (pinchare) come un matto ferendosi).
13. **Semplificazione:** Basta muovere orizzontalmente dolcemente senza pattern luna. Se muovi veloce o pinchi, respinge e torna dentato rosso.
14. **Varianti:** Il volume della venue influenza il caos rosso nativo.
15. **Perché nel catalogo:** Inibisce la reazione di stress ("devi reagire!") inducendo reazione passiva ("devi cullare/ammorbidirti").
**(Voti: Coerenza 10 | Visiva 9 | Chiarezza 9 | Robusta 10 | V1 10 | Evento 9 | Modulo 10 | Multi: 10 - Tot: 77) - P.Forte: Contrast visivo Spike-to-Round magistrale. P.Debole: Rischio interpretativo iniziale (user sbatte e non capisce il carezzare). Rischio: Nullo. Scintilla: Transizioni liquide sonore per calmare in parallelo con l'SVG morphing.**

---

## 3. Classifica Sintetica con Punteggi
(Totale massimale = 80 pt)

1. **Finestra Prospettica** (79/80)
2. **Lente della Calma** (78/80)
3. **Battito** (77/80)
4. **Filtro Morbido [Lente]** / **Muro Sfuocato** / **Scudo Morbido** / **Sincronia Liquida** (76/80)
5. **Spazzaneve Digitale** (75/80)
6. **Tensione Elastica / Raccogliere la Luce / Danza Spaziale / Gravità Inversa** (74/80)
7. **Costruire il Vuoto / Orologio di Sabbia** (73/80)
8. **Traccia Indelebile** / **Eco Cromatico** (71/80)
9. **Geometria del Respiro / Scultura Effimera / Acqua Quieta** (70/80) 
10. **Equilibrio di Lame** (68/80)
11. **Nuvola di Nodi** (66/80)
12. **Geometria 2 mani** (65/80)
13. **Ombra Tangibile** (60/80) - *fuori constraint skeleton/pose track*
14. **Bolla di Memoria** (46/80) - *fuori constraint zero loop server/localStorage syncro*

---

## 4. Le 8 Migliori e Perché

1. **Finestra Prospettica:** Mostra incredibile scalabilità visiva. Usa tecniche puramente web (CSS/3D Transforms parallax) agganciate al core track garantendo performance altissime, WOW in 0 net failure factor.
2. **Lente della Calma:** Impossibile sbagliare. Rassicurante, catartico, visivamente di impatto stratosferico (gioco colore vs bianco/nero), zero fisica problematica o drops pinch.
3. **Battito:** Offre uno *scopo* di guarigione esplicitando totalmente la baseline Salvagente (dal rumore alla pace geometrica). Rischio crash zero (SVG manipolato).
4. **Sincronia Liquida:** Metaphor del ritrovare il proprio "centro / flusso" che mescola tracking morbido e WebGL/Canvas di forte spessore installativo. Si fa guardare da chi fa coda.
5. **Scudo Morbido:** Gesto plateale e di autoprotezione perfetto, traduce la problematica del drop stressante (spam visivo) nel mondo reale dello stand, dando all'utente una barriera e appagamento fisico per respingere.
6. **Spazzaneve Digitale:** Sfrutta il "gomma" instinct primordiale, ma lo inverte poeticamente. Catartico da urlo se la disintegrativa particellare del font è sbalorditiva, liberando serotonina pura di pulizia UI.
7. **Tensione Elastica:** Unica che allena a dovere e da senso materico al gesto fondante di **Pinch**, con fisica elastica del drop back che innesca sorrisi e brividi plastici sonori.
8. **Gravità Inversa:** Una prova di puro potere algoritmico che diverte l'utente ma poi lo lascia a riflettere col silenzio dei blocchi caduti; ha un coefficiente di spettacolarità fisica da vetrina Matter.js / Box2d puro e irresistibile, reverso ma pulitissimo.

---

## 5. Le 3 da Costruire Subito (Sviluppo rapido / ROI enorme architetturale)

1. **Lente della Calma:** Modulo da sviluppo "day zero". 1 Div background, 1 Div frontale mask. Permette di testare immediati FPS core drop del MediaPipe engine con canvas raw sottostante su React con costo dev: 1 giornata tecnica. E strega subito gli stakeholder.
2. **Spazzaneve Digitale:** Ottimo per definire librerie/framework 2D canvas pulizia, iterare sulle collision boundries del Cursore e le zone cieche del tracking su layout screen-wide. Unico target render array di polveri vs position.
3. **Battito:** Consente di stabilire i parametri the "lowpass filter" e derivate su Salvagente Core, verificando come usare gli smooth array di Y/X per creare *meaning* emotivo dal moto liscio e tondo. Scalabilità massima.

---

## 6. Le 3 da Wow Effect (Centro vetrina)

1. **Finestra Prospettica:** Crea la magia assoluta alterando di prospettiva una telecamera interamente finta come in *headtracking illusion*, lasciando l'utente a guardare "dentro" lo schermo scavalcando le barriere piatte per cercare lo spazio lontano.
2. **Sincronia Liquida:** Quando i core si fondono il flash di saturazione di Liquid Gooey fa esclamare. Assicura che l'app interagisca come "materia viva". 
3. **Gravità Inversa:** Per fare spettacolo da lontano; un utente che "ordina" all'aria di sollevare pesi verso su richiama capannelli di curiosi furbissimi senza sapere niente del setting. 

---

## 7. Le 2 Più Sperimentali (Ma Realistiche / Costruibili v1.5)

1. **Acqua Quieta:** Costruibile realisticamente, ma richiede expertise tecnica per non far "wobblare" l'acqua al minimo errore di quantizzazione millimetrica posizionale del polso in MediaPipe skeleton. Affascinante se ben smoothata.
2. **Geometria del Respiro (Bimanuale):** Sviluppabile logicamente easy ma se, e solo se, il team V1 si lancia a sbloccare `maxNumHands: 2` in Core CV SDK. Il potenziale performativo bimanuale moltiplicherebbe la profondità di interazione dell'installazione al 300%.

---

## 8. Errori Concettuali da Evitare nelle Future Mini-App

1. **Effetto Salvaschermo (Vaghezza Visiva):** Se i blob, i trails o i cerchi creati dal mouse non hanno *obiettivo logico di fine/rilascio* (come in "Traccia Indelebile" dove evapora) si riducono a giochini visualizer Winamp v2. Deve sempre esserci un senso catartico o un reset progressivo che faccia "uscire dalla stanza".
2. **L'Arcade Fallace:** Cose tipo "Cattura tutte le palle veloci! Fai Punteggio! Evadi gli scogli!" sfondano il fragile tracking della V1 in lag fisici orridi, trasformando un'esperienza contemplativa poetica nel peggior porting Kinect mobile. Salvagente V1 ha senso nel **rallentare**. 
3. **Tutto Drag No Drop (o falso drop):** Richiedere pinch che debbano restare pinzati a trascinare in giro cose minuscole nello schermo. Il tracking su event fisici perde focus. **Soluzione sempre the best:** Gesti broad (larghi), Hover based (stai qui una zona grossa), o Pinch corti balistici (Launch and forget, Tira forte e lascia). Non richiedere minuziosa calibrazione certosina.
4. **Testo Informativo (Morte del Rito):** Mai inserire Onboarding con stringhe di testo come "Muoviti lento per farlo" / "Apri/chiudi il polso". Se una app necessita di spiegazione allora il visual design ha fallito l'affordance. 
5. **Assenza di Exit Stragety / Incastro della Macchina State:** Una app Salvagente (modulo) termina automaticamente dismettendo componente. O l'utente la chiude per aver trovato l'armonia (win state), o vige una icona X grossolana in alto a destra fissa sempre pronta al pinch-out a livello di Platform Shell, mai coperta.
