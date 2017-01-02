/**
 * Class with implementation of the soundex algorithm.
 */
export class ArtyomInternals {

    /**
     * Javascript implementation of the soundex algorithm.
     * @see https://gist.github.com/shawndumas/1262659
     * @returns {String}
     */
    soundex(s) {
        let a = s.toLowerCase().split(''),
            f = a.shift(),
            r = '',
            codes = {a:"",e:"",i:"",o:"",u:"",b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,d:3,t:3,l:4,m:5,n:5,r:6};

        r = f +
            a
            .map(function(v, i, a) {
                return codes[v]
            })
            .filter(function(v, i, a) {
                return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
            })
            .join('');

        return (r + '000').slice(0, 4).toUpperCase();
    }

}

/**
 * Helper class of Artyom.js
 */
export class ArtyomHelpers {

    /**
     * Returns if de browser is either Chrome or not.
     * @return {Boolean}
     */
    public isChrome() {
        return navigator.userAgent.indexOf("Chrome") === -1;
    }

    /**
     * Returns if the app is being executed over a mobile device.
     * @return {Boolean}
     */
    public isMobileDevice() {
        return (navigator.userAgent.match(/Android/i) || 
                navigator.userAgent.match(/webOS/i) || 
                navigator.userAgent.match(/iPhone/i) || 
                navigator.userAgent.match(/iPad/i) || 
                navigator.userAgent.match(/iPod/i) || 
                navigator.userAgent.match(/BlackBerry/i) || 
                navigator.userAgent.match(/Windows Phone/i));
    }

    /**
     * Fires an event
     * @param {String} name 
     * @param {String} param (optional)
     * @return {CustomEvent} event
     */
    public artyomTriggerEvent(name, param?) {
        let event = new CustomEvent(name, {'detail': param});
        document.dispatchEvent(event);
        return event;
    };

}

/**
 * Artyom.js - A voice control / voice commands / speech recognition and speech synthesis javascript library. 
 * Create your own siri,google now or cortana with Google Chrome within your website.
 * That class requires webkitSpeechRecognition and speechSynthesis APIs.
 */
export class Artyom {
    private static instance: ArtyomJS;

    private constructor() {
        let artyom: ArtyomJS = {};
        let artyomCommands = [];
        let artyomInternals = new ArtyomInternals();
        let artyomHelpers = new ArtyomHelpers();
        let artyomVoice = 'Google UK English Male';
        let artyom_garbage_collector = [];

        /** 
         * This object contains all available languages that support speechSynthesis and SpeechRecognition
         * on the Google Chrome browser. Those identifiers will be used to select the voice on artyom.say
         * 
         */
        let artyomLanguages = {
            german: "Google Deutsch",
            spanish: "Google español",
            italian: "Google italiano",
            japanese: "Google 日本人",
            englishUSA: "Google US English",
            englishGB: "Google UK English Male",
            brasilian: "Google português do Brasil",
            russia: "Google русский",
            holand: "Google Nederlands",
            france: "Google français",
            polski: "Google polski",
            indonesia: "Google Bahasa Indonesia",
            mandarinChinese: "Google 普通话（中国大陆）",
            cantoneseChinese: "Google 粤語（香港）",
            native: "native"
        };
        let artyom_global_events = {
            ERROR: "ERROR",
            SPEECH_SYNTHESIS_START: "SPEECH_SYNTHESIS_START",
            SPEECH_SYNTHESIS_END: "SPEECH_SYNTHESIS_END",
            TEXT_RECOGNIZED: "TEXT_RECOGNIZED",
            COMMAND_RECOGNITION_START : "COMMAND_RECOGNITION_START",
            COMMAND_RECOGNITION_END: "COMMAND_RECOGNITION_END",
            COMMAND_MATCHED: "COMMAND_MATCHED"
        };
        let artyomProperties: artyomConfigProperties = {
            lang: 'en-GB',
            recognizing: false,
            continuous: false,
            speed: 1,
            volume: 1,
            listen: false,
            mode: "normal",
            debug: false,
            helpers: {
                redirectRecognizedTextOutput: null,
                remoteProcessorHandler: null,
                lastSay: null
            },
            executionKeyword: null,
            obeyKeyword: null,
            speaking: false,
            obeying: true,
            soundex: false
        };
        let artyomFlags = {
            restartRecognition: false
        };

        let reconocimiento;
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            //reconocimiento = new window.webkitSpeechRecognition();
            reconocimiento = new webkitSpeechRecognition();
        }

        artyom.device = { 
            isChrome: artyomHelpers.isChrome(),
            isMobile: !!artyomHelpers.isMobileDevice() // Avoid "null" efect
        };

        artyom.getVoices = () => {
            return (window['speechSynthesis']).getVoices();
        };

        artyom.getAvailableCommands = function () {
             const commandsLength = artyomCommands.length;
             let availables = [];
             for (let i = 0; i < commandsLength; i++) {
                 let command = artyomCommands[i];
                 let aval = {};
                 aval['indexes'] = command.indexes;

                 if (command.smart) {
                     aval['smart'] = true;
                 }

                 if (command.description) {
                     aval['description'] = command.description;
                 }

                 availables.push(aval);
             }
             return availables;
         };

