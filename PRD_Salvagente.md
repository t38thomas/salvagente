# Product Requirements Document (PRD) - Salvagente (v2 Consolidato)

---

## 1. Visione Operativa e Finalità
**Salvagente** è una piattaforma web interattiva progettata per eventi fisici, fruibile tramite hand-tracking (computer vision). La "Root Experience" è rappresentata da un ecosistema di bolle fluttuanti che fa da catalogo e punto d'accesso a singole mini-app (esperienze tematiche). 
L'installazione veicola il tema della **"riappropriazione degli spazi fisici e mentali"** attraverso un design organico, un'interfaccia _zero-friction_ priva di periferiche fisiche e un look&feel che privilegia leggerezza, respiro e fluidità (assenza di griglie tradizionali).

## 2. Branding 
- **Salvagente**: Il prodotto e brand principale. Presente in modo elegante ma preponderante, impiega font chiari e distesi e un microcopy astratto, non-tecnicistico ed empatico.
- **Naqah**: Branding istituzionale curatore. Discreto, confinato nelle zone perimetrali inferiori ("A project by Naqah").

## 3. Product Goals & Requisiti Funzionali Core
- **Time-to-Wow (Attract rapido)**: Ingaggio immediato. Quando il visitatore si avvicina, il sistema riconosce la mano ed esplicita il pointer visivo del canvas in *meno di 3 secondi*.
- **Low-Fatigue (Anti Gorilla-Arm)**: Mappatura del pointer asimmetrica per cui azioni a mezz'aria in posizioni di riposo (braccia verso il basso/centro) possono raggiungere tutto il campo visivo utile.
- **Elaborazione Local-First**: Inferenza della Computer Vision rigorosamente *client-side* per zero latenza critica e garanzia totale della privacy dei passanti. Nessun stream video deve uscire dal perimetro locale.
- **Modularità Ospite/Contenitore**: Salvagente funge da Shell/Host. Le mini-app vengono istanziate indipendentemente ed esclusivamente come **componenti React lazy-loaded** (nessun iframe), ricevendo lo stato di input globale della mano ma eseguendo le proprie logiche in isolamento logico.

## 4. Esperienza Utente: Il Catalogo V1 (Root Experience)
### A. Spazio e Movimento delle Bolle
- **Il Canvas**: Uno sfondo materico e profondo (es. gradienti fluidi, glassmorphism), renderizzato tipicamente in 2.5D. Le bolle fungono da oblò tematici.
- **Fisica Semplificata**: Per garantire stabilità funzionale nell'MVP, le bolle non avranno complesse logiche N-Body (nessuna caoticità pura da collisione continua). Seguono invece orbite lente pseudo-randomiche o pattern di oscillazione di *idle*, restando focalizzate e stabili "a portata di mira".
- **La Gestione dell'Overflow**: Nessuna "scroll-bar". Le bolle fuori o al bordo dello schermo viaggiano e si ripresentano ciclicamente. In V1 si mantiene un numero limitato di bolle simultanee, sufficiente a non ingorgare il viewport.

### B. Pointer & Tolleranza (Hitboxing)
- **Pointer Diegetico**: Rigettata definitivamente la logica "Freccina del Mouse". Il feedback della mano è un anello di luce organico, un deformatore o un elementale (particelle). 
- **Forgiving Hitboxes**: L'area magnetica invisibile che "cattura" il pointer è dilatata (es. +40%) rispetto alla dimensione vettoriale/raster della bolla, per disinnescare la frustrazione dei tremolii ottici di puntamento.

## 5. User Journey Strategico (Flow d'Ingresso)
Il tragitto per l'accesso a un'esperienza si snoda in questi passaggi:

