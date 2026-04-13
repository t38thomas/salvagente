# Salvagente v1: Design System e Motion System

Questo documento contiene le direttive operative per il design e le interazioni di Salvagente v1, ottimizzate per l'implementazione tramite DOM, CSS e Framer Motion.

---

## 1. Principi del Design System v1

*   **Organico ma Preciso:** La UI deve respirare, ma le aree interattive ("hitbox") e i feedback devono essere inequivocabili.
*   **Contemplazione Attiva:** Usa lo spazio vuoto (negative space) per permettere all'utente di concentrarsi su un elemento alla volta.
*   **Materia Leggera:** Nessuna geometria rigida da "cruscotto/pannello di controllo". Usa forme morbide (circle, pill) e percezioni di galleggiamento.
*   **Comunicazione Gestuale Immediata:** L'utente deve capire subito *dove* si trova la sua mano e *cosa succede* se "pizzica" (pinch), senza leggere manuali.

## 2. Visual Language Generale

Il linguaggio visivo si basa sul concetto di **"Sospensione Liquida"**.
*   **Forme:** Assenza quasi totale di spigoli vivi (`border-radius` circolari o a pillola).
*   **Materiali:** Nessun "glassmorphism" spinto che distrugga le performance. Usa un **"Soft Matte"**: sfondi semi-trasparenti a tinta unita (es. `rgba(255, 255, 255, 0.1)`) con un solo livello di `backdrop-filter: blur(12px)` per separare i layer.
*   **Bordi:** Sottili e semi-trasparenti (`1px solid rgba(255,255,255,0.2)`) per definire la geometria senza appesantirla.
*   **Color Palette:** Sfondo scuro e profondo (es. un blu/grigio oceanico quasi nero) con bolle/elementi in contrasto luminoso (bianchi, accenti di colore brillanti) per mascherare lo schermo fisico e dare percezione di profondità e ambiente buio.

## 3. Motion Language Generale

Il motion system utilizza **fisica a molla (Spring)**, mai transizioni lineari. In Framer Motion:
*   **Drift (Ambientale):** Moto armonico lentissimo, continuo. Parametri simulati: transizione `ease: "easeInOut"`, durata 6-10 secondi, andata e ritorno asimmetrico.
*   **Interattivo (Hover/Focus):** Scattante ma plastico, non robotico. Utilizza molle morbide: `stiffness: 200, damping: 20` (nessun rimbalzo esagerato, transizione liscia).
*   **Conferma (Pinch):** Immediato, reattivo. Nessun ritardo. `stiffness: 400, damping: 25`. L'utente deve sentire il "click" visivo.

## 4. Profondità Simulata nella Root Experience 2.5D

Il 2.5D sarà puramente implementato tramite layering DOM (z-index) e trasformazioni CSS (scale, opacity, blur).
*   **Layer 0 (Sfondo Costante):** Colore base profondo, magari un gradiente radiale statico molto sfumato.
*   **Layer 1 (Bolle Lontane - Non interattive / Decorative):** `scale: 0.5`, `opacity: 0.2`, `filter: blur(8px)`. Si muovono pochissimo.
*   **Layer 2 (Bolle Medie - Iterabili, non in focus ottimale):** `scale: 0.8`, `opacity: 0.6`, `filter: blur(2px)`.
*   **Layer 3 (Foreground - Hitbox Attive):** `scale: 1`, `opacity: 1`, `filter: none`.
*   **Parallasse (Simulata):** Al muoversi della mano (pointer) sull'asse X/Y, il container del catalogo subisce una lievissima traslazione inversa (es. pointer a destra = mondo trasla a sinistra del 2%), enfatizzando la profondità.

## 5. Regole di Composizione delle Bolle

Le "bolle" sono i nodi interattivi del catalogo, tecnicamente dei `div` circolari.
*   **Idle State:** Circolari perfetti. Bordo sottile, sfondo quasi trasparente. Movimento di "respiro" (drift) su assi Y di ±15px e scale ±2%.
*   **Focus State (Hover della mano):**
    *   Fisica: Il drift si "congela" dolcemente.
    *   Visivo: Sfondo si riempie uniformemente fino al 10-15% di opacità. Drop-shadow esterna morbida appare (`box-shadow: 0 0 40px rgba(Bianco, 0.2)`).
    *   Scale: passa impercettibilmente a `1.05`.