         artyom.initialize = function (config: artyomConfigProperties) {
             if (typeof (config) !== "object") {
                 console.error("You must give the configuration for start artyom properly.");
                 return;
             }

             if (config.hasOwnProperty("lang")) {
                 switch (config.lang) {
                     case 'de':
                     case 'de-DE':
                         artyomVoice = artyomLanguages.german;
                         break;
                     case 'en-GB':
                         artyomVoice = artyomLanguages.englishGB;
                         break;
                     case "pt":
                     case "pt-br":
                     case "pt-PT":
                         artyomVoice = artyomLanguages.brasilian;
                         break;
                     case "ru":
                     case "ru-RU":
                         artyomVoice = artyomLanguages.russia;
                         break;
                     case "nl":
                     case "nl-NL":
                         artyomVoice = artyomLanguages.holand;
                         break;
                     case 'es':
                     case 'es-CO':
                     case 'es-ES':
                         artyomVoice = artyomLanguages.spanish;
                         break;
                     case "en":
                     case 'en-US':
                         artyomVoice = artyomLanguages.englishUSA;
                         break;
                     case 'fr':
                     case 'fr-FR':
                         artyomVoice = artyomLanguages.france;
                         break;
                     case 'it':
                     case 'it-IT':
                         artyomVoice = artyomLanguages.italian;
                         break;
                     case 'jp':
                     case 'ja-JP':
                         artyomVoice = artyomLanguages.japanese;
                         break;
                     case 'id':
                     case 'id-ID':
                         artyomVoice = artyomLanguages.indonesia;
                         break;
                     case 'pl':
                     case 'pl-PL':
                         artyomVoice = artyomLanguages.polski;
                         break;
                     case 'zh-CN':
                         artyomVoice = artyomLanguages.mandarinChinese;
                         break;
                     case 'zh-HK':
                         artyomVoice = artyomLanguages.cantoneseChinese;
                         break;
                     case 'native':
                         artyomVoice = artyomLanguages.native;
                         break;
                     default:
                         console.warn("The given language for artyom is not supported yet. English has been set to default");
                         break;
                 }
                 artyomProperties.lang = config.lang;
             }

             if (config.hasOwnProperty("continuous")) {
                 if (config.continuous) {
                     artyomProperties.continuous = true;
                     artyomFlags.restartRecognition = true;
                 } else {
                     artyomProperties.continuous = false;
                     artyomFlags.restartRecognition = false;
                 }
             }

             if (config.hasOwnProperty("speed")) {
                 artyomProperties.speed = config.speed;
             }

             if (config.hasOwnProperty("soundex")) {
                 artyomProperties.soundex = config.soundex;
             }

             if (config.hasOwnProperty("executionKeyword")) {
                 artyomProperties.executionKeyword = config.executionKeyword;
             }

             if (config.hasOwnProperty("obeyKeyword")) {
                 artyomProperties.obeyKeyword = config.obeyKeyword;
             }

             if (config.hasOwnProperty("volume")) {
                 artyomProperties.volume = config.volume;
             }

             if(config.hasOwnProperty("listen")){
                 artyomProperties.listen = config.listen;
             }

             if(config.hasOwnProperty("debug")){
                 artyomProperties.debug = config.debug;
             }else{
                 console.warn("The initialization doesn't provide how the debug mode should be handled. Is recommendable to set this value either to true or false.");
             }

             if (config.mode) {
                 artyomProperties.mode = config.mode;
             }

             if (artyomProperties.listen === true) {
                 artyom_hey();
                 //this.instance2.artyom_hey();
             }

             return true;
         };

         artyom.fatality = function () {
             try {
                 // if config is continuous mode, deactivate anyway.
                 artyomFlags.restartRecognition = false;
                 reconocimiento.stop();
                 return true;
             } catch(e) {
                 console.log(e);
                 return false;
             }
         };

         artyom.addCommands = function (param) {
             var _processObject = function (obj) {
                 if(obj.hasOwnProperty("indexes")) {
                     artyomCommands.push(obj);
                 } else {
                     console.error("The following command doesn't provide any index to execute :");
                     console.dir(obj);
                 }
             };

             if (param instanceof Array) {
                 const paramLength = param.length;
                 for (let i = 0; i < paramLength; i++) {
                     _processObject(param[i]);
                 }
             } else {
                 _processObject(param);
             }

             return true;
         };

         artyom.removeCommands = function (identifier) {
             let toDelete = [];
             if (typeof (identifier) === "string") {
                 const commandsLength = artyomCommands.length;
                 for (let i = 0; i < commandsLength; i++) {
                     let command = artyomCommands[i];
                     if (command.indexes.indexOf(identifier)) {
                         toDelete.push(i);
                     }
                 }

                 const toDeleteLength = toDelete.length;
                 for (let o = 0; o < toDeleteLength; o++) {
                     artyomCommands.splice(o, 1);
                 }
             }

             return toDelete;
         };