1. **Attract Loop (Attesa):** Nessun corpo rilevato. Bolle che galleggiano fluttuanti in totale ociosità. Micro-copy ambientale minimale (es. *"Alza una mano per avvicinarti"*).
2. **Hand Detected (Sincronizzazione):** Agganciato il landmark, il testo ambiente sparisce e il *Pointer Visivo* fiorisce a schermo. Il feedback di aggancio deve essere percepito dall'utente come **immediato e organico**, garantito tramite rigoroso smoothing e interpolazione visiva fluidi che mascherano l'eventuale latenza sottostante (abolite soglie rigide in millisecondi in favore della fluidità percepita).
3. **Hover & Reveal (Focalizzazione):** Il passante sposta il pointer sopra la forgiving-hitbox di una bolla.
    - L'orbita della bolla bersaglio frena, si stabilizza centralmente e la bolla subisce una leggera enfasi (es. scale +15%), mentre lo sfondo e le altre bolle sfocano.
    - Accanto/Sotto la bolla balza in view un pannello/HUD elegante e leggibile in materico (vetro/sfocatura) contenente rigorosamente:
        - *Nome App* (es. "Soffio")
        - *One-liner* (Meno di 10 parole - es. "Allontana i pensieri muovendo l'aria")
        - *Tipologia di Esperienza* via etichetta (es. `[✨ Contemplativo]`)
        - *Gesto richiesto visivo* (Icona due dita chiuse + "Pinch per entrare")
4. **Pinch-to-Confirm (Impegno):** Ricevuto l'istinto verbale/visivo, l'utente chiude pollice e indice. Un loader radiale circonda immediatamente il pointer e richiede tra **300ms a 500ms** continui.
   - *Se rilasciato prima*, il timer implode istantaneamente ritornando alla posa 3. 
   - *Se mantenuto*, il trigger scatta inesorabilmente e disabilita il menu.
5. **Transizione "Inabissamento":** La bolla satura lo schermo inglobandolo in modo fluido. L'istanza dell'app si monta a pieno formato.

## 6. Flow di Uscita e Sistemi di Sopravvivenza (Gestione Abbondono)
Nei contesti eventistici la caduta di attenzione e l'abbandono sono fisiologici; Salvagente interviene per rimettere in bolla lo stage per la prossima persona.

1. **Uscita Esplicita (Controllo Utente)**: Non essendoci swiping complessi (scartati nella V1 per fragilità di pattern), all'interno di ogni singola mini-app ci dovrà essere _obbligatoriamente_ uno standard UI di piattaforma: un "Orb / Bottone" di ritorno ubicato in un quadrante coerente (es. In alto a destra). Lo si punta, si fa pinch -> si torna in Root.
2. **Idle Timeout Globale (Fallback Primario Automagico)**: È l'assicurazione sulla vita di Salvagente.
   - Costante monitoraggio dell'attività (mano assente da schermo, scheletro non trovato da AI).
   - Se per **X secondi consecutivi** (Valori predefiniti ipotetici: `15s` se bloccati nel router catalogo, `45/60s` in base all'esigenza dentro una mini-app) il modulo CV entra in morte di segnale utente: 
   - Scatta un *Hard/Soft Reset Autonomo*: Il router interrompe forzatamente il guest e disvela un sipario nero/sfumato riportando la scena all'**Attesa** (Loop 1).  

## 7. Precauzioni di Design per Implementabilità Piena
- **Assenza di "Lag da Legno"**: La computer vision farà necessariamente fatica a gestire input a 60fps solidi continui per la natura neurale: il layer di rappresentazione visuale (shader/ThreeJS/DOM-Anim) deve obbligatoriamente *interpolare* linearmente e morbidamente tra i due delta dei points del marker (es. lerp/damping fluidi), staccando le prestazioni dal framerate dell'AI e simulando uno "strascico cinematico" sul cursore che maschera la latenza AI. 
- Nessun tutorial invasivo bloccante ad ingresso: lo step `Hover & Reveal` assume totalmente le funzioni istruttive. Se l'utente non lo capisce in Hover, il design dell'HUD va rifatto testuale e più grande. 