*   **Selected State (Durante Pinch):**
    *   La bolla scala rapidamente a `0.95` (per dare l'effetto di "compressione fisica" nelle mani).

## 6. Focus, Hover e Selected States: Il Pointer

Il "Pointer" riprende la metafora del sonar o del mirino da presa, senza sembrare un mouse.
*   **Aspetto di base:** Un anello (Ring) vuoto, dimensioni circa `40x40px`, bordo di `2px`. Costantemente traccia la posizione del palmo della mano.
*   **Comportamento Hover (Magnetic Snap):** Quando l'hitbox della mano entra nell'estensione di una bolla, il pointer *smette di seguire la mano esattamente* e **scatta magneticamente** al centro o lungo il bordo della bolla (Magnetic Lock). Questo stabilizza l'input e riduce la stanchezza fisica dell'utente.
*   **Pinch-to-confirm (Feedback visivo):**
    *   Quando rilevato l'inizio del pinch: Tutta l'area dell'anello inizia a riempirsi circolarmente o a scalare dall'esterno verso l'interno (`scale` da 1 a 0.2 rapido) diventando un punto solido (Dot pieno).
    *   Questo riempimento è la *conferma di attivazione*.

## 7. Pattern per gli Overlay Informativi

Gli overlay appaiono **solo** quando una bolla è in *Focus State* (mano sopra).
*   **Posizionamento:** Ancorati esternamente alla bolla in focus (es. radialmente a 45 gradi) tramite posizionamento assoluto calcolato (o Floating UI minimale).
*   **Gerarchia Visiva (Leggibilità < 2s):**
    *   **Titolo:** H1, molto grande e contrastato.
    *   **Tipo/Tag:** Pillola sopra o sotto il titolo (es. "INSTALLAZIONE A/V").
    *   **Call to Action gestuale:** Sotto il titolo compare un'iconcina animata o un microcopy: "Pizzica per esplorare" in opacità 60%.
*   **Stile:** Nessun background solido per il tooltip. Il testo bianco/brillante "gallegge" in aria. Testo con leggero text-shadow per contrastare lo sfondo.
*   **Transizione:** `opacity: 0 -> 1` e `y: 10 -> 0` (piccola entrata dal basso a comparsa).

## 8. Branding System per Salvagente e Naqah

*   **Salvagente (Protagonista):** È l'ecosistema. Deve trasmettere impatto emotivo. Il nome "Salvagente" può figurare come un Wordmark espressivo (es. tipografia serif con alto contrasto) nella safe-area alta dello schermo quando nel catalogo.
*   **Naqah (Istituzionale/Secondario):** La "firma". Deve risultare silenziosa, architettonica. Va fissa e in piccolo nei footer marginati, con un sans-serif geometrico pulito, opacità al 40%. "Powered by Naqah".

## 9. Pattern per Transizioni Catalogo -> Mini-app -> Catalogo

Il passaggio deve essere un "tuffo" dentro la bolla (Ripple/Mask expansion), nessuna transizione di pagina classica.
*   **Entrance (Catalogo > App):**
    1. Utente pincha la bolla.
    2. La bolla si espande (scale) fino a riempire il 100vw e 100vh con il colore della miniapp (`clip-path: circle(100% at X Y)` partendo dalle coordinate della bolla).
    3. Il contenuto della mini-app entra in fade-in (delay di 0.3s).
*   **Exit (App > Catalogo):**
    1. L'utente pincha l'orb di uscita ("Chiudi / Torna su").
    2. Il colore di sfondo collassa (clip-path inverso) tornando dimensione bolla, o l'intefacciata fade-out mentre le bolle tornano in fade-in dal livello di profondità.

## 10. Pattern per Stati di Camera, Tracking, Idle e Fallback

Questi stati proteggono la mostra dai guasti o dall'abbandono della platea.
*   **"No Camera" (Fallback Grave):** Sfondo sfocato, un overlay centrato con icona della telecamera sbarrata e messaggio chiaro al curatore: "Segnale videocamera assente. Controlla la connessione."
*   **"No Hand" (Lost Tracking):** Il pointer scompare con un rapido fade-out. Appare un prompt fluttuante leggero in basso al centro: "Alza la mano davanti a te" + animazione (Lottie/CSS) di una mano.
*   **Idle / Timeout (> 30 Secondi senza mani):**
    *   Qualsiasi mini-app aperta torna in auto-exit alla main shell.
    *   Il sistema ripristina la visuale perfetta del catalogo, in attesa del prossimo utente.

## 11. Pattern Shared per Mini-app

Per garantire che un'app non sembri "fuori posto", queste UI sono standardizzate e iniettate dalla Shell:
*   **L'Orb di Uscita (Persistent Exit):** Un cerchio in basso al centro (o angolo in alto a sinistra), stilisticamente identico al pointer system. Stato di hover che recita sempre "Chiudi". Lo si attiva col pinch.
*   **Curtain d'ingresso (Titolo app):** Breve splash sreen generato automaticamente per la miniapp. Prima di far interagire l'utente nell'app isolata, si mostra il titolo grande per 2 secondi, poi fade out.
*   **Puntatore globale:** Il pointer ad anello (Ring) continua a esistere e funzionare identico dentro la miniapp per garantire coerenza mnemonica sul pinch, gestito dall'SDK base.

## 12. Tipografia e Gerarchie

Usa un approccio *Type-Driven* per definire lo stile artistico. Due font:
1.  **Display (Titoli, Overlay bolle, Splash screen):** Un font con personalità (es. *PP Neue Montreal, Ogg, oppure un Serif elegante e contemporaneo*).
    *   H1 (Nome Bolla): `64px` o `min(8vw, 84px)`, weight 500/600, leading stretto (110%).
2.  **UI/Functional (Microcopy, Naqah, tag):** Un sans-serif di altissima leggibilità da schermo (es. *Inter, Roboto Mono o SF Pro Display*).
    *   Body/Microcopy: `18px/20px`, weight 400, lettera spaziata (tracking +2%). Maiuscoletto per categorie/tag.

## 13. Design Tokens (Esempi concreti)

*   `--salvagente-bg-core`: `#05080F` (Blu abisso quasi nero)
*   `--salvagente-ui-text-primary`: `rgba(255, 255, 255, 0.95)`
*   `--salvagente-ui-text-secondary`: `rgba(255, 255, 255, 0.5)`
*   `--salvagente-bubble-border-idle`: `rgba(255, 255, 255, 0.15)`
*   `--salvagente-bubble-bg-focus`: `rgba(255, 255, 255, 0.1)`
*   `--salvagente-blur-overlay`: `blur(16px)`
*   **Motion Tokens (Framer):**
    *   `transition-spring-magnetic`: `{ type: "spring", stiffness: 300, damping: 25 }`
    *   `transition-spring-drift`: `{ type: "tween", ease: "easeInOut", duration: 8 }`

## 14. Microcopy Guidelines

*   **Verbi Gesto:** Usa sempre "Pizzica" (Pinch) per formare abitudine.
    *   *Sì:* "Pizzica per aprire", "Pizzica per tornare al catalogo".
    *   *No:* "Seleziona", "Entra", "Clicca qui".
*   **Feedback d'errore (Mano persa):** "Mostra il palmo aperto" / "Rimani nell'inquadratura".
*   **Tono di voce:** Muto e contemplativo, zero "chatter". Poche parole, grande chiarezza.

## 15. Errori Stilistici da Evitare (Blacklist v1)

1.  **Ombre nette o offset pesanti (`box-shadow: 10px 10px 0 black`):** Distruggono il concetto di spazio astratto, fanno sembrare tutto "carta/sticker".
2.  **Hover States basati su cambi cromatici improvvisi (rosso -> verde):** Distraggono e abbassano la qualità percepita; gestire il focus solo con l'Opacità, Luminosità e Scale.
3.  **Scrollbars o Indicatori di UI standard:** Nessuna barra di scorrimento web. Lo spazio si naviga portando il pointer sui bordi (camera panning), non scrollando rotelle inesistenti.
4.  **Pointer Trasparente:** L'anello NON deve mai sparire in movimento. Una persona in una fiera affollata, se sposta gli occhi, deve sempre trovare la sua mano istantaneamente. Usa bianco alto contrasto o verde fluo ("laser") se il contrasto ambientale è critico.