         artyom.emptyCommands = function () {
             return artyomCommands = [];
         };

         artyom.shutUp = function () {
             if ('speechSynthesis' in window) {
                 do {
                     (window['speechSynthesis']).cancel();
                 } while ((window['speechSynthesis']).pending === true);
             }

             artyomProperties.speaking = false;
             artyom.clearGarbageCollection();
         };

         artyom.getProperties = function () {
             return artyomProperties;
         };

         artyom.when = function (event, action) {
             return document.addEventListener(event, function (e) {
                 action(e.detail);
             }, false);
         };

         artyom.getLanguage = function () {
             switch (artyomVoice) {
                 case 'Google UK English Male':
                     return "en-GB";
                 case 'Google español':
                     return "es-CO";
                 case 'Google Deutsch':
                     return "de-DE";
                 case 'Google français':
                     return "fr-FR";
                 case 'Google italiano':
                     return "it-IT";
                 case 'Google 日本人':
                     return "ja-JP";
                 case 'Google US English':
                     return "en-US";
                 case 'Google português do Brasil':
                     return "pt-BR";
                 case 'Google русский':
                     return "ru-RU";
                 case 'Google Nederlands':
                     return "nl-NL";
                 case 'Google polski':
                     return "pl-PL";
                 case 'Google Bahasa Indonesia':
                     return "id-ID";
                 case 'Google 普通话（中国大陆）':
                     return "zh-CN";
                 case 'Google 粤語（香港）':
                     return "zh-HK";
                 case 'native':
                     return "native";
             }
         };

         /**
          * Talks a text according to the given parameters (private function).
          * @param {String} text Text to be spoken
          * @param {Int} actualChunk Number of chunk of the
          * @param {Int} totalChunks
          */
         let artyom_talk = function (text, actualChunk, totalChunks, callbacks) {
             let msg = new SpeechSynthesisUtterance();
             msg.text = text;
             msg.volume = artyomProperties.volume;
             msg.rate = artyomProperties.speed;

             // Select the voice according to the selected
             if (artyomVoice) {
                 msg.voice = (window['speechSynthesis']).getVoices().filter(function (voice) {
                     return voice.name == artyomVoice;
                 })[0];
             }

             // If is first text chunk (onStart)
             if (actualChunk == 1) {
                 msg.addEventListener('start', function () {
                     // Set artyom is talking
                     artyomProperties.speaking = true;
                     // Trigger the onSpeechSynthesisStart event
                     artyom.debug("Event reached : " + artyom_global_events.SPEECH_SYNTHESIS_START);
                     // The original library dismiss the second parameter
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.SPEECH_SYNTHESIS_START);
                     // Trigger the onStart callback if exists
                     if (callbacks) {
                         if (typeof(callbacks.onStart) == "function") {
                             callbacks.onStart.call(msg);
                         }
                     }
                 });
             }

