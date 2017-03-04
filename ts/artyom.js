"use strict";
/**
 * Internal class to provie an implementation of soundex
 */
var ArtyomInternals = (function () {
    function ArtyomInternals() {
    }
    /**
     * Retrieve a single voice of the browser by it's language code.
     * It will return the first voice available for the language on every device.
     *
     * @param {languageCode} String Language code
     * @returns {Voice}
     */
    ArtyomInternals.getVoice = function (languageCode) {
        var voiceIdentifiersArray = [];
        switch (languageCode) {
            case 'de-DE':
                voiceIdentifiersArray = ArtyomLanguages.german;
                break;
            case 'en-GB':
                voiceIdentifiersArray = ArtyomLanguages.englishGB;
                break;
            case "pt-BR":
            case "pt-PT":
                voiceIdentifiersArray = ArtyomLanguages.brasilian;
                break;
            case "ru-RU":
                voiceIdentifiersArray = ArtyomLanguages.russia;
                break;
            case "nl-NL":
                voiceIdentifiersArray = ArtyomLanguages.holand;
                break;
            case 'es-ES':
                voiceIdentifiersArray = ArtyomLanguages.spanish;
                break;
            case 'en-US':
                voiceIdentifiersArray = ArtyomLanguages.englishUSA;
                break;
            case 'fr-FR':
                voiceIdentifiersArray = ArtyomLanguages.france;
                break;
            case 'it-IT':
                voiceIdentifiersArray = ArtyomLanguages.italian;
                break;
            case 'ja-JP':
                voiceIdentifiersArray = ArtyomLanguages.japanese;
                break;
            case 'id-ID':
                voiceIdentifiersArray = ArtyomLanguages.indonesia;
                break;
            case 'hi-IN':
                voiceIdentifiersArray = ArtyomLanguages.hindi;
                break;
            case 'pl-PL':
                voiceIdentifiersArray = ArtyomLanguages.polski;
                break;
            case 'zh-CN':
                voiceIdentifiersArray = ArtyomLanguages.mandarinChinese;
                break;
            case 'zh-HK':
                voiceIdentifiersArray = ArtyomLanguages.cantoneseChinese;
                break;
            case 'native':
                voiceIdentifiersArray = ArtyomLanguages.native;
                break;
            default:
                console.warn("The given language '" + languageCode + "' for artyom is not supported yet. Using native voice instead");
                break;
        }
        var voice = undefined;
        var voices = speechSynthesis.getVoices();
        var voicesLength = voiceIdentifiersArray.length;
        for (var i = 0; i < voicesLength; i++) {
            var foundVoice = voices.filter(function (voice) {
                return ((voice.name == voiceIdentifiersArray[i]) || (voice.lang == voiceIdentifiersArray[i]));
            })[0];
            if (foundVoice) {
                voice = foundVoice;
                break;
            }
        }
        return voice;
    };
    ;
    /**
     * Soundex algorithm implementation
     * @param {string} s
     * @return {string}
     */
    ArtyomInternals.soundex = function (s) {
        var a = s.toLowerCase().split(''), f = a.shift(), r = '', codes = {
            a: '',
            e: '',
            i: '',
            o: '',
            u: '',
            b: 1,
            f: 1,
            p: 1,
            v: 1,
            c: 2,
            g: 2,
            j: 2,
            k: 2,
            q: 2,
            s: 2,
            x: 2,
            z: 2,
            d: 3,
            t: 3,
            l: 4,
            m: 5,
            n: 5,
            r: 6
        };
        r = f +
            a
                .map(function (v, i, a) {
                return codes[v];
            })
                .filter(function (v, i, a) {
                return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
            })
                .join('');
        return (r + '000').slice(0, 4).toUpperCase();
    };
    return ArtyomInternals;
}());
/**
 * Helper methods for Artyom core implementation
 */
