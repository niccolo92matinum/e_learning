# Guida all'uso

## Code Style Guide:
https://github.com/airbnb/javascript/tree/master/react

## Git Commit conventions:
https://www.conventionalcommits.org/en/v1.0.0/

# Indice
- [Corso](#corso)
- [Struttura](#struttura)
- [Tracciamento](#tracciamento)
- [Branch e scripts](#branch-e-scripts)

#### 1) Copia il progetto dal repository git
``` git clone <link al progetto>```

#### 2) Installa le dipendenze
```yarn install```

#### 3) Fai partire il progetto in locale
```yarn start```

#### 4) Carica gli asset di interesse
##### In public/assets:
- exerciseAudio: gli audio per gli esercizi
- images/exercises: le copertine o le immagini delle esercitazioni / test finale
- landing: le immagini per la landing page
- lang: le bandiere delle lingue
- player: contiene il play centrale sul video. Se si vuole cambiare colore aprire l'svg e cambiare il fill
- subtitle: contiene i file .vtt per i sottotitoli. Separare in cartelle con la lingua possibilmente
- video: caricare i video divisi in cartelle con lingua. Es. video/it/ conterrà tutti i video in lingua italiana

# Corso
### Configurazione store/initial-state-course.json

```
{
  "audioTranscriptionVisible":false, // Trascrizione true presente, false no
  "indexLesson":0,
  "indexModalVisible":false, // Indice corso true presente, false no
  "indexModule":0,    
  "indexPage":0,  
  "landingPageVisible":true, // pagina di lancio
  "currentLang": null, // shortName della lingua (es. it, en...), deve essere diverso da null se multilanguage false.
  "layoutType": "LAYOUT_FULLSCREEN", // LAYOUT_FULLSCREEN o LAYOUT_BOX
  "index": { // indica se mostrare l'icona di apertura indice nell'header
    "visible": true,
    "showAllLessons": true // indica se mostrare tutte le lezioni del corso nell'indice, o solo le lezioni del modulo aperto
  },
  "pageNav": { // indica se mostrare nell'header l'indicazione della pagina e le frecce avanti/indietro
    "visible": true
  },  
  "fullscreen": { // indica se mostrare nell'header il pulsante per andare in fullscreen
    "visible": true
  },  
  "languages": [ // array contenente tutte le lingue supportate e relative icone (corsi e labels)
      {
          "small_title": "it",
          "long_title": "Italiano",
          "img": "assets/lang/italy.svg"
      },
      {
          "small_title": "en",
          "long_title": "English",
          "img": "assets/lang/england.svg"
      },
  ],
  "vttLanguages": [ // array contenente tutte le lingue supportate per i sottotitoli nei video
      {
          "small_title": "it",
          "long_title": "Italiano",
          "img": "assets/lang/italy.svg"
      },
      {
          "small_title": "en",
          "long_title": "English",
          "img": "assets/lang/england.svg"
      }
  ]
}
```

- Usare i controlli nativi di videoJs (true) o (false):
"controlsVideoJs": true

- Voglio che il corso sia "restricted" in modo che l'utente deve finire di vedere il video prima di poter procedere: 
"restricted": true

``` !!! C'è un trick per poter avere il mostra controlli anche in restricted. Premi ctrl + q poi tasto destro sul video apparirà un context menu, scegli Mostra controlli video ```
- Esistenza di landing page: 
    "landingPageVisible": true

- Per lavorare in locale è utile la modalità debug in modo da avere la stringa di tracciamento in localStorage:
"isDebug": true

- editMode: true Per impostare le aree cliccabili tramite drag & drop si può impostare la modalità 
  
- recover_state_on_reopen: per disabilitare il recupero del tracciamento (se voglio rientrare continuando da dove ho lasciato)

- A fine video vado automaticamente alla pagina successiva
- "autoNext": true

- Il corso è in multilingua (se specificata la lingua non vengono mostrate le bandierine):
"lang.currentLang": "it"

- Se è in multilingua c'è bisogno dell'array delle lingue con abbreviazione, titolo esteso, immagine per la scelta lingua in landing linguaggio.
"languages": [
    {
        "small_title": "en",
        "long_title": "English",
        "img": "./assets/lang/england.svg"
    },
    ...
]
- La lista di lingue selezionabili per i sottotitoli va indicata con l'array vttLanguages:
  "vttLanguages": [
  {
      "small_title": "en",
      "long_title": "English",
      "img": "./assets/lang/england.svg"
  },
  ...
]

- suffixJsonToRead: utile in sviluppo in locale, indica il suffisso del json di struttura da usare. (Es. per es_story01.json, it_story02.json... posso impostare lingua: es e suffixJsonToRead: _story01 per usare es_story01.json)

- "layoutType": "LAYOUT_BOX" 
  - **LAYOUT_BOX**: stile pillole
  - **LAYOUT_FULLSCREEN** corso a tutta pagina
  

## struttura
### configurazione (store/lang/\<lingua\>.json)
La struttura fa anche da traduttore. Per cui troviamo direttamente la traduzione in struttura. Per avere un multilingua basta copiare il file della lingua primaria e applicare le traduzioni dove occorre

#### Traduzioni di bottoni e cose sparse varie ed eventuali:
```
    "course": "Corso",
    "subtitles": "Sottotitoli",
    "next_question": "Avanti",
    "prev_question": "Indietro",
    "tooltip_next": "click here to continue",
    "question": "Domanda",
    "question_count": "Domanda {current} di {total}",
    "retry": "Riprova",
    "skip": "Salta",
    "confirm": "Conferma",
    "cancel": "Annulla",
    "select": "Seleziona",
    "confirmBeginText": "Vuoi riprendere dal punto di interruzione precedente?",
    "questions": "Domande",
    "maxScore": "Punteggio massimo",
    "passScore": "Punteggio per passare il test",
    "start": "Inizia",
    "greetings": "Ciao",
    "yes": "SI",
    "no": "NO",
    "of": "di",
    "final_profile": "Profilo finale",
    "finalProfileResult_ko": "Il test non è superato!",
    "finalProfileResult_ok": "Il test è superato!",
    "totalScore": "Hai totalizzato un punteggio pari al <strong>[[]]%</strong>",
    "innerDoughnut": "Completato",
```

#### Struttura vera e propria 
Un object contenente i moduli e il riferimento ai figli (childIds con id delle lezioni)
``` 
    "modules": {
        "0": {
            "id": 0,
            "title": "Modulo 1",
            "childIds": [0,1]
        },
        "1": {
            "id": 1,
            "title": "Modulo 2",
            "childIds": [0,1]
        }
    }
```

Un object contenente le lezioni e il riferimento ai figli (childIds con id delle pagine)
```
    "lessons": {
        "0": {
            "id": 0,
            "title": "Lezione 1",
            "childIds": [1,2,3,4,5,6,7,8]
        },
        "1": {
            "id": 1,
            "title": "Lezione 2",
            "childIds": [8]
        }
    }
```

Un object contenente le pagine e il riferimento ai figli (childIds con id dei componenti, ad es. esercitazioni, approfondimenti)
videoSrc: indica il codice video da mostrare nella pagina (es. "videoSrc": "01_01")
videoVtt: indica i sottotitoli del video in base alla lingua (esempio path: assets/subtitle/it/01_01.vtt)
```
    "pages": {
        "1": {
            "id": 1,
            "title": "Partenza: Cagliari",
            "childIds": [0],
            "audioTranscription": "<p>Napoli, Caserta, Bari, Pescara, Rimini, Bologna.</p><p>In questa seconda tappa del tour scoprirai queste perle del Sud e Centro Italia a bordo dei nostri treni!</p><p>Hai tutto quello che ti serve per iniziare il tuo viaggio:</p><ul><li>Il biglietto</li><li>Il kit di allenamento</li><li>Il tuo bagaglio </li></ul><p>Sali sul treno, accomodati al tuo posto e aspetta il momento per metterti in gioco!</p>",
            "videoSrc": "01_01",
            "videoVtt": {
              "en": "assets/subtitle/en/07_00.vtt",
              "fr": "assets/subtitle/fr/07_00.vtt",
              "it": "assets/subtitle/it/01_01.vtt"
            }
        },
        "2": {
            "id": 2,
            "title": "Kit di allenamento 1/2",
            "childIds": [1],
            "audioTranscription": "<p>Prima di partire, però, ricordati di controllare l’orologio!</p><p>Il tuo kit di allenamento per questa seconda tappa è la Matrice di Eisenhower, uno strumento per rafforzare le tue soft skills e mettere in atto i comportamenti del Leadership Model per tutta la durata del percorso di gioco.</p><p>Ma a cosa serve?</p><p>La matrice di Eisenhower può aiutarti a organizzare e ad assegnare alle attività la giusta priorità in base all'urgenza e all'importanza per gestire al meglio il tuo tempo.</p><p>Vediamo come.</p><p>Questa frase è stata attribuita a Dwight D. Eisenhower, generale e presidente statunitense negli anni ‘50 ed è alla base del metodo di organizzazione e ottimizzazione del tempo noto, appunto, come Matrice di Eisenhower.</p><p>Prosegui per saperne di più.</p>"
        }
    }
```

Un object contenente i componenti da mostrare in un certo timing (ad es. inizio o fine video)
I child possono essere facoltativi sbloccando la pagina in automatico ("optional": true)
  ```
      "timings": {
        "0": {
            "id": 0,
            "position": "end",
            "optional": true,
            "component": {
                "id": "",
                "type": "non_evaluative_test",
                "title": "Sei pronto?",
                "isHideFeedback": false,
                "exercise": {
                    "feedback": {
                        "ok": "La risposta è corretta",
                        "ko": "La risposta non è corretta",
                        "retry": "Riprova!"
                    },
                    "type": "exercise_card",
                    "title": "<p>Titolo formattato</p>",
                    "subtitle": "Sottotitolo",
                    "score": 0,
                    "attempt": 2,
                    "answers": [
                        {
                            "id": 0,
                            "text": "<p>Testo frontale 1</p>",
                            "cover": "./assets/images/exercises/card-01.png",
                            "feedback": "<h5>Errato! <br /><i class=\"fa fa-times\" aria-hidden=\"true\"></i></p>"
                        },
                        {
                            "id": 1,
                            "text": "<p>Testo frontale 2</p>",
                            "cover": "./assets/images/exercises/card-02.png",
                            "feedback": "<h5>Errato! <br /><i class=\"fa fa-times\" aria-hidden=\"true\"></i></h5>"
                        },
                        {
                            "id": 2,
                            "text": "<p>Testo frontale 3</p>",
                            "cover": "./assets/images/exercises/card-03.png",
                            "feedback": "<h5>Esatto! <br /><i class=\"fa fa-check\" aria-hidden=\"true\"></i></h5>",
                            "correct": true
                        }
                    ]
                }
            }
        },
        "1": {
            "id": 1,
            "position": "end",
            "component": {
                "id": "",
                "type": "non_evaluative_test",
                "title": "Sei pronto?",
                "isHideFeedback": false,
                "exercise": {
                    "feedback": {
                        "ok": "La risposta è corretta",
                        "ko": "La risposta non è corretta",
                        "retry": "Riprova!"
                    },
                    "type": "exercise_draggable",
                    "title": "<p>Testo formattato</p>",
                    "subtitle": "Ordina le voci trascinandole al posto giusto",
                    "score": 0,
                    "attempt": 2,
                    "answers": [
                        {
                            "id": "0",
                            "text": "<p>Energetica</p>",
                            "order": "3"
                        },
                        {
                            "id": "1",
                            "text": "<p>Sinergica</p>",
                            "order": "5"
                        },
                        {
                            "id": "2",
                            "text": "<p>Carismatica</p>",
                            "order": "2"
                        },
                        {
                            "id": "3",
                            "text": "<p>Poliedrica</p>",
                            "order": "4"
                        },
                        {
                            "id": "4",
                            "text": "<p>Attraente</p>",
                            "order": "1"
                        },
                        {
                            "id": "5",
                            "text": "<p>Virtuosa</p>",
                            "order": "6"
                        }
                    ]
                }
            }
        }
      }
  ```


**Approfondimenti** 
- è possibile specificare un'immagine come background degli approfondimenti tramite la props "backgroundImage"
- Ciascuna area cliccabile può essere facoltativa ("optional": true)
- Ciascuna area cliccabile può avere un audio associato. Ad esempio per ("audio": "01_01") verrà caricato il file 01_01.mp3 dalla cartella public/assets/audio/appro/it/01_01.mp3

##### **Modale**
Un' area cliccabile che apre una modale con html custom
```
"1": {
  "id": 1,
  "position": "end",
  "component": {
    "id": "",
    "type": "custom",
    "tagComponent": "approfondimenti",
    "props": {
      "positionType": "flex",
      "backgroundImage": "sfondo_appro_pdf.jpg",
      "detailed": [
        {
          "coords": {
            "width": "23%",
            "height": "38%",
            "left": "39%",
            "top": "4%"
          },
          "audio": "01_01",
          "popupType": "nodeHtml",
          "props": {
            "title": "Procedure operative",
            "nodeHtml": "<p>Le violazioni delle regole richiamate dal Modello sono definite illeciti disciplinari e sono sanzionati in base a quanto previsto dal regolamento interno redatto in ottemperanza al disposto dell’art. 7, primo comma, dello Statuto dei Lavoratori e rivolto a tutto il personale della Società. </p>"
          }
        }
      ]
    }
  }
}
```
##### **Link**
Un' area cliccabile che apre un link in un nuovo tab
```
"1": {
  "id": 1,
  "position": "end",
  "component": {
    "id": "",
    "type": "custom",
    "tagComponent": "approfondimenti",
    "props": {
      "positionType": "flex",
      "backgroundImage": "sfondo_appro_pdf.jpg",
      "detailed": [
        {
          "coords": {
            "width": "23%",
            "height": "38%",
            "left": "39%",
            "top": "4%"
          },
          "popupType": "link",
          "props": {
            "title": "Procedure operative",
            "link": "sharepoint.com/sites/COMPLIANCE77"
          }
        }
      ]
    }
  }
}
```
##### **pdfSintesi**
Un' area cliccabile che apre un link in un nuovo tab. Uguale a type Link, ma con grafica diversa e 2 righe di testo (title, description)
```
"1": {
  "id": 1,
  "position": "end",
  "component": {
    "id": "",
    "type": "custom",
    "tagComponent": "approfondimenti",
    "props": {
      "positionType": "flex",
      "backgroundImage": "sfondo_appro_pdf.jpg",
      "detailed": [
        {
          "popupType": "pdfSintesi",
          "props": {
            "description": "Scarica il documento",
            "title": "gestire e archiviare le informazioni digitali",
            "link": "./docs/Regolamento.pdf"
          }
        }
      ]
    }
  }
}
```

##### **Video**
Un'area cliccabile che fa partire un video
```
"1": {
  "id": 1,
  "position": "end",
  "component": {
    "id": "",
    "type": "custom",
    "tagComponent": "approfondimenti",
    "props": {
      "positionType": "flex",
      "backgroundImage": "sfondo_appro_pdf.jpg",
      "detailed": [
        {
          "coords": {
            "width": "23%",
            "height": "38%",
            "left": "39%",
            "top": "4%"
          },
          "popupType": "video",
          "props": {
            "restricted": true,
            "src": "./assets/video/it/01_01it.mp4"
          }
        }
      ]
    }
  }
}
```

##### **PDF in modale**
Un'area cliccabile che apre una modale con pdf
```
"1": {
  "id": 1,
  "position": "end",
  "component": {
    "id": "",
    "type": "custom",
    "tagComponent": "approfondimenti",
    "props": {
      "positionType": "flex",
      "backgroundImage": "sfondo_appro_pdf.jpg",
      "detailed": [
        {
          "coords": {
            "width": "23%",
            "height": "38%",
            "left": "39%",
            "top": "4%"
          },
          "popupType": "pdf",
          "props": {
            "title": "Titolo modale",
                "pdfLink": "/assets/doc/..."
          }
        }
      ]
    }
  }
}
```

##### **Custom page**
custompage1 è da gestire come componente da richiamare poi nel CustomComponent
```
"components": [{
    "id": "0",
    "type": "custom",
    "propsComponent": {
        "title": "Componente interattivo. Premi play per continuare",
        "detailed": []
    },
    "tagComponent": "custompage1"
}],
```
    
#### **PopupOpenChildren**
È un custom component che apre un popup con testo e button.
Al click sul button si mette in pausa il video e si apre un altro componente custom indicato in innerComponent
Nato per essere aperto a "metà" video mentre il video continua a scorrere. Se non si clicca su ok e passa il tempo indicato in timings, viene chiuso senza mostrare l'innerComponent.

```
{
  "id": "0",
  "type": "custom",
  "innerComponent": {
      "type": "custom",
      "tagComponent": "approfondimenti",
      "propsComponent": {
          "detailed": [
              {
                  "coords": {
                      "width": "34%",
                      "height": "55%",
                      "left": "35%",
                      "top": "22%",
                      "clipPath": "polygon(0 0, 80% 0%, 100% 20%, 100% 80%, 99% 100%, 20% 100%, 0% 80%, 0% 20%)"
                  },
                  "popupType": "nodeHtml",
                  "props": {
                      "title": "Quali sono gli Enti a cui si attribuisce responsabilità?",
                      "nodeHtml": "<p>Il campo di applicazione del Decreto è molto ampio e riguarda tutti gli enti forniti di personalità giuridica, le società, le associazioni anche prive di personalità giuridica, gli enti pubblici economici e gli enti privati concessionari di un pubblico servizio. Mentre gli Enti non imputabili sono: lo Stato, gli enti pubblici territoriali, gli enti pubblici non economici e quelli che svolgono funzioni di rilievo costituzionale.</p>"
                  }
              }
          ],
          "title": "ciao"
      }
  },
  "tagComponent": "popupOpenChildren"
}
```

#### Esercitazioni e Test

Le esercitazioni possono essere inserite sia come standalone (non-evaluative-test) sia come test con più step (multiple-step-test)
In ciascun componente relativo alle esercitazioni è presente un esempio di json da usare
- [Esercitazione risposta singola](./src/components/MultipleStepTest/QuestionSingle/QuestionSingle.jsx)
- [Esercitazione risposta multipla](./src/components/MultipleStepTest/QuestionMultiple/QuestionMultiple.jsx)
- [Esercitazione vero falso](./src/components/MultipleStepTest/QuestionYesOrNO/QuestionYesOrNO.jsx)
- [Esercitazione dropdown](./src/components/MultipleStepTest/QuestionDropdown/QuestionDropdown.jsx)
- [Esercitazione dropdown inline](./src/components/MultipleStepTest/QuestionDropdownInline/QuestionDropdownInline.jsx)
- [Esercitazione popola campi vuoti con drag&drop](./src/components/MultipleStepTest/QuestionFill/QuestionFill.jsx)
- [Esercitazione ordinamento](./src/components/MultipleStepTest/QuestionDraggable/QuestionDraggable.jsx)
- [Esercitazione flip card](./src/components/MultipleStepTest/QuestionCard/QuestionCards.jsx)

### Test con più step
config:
- **track**: se true, viene tracciato passed/failed o completed in base alla configurazione in initial-state-lms.json
- **welcomeScreen**: indica se mostrare la schermata di intro del test

Il parametro **groups** serve ad impostare quante domande pescare dai vari gruppi di domande. Ciascuna domanda ha un parametro groupId che indica il gruppo di appartenenza.
Il parametro **attempt** indica quante volte può essere rifatto il test. Se si chiude e riapre lo scorm, il test riparte, ma non traccia.
Il parametro **timer** (in secondi): indica se c'è un countdown entro cui rispondere nel test finale
```
      {
      "id": 1,
      "position": "end",
      "component": {
        "id": "",
        "type": "multiple_step_test",
        "config": {
          "welcomeScreen": true,
          "track": true
        },
        "groups": {
            "G1": 3,
            "G2": 2
        },
        "limit": 1,
        "attempt": 3,
        "random": true,
        "timer": 50,
        "confirmOnAnswer": true,
        "isHideFeedback": true,
        "elements": [
          {
            "groupId": "G1",
            "feedback": {
              "ok": "La risposta che hai dato è quella corretta",
              "ko": "Purtroppo non mi conosci"
            },
            "type": "exercise_single",
            "title": "Quale tra questi prodotti è bio based",
            "subtitle": "Vediamo se indovini",
            "score": 10,
            "answers": [
              {
                "text": "Sacchetto di plastica"
              },
              {
                "text": "Camicia di cotone",
                "correct": true
              },
              {
                "text": "Nessuno"
              }
            ]
          },
          {
            "groupId": "G2",
            "feedback": {
              "ok": "La risposta che hai dato è quella corretta",
              "ko": "Purtroppo non mi conosci"
            },
            "type": "exercise_multiple",
            "title": "Quali tra questi rappresenta un tipo di biomassa",
            "score": 10,
            "answers": [
              {
                "text": "Gusci d'uova",
                "correct": true
              },
              {
                "text": "Alghe",
                "correct": true
              },
              {
                "text": "Legno",
                "correct": true
              },
              {
                "text": "Nessuno"
              },
              {
                "text": "Grano",
                "correct": true
              }
            ]
          }
        ]
      }
    }
```

#### Esercitazione con un solo step
    ```
      "components": [
          {
              "id": "0", // importante nel caso di esercizio durante o a fine video
              "type": "non_evaluative_test",
              "elements": {} //Vedi prossimi punti per tipologie esercizi
          }
      ]
    ```

#### Parametri esercitazioni
- ***audioQuestion***: parametro impostabile per ciascuna esercitazione, indica il codice audio da usare per l'esercitazione (es. "audioQuestion”: "01_01" leggerà 01_01.mp3 per la domanda, 01_01_ok.mp3 per risposta corretta, 01_01_ko.mp3 per risposta sbagliata, 01_01_ko_retry se ho ancora tentativi). Gli audio vanno nella cartella public/assets/audio/exercises/it/... 

# Tracciamento
### configurazione initial-state-lms
```
{
    "tracking_enabled": true, // se tracciare o meno in lms
    "alertConnectionAPI": true, // quando è true, compare un messaggio d'errore se non trova le api lms
    "recover_state_on_reopen": true, // chiede tramite modale se continuare da dove si era arrivati
    "tracking_type": "lesson_location", // lesson_location, suspend_data
    "tracking_passed_failed": true, // stabilisce se tracciare passed failed o il completato
    "lms_polling": "-1", // valore in millisecondi (Ogni quanto inviare un tracking.update in piattaforma per non far chiudere connessione) 
    "track_level": "page", // page_level, answer_level, timer...
    "mastery_score": 40 // punteggio da superare nel test finale per il passed/completed 
}
```



- tipo di scorm possibili: 1.2, 2004, xApi (non è ancora ben gestito)
    Impostare la versione tramite parametro ScormProvider in App.js:
    ```
    <ScormProvider version="2004" debug={process.env.NODE_ENV === 'development'}>
    ```
    Impostare versione scorm anche in scoPackager.js
    ```
    version: SCORM_VERSION['1.2'], //1.2, 2004  
    ```
## Esempio stringhe di tracciamento:
- avviando con script start-assessment (assessment/survey): "\*\*SRV\*\*LOcode_G1_E1-LOcode_G2_E2\*||\*1-2-012|0_4_2_3-0-04231\*||\*2\*||\*2\*||\*90\*||\*0\*||\*3\*||\*3\*||\*00"
  - LOcode non può contenere caratteri di separazione stringa (es. '_', '-', '\*||\*')
  - il prefisso \*\*SRV\*\* è presente solo se masteryScore = 0. Altrimenti per l'assessment viene inserito prefisso \*\*TEST\*\*
- avviando con script start: "1:1:1/1:1:0|/0:3" (es. ID_MOD:ID_LEZ:ID_PAG/1:3:11111000|2:3:12000|/1:3 => BOOKMARK/ID_LES:BOOKMARK_PAGE_ID:VIWED_PAGES/TENTATIVI_TEST_FRUITI:TENTATIVI_TOTALI)

- Tipo di tracciamento suspend_data, lesson_location
"tracking_type": "suspend_data"

- "lms_polling_minutes" (in minuti): Polling per "chiamata muta". Ogni quanto richiamare una get in piattaforma per non far chiudere la connessione. Se non voglio fare polling settare -1.
  - valore minimo 1 minuto. Se metto valori inferiori non avviene il polling.
- alertConnectionAPI: mostra alert di errore se non trova connessione con lms (N.B. usare true solo per gli scorm in piattaforma, non nei link)

- Per il tracciamento comanda il parametro tracking_enabled.
  - Lo score minimo sopra (o equivalente) il quale l'eventuale test risulta passato. "mastery_score": "40"

- ***trackUntilCompleted***: se true, non viene sovrascritto il risultato del test finale. Una volta finiti i tentativi non traccio più (ma l'utente può comunque fruire).

# Branch e scripts
- dev (ambiente dev, da usare per sviluppi prima di spostarli in prod)
- master (ambiente prod)
- _deploy/pdf-downloader (versione senza pulsanti in header, e con già una struttura con singola pagina per download pdf) (in futuro gestire rimozione pulsanti in header tramite codice, per tenere solo branch dev e master)_

## script di avvio/build:
- npm run start legge struttura da cartella mock_langs (versione standard con tracciamento moduli lezioni pagine es. `ID_MOD:ID_LEZ:ID_PAG/1:3:11111000|2:3:12000|/1:3 => BOOKMARK/ID_LES:BOOKMARK_PAGE_ID:VIWED_PAGES/TENTATIVI_TEST_FRUITI:TENTATIVI_TOTALI`)
- npm run start-assessment legge struttura da cartella mock_langs (versione con tracciamento assessment es. `**SRV**LOcode_G1_E1-LOcode_G2_E2*||1-2-012|0_4_2_3-0-04231||2||2||90||0||3||3||*00`)
- npm run package-scorm legge struttura da cartella lang generata da packager (versione scorm con tracciamento standard `ID_MOD:ID_LEZ:ID_PAG/1:3:11111000|2:3:12000|/1:3 => BOOKMARK/ID_LES:BOOKMARK_PAGE_ID:VIWED_PAGES/TENTATIVI_TEST_FRUITI:TENTATIVI_TOTALI`)
- npm run package-scorm-assessment legge struttura da cartella lang generata da packager (versione scorm con tracciamento per assessment `**SRV**LOcode_G1_E1-LOcode_G2_E2*||1-2-012|0_4_2_3-0-04231||2||2||90||0||3||3||*00`)