             // If is final text chunk (onEnd)
             if ((actualChunk) >= totalChunks) {
                 msg.addEventListener('end', function () {
                     // Set artyom is talking
                     artyomProperties.speaking = false;
                     // Trigger the onSpeechSynthesisEnd event
                     artyom.debug("Event reached : " + artyom_global_events.SPEECH_SYNTHESIS_END);
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.SPEECH_SYNTHESIS_END);
                     // Trigger the onEnd callback if exists.
                     if(callbacks){
                         if(typeof(callbacks.onEnd) == "function"){
                             callbacks.onEnd.call(msg);
                         }
                     }
                 });
             }

             // Notice how many chunks were processed for the given text.
             artyom.debug((actualChunk) + " text chunk processed succesfully out of " + totalChunks);
             // Important : Save the SpeechSynthesisUtterance object in memory, otherwise it will get lost
             // thanks to the Garbage collector of javascript
             artyom_garbage_collector.push(msg);
             (window['speechSynthesis']).speak(msg);
         };

         /**
          * Splits a string into an array of strings with a limited size (chunk_length).
          * @param {String} input text to split into chunks
          * @param {Integer} chunk_length limit of characters in every chunk
          */
         let splitStringByChunks =  function (input, chunk_length){
             let prev = 0;
             let output = [];
             input = input || "";
             chunk_length = chunk_length || 100;
             let curr = chunk_length;
             while (input[curr]) {
                 if (input[curr++] == ' ') {
                     output.push(input.substring(prev,curr));
                     prev = curr;
                     curr += chunk_length;
                 }
             }
             output.push(input.substr(prev));
             return output;
         };

         artyom.say = function (message, callbacks) {
             let artyom_say_max_chunk_length = 115;
             if (artyom.speechSupported()) {
                 if (typeof(message) === 'string') {
                     if (message.length > 0) {
                         let definitive = [];

                         // If the providen text is long, proceed to split it
                         if(message.length > artyom_say_max_chunk_length) {
                             // Split the given text by pause reading characters [",",":",";","."] to provide a natural reading feeling.
                             let naturalReading = message.split(/,|:|\.|;/);

                             naturalReading.forEach(function(chunk, index){
                                 // If the sentence is too long and could block the API, split it to prevent any errors.
                                 if(chunk.length > artyom_say_max_chunk_length){
                                     // Process the providen string into strings (withing an array) of maximum aprox. 115 characters to prevent any error with the API.
                                     let temp_processed = splitStringByChunks(chunk, artyom_say_max_chunk_length);
                                     // Add items of the processed sentence into the definitive chunk.
                                     definitive.push.apply(definitive, temp_processed);
                                 } else {
                                     // Otherwise just add the sentence to being spoken.
                                     definitive.push(chunk);
                                 }
                             });
                         } else {
                             definitive.push(message);
                         }

                         // Clean any empty item in array
                         definitive = definitive.filter(function(e){return e;});

                         // Finally proceed to talk the chunks and assign the callbacks.
                         definitive.forEach(function (chunk, index) {
                             let numberOfChunk = (index + 1);
                             if (chunk) {
                                 artyom_talk(chunk, numberOfChunk, definitive.length, callbacks);
                             }
                         });

                         // Save the spoken text into the lastSay object of artyom
                         artyomProperties.helpers.lastSay = {
                             text: message,
                             date: new Date()
                         };
                     } else {
                         console.warn("Artyom expects a string to say ... none given.");
                     }
                 } else {
                     console.warn("Artyom expects a string to say ... " + typeof (message) + " given.");
                 }
             }
         };

         artyom.repeatLastSay = function (returnObject) {
             let last = artyomProperties.helpers.lastSay;
             if (returnObject) {
                 return last;
             } else {
                 if (last != null) {
                     artyom.say(last.text);
                 }
             }
         };

         artyom.speechSupported = function () {
             return 'speechSynthesis' in window;
         };

         artyom.recognizingSupported = function () {
             return 'webkitSpeechRecognition' in window;
         };

         artyom.simulateInstruction = function (sentence) {
             if ((!sentence) || (typeof (sentence) !== "string")) {
                 console.warn("Cannot execute a non string command");
                 return false;
             }

             let foundCommand = artyom_execute(sentence);   // Command founded object
             if(foundCommand.result && foundCommand.objeto) {
                if (foundCommand.objeto.smart) {
                    artyom.debug('Smart command matches with simulation, executing', "info");
                    foundCommand.objeto.action(foundCommand.indice, foundCommand.wildcard.item, foundCommand.wildcard.full);
                } else {
                    artyom.debug('Command matches with simulation, executing', "info");
                    foundCommand.objeto.action(foundCommand.indice);//Execute Normal command
                }
                return true;
             } else {
                 console.warn("No command founded trying with " + sentence);
                 return false;
             }
         };

         /**
          * Returns an object with data of the matched element.
          * @param {string} comando
          * @returns {Object || Function}. There is a result field when the function should return a boolean value.
          */
         let artyom_execute = function(voz) {
             if (!voz) {
                 console.warn("Internal error: Execution of empty command");
                 return {
                     result: false,
                     indice: null,
                         objeto: null,
                         wildcard: {
                             item: null,
                             full: voz
                         }
                 };
             }

             let wildcard;
             artyom.debug(">> " + voz);

             // @3 Artyom needs time to think that
             let artyomCommandsLength = artyomCommands.length;
             for (let i = 0; i < artyomCommandsLength; i++) {
                 let instruction = artyomCommands[i];
                 let opciones = instruction.indexes;
                 let encontrado = -1;
                 const optionsLength = opciones.length; 
                 for (let c = 0; c < optionsLength; c++) {
                     let opcion = opciones[c];

                     if (!instruction.smart) {
                         continue;  // Jump if is not smart command
                     }

                     if (opcion.indexOf("*") !== -1) {
                         // Logic here
                         let grupo = opcion.split("*");
                         if (grupo.length > 2) {
                             console.warn("Artyom found a smart command with " + (grupo.length - 1) + " wildcards. Artyom only support 1 wildcard for each command. Sorry");
                             continue;
                         }

                         // Start smart command 
                         let before = grupo[0];
                         let latter = grupo[1];

                         // Wildcard in the end
                         //if ((latter === "") || (latter === " ")) {
                        if(latter.trim() === "") {
                             if ((voz.indexOf(before) !== -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) !== -1)) {
                                 let wildy = voz.replace(before, '');
                                 wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '');
                                 wildcard = wildy;
                                 encontrado = c;
                             }
                         } else {
                             if ((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                 if ((voz.indexOf(latter) != -1) || ((voz.toLowerCase()).indexOf(latter.toLowerCase()) != -1)) {
                                     let wildy = voz.replace(before, '').replace(latter, '');
                                     wildy = (wildy.toLowerCase())
                                                .replace(before.toLowerCase(), '')
                                                .replace(latter.toLowerCase(), '');
                                     wildy = (wildy.toLowerCase()).replace(latter.toLowerCase(), '');
                                     wildcard = wildy;
                                     encontrado = c;
                                 }
                             }
                         }
                     } else {
                         console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                     }

                     if ((encontrado >= 0)) {
                         encontrado = c;
                         break;
                     }
                 }

                 if (encontrado >= 0) {
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_MATCHED);
                     return {
                         result: true,
                         indice: encontrado,
                         objeto: instruction,
                         wildcard: {
                             item: wildcard,
                             full: voz
                         }
                     };
                 }
             }  // End @3

             // @1 Search for IDENTICAL matches in the commands if nothing matches start with a index match in commands
             artyomCommandsLength = artyomCommands.length;
             for (let i = 0; i < artyomCommandsLength; i++) {
                 let instruction = artyomCommands[i];
                 let opciones = instruction.indexes;
                 let encontrado = -1;

                 // Execution of match with identical commands
                 for (let c = 0; c < opciones.length; c++) {
                     let opcion = opciones[c];
                     if (instruction.smart) {
                         continue;  // Jump wildcard commands
                     }

                     if ((voz === opcion)) {
                         artyom.debug(">> MATCHED FULL EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                         encontrado = c;
                         break;
                     } else if ((voz.toLowerCase() === opcion.toLowerCase())) {
                         artyom.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                         encontrado = c;
                         break;
                     }
                 }

                 if (encontrado >= 0) {
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_MATCHED);
                     return {
                         result: true,
                         indice: encontrado,
                         objeto: instruction,
                         wildcard: null
                     };
                 }
             }  // End @1

             // Step 3 Commands recognition. If the command is not smart, and any of the commands match exactly then try to find a command in all the quote.
             artyomCommandsLength = artyomCommands.length;
             for (let i = 0; i < artyomCommandsLength; i++) {
                 let instruction = artyomCommands[i];
                 let opciones = instruction.indexes;
                 let encontrado = -1;

                 // Execution of match with index
                 let optionsLength = opciones.length;
                 for (let c = 0; c < optionsLength; c++) {
                     if (instruction.smart) {
                         continue;  // Jump wildcard commands
                     }

                     let opcion = opciones[c];
                     if ((voz.indexOf(opcion) >= 0)) {
                         artyom.debug(">> MATCHED INDEX EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                         encontrado = c;
                         break;
                     } else if (((voz.toLowerCase()).indexOf(opcion.toLowerCase()) >= 0)) {
                         artyom.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                         encontrado = c;
                         break;
                     }
                 }

                 if (encontrado >= 0) {
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_MATCHED);
                     return {
                         result: true,
                         indice: encontrado,
                         objeto: instruction,
                         wildcard: null
                     };
                 }
             }  // End Step 3

             /**
              * If the soundex options is enabled, proceed to process the commands in case that any of the previous
              * ways of processing (exact, lowercase and command in quote) didn't match anything.
              * Based on the soundex algorithm match a command if the spoken text is similar to any of the artyom commands.
              * Example:
              * If you have a command with "Open Wallmart" and "Open Willmar" is recognized, the open wallmart command will be triggered.
              * soundex("Open Wallmart") == soundex("Open Willmar") <= true
              *
              */
             if(artyomProperties.soundex){
                 artyomCommandsLength = artyomCommands.length;
                 for (let i = 0; i < artyomCommandsLength; i++) {
                     let instruction = artyomCommands[i];
                     let opciones = instruction.indexes;
                     let encontrado = -1;
                     let optionsLength = opciones.length;
                     for (let c = 0; c < optionsLength; c++) {
                         let opcion = opciones[c];
                         if (instruction.smart) {
                             continue;  // Jump wildcard commands
                         }

                         if(artyomInternals.soundex(voz) == artyomInternals.soundex(opcion)){
                             artyom.debug(">> Matched Soundex command '"+opcion+"' AGAINST '"+voz+"' with index "+ c , "info");
                             encontrado = c;
                             artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_MATCHED);
                             return {
                                 result: true,
                                 indice: encontrado,
                                 objeto: instruction,
                                 wildcard: null
                             };
                         }
                     }
                 }
             }

             return {
                 result: false,
                 indice: null,
                 objeto: null,
                 wildcard: null
             };
         };

         artyom.debug = function (e, o) {
             if (artyomProperties.debug === true) {
                 switch (o) {
                     case"error":
                         console.log(' %cArtyom.js ' + " " + e, 'background: #C12127; color: #FFFFFF');
                         break;
                     case"warn":
                         console.warn(e);
                         break;
                     case"info":
                         console.log(' %cArtyom.js: ' + " " + e, 'background: #4285F4; color: #FFFFFF');
                         break;
                     default:
                         console.log(' %cArtyom.js %c ' + " " + e, 'background: #005454; color: #BFF8F8', 'color:black;');
                         break;
                 }
             }
         };

         /*artyom.detectErrors = function () {
             if ((window.location.protocol) == "file:") {
                 let message = "Fatal Error Detected : It seems you're running the artyom demo from a local file ! The SpeechRecognitionAPI Needs to be hosted someway (server as http or https). Artyom will NOT work here, Sorry.";
                 console.error(message);
                 return {
                     code: "artyom_error_localfile",
                     message: message
                 };
             }

             if (!artyom.device.isChrome) {
                 var message = "Fatal Error Detected: You are not running Google Chrome ! SpeechRecognitionAPI and SpeechSynthesisAPI is only available in google chrome ! ";
                 console.error(message);
                 return {
                     code: "artyom_error_browser_unsupported",
                     message: message
                 };
             }

             if (window.location.protocol != "https:") {
                 console.warn("Artyom is not running in HTTPS protocol,running in protocol : " + window.location.protocol + " that means the browser will ask the permission of microphone too often. You need a HTTPS Connection if you want artyom in continuous mode !");
             }

             return false;
         };*/

         artyom.redirectRecognizedTextOutput = function (action) {
             if (typeof (action) != "function") {
                 console.warn("Expected function to handle the recognized text ...");
                 return false;
             }

             artyomProperties.helpers.redirectRecognizedTextOutput = action;
             return true;
         };

         artyom.sayRandom = function (data) {
             if (data instanceof Array) {
                 var index = Math.floor(Math.random() * data.length);
                 artyom.say(data[index]);
                 return {
                     text: data[index],
                     index: index
                 };
             } else {
                 console.error("Random quotes must be in an array !");
                 return null;
             }
         };

         artyom.newDictation = function (settings) {
             if (!artyom.recognizingSupported()) {
                 console.error("SpeechRecognition is not supported in this browser");
                 return false;
             }

             let dictado = new webkitSpeechRecognition();
             dictado.continuous = true;
             dictado.interimResults = true;
             dictado.lang = artyomProperties.lang;
             dictado.onresult = function (event) {
                 let temporal = "";
                 let interim = "";
                 let resultsLength = event.results.length;
                 for (let i = 0; i < resultsLength; ++i) {
                     if (event.results[i].final) {
                         temporal += event.results[i][0].transcript;
                     } else {
                         interim += event.results[i][0].transcript;
                     }
                 }

                 if (settings.onResult) {
                     settings.onResult(interim, temporal);
                 }
             };

             return new function () {
                 let dictation = dictado;
                 let flagStartCallback = true;
                 let flagRestart = false;
                 this.onError = null;

                 this.start = function () {
                     if (settings.continuous === true) {
                         flagRestart = true;
                     }

                     dictation.onstart = function () {
                         if (typeof (settings.onStart) === "function") {
                             if (flagStartCallback === true) {
                                 settings.onStart();
                             }
                         }
                     };

                     dictation.onend = function () {
                         if (flagRestart === true) {
                             flagStartCallback = false;
                             dictation.start();
                         } else {
                             flagStartCallback = true;
                             if (typeof (settings.onEnd) === "function") {
                                 settings.onEnd();
                             }
                         }
                     };

                     dictation.start();
                 };

                 this.stop = function () {
                     flagRestart = false;
                     dictation.stop();
                 };

                 if (typeof (settings.onError) === "function") {
                     dictation.onerror = settings.onError;
                 }
             };
         };

         artyom.newPrompt = function (config) {
             if (typeof (config) !== "object") {
                 console.error("Expected the prompt configuration.");
             }

             let copyActualCommands = Object.assign([], artyomCommands);
             artyom.emptyCommands();

             let promptCommand = {
                 description: "Setting the artyom commands only for the prompt. The commands will be restored after the prompt finishes",
                 indexes: config.options,
                 action: function (i, wildcard) {
                     artyomCommands = copyActualCommands;
                     let toExe = config.onMatch(i, wildcard);
                     if (typeof (toExe) !== "function") {
                         console.error("onMatch function expects a returning function to be executed");
                         return;
                     }
                     toExe();
                 }
             };
             if (config.smart) {
                 promptCommand['smart'] = true;
             }

             artyom.addCommands(promptCommand);

             if (typeof (config.beforePrompt) !== "undefined") {
                 config.beforePrompt();
             }

             artyom.say(config.question, {
                 onStart: function () {
                     if (typeof (config.onStartPrompt) !== "undefined") {
                         config.onStartPrompt();
                     }
                 },
                 onEnd: function () {
                     if (typeof (config.onEndPrompt) !== "undefined") {
                         config.onEndPrompt();
                     }
                 }
             });
         };

         /**
          * Artyom awaits for orders when this function is executed. If artyom gets a first parameter the instance will be stopped.
          */
         let artyom_hey = function () {
             let start_timestamp;
             let artyom_is_allowed;

             reconocimiento.continuous = true;
             reconocimiento.interimResults = true;
             reconocimiento.lang = artyomProperties.lang;
             reconocimiento.onstart = function () {
                 artyom.debug("Event reached : " + artyom_global_events.COMMAND_RECOGNITION_START);
                 artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_RECOGNITION_START);
                 artyomProperties.recognizing = true;
                 artyom_is_allowed = true;
             };

             /**
              * Handle all artyom posible exceptions
              * @param {type} event
              * @returns {undefined}
              */
             reconocimiento.onerror = function (event) {
                 // Dispath error globally (artyom.when)
                 artyomHelpers.artyomTriggerEvent(artyom_global_events.ERROR, {
                     code: event.error
                 });

                 if (event.error === 'audio-capture') {
                     artyom_is_allowed = false;
                 }

                 if (event.error === 'not-allowed') {
                     artyom_is_allowed = false;
                     if (event.timeStamp - start_timestamp < 100) {
                         artyomHelpers.artyomTriggerEvent(artyom_global_events.ERROR, {
                             code: "info-blocked",
                             message: "Artyom needs the permision of the microphone, is blocked."
                         });
                     } else {
                         artyomHelpers.artyomTriggerEvent(artyom_global_events.ERROR, {
                             code: "info-denied",
                             message: "Artyom needs the permision of the microphone, is denied"
                         });
                     }
                 }
             };

             /**
              * Check if continuous mode is active and restart the recognition. Throw events too.
              */
             reconocimiento.onend = function () {
                 if (artyomFlags.restartRecognition === true) {
                     if (artyom_is_allowed === true) {
                         reconocimiento.start();
                         artyom.debug("Continuous mode enabled, restarting", "info");
                     } else {
                         console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                     }

                     artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_RECOGNITION_END,{
                         code: "continuous_mode_enabled",
                         message: "OnEnd event reached with continuous mode"
                     });
                 } else {
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_RECOGNITION_END,{
                         code: "continuous_mode_disabled",
                         message: "OnEnd event reached without continuous mode"
                     });
                 }

                 artyomProperties.recognizing = false;
             };

             /**
              * Declare the processor dinamycally according to the mode of artyom to increase the performance.
              */
             let onResultProcessor: Function;

             // Process the recognition in normal mode
             if(artyomProperties.mode === "normal"){
                 onResultProcessor = function(event){
                     if (!artyomCommands.length) {
                         artyom.debug("No commands to process in normal mode.");
                         return;
                     }

                     artyomHelpers.artyomTriggerEvent(artyom_global_events.TEXT_RECOGNIZED);

                     let cantidadResultados = event.results.length;
                     for (let i = event.resultIndex; i < cantidadResultados; ++i) {
                         let identificated = event.results[i][0].transcript;
                         if (event.results[i].isFinal) {
                             let comando = artyom_execute(identificated.trim());

                             // Redirect the output of the text if necessary
                             if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                 artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                             }

                             if ((comando.result !== false) && (artyomProperties.recognizing === true)) {
                                 artyom.debug("<< Executing Matching Recognition in normal mode >>", "info");
                                 reconocimiento.stop();
                                 artyomProperties.recognizing = false;
                                 // Execute the command if smart
                                 if (comando.wildcard) {
                                     comando.objeto.action(comando.indice, comando.wildcard.item, comando.wildcard.full);
                                 // Execute a normal command
                                 } else {
                                     comando.objeto.action(comando.indice);
                                 }

                                 break;
                             }
                         } else {
                             // Redirect output when necesary
                             if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                 artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                             }

                             if (typeof (artyomProperties.executionKeyword) === "string") {
                                 if (identificated.indexOf(artyomProperties.executionKeyword) !== -1) {
                                     let comando = artyom_execute(identificated.replace(artyomProperties.executionKeyword, '').trim());
                                     if ((comando.result !== false) && (artyomProperties.recognizing === true)) {
                                         artyom.debug("<< Executing command ordered by ExecutionKeyword >>", 'info');
                                         reconocimiento.stop();
                                         artyomProperties.recognizing = false;
                                         // Executing Command Action
                                         if (comando.wildcard) {
                                             comando.objeto.action(comando.indice, comando.wildcard.item, comando.wildcard.full);
                                         } else {
                                             comando.objeto.action(comando.indice);
                                         }

                                         break;
                                     }
                                 }
                             }

                             artyom.debug("Normal mode : " + identificated);
                         }
                     }
                 }
             }

             // Process the recognition in quick mode
             if(artyomProperties.mode === "quick"){
                 onResultProcessor = function(event){
                     if (!artyomCommands.length) {
                         artyom.debug("No commands to process.");
                         return;
                     }

                     artyomHelpers.artyomTriggerEvent(artyom_global_events.TEXT_RECOGNIZED);
                     let cantidadResultados = event.results.length;
                     for (let i = event.resultIndex; i < cantidadResultados; ++i) {
                         let identificated = event.results[i][0].transcript;
                         if (!event.results[i].isFinal) {
                             let comando = artyom_execute(identificated.trim());
                             // Redirect output when necesary
                             if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                 artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                             }

                             if ((comando.result !== false) && (artyomProperties.recognizing == true)) {
                                 artyom.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                 reconocimiento.stop();
                                 artyomProperties.recognizing = false;

                                 // Executing Command Action
                                 if (comando.wildcard) {
                                     comando.objeto.action(comando.indice, comando.wildcard.item);
                                 } else {
                                     comando.objeto.action(comando.indice);
                                 }

                                 break;
                             }
                         } else {
                             let comando = artyom_execute(identificated.trim());
                             // Redirect output when necesary
                             if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                 artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                             }

                             if ((comando.result !== false) && (artyomProperties.recognizing == true)) {
                                 artyom.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                 reconocimiento.stop();
                                 artyomProperties.recognizing = false;

                                 // Executing Command Action
                                 if (comando.wildcard) {
                                     comando.objeto.action(comando.indice, comando.wildcard.item);
                                 } else {
                                     comando.objeto.action(comando.indice);
                                 }

                                 break;
                             }
                         }

                         artyom.debug("Quick mode : " + identificated);
                     }
                 }
             }

             // Process the recognition in remote mode
             if(artyomProperties.mode == "remote"){
                 onResultProcessor = function(event){
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.TEXT_RECOGNIZED);
                     let cantidadResultados = event.results.length;
                     if (typeof (artyomProperties.helpers.remoteProcessorHandler) !== "function") {
                         return artyom.debug("The remoteProcessorService is undefined.","warn");
                     }

                     for (let i = event.resultIndex; i < cantidadResultados; ++i) {
                         let identificated = event.results[i][0].transcript;
                         artyomProperties.helpers.remoteProcessorHandler({
                             text: identificated,
                             isFinal:event.results[i].isFinal
                         });
                     }
                 }
             }

             /**
              * Process the recognition event with the previously declared processor function.
              */
             reconocimiento.onresult = function(event) {
                 if(artyomProperties.obeying) {
                     onResultProcessor(event);
                 } else {
                     // Handle obeyKeyword if exists and artyom is not obeying
                     if(!artyomProperties.obeyKeyword) {
                         return;
                     }

                     let temporal = "";
                     let interim = "";
                     let resultsLength = event.results.length;
                     for (let i = 0; i < resultsLength; ++i) {
                         if (event.results[i].final) {
                             temporal += event.results[i][0].transcript;
                         } else {
                             interim += event.results[i][0].transcript;
                         }
                     }

                     artyom.debug("Artyom is not obeying","warn");

                     // If the obeyKeyword is found in the recognized text enable command recognition again
                     if(((interim).indexOf(artyomProperties.obeyKeyword) > -1) || (temporal).indexOf(artyomProperties.obeyKeyword) > -1){
                         artyomProperties.obeying = true;
                     }
                 }
             };

             if (artyomProperties.recognizing) {
                 reconocimiento.stop();
                 artyom.debug("Event reached : " + artyom_global_events.COMMAND_RECOGNITION_END);
                 artyomHelpers.artyomTriggerEvent(artyom_global_events.COMMAND_RECOGNITION_END);
             } else {
                 try {
                     reconocimiento.start();
                 } catch (e) {
                     artyomHelpers.artyomTriggerEvent(artyom_global_events.ERROR,{
                         code: "recognition_overlap",
                         message: "A webkitSpeechRecognition instance has been started while there's already running. Is recommendable to restart the Browser"
                     });
                 }
             }
         };    

         artyom.extensions = function () {
             return {};
         };

         artyom.getNativeApi = function () {
             return reconocimiento;
         };

         artyom.isRecognizing = function(){
             return artyomProperties.recognizing;
         };

         artyom.isSpeaking = function(){
             return artyomProperties.speaking;
         };

         artyom.clearGarbageCollection = function(){
             // Review this return, because it will always return true
             return artyom_garbage_collector = [];
         };

         artyom.getGarbageCollection = function(){
             return artyom_garbage_collector;
         };

         /*artyom.setDebug = function(status: boolean){
             if(status){
                 return artyomProperties.debug = true;
             }else{
                 return artyomProperties.debug = false;
             }
         };*/

         artyom.dontObey = function(){
             return artyomProperties.obeying = false;
         };

         artyom.obey = function(){
             return artyomProperties.obeying = true;
         };

         artyom.isObeying = function(){
             return artyomProperties.obeying;
         };

         artyom.getVersion = function () {
             return "1.0.1";
         };

         artyom.on = function(indexes, smart){
             return {
                 then: function(action){
                     let command = {
                         indexes:indexes,
                         action: action,
                         smart: false
                     };

                     if(smart){
                         command.smart = true;
                         //command['smart'] = true;
                     }

                     artyom.addCommands(command);
                 }
             };
         };

         artyom.remoteProcessorService = function(action){
             artyomProperties.helpers.remoteProcessorHandler = action;
             return true;
         };

         // Return the recent created instance
         Artyom.instance = artyom;
         return artyom;
    }

    /**
     * 
     */
    static getInstance() {
        if (!Artyom.instance) {
            // Protect the instance to be inherited
            Artyom.instance = Object.preventExtensions(new Artyom());
        }
        // Return the instance
        return Artyom.instance;
    }

}