var ArtyomHelpers = (function () {
    function ArtyomHelpers() {
    }
    /**
     * Determine if the current browser is Google Chrome (static method)
     * @return {boolean}
     */
    ArtyomHelpers.isChrome = function () {
        return navigator.userAgent.indexOf("Chrome") !== -1;
    };
    /**
     * Determine if the current device is a mobile (static method)
     * @return {boolean}
     */
    ArtyomHelpers.isMobileDevice = function () {
        return (navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i));
    };
    /**
     * Trigger an event
     * @param {string} name
     * @param {any} param
     * @return {event}
     */
    ArtyomHelpers.artyomTriggerEvent = function (name, param) {
        var event = new CustomEvent(name, { 'detail': param });
        document.dispatchEvent(event);
        return event;
    };
    ;
    return ArtyomHelpers;
}());
var ArtyomGlobalEvents = {
    ERROR: "ERROR",
    SPEECH_SYNTHESIS_START: "SPEECH_SYNTHESIS_START",
    SPEECH_SYNTHESIS_END: "SPEECH_SYNTHESIS_END",
    TEXT_RECOGNIZED: "TEXT_RECOGNIZED",
    COMMAND_RECOGNITION_START: "COMMAND_RECOGNITION_START",
    COMMAND_RECOGNITION_END: "COMMAND_RECOGNITION_END",
    COMMAND_MATCHED: "COMMAND_MATCHED",
    NOT_COMMAND_MATCHED: "NOT_COMMAND_MATCHED"
};
var ArtyomLanguages = {
    german: ["Google Deutsch", "de-DE", "de_DE"],
    spanish: ["Google español", "es-ES", "es_ES", "es-MX", "es_MX"],
    italian: ["Google italiano", "it-IT", "it_IT"],
    japanese: ["Google 日本人", "ja-JP", "ja_JP"],
    englishUSA: ["Google US English", "en-US", "en_US"],
    englishGB: ["Google UK English Male", "Google UK English Female", "en-GB", "en_GB"],
    brasilian: ["Google português do Brasil", "pt-PT", "pt-BR", "pt_PT", "pt_BR"],
    russia: ["Google русский", "ru-RU", "ru_RU"],
    holand: ["Google Nederlands", "nl-NL", "nl_NL"],
    france: ["Google français", "fr-FR", "fr_FR"],
    polski: ["Google polski", "pl-PL", "pl_PL"],
    indonesia: ["Google Bahasa Indonesia", "id-ID", "id_ID"],
    hindi: ["Google हिन्दी", "hi-IN", "hi_IN"],
    mandarinChinese: ["Google 普通话（中国大陆）", "zh-CN", "zh_CN"],
    cantoneseChinese: ["Google 粤語（香港）", "zh-HK", "zh_HK"],
    native: ["native"]
};
var ArtyomJsImpl = (function () {
    function ArtyomJsImpl() {
        var _this = this;
        this.artyomCommands = [];
        this.artyomGarbageCollector = [];
        this.device = {
            isChrome: function () { return ArtyomHelpers.isChrome(); },
            isMobile: function () { return !!ArtyomHelpers.isMobileDevice(); }
        };
        this.getVoices = function () {
            return (window['speechSynthesis']).getVoices();
        };
        this.getAvailableCommands = function () {
            return _this.artyomCommands;
        };
        this.initialize = function (config) {
            if (typeof (config) !== "object") {
                return Promise.reject("You must give the configuration for start artyom properly.");
            }
            if (config.hasOwnProperty("lang")) {
                _this.artyomVoice = ArtyomInternals.getVoice(config.lang);
                _this.artyomProperties.lang = config.lang;
            }
            if (config.hasOwnProperty("continuous")) {
                if (config.continuous) {
                    _this.artyomProperties.continuous = true;
                    _this.artyomFlags.restartRecognition = true;
                }
                else {
                    _this.artyomProperties.continuous = false;
                    _this.artyomFlags.restartRecognition = false;
                }
            }
            if (config.hasOwnProperty("speed")) {
                _this.artyomProperties.speed = config.speed;
            }
            if (config.hasOwnProperty("soundex")) {
                _this.artyomProperties.soundex = config.soundex;
            }
            if (config.hasOwnProperty("executionKeyword")) {
                _this.artyomProperties.executionKeyword = config.executionKeyword;
            }
            if (config.hasOwnProperty("obeyKeyword")) {
                _this.artyomProperties.obeyKeyword = config.obeyKeyword;
            }
            if (config.hasOwnProperty("volume")) {
                _this.artyomProperties.volume = config.volume;
            }
            if (config.hasOwnProperty("listen")) {
                _this.artyomProperties.listen = config.listen;
            }
            if (config.hasOwnProperty("debug")) {
                _this.artyomProperties.debug = config.debug;
            }
            else {
                console.warn("The initialization doesn't provide how the debug mode should be handled. Is recommendable to set this value either to true or false.");
            }
            if (config.mode) {
                _this.artyomProperties.mode = config.mode;
            }
            if (_this.artyomProperties.listen === true) {
                var hey_1 = _this.artyomHey;
                return new Promise(function (resolve, reject) {
                    hey_1(resolve, reject);
                });
            }
            return Promise.resolve(undefined);
        };
        this.fatality = function () {
            try {
                // if config is continuous mode, deactivate anyway.
                _this.artyomFlags.restartRecognition = false;
                _this.artyomWSR.stop();
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        };
        this.addCommands = function (param) {
            var _processObject = function (obj) {
                if (obj.hasOwnProperty("indexes")) {
                    _this.artyomCommands.push(obj);
                }
                else {
                    console.error("The following command doesn't provide any index to execute :");
                    console.dir(obj);
                }
            };
            if (param instanceof Array) {
                var paramLength = param.length;
                for (var i = 0; i < paramLength; i++) {
                    _processObject(param[i]);
                }
            }
            else {
                _processObject(param);
            }
            return true;
        };
        this.removeCommands = function (identifier) {
            var toDelete = [];
            if (typeof (identifier) === "string") {
                var commandsLength = _this.artyomCommands.length;
                for (var i = 0; i < commandsLength; i++) {
                    var command = _this.artyomCommands[i];
                    if (command.indexes.indexOf(identifier)) {
                        toDelete.push(i);
                    }
                }
                var toDeleteLength = toDelete.length;
                for (var o = 0; o < toDeleteLength; o++) {
                    _this.artyomCommands.splice(o, 1);
                }
            }
            return toDelete;
        };
        this.emptyCommands = function () {
            return _this.artyomCommands = [];
        };
        this.shutUp = function () {
            if ('speechSynthesis' in window) {
                do {
                    (window['speechSynthesis']).cancel();
                } while ((window['speechSynthesis']).pending === true);
            }
            _this.artyomProperties.speaking = false;
            _this.clearGarbageCollection();
        };
        this.getProperties = function () {
            return _this.artyomProperties;
        };
        this.when = function (event, action) {
            return document.addEventListener(event, function (e) {
                action(e.detail);
            }, false);
        };
        this.getLanguage = function () {
            return _this.artyomProperties.lang;
        };
        this.artyomTalk = function (text, actualChunk, totalChunks, callbacks) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = text;
            msg.volume = _this.artyomProperties.volume;
            msg.rate = _this.artyomProperties.speed;
            // Select the voice according to the selected
            if (typeof (_this.artyomVoice) != "undefined") {
                var availableVoice = undefined;
                if (callbacks) {
                    // If the language to speak has been forced, use it
                    if (callbacks.hasOwnProperty("lang")) {
                        availableVoice = ArtyomInternals.getVoice(callbacks.lang);
                    }
                    else {
                        availableVoice = ArtyomInternals.getVoice(_this.artyomProperties.lang);
                    }
                }
                else {
                    // Otherwise speak in the language of the initialization
                    availableVoice = ArtyomInternals.getVoice(_this.artyomProperties.lang);
                }
                // If is a mobile device, provide only the language code in the lang property i.e "es_ES"
                if (_this.device.isMobile()) {
                    // Try to set the voice only if exists, otherwise don't use anything to use the native voice
                    if (availableVoice) {
                        msg.lang = availableVoice.lang;
                    }
                }
                else {
                    msg.voice = availableVoice;
                }
            }
            else {
                console.warn("Using default voice because no voice was selected during the initialization probably because there were no voices available. Initialize artyom after the onload event of the window.");
            }
            // If is first text chunk (onStart)
            if (actualChunk == 1) {
                msg.addEventListener('start', function () {
                    // Set artyom is talking
                    _this.artyomProperties.speaking = true;
                    // Trigger the onSpeechSynthesisStart event
                    _this.debug("Event reached : " + ArtyomGlobalEvents.SPEECH_SYNTHESIS_START);
                    // The original library dismiss the second parameter
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.SPEECH_SYNTHESIS_START);
                    // Trigger the onStart callback if exists
                    if (callbacks) {
                        if (typeof (callbacks.onStart) == "function") {
                            callbacks.onStart.call(msg);
                        }
                    }
                });
            }
            // If is final text chunk (onEnd)
            if ((actualChunk) >= totalChunks) {
                msg.addEventListener('end', function () {
                    // Set artyom is talking
                    _this.artyomProperties.speaking = false;
                    // Trigger the onSpeechSynthesisEnd event
                    _this.debug("Event reached : " + ArtyomGlobalEvents.SPEECH_SYNTHESIS_END);
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.SPEECH_SYNTHESIS_END);
                    // Trigger the onEnd callback if exists.
                    if (callbacks) {
                        if (typeof (callbacks.onEnd) == "function") {
                            callbacks.onEnd.call(msg);
                        }
                    }
                });
            }
            // Notice how many chunks were processed for the given text.
            _this.debug((actualChunk) + " text chunk processed succesfully out of " + totalChunks);
            // Important : Save the SpeechSynthesisUtterance object in memory, otherwise it will get lost
            // thanks to the Garbage collector of javascript
            _this.artyomGarbageCollector.push(msg);
            (window['speechSynthesis']).speak(msg);
        };
        this.splitStringByChunks = function (input, chunk_length) {
            var prev = 0;
            var output = [];
            input = input || "";
            chunk_length = chunk_length || 100;
            var curr = chunk_length;
            while (input[curr]) {
                if (input[curr++] == ' ') {
                    output.push(input.substring(prev, curr));
                    prev = curr;
                    curr += chunk_length;
                }
            }
            output.push(input.substr(prev));
            return output;
        };
        this.say = function (message, callbacks) {
            var artyom_say_max_chunk_length = 115;
            if (_this.speechSupported()) {
                if (typeof (message) === 'string') {
                    if (message.length > 0) {
                        var definitive_1 = [];
                        // If the providen text is long, proceed to split it
                        if (message.length > artyom_say_max_chunk_length) {
                            // Split the given text by pause reading characters [",",":",";","."] to provide a natural reading feeling.
                            var naturalReading = message.split(/,|:|\.|;/);
                            naturalReading.forEach(function (chunk, index) {
                                // If the sentence is too long and could block the API, split it to prevent any errors.
                                if (chunk.length > artyom_say_max_chunk_length) {
                                    // Process the providen string into strings (withing an array) of maximum aprox. 115 characters to prevent any error with the API.
                                    var temp_processed = _this.splitStringByChunks(chunk, artyom_say_max_chunk_length);
                                    // Add items of the processed sentence into the definitive chunk.
                                    definitive_1.push.apply(definitive_1, temp_processed);
                                }
                                else {
                                    // Otherwise just add the sentence to being spoken.
                                    definitive_1.push(chunk);
                                }
                            });
                        }
                        else {
                            definitive_1.push(message);
                        }
                        // Clean any empty item in array
                        definitive_1 = definitive_1.filter(function (e) { return e; });
                        // Finally proceed to talk the chunks and assign the callbacks.
                        definitive_1.forEach(function (chunk, index) {
                            var numberOfChunk = (index + 1);
                            if (chunk) {
                                _this.artyomTalk(chunk, numberOfChunk, definitive_1.length, callbacks);
                            }
                        });
                        // Save the spoken text into the lastSay object of artyom
                        _this.artyomProperties.helpers.lastSay = {
                            text: message,
                            date: new Date()
                        };
                    }
                    else {
                        console.warn("Artyom expects a string to say ... none given.");
                    }
                }
                else {
                    console.warn("Artyom expects a string to say ... " + typeof (message) + " given.");
                }
            }
        };
        this.repeatLastSay = function (returnObject) {
            var last = _this.artyomProperties.helpers.lastSay;
            if (returnObject) {
                return last;
            }
            else {
                if (last != null) {
                    _this.say(last.text);
                }
            }
        };
        this.speechSupported = function () {
            return 'speechSynthesis' in window;
        };
        this.recognizingSupported = function () {
            return 'webkitSpeechRecognition' in window;
        };
        this.simulateInstruction = function (sentence) {
            if ((!sentence) || (typeof (sentence) !== "string")) {
                console.warn("Cannot execute a non string command");
                return false;
            }
            var foundCommand = _this.artyomExecute(sentence); // Command founded object
            if (foundCommand.result && foundCommand.objeto) {
                if (foundCommand.objeto.smart) {
                    _this.debug('Smart command matches with simulation, executing', "info");
                    foundCommand.objeto.action(foundCommand.indice, foundCommand.wildcard.item, foundCommand.wildcard.full);
                }
                else {
                    _this.debug('Command matches with simulation, executing', "info");
                    foundCommand.objeto.action(foundCommand.indice); // Execute Normal command
                }
                return true;
            }
            else {
                console.warn("No command founded trying with " + sentence);
                return false;
            }
        };
        this.artyomExecute = function (voice) {
            if (!voice) {
                console.warn("Internal error: Execution of empty command");
                return {
                    result: false,
                    indice: null,
                    objeto: null,
                    wildcard: {
                        item: null,
                        full: voice
                    }
                };
            }
            var wildcard;
            _this.debug(">> " + voice);
            // @3 Artyom needs time to think that
            var artyomCommandsLength = _this.artyomCommands.length;
            for (var i = 0; i < artyomCommandsLength; i++) {
                var instruction = _this.artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;
                var optionsLength = opciones.length;
                for (var c = 0; c < optionsLength; c++) {
                    var opcion = opciones[c];
                    if (!instruction.smart) {
                        continue; // Jump if is not smart command
                    }
                    if (opcion instanceof RegExp) {
                        // If RegExp matches 
                        if (opcion.test(voice)) {
                            _this.debug(">> REGEX " + opcion.toString() + " MATCHED AGAINST " + voice + " WITH INDEX " + c + " IN COMMAND ", "info");
                            encontrado = c;
                        }
                    }
                    else {
                        if (opcion.indexOf("*") !== -1) {
                            // Logic here
                            var grupo = opcion.split("*");
                            if (grupo.length > 2) {
                                console.warn("Artyom found a smart command with " + (grupo.length - 1) + " wildcards. Artyom only support 1 wildcard for each command. Sorry");
                                continue;
                            }
                            // Start smart command
                            var before = grupo[0];
                            var latter = grupo[1];
                            // Wildcard in the end
                            //if ((latter === "") || (latter === " ")) {
                            if (latter.trim() === "") {
                                if ((voice.indexOf(before) !== -1) || ((voice.toLowerCase()).indexOf(before.toLowerCase()) !== -1)) {
                                    var wildy = voice.replace(before, '');
                                    wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '');
                                    wildcard = wildy;
                                    encontrado = c;
                                }
                            }
                            else {
                                if ((voice.indexOf(before) != -1) || ((voice.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                    if ((voice.indexOf(latter) != -1) || ((voice.toLowerCase()).indexOf(latter.toLowerCase()) != -1)) {
                                        var wildy = voice.replace(before, '').replace(latter, '');
                                        wildy = (wildy.toLowerCase())
                                            .replace(before.toLowerCase(), '')
                                            .replace(latter.toLowerCase(), '');
                                        wildy = (wildy.toLowerCase()).replace(latter.toLowerCase(), '');
                                        wildcard = wildy;
                                        encontrado = c;
                                    }
                                }
                            }
                        }
                        else {
                            console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                        }
                    }
                    if ((encontrado >= 0)) {
                        encontrado = c;
                        break;
                    }
                }
                if (encontrado >= 0) {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_MATCHED);
                    return {
                        result: true,
                        indice: encontrado,
                        objeto: instruction,
                        wildcard: {
                            item: wildcard,
                            full: voice
                        }
                    };
                }
            } // End @3
            // @1 Search for IDENTICAL matches in the commands if nothing matches start with a index match in commands
            artyomCommandsLength = _this.artyomCommands.length;
            for (var i = 0; i < artyomCommandsLength; i++) {
                var instruction = _this.artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;
                // Execution of match with identical commands
                for (var c = 0; c < opciones.length; c++) {
                    var opcion = opciones[c];
                    if (instruction.smart) {
                        continue; // Jump wildcard commands
                    }
                    if ((voice === opcion)) {
                        _this.debug(">> MATCHED FULL EXACT OPTION " + opcion + " AGAINST " + voice + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = c;
                        break;
                    }
                    else if ((voice.toLowerCase() === opcion.toLowerCase())) {
                        _this.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voice + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = c;
                        break;
                    }
                }
                if (encontrado >= 0) {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_MATCHED);
                    return {
                        result: true,
                        indice: encontrado,
                        objeto: instruction,
                        wildcard: null
                    };
                }
            } // End @1
            // Step 3 Commands recognition. If the command is not smart, and any of the commands match exactly then try to find a command in all the quote.
            artyomCommandsLength = _this.artyomCommands.length;
            for (var i = 0; i < artyomCommandsLength; i++) {
                var instruction = _this.artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;
                // Execution of match with index
                var optionsLength = opciones.length;
                for (var c = 0; c < optionsLength; c++) {
                    if (instruction.smart) {
                        continue; // Jump wildcard commands
                    }
                    var opcion = opciones[c];
                    if ((voice.indexOf(opcion) >= 0)) {
                        _this.debug(">> MATCHED INDEX EXACT OPTION " + opcion + " AGAINST " + voice + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = c;
                        break;
                    }
                    else if (((voice.toLowerCase()).indexOf(opcion.toLowerCase()) >= 0)) {
                        _this.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voice + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = c;
                        break;
                    }
                }
                if (encontrado >= 0) {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_MATCHED);
                    return {
                        result: true,
                        indice: encontrado,
                        objeto: instruction,
                        wildcard: null
                    };
                }
            } // End Step 3
            /**
             * If the soundex options is enabled, proceed to process the commands in case that any of the previous
            * ways of processing (exact, lowercase and command in quote) didn't match anything.
            * Based on the soundex algorithm match a command if the spoken text is similar to any of the artyom commands.
            * Example:
            * If you have a command with "Open Wallmart" and "Open Willmar" is recognized, the open wallmart command will be triggered.
            * soundex("Open Wallmart") == soundex("Open Willmar") <= true
            *
            */
            if (_this.artyomProperties.soundex) {
                artyomCommandsLength = _this.artyomCommands.length;
                for (var i = 0; i < artyomCommandsLength; i++) {
                    var instruction = _this.artyomCommands[i];
                    var opciones = instruction.indexes;
                    var encontrado = -1;
                    var optionsLength = opciones.length;
                    for (var c = 0; c < optionsLength; c++) {
                        var opcion = opciones[c];
                        if (instruction.smart) {
                            continue; // Jump wildcard commands
                        }
                        if (ArtyomInternals.soundex(voice) == ArtyomInternals.soundex(opcion)) {
                            _this.debug(">> Matched Soundex command '" + opcion + "' AGAINST '" + voice + "' with index " + c, "info");
                            encontrado = c;
                            ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_MATCHED);
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
            _this.debug("Event reached : " + ArtyomGlobalEvents.NOT_COMMAND_MATCHED);
            ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.NOT_COMMAND_MATCHED);
            return {
                result: false,
                indice: null,
                objeto: null,
                wildcard: null
            };
        };
        this.debug = function (stringEvent, traceLevel) {
            if (_this.artyomProperties.debug === true) {
                switch (traceLevel) {
                    case 'error':
                        console.log(' %cArtyom.js ' + " " + stringEvent, 'background: #C12127; color: #FFFFFF');
                        break;
                    case 'warn':
                        console.warn(stringEvent);
                        break;
                    case 'info':
                        console.log(' %cArtyom.js: ' + " " + stringEvent, 'background: #4285F4; color: #FFFFFF');
                        break;
                    default:
                        console.log(' %cArtyom.js %c ' + " " + stringEvent, 'background: #005454; color: #BFF8F8', 'color:black;');
                        break;
                }
            }
        };
        this.redirectRecognizedTextOutput = function (action) {
            if (typeof (action) != "function") {
                console.warn("Expected function to handle the recognized text ...");
                return false;
            }
            _this.artyomProperties.helpers.redirectRecognizedTextOutput = action;
            return true;
        };
        this.sayRandom = function (data) {
            if (data instanceof Array) {
                var index = Math.floor(Math.random() * data.length);
                _this.say(data[index]);
                return {
                    text: data[index],
                    index: index
                };
            }
            else {
                console.error("Random quotes must be in an array !");
                return null;
            }
        };
        this.newDictation = function (settings) {
            if (!_this.recognizingSupported()) {
                console.error("SpeechRecognition is not supported in this browser");
                return false;
            }
            var dictado = new webkitSpeechRecognition();
            dictado.continuous = true;
            dictado.interimResults = true;
            dictado.lang = _this.artyomProperties.lang;
            dictado.onresult = function (event) {
                var temporal = "";
                var interim = "";
                var resultsLength = event.results.length;
                for (var i = 0; i < resultsLength; ++i) {
                    if (event.results[i].isFinal) {
                        temporal += event.results[i][0].transcript;
                    }
                    else {
                        interim += event.results[i][0].transcript;
                    }
                }
                if (settings.onResult) {
                    settings.onResult(interim, temporal);
                }
            };
            return new function () {
                var dictation = dictado;
                var flagStartCallback = true;
                var flagRestart = false;
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
                        }
                        else {
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
        this.newPrompt = function (config) {
            if (typeof (config) !== "object") {
                console.error("Expected the prompt configuration.");
            }
            var copyActualCommands = Object.assign([], _this.artyomCommands);
            _this.emptyCommands();
            var promptCommand = {
                description: 'Setting the artyom commands only for the prompt. The commands will be restored after the prompt finishes',
                indexes: config.options,
                smart: (config.smart) ? true : false,
                action: function (i, wildcard) {
                    _this.artyomCommands = copyActualCommands;
                    var toExe = config.onMatch(i, wildcard);
                    if (typeof (toExe) !== "function") {
                        console.error("onMatch function expects a returning function to be executed");
                        return;
                    }
                    toExe();
                }
            };
            _this.addCommands(promptCommand);
            if (typeof (config.beforePrompt) !== "undefined") {
                config.beforePrompt();
            }
            _this.say(config.question, {
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
        this.artyomHey = function (resolve, reject) {
            var start_timestamp;
            var artyom_is_allowed;
            /**
             * On mobile devices the recognized text is always thrown twice.
             * By setting the following configuration, fixes the issue
             */
            if (ArtyomHelpers.isMobileDevice) {
                _this.artyomWSR.continuous = false;
                _this.artyomWSR.interimResults = false;
                _this.artyomWSR.maxAlternatives = 1;
            }
            else {
                _this.artyomWSR.continuous = true;
                _this.artyomWSR.interimResults = true;
            }
            _this.artyomWSR.lang = _this.artyomProperties.lang;
            _this.artyomWSR.onstart = function () {
                _this.debug("Event reached : " + ArtyomGlobalEvents.COMMAND_RECOGNITION_START);
                ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_RECOGNITION_START);
                _this.artyomProperties.recognizing = true;
                artyom_is_allowed = true;
                resolve();
            };
            /**
             * Handle all artyom posible exceptions
            * @param {type} event
            * @returns {undefined}
            */
            _this.artyomWSR.onerror = function (event) {
                reject(event.error);
                // Dispath error globally (artyom.when)
                ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.ERROR, {
                    code: event.error
                });
                if (event.error === 'audio-capture') {
                    artyom_is_allowed = false;
                }
                if (event.error === 'not-allowed') {
                    artyom_is_allowed = false;
                    if (event.timeStamp - start_timestamp < 100) {
                        ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.ERROR, {
                            code: "info-blocked",
                            message: "Artyom needs the permision of the microphone, is blocked."
                        });
                    }
                    else {
                        ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.ERROR, {
                            code: "info-denied",
                            message: "Artyom needs the permision of the microphone, is denied"
                        });
                    }
                }
            };
            /**
             * Check if continuous mode is active and restart the recognition. Throw events too.
            */
            _this.artyomWSR.onend = function () {
                if (_this.artyomFlags.restartRecognition === true) {
                    if (artyom_is_allowed === true) {
                        _this.artyomWSR.start();
                        _this.debug("Continuous mode enabled, restarting", "info");
                    }
                    else {
                        console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                    }
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_RECOGNITION_END, {
                        code: "continuous_mode_enabled",
                        message: "OnEnd event reached with continuous mode"
                    });
                }
                else {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_RECOGNITION_END, {
                        code: "continuous_mode_disabled",
                        message: "OnEnd event reached without continuous mode"
                    });
                }
                _this.artyomProperties.recognizing = false;
            };
            /**
             * Declare the processor dinamycally according to the mode of artyom to increase the performance.
            */
            var onResultProcessor;
            // Process the recognition in normal mode
            if (_this.artyomProperties.mode === "normal") {
                onResultProcessor = function (event) {
                    if (!_this.artyomCommands.length) {
                        _this.debug("No commands to process in normal mode.");
                        return;
                    }
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.TEXT_RECOGNIZED);
                    var cantidadResultados = event.results.length;
                    for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                        var identificated = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            var comando = _this.artyomExecute(identificated.trim());
                            // Redirect the output of the text if necessary
                            if (typeof (_this.artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                _this.artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                            }
                            if ((comando.result !== false) && (_this.artyomProperties.recognizing === true)) {
                                _this.debug("<< Executing Matching Recognition in normal mode >>", "info");
                                _this.artyomWSR.stop();
                                _this.artyomProperties.recognizing = false;
                                // Execute the command if smart
                                if (comando.wildcard) {
                                    comando.objeto.action(comando.indice, comando.wildcard.item, comando.wildcard.full);
                                }
                                else {
                                    comando.objeto.action(comando.indice);
                                }
                                break;
                            }
                        }
                        else {
                            // Redirect output when necesary
                            if (typeof (_this.artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                _this.artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                            }
                            if (typeof (_this.artyomProperties.executionKeyword) === "string") {
                                if (identificated.indexOf(_this.artyomProperties.executionKeyword) !== -1) {
                                    var comando = _this.artyomExecute(identificated.replace(_this.artyomProperties.executionKeyword, '').trim());
                                    if ((comando.result !== false) && (_this.artyomProperties.recognizing === true)) {
                                        _this.debug("<< Executing command ordered by ExecutionKeyword >>", 'info');
                                        _this.artyomWSR.stop();
                                        _this.artyomProperties.recognizing = false;
                                        // Executing Command Action
                                        if (comando.wildcard) {
                                            comando.objeto.action(comando.indice, comando.wildcard.item, comando.wildcard.full);
                                        }
                                        else {
                                            comando.objeto.action(comando.indice);
                                        }
                                        break;
                                    }
                                }
                            }
                            _this.debug("Normal mode : " + identificated);
                        }
                    }
                };
            }
            // Process the recognition in quick mode
            if (_this.artyomProperties.mode === "quick") {
                onResultProcessor = function (event) {
                    if (!_this.artyomCommands.length) {
                        _this.debug("No commands to process.");
                        return;
                    }
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.TEXT_RECOGNIZED);
                    var cantidadResultados = event.results.length;
                    for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                        var identificated = event.results[i][0].transcript;
                        if (!event.results[i].isFinal) {
                            var comando = _this.artyomExecute(identificated.trim());
                            // Redirect output when necesary
                            if (typeof (_this.artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                _this.artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                            }
                            if ((comando.result !== false) && (_this.artyomProperties.recognizing == true)) {
                                _this.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                _this.artyomWSR.stop();
                                _this.artyomProperties.recognizing = false;
                                // Executing Command Action
                                if (comando.wildcard) {
                                    comando.objeto.action(comando.indice, comando.wildcard.item);
                                }
                                else {
                                    comando.objeto.action(comando.indice);
                                }
                                break;
                            }
                        }
                        else {
                            var comando = _this.artyomExecute(identificated.trim());
                            // Redirect output when necesary
                            if (_this.artyomProperties.helpers && typeof (_this.artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                _this.artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                            }
                            if ((comando.result !== false) && (_this.artyomProperties.recognizing == true)) {
                                _this.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                _this.artyomWSR.stop();
                                _this.artyomProperties.recognizing = false;
                                // Executing Command Action
                                if (comando.wildcard) {
                                    if (comando.objeto && typeof (comando.indice) === 'number') {
                                        comando.objeto.action(comando.indice, comando.wildcard.item);
                                    }
                                }
                                else {
                                    if (comando.objeto && typeof (comando.indice) === 'number') {
                                        comando.objeto.action(comando.indice);
                                    }
                                }
                                break;
                            }
                        }
                        _this.debug("Quick mode : " + identificated);
                    }
                };
            }
            // Process the recognition in remote mode
            if (_this.artyomProperties.mode == "remote") {
                onResultProcessor = function (event) {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.TEXT_RECOGNIZED);
                    var cantidadResultados = event.results.length;
                    if (_this.artyomProperties.helpers && typeof (_this.artyomProperties.helpers.remoteProcessorHandler) !== "function") {
                        return _this.debug("The remoteProcessorService is undefined.", "warn");
                    }
                    for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                        var identificated = event.results[i][0].transcript;
                        if (_this.artyomProperties.helpers) {
                            _this.artyomProperties.helpers.remoteProcessorHandler({
                                text: identificated,
                                isFinal: event.results[i].isFinal
                            });
                        }
                    }
                };
            }
            /**
             * Process the recognition event with the previously declared processor function.
            */
            _this.artyomWSR.onresult = function (event) {
                if (_this.artyomProperties.obeying) {
                    onResultProcessor(event);
                }
                else {
                    // Handle obeyKeyword if exists and artyom is not obeying
                    if (!_this.artyomProperties.obeyKeyword) {
                        return;
                    }
                    var temporal = "";
                    var interim = "";
                    var resultsLength = event.results.length;
                    for (var i = 0; i < resultsLength; ++i) {
                        if (event.results[i].final) {
                            temporal += event.results[i][0].transcript;
                        }
                        else {
                            interim += event.results[i][0].transcript;
                        }
                    }
                    _this.debug("Artyom is not obeying", "warn");
                    // If the obeyKeyword is found in the recognized text enable command recognition again
                    if (((interim).indexOf(_this.artyomProperties.obeyKeyword) > -1) || (temporal).indexOf(_this.artyomProperties.obeyKeyword) > -1) {
                        _this.artyomProperties.obeying = true;
                    }
                }
            };
            if (_this.artyomProperties.recognizing) {
                _this.artyomWSR.stop();
                _this.debug("Event reached : " + ArtyomGlobalEvents.COMMAND_RECOGNITION_END);
                ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.COMMAND_RECOGNITION_END);
            }
            else {
                try {
                    _this.artyomWSR.start();
                }
                catch (e) {
                    ArtyomHelpers.artyomTriggerEvent(ArtyomGlobalEvents.ERROR, {
                        code: "recognition_overlap",
                        message: "A webkitSpeechRecognition instance has been started while there's already running. Is recommendable to restart the Browser"
                    });
                }
            }
        };
        this.getNativeApi = function () {
            return _this.artyomWSR;
        };
        this.isRecognizing = function () {
            return !!_this.artyomProperties.recognizing;
        };
        this.isSpeaking = function () {
            return !!_this.artyomProperties.speaking;
        };
        this.clearGarbageCollection = function () {
            // Review this return, because it will always return true
            return _this.artyomGarbageCollector = [];
        };
        this.getGarbageCollection = function () {
            return _this.artyomGarbageCollector;
        };
        this.dontObey = function () {
            // Comprobar tipo devuelto -> siempre false?
            return _this.artyomProperties.obeying = false;
        };
        this.obey = function () {
            // Check returned type ? alway true
            return _this.artyomProperties.obeying = true;
        };
        this.isObeying = function () {
            return !!_this.artyomProperties.obeying;
        };
        this.getVersion = function () {
            return "1.0.5";
        };
        this.on = function (indexes, smart) {
            return {
                then: function (action) {
                    var command = {
                        indexes: indexes,
                        action: action,
                        smart: false
                    };
                    if (smart) {
                        command.smart = true;
                    }
                    _this.addCommands(command);
                }
            };
        };
        this.remoteProcessorService = function (action) {
            if (_this.artyomProperties.helpers) {
                _this.artyomProperties.helpers.remoteProcessorHandler = action;
            }
            return true;
        };
        // Load browser voices as soon as possible
        if (window.hasOwnProperty('speechSynthesis')) {
            speechSynthesis.getVoices();
        }
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            var webkitSpeechRecognition_1 = window.webkitSpeechRecognition;
            this.artyomWSR = new webkitSpeechRecognition_1();
        }
        // Default values
        this.artyomProperties = {
            lang: 'en-GB',
            recognizing: false,
            continuous: false,
            speed: 1,
            volume: 1,
            listen: false,
            mode: 'normal',
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
        // Recognition
        this.artyomFlags = {
            restartRecognition: false
        };
        // Default voice
        this.artyomVoice = {
            "default": false,
            lang: "en-GB",
            localService: false,
            name: "Google UK English Male",
            voiceURI: "Google UK English Male"
        };
    }
    return ArtyomJsImpl;
}());
exports.ArtyomJsImpl = ArtyomJsImpl;
/**
 * Artyom.js requires webkitSpeechRecognition and speechSynthesis APIs
 *
 * @license MIT
 * @version 1.0.4
 * @copyright 2017 Our Code World All Rights Reserved.
 * @author semagarcia (TypeScript version) - https://github.com/semagarcia
 * @see https://sdkcarlos.github.io/sites/artyom.html
 * @see http://docs.ourcodeworld.com/projects/artyom-js
 */
var ArtyomBuilder = (function () {
    function ArtyomBuilder() {
        var artyom;
        var artyomVoice = 'Google UK English Male';
        var artyom_garbage_collector = [];
        var artyomCommands = [];
    }
    ArtyomBuilder.getInstance = function () {
        if (!ArtyomBuilder.instance) {
            // Protect the instance to be inherited
            ArtyomBuilder.instance = Object.preventExtensions(new ArtyomJsImpl());
        }
        // Return the instance
        return ArtyomBuilder.instance;
    };
    return ArtyomBuilder;
}());
exports.ArtyomBuilder = ArtyomBuilder;
