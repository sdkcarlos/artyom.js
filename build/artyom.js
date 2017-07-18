"use strict";
/**
 * Artyom.js is a voice control, speech recognition and speech synthesis JavaScript library.
 *
 * @requires {webkitSpeechRecognition && speechSynthesis}
 * @license MIT
 * @version 1.0.6
 * @copyright 2017 Our Code World (www.ourcodeworld.com) All Rights Reserved.
 * @author Carlos Delgado (https://github.com/sdkcarlos) and Sema García (https://github.com/semagarcia)
 * @see https://sdkcarlos.github.io/sites/artyom.html
 * @see http://docs.ourcodeworld.com/projects/artyom-js
 */
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path="artyom.d.ts" />
// Remove "export default " keywords if willing to build with `npm run artyom-build-window`
var Artyom = (function () {
    // Triggered at the declaration of 
    function Artyom() {
        this.ArtyomCommands = [];
        this.ArtyomVoicesIdentifiers = {
            // German
            "de-DE": ["Google Deutsch", "de-DE", "de_DE"],
            // Spanish
            "es-ES": ["Google español", "es-ES", "es_ES", "es-MX", "es_MX"],
            // Italian
            "it-IT": ["Google italiano", "it-IT", "it_IT"],
            // Japanese
            "jp-JP": ["Google 日本人", "ja-JP", "ja_JP"],
            // English USA
            "en-US": ["Google US English", "en-US", "en_US"],
            // English UK
            "en-GB": ["Google UK English Male", "Google UK English Female", "en-GB", "en_GB"],
            // Brazilian Portuguese
            "pt-BR": ["Google português do Brasil", "pt-PT", "pt-BR", "pt_PT", "pt_BR"],
            // Portugal Portuguese
            // Note: in desktop, there's no voice for portugal Portuguese
            "pt-PT": ["Google português do Brasil", "pt-PT", "pt_PT"],
            // Russian
            "ru-RU": ["Google русский", "ru-RU", "ru_RU"],
            // Dutch (holland)
            "nl-NL": ["Google Nederlands", "nl-NL", "nl_NL"],
            // French
            "fr-FR": ["Google français", "fr-FR", "fr_FR"],
            // Polish
            "pl-PL": ["Google polski", "pl-PL", "pl_PL"],
            // Indonesian
            "id-ID": ["Google Bahasa Indonesia", "id-ID", "id_ID"],
            // Hindi
            "hi-IN": ["Google हिन्दी", "hi-IN", "hi_IN"],
            // Mandarin Chinese
            "zh-CN": ["Google 普通话（中国大陆）", "zh-CN", "zh_CN"],
            // Cantonese Chinese
            "zh-HK": ["Google 粤語（香港）", "zh-HK", "zh_HK"],
            // Native voice
            "native": ["native"]
        };
        // Important: retrieve the voices of the browser as soon as possible.
        // Normally, the execution of speechSynthesis.getVoices will return at the first time an empty array.
        if (window.hasOwnProperty('speechSynthesis')) {
            speechSynthesis.getVoices();
        }
        else {
            console.error("Artyom.js can't speak without the Speech Synthesis API.");
        }
        // This instance of webkitSpeechRecognition is the one used by Artyom.
        if (window.hasOwnProperty('webkitSpeechRecognition')) {
            this.ArtyomWebkitSpeechRecognition = new window.webkitSpeechRecognition();
        }
        else {
            console.error("Artyom.js can't recognize voice without the Speech Recognition API.");
        }
        this.ArtyomProperties = {
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
                lastSay: null,
                fatalityPromiseCallback: null
            },
            executionKeyword: null,
            obeyKeyword: null,
            speaking: false,
            obeying: true,
            soundex: false,
            name: null
        };
        this.ArtyomGarbageCollection = [];
        this.ArtyomFlags = {
            restartRecognition: false
        };
        this.ArtyomGlobalEvents = {
            ERROR: "ERROR",
            SPEECH_SYNTHESIS_START: "SPEECH_SYNTHESIS_START",
            SPEECH_SYNTHESIS_END: "SPEECH_SYNTHESIS_END",
            TEXT_RECOGNIZED: "TEXT_RECOGNIZED",
            COMMAND_RECOGNITION_START: "COMMAND_RECOGNITION_START",
            COMMAND_RECOGNITION_END: "COMMAND_RECOGNITION_END",
            COMMAND_MATCHED: "COMMAND_MATCHED",
            NOT_COMMAND_MATCHED: "NOT_COMMAND_MATCHED"
        };
        this.Device = {
            isMobile: false,
            isChrome: true
        };
        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
            this.Device.isMobile = true;
        }
        if (navigator.userAgent.indexOf("Chrome") == -1) {
            this.Device.isChrome = false;
        }
        /**
         * The default voice of Artyom in the Desktop. In mobile, you will need to initialize (or force the language)
         * with a language code in order to find an available voice in the device, otherwise it will use the native voice.
         */
        this.ArtyomVoice = {
            default: false,
            lang: "en-GB",
            localService: false,
            name: "Google UK English Male",
            voiceURI: "Google UK English Male"
        };
    }
    /**
     * Add dinamically commands to artyom using
     * You can even add commands while artyom is active.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/addcommands
     * @since 0.6
     * @param {Object | Array[Objects]} param
     * @returns {undefined}
     */
    Artyom.prototype.addCommands = function (param) {
        var _this = this;
        var processCommand = function (command) {
            if (command.hasOwnProperty("indexes")) {
                _this.ArtyomCommands.push(command);
            }
            else {
                console.error("The given command doesn't provide any index to execute.");
            }
        };
        if (param instanceof Array) {
            for (var i = 0; i < param.length; i++) {
                processCommand(param[i]);
            }
        }
        else {
            processCommand(param);
        }
        return true;
    };
    ;
    /**
     * The SpeechSynthesisUtterance objects are stored in the artyom_garbage_collector variable
     * to prevent the wrong behaviour of artyom.say.
     * Use this method to clear all spoken SpeechSynthesisUtterance unused objects.
     *
     * @returns {Array<any>}
     */
    Artyom.prototype.clearGarbageCollection = function () {
        return this.ArtyomGarbageCollection = [];
    };
    ;
    /**
     * Displays a message in the console if the artyom propery DEBUG is set to true.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/debug
     * @returns {undefined}
     */
    Artyom.prototype.debug = function (message, type) {
        var preMessage = "[v" + this.getVersion() + "] Artyom.js";
        if (this.ArtyomProperties.debug === true) {
            switch (type) {
                case "error":
                    console.log("%c" + preMessage + ":%c " + message, 'background: #C12127; color: black;', 'color:black;');
                    break;
                case "warn":
                    console.warn(message);
                    break;
                case "info":
                    console.log("%c" + preMessage + ":%c " + message, 'background: #4285F4; color: #FFFFFF', 'color:black;');
                    break;
                default:
                    console.log("%c" + preMessage + ":%c " + message, 'background: #005454; color: #BFF8F8', 'color:black;');
                    break;
            }
        }
    };
    /**
     * Artyom have it's own diagnostics.
     * Run this function in order to detect why artyom is not initialized.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/detecterrors
     * @param {type} callback
     * @returns {}
     */
    Artyom.prototype.detectErrors = function () {
        var _this = this;
        if ((window.location.protocol) == "file:") {
            var message = "Error: running Artyom directly from a file. The APIs require a different communication protocol like HTTP or HTTPS";
            console.error(message);
            return {
                code: "artyom_error_localfile",
                message: message
            };
        }
        if (!_this.Device.isChrome) {
            var message = "Error: the Speech Recognition and Speech Synthesis APIs require the Google Chrome Browser to work.";
            console.error(message);
            return {
                code: "artyom_error_browser_unsupported",
                message: message
            };
        }
        if (window.location.protocol != "https:") {
            console.warn("Warning: artyom is being executed using the '" + window.location.protocol + "' protocol. The continuous mode requires a secure protocol (HTTPS)");
        }
        return false;
    };
    /**
     * Removes all the added commands of artyom.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/emptycommands
     * @since 0.6
     * @returns {Array}
     */
    Artyom.prototype.emptyCommands = function () {
        return this.ArtyomCommands = [];
    };
    /**
     * Returns an object with data of the matched element
     *
     * @private
     * @param {string} comando
     * @returns {MatchedCommand}
     */
    Artyom.prototype.execute = function (voz) {
        var _this = this;
        if (!voz) {
            console.warn("Internal error: Execution of empty command");
            return;
        }
        // If artyom was initialized with a name, verify that the name begins with it to allow the execution of commands.
        if (_this.ArtyomProperties.name) {
            if (voz.indexOf(_this.ArtyomProperties.name) != 0) {
                _this.debug("Artyom requires with a name \"" + _this.ArtyomProperties.name + "\" but the name wasn't spoken.", "warn");
                return;
            }
            // Remove name from voice command
            voz = voz.substr(_this.ArtyomProperties.name.length);
        }
        _this.debug(">> " + voz);
        /** @3
         * Artyom needs time to think that
         */
        for (var i = 0; i < _this.ArtyomCommands.length; i++) {
            var instruction = _this.ArtyomCommands[i];
            var opciones = instruction.indexes;
            var encontrado = -1;
            var wildy = "";
            for (var c = 0; c < opciones.length; c++) {
                var opcion = opciones[c];
                if (!instruction.smart) {
                    continue; //Jump if is not smart command
                }
                // Process RegExp
                if (opcion instanceof RegExp) {
                    // If RegExp matches 
                    if (opcion.test(voz)) {
                        _this.debug(">> REGEX " + opcion.toString() + " MATCHED AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = parseInt(c.toString());
                    }
                    // Otherwise just wildcards
                }
                else {
                    if (opcion.indexOf("*") != -1) {
                        ///LOGIC HERE
                        var grupo = opcion.split("*");
                        if (grupo.length > 2) {
                            console.warn("Artyom found a smart command with " + (grupo.length - 1) + " wildcards. Artyom only support 1 wildcard for each command. Sorry");
                            continue;
                        }
                        //START SMART COMMAND
                        var before = grupo[0];
                        var later = grupo[1];
                        // Wildcard in the end
                        if ((later == "") || (later == " ")) {
                            if ((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                wildy = voz.replace(before, '');
                                wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '');
                                encontrado = parseInt(c.toString());
                            }
                        }
                        else {
                            if ((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                if ((voz.indexOf(later) != -1) || ((voz.toLowerCase()).indexOf(later.toLowerCase()) != -1)) {
                                    wildy = voz.replace(before, '').replace(later, '');
                                    wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '').replace(later.toLowerCase(), '');
                                    wildy = (wildy.toLowerCase()).replace(later.toLowerCase(), '');
                                    encontrado = parseInt(c.toString());
                                }
                            }
                        }
                    }
                    else {
                        console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                    }
                }
                if ((encontrado >= 0)) {
                    encontrado = parseInt(c.toString());
                    break;
                }
            }
            if (encontrado >= 0) {
                _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_MATCHED);
                var response = {
                    index: encontrado,
                    instruction: instruction,
                    wildcard: {
                        item: wildy,
                        full: voz
                    }
                };
                return response;
            }
        } //End @3
        /** @1
         * Search for IDENTICAL matches in the commands if nothing matches
         * start with a index match in commands
         */
        for (var i = 0; i < _this.ArtyomCommands.length; i++) {
            var instruction = _this.ArtyomCommands[i];
            var opciones = instruction.indexes;
            var encontrado = -1;
            /**
             * Execution of match with identical commands
             */
            for (var c = 0; c < opciones.length; c++) {
                var opcion = opciones[c];
                if (instruction.smart) {
                    continue; //Jump wildcard commands
                }
                if ((voz === opcion)) {
                    _this.debug(">> MATCHED FULL EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                    encontrado = parseInt(c.toString());
                    break;
                }
                else if ((voz.toLowerCase() === opcion.toLowerCase())) {
                    _this.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                    encontrado = parseInt(c.toString());
                    break;
                }
            }
            if (encontrado >= 0) {
                _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_MATCHED);
                var response = {
                    index: encontrado,
                    instruction: instruction
                };
                return response;
            }
        } //End @1
        /**
         * Step 3 Commands recognition.
         * If the command is not smart, and any of the commands match exactly then try to find
         * a command in all the quote.
         */
        for (var i = 0; i < _this.ArtyomCommands.length; i++) {
            var instruction = _this.ArtyomCommands[i];
            var opciones = instruction.indexes;
            var encontrado = -1;
            /**
             * Execution of match with index
             */
            for (var c = 0; c < opciones.length; c++) {
                if (instruction.smart) {
                    continue; //Jump wildcard commands
                }
                var opcion = opciones[c];
                if ((voz.indexOf(opcion) >= 0)) {
                    _this.debug(">> MATCHED INDEX EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                    encontrado = parseInt(c.toString());
                    break;
                }
                else if (((voz.toLowerCase()).indexOf(opcion.toLowerCase()) >= 0)) {
                    _this.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                    encontrado = parseInt(c.toString());
                    break;
                }
            }
            if (encontrado >= 0) {
                _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_MATCHED);
                var response = {
                    index: encontrado,
                    instruction: instruction
                };
                return response;
            }
        } //End Step 3
        /**
         * If the soundex options is enabled, proceed to process the commands in case that any of the previous
         * ways of processing (exact, lowercase and command in quote) didn't match anything.
         * Based on the soundex algorithm match a command if the spoken text is similar to any of the artyom commands.
         * Example :
         * If you have a command with "Open Wallmart" and "Open Willmar" is recognized, the open wallmart command will be triggered.
         * soundex("Open Wallmart") == soundex("Open Willmar") <= true
         *
         */
        if (_this.ArtyomProperties.soundex) {
            for (var i = 0; i < _this.ArtyomCommands.length; i++) {
                var instruction = _this.ArtyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;
                for (var c = 0; c < opciones.length; c++) {
                    var opcion = opciones[c];
                    if (instruction.smart) {
                        continue; //Jump wildcard commands
                    }
                    if (_this.soundex(voz) == _this.soundex(opcion)) {
                        _this.debug(">> Matched Soundex command '" + opcion + "' AGAINST '" + voz + "' with index " + c, "info");
                        encontrado = parseInt(c.toString());
                        _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_MATCHED);
                        var response = {
                            index: encontrado,
                            instruction: instruction
                        };
                        return response;
                    }
                }
            }
        }
        _this.debug("Event reached : " + _this.ArtyomGlobalEvents.NOT_COMMAND_MATCHED);
        _this.triggerEvent(_this.ArtyomGlobalEvents.NOT_COMMAND_MATCHED);
        return;
    };
    /**
     * Force artyom to stop listen even if is in continuos mode.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/fatality
     * @returns {Boolean}
     */
    Artyom.prototype.fatality = function () {
        var _this = this;
        //fatalityPromiseCallback
        return new Promise(function (resolve, reject) {
            // Expose the fatality promise callback to the helpers object of Artyom.
            // The promise isn't resolved here itself but in the onend callback of
            // the speechRecognition instance of artyom
            _this.ArtyomProperties.helpers.fatalityPromiseCallback = resolve;
            try {
                // If config is continuous mode, deactivate anyway.
                _this.ArtyomFlags.restartRecognition = false;
                _this.ArtyomWebkitSpeechRecognition.stop();
            }
            catch (e) {
                reject(e);
            }
        });
    };
    /**
     * Returns an array with all the available commands for artyom.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/getavailablecommands
     * @readonly
     * @returns {Array}
     */
    Artyom.prototype.getAvailableCommands = function () {
        return this.ArtyomCommands;
    };
    /**
     * Artyom can return inmediately the voices available in your browser.
     *
     * @readonly
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/getvoices
     * @returns {Array}
     */
    Artyom.prototype.getVoices = function () {
        return window.speechSynthesis.getVoices();
    };
    /**
     * Verify if the browser supports speechSynthesis.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/speechsupported
     * @returns {Boolean}
     */
    Artyom.prototype.speechSupported = function () {
        return 'speechSynthesis' in window;
    };
    /**
     * Verify if the browser supports webkitSpeechRecognition.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/recognizingsupported
     * @returns {Boolean}
     */
    Artyom.prototype.recognizingSupported = function () {
        return 'webkitSpeechRecognition' in window;
    };
    /**
     * Stops the actual and pendings messages that artyom have to say.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/shutup
     * @returns {undefined}
     */
    Artyom.prototype.shutUp = function () {
        if ('speechSynthesis' in window) {
            do {
                window.speechSynthesis.cancel();
            } while (window.speechSynthesis.pending === true);
        }
        this.ArtyomProperties.speaking = false;
        this.clearGarbageCollection();
    };
    /**
     * Returns an object with the actual properties of artyom.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/getproperties
     * @returns {object}
     */
    Artyom.prototype.getProperties = function () {
        return this.ArtyomProperties;
    };
    /**
     * Returns the code language of artyom according to initialize function.
     * if initialize not used returns english GB.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/getlanguage
     * @returns {String}
     */
    Artyom.prototype.getLanguage = function () {
        return this.ArtyomProperties.lang;
    };
    /**
     * Retrieves the used version of Artyom.js
     *
     * @returns {String}
     */
    Artyom.prototype.getVersion = function () {
        return '1.0.6';
    };
    /**
     * Artyom awaits for orders when this function
     * is executed.
     *
     * If artyom gets a first parameter the instance will be stopped.
     *
     * @private
     * @returns {undefined}
     */
    Artyom.prototype.hey = function (resolve, reject) {
        var start_timestamp;
        var artyom_is_allowed;
        var _this = this;
        /**
         * On mobile devices the recognized text is always thrown twice.
         * By setting the following configuration, fixes the issue
         */
        if (this.Device.isMobile) {
            this.ArtyomWebkitSpeechRecognition.continuous = false;
            this.ArtyomWebkitSpeechRecognition.interimResults = false;
            this.ArtyomWebkitSpeechRecognition.maxAlternatives = 1;
        }
        else {
            this.ArtyomWebkitSpeechRecognition.continuous = true;
            this.ArtyomWebkitSpeechRecognition.interimResults = true;
        }
        this.ArtyomWebkitSpeechRecognition.lang = this.ArtyomProperties.lang;
        this.ArtyomWebkitSpeechRecognition.onstart = function () {
            _this.debug("Event reached : " + _this.ArtyomGlobalEvents.COMMAND_RECOGNITION_START);
            _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_RECOGNITION_START);
            _this.ArtyomProperties.recognizing = true;
            artyom_is_allowed = true;
            resolve();
        };
        /**
         * Handle all artyom posible exceptions
         *
         * @param {type} event
         * @returns {undefined}
         */
        this.ArtyomWebkitSpeechRecognition.onerror = function (event) {
            // Reject promise on initialization
            reject(event.error);
            // Dispath error globally (artyom.when)
            _this.triggerEvent(_this.ArtyomGlobalEvents.ERROR, {
                code: event.error
            });
            if (event.error == 'audio-capture') {
                artyom_is_allowed = false;
            }
            if (event.error == 'not-allowed') {
                artyom_is_allowed = false;
                if (event.timeStamp - start_timestamp < 100) {
                    _this.triggerEvent(_this.ArtyomGlobalEvents.ERROR, {
                        code: "info-blocked",
                        message: "Artyom needs the permision of the microphone, is blocked."
                    });
                }
                else {
                    _this.triggerEvent(_this.ArtyomGlobalEvents.ERROR, {
                        code: "info-denied",
                        message: "Artyom needs the permision of the microphone, is denied"
                    });
                }
            }
        };
        /**
         * Check if continuous mode is active and restart the recognition.
         * Throw events too.
         *
         * @returns {undefined}
         */
        _this.ArtyomWebkitSpeechRecognition.onend = function () {
            if (_this.ArtyomFlags.restartRecognition === true) {
                if (artyom_is_allowed === true) {
                    _this.ArtyomWebkitSpeechRecognition.start();
                    _this.debug("Continuous mode enabled, restarting", "info");
                }
                else {
                    console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                }
                _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_RECOGNITION_END, {
                    code: "continuous_mode_enabled",
                    message: "OnEnd event reached with continuous mode"
                });
            }
            else {
                // If the fatality promise callback was set, invoke it
                if (_this.ArtyomProperties.helpers.fatalityPromiseCallback) {
                    // As the speech recognition doesn't finish really, wait 500ms
                    // to trigger the real fatality callback
                    setTimeout(function () {
                        _this.ArtyomProperties.helpers.fatalityPromiseCallback();
                    }, 500);
                    _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_RECOGNITION_END, {
                        code: "continuous_mode_disabled",
                        message: "OnEnd event reached without continuous mode"
                    });
                }
            }
            _this.ArtyomProperties.recognizing = false;
        };
        /**
         * Declare the processor dinamycally according to the mode of artyom
         * to increase the performance.
         *
         * @type {Function}
         * @return
         */
        var onResultProcessor;
        // Process the recognition in normal mode
        if (_this.ArtyomProperties.mode == "normal") {
            onResultProcessor = function (event) {
                if (!_this.ArtyomCommands.length) {
                    _this.debug("No commands to process in normal mode.");
                    return;
                }
                var cantidadResultados = event.results.length;
                _this.triggerEvent(_this.ArtyomGlobalEvents.TEXT_RECOGNIZED);
                for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                    var identificated = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        var comando = _this.execute(identificated.trim());
                        // Redirect the output of the text if necessary
                        if (typeof (_this.ArtyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                            _this.ArtyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                        }
                        if ((comando) && (_this.ArtyomProperties.recognizing == true)) {
                            _this.debug("<< Executing Matching Recognition in normal mode >>", "info");
                            _this.ArtyomWebkitSpeechRecognition.stop();
                            _this.ArtyomProperties.recognizing = false;
                            // Execute the command if smart
                            if (comando.wildcard) {
                                comando.instruction.action(comando.index, comando.wildcard.item, comando.wildcard.full);
                                // Execute a normal command
                            }
                            else {
                                comando.instruction.action(comando.index);
                            }
                            break;
                        }
                    }
                    else {
                        // Redirect output when necesary
                        if (typeof (_this.ArtyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                            _this.ArtyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                        }
                        if (typeof (_this.ArtyomProperties.executionKeyword) === "string") {
                            if (identificated.indexOf(_this.ArtyomProperties.executionKeyword) != -1) {
                                var comando = _this.execute(identificated.replace(_this.ArtyomProperties.executionKeyword, '').trim());
                                if ((comando) && (_this.ArtyomProperties.recognizing == true)) {
                                    _this.debug("<< Executing command ordered by ExecutionKeyword >>", 'info');
                                    _this.ArtyomWebkitSpeechRecognition.stop();
                                    _this.ArtyomProperties.recognizing = false;
                                    //Executing Command Action
                                    if (comando.wildcard) {
                                        comando.instruction.action(comando.index, comando.wildcard.item, comando.wildcard.full);
                                    }
                                    else {
                                        comando.instruction.action(comando.index);
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
        if (_this.ArtyomProperties.mode == "quick") {
            onResultProcessor = function (event) {
                if (!_this.ArtyomCommands.length) {
                    _this.debug("No commands to process.");
                    return;
                }
                var cantidadResultados = event.results.length;
                _this.triggerEvent(_this.ArtyomGlobalEvents.TEXT_RECOGNIZED);
                for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                    var identificated = event.results[i][0].transcript;
                    if (!event.results[i].isFinal) {
                        var comando = _this.execute(identificated.trim());
                        //Redirect output when necesary
                        if (typeof (_this.ArtyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                            _this.ArtyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                        }
                        if ((comando) && (_this.ArtyomProperties.recognizing == true)) {
                            _this.debug("<< Executing Matching Recognition in quick mode >>", "info");
                            _this.ArtyomWebkitSpeechRecognition.stop();
                            _this.ArtyomProperties.recognizing = false;
                            //Executing Command Action
                            if (comando.wildcard) {
                                comando.instruction.action(comando.index, comando.wildcard.item);
                            }
                            else {
                                comando.instruction.action(comando.index);
                            }
                            break;
                        }
                    }
                    else {
                        var comando = _this.execute(identificated.trim());
                        //Redirect output when necesary
                        if (typeof (_this.ArtyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                            _this.ArtyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                        }
                        if ((comando) && (_this.ArtyomProperties.recognizing == true)) {
                            _this.debug("<< Executing Matching Recognition in quick mode >>", "info");
                            _this.ArtyomWebkitSpeechRecognition.stop();
                            _this.ArtyomProperties.recognizing = false;
                            //Executing Command Action
                            if (comando.wildcard) {
                                comando.instruction.action(comando.index, comando.wildcard.item);
                            }
                            else {
                                comando.instruction.action(comando.index);
                            }
                            break;
                        }
                    }
                    _this.debug("Quick mode : " + identificated);
                }
            };
        }
        // Process the recognition in remote mode
        if (_this.ArtyomProperties.mode == "remote") {
            onResultProcessor = function (event) {
                var cantidadResultados = event.results.length;
                _this.triggerEvent(_this.ArtyomGlobalEvents.TEXT_RECOGNIZED);
                if (typeof (_this.ArtyomProperties.helpers.remoteProcessorHandler) !== "function") {
                    return _this.debug("The remoteProcessorService is undefined.", "warn");
                }
                for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                    var identificated = event.results[i][0].transcript;
                    _this.ArtyomProperties.helpers.remoteProcessorHandler({
                        text: identificated,
                        isFinal: event.results[i].isFinal
                    });
                }
            };
        }
        /**
         * Process the recognition event with the previously
         * declared processor function.
         *
         * @param {type} event
         * @returns {undefined}
         */
        _this.ArtyomWebkitSpeechRecognition.onresult = function (event) {
            if (_this.ArtyomProperties.obeying) {
                onResultProcessor(event);
            }
            else {
                // Handle obeyKeyword if exists and artyom is not obeying
                if (!_this.ArtyomProperties.obeyKeyword) {
                    return;
                }
                var temporal = "";
                var interim = "";
                for (var i = 0; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        temporal += event.results[i][0].transcript;
                    }
                    else {
                        interim += event.results[i][0].transcript;
                    }
                }
                _this.debug("Artyom is not obeying", "warn");
                // If the obeyKeyword is found in the recognized text
                // enable command recognition again
                if (((interim).indexOf(_this.ArtyomProperties.obeyKeyword) > -1) || (temporal).indexOf(_this.ArtyomProperties.obeyKeyword) > -1) {
                    _this.ArtyomProperties.obeying = true;
                }
            }
        };
        if (_this.ArtyomProperties.recognizing) {
            _this.ArtyomWebkitSpeechRecognition.stop();
            _this.debug("Event reached : " + _this.ArtyomGlobalEvents.COMMAND_RECOGNITION_END);
            _this.triggerEvent(_this.ArtyomGlobalEvents.COMMAND_RECOGNITION_END);
        }
        else {
            try {
                _this.ArtyomWebkitSpeechRecognition.start();
            }
            catch (e) {
                _this.triggerEvent(_this.ArtyomGlobalEvents.ERROR, {
                    code: "recognition_overlap",
                    message: "A webkitSpeechRecognition instance has been started while there's already running. Is recommendable to restart the Browser"
                });
            }
        }
    };
    /**
     * Set up artyom for the application.
     *
     * This function will set the default language used by artyom
     * or notice the user if artyom is not supported in the actual
     * browser
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/initialize
     * @param {Object} config
     * @returns {Boolean}
     */
    Artyom.prototype.initialize = function (config) {
        var _this = this;
        if (typeof (config) !== "object") {
            return Promise.reject("You must give the configuration for start artyom properly.");
        }
        if (config.hasOwnProperty("lang")) {
            _this.ArtyomVoice = _this.getVoice(config.lang);
            _this.ArtyomProperties.lang = config.lang;
        }
        if (config.hasOwnProperty("continuous")) {
            if (config.continuous) {
                this.ArtyomProperties.continuous = true;
                this.ArtyomFlags.restartRecognition = true;
            }
            else {
                this.ArtyomProperties.continuous = false;
                this.ArtyomFlags.restartRecognition = false;
            }
        }
        if (config.hasOwnProperty("speed")) {
            this.ArtyomProperties.speed = config.speed;
        }
        if (config.hasOwnProperty("soundex")) {
            this.ArtyomProperties.soundex = config.soundex;
        }
        if (config.hasOwnProperty("executionKeyword")) {
            this.ArtyomProperties.executionKeyword = config.executionKeyword;
        }
        if (config.hasOwnProperty("obeyKeyword")) {
            this.ArtyomProperties.obeyKeyword = config.obeyKeyword;
        }
        if (config.hasOwnProperty("volume")) {
            this.ArtyomProperties.volume = config.volume;
        }
        if (config.hasOwnProperty("listen")) {
            this.ArtyomProperties.listen = config.listen;
        }
        if (config.hasOwnProperty("name")) {
            this.ArtyomProperties.name = config.name;
        }
        if (config.hasOwnProperty("debug")) {
            this.ArtyomProperties.debug = config.debug;
        }
        else {
            console.warn("The initialization doesn't provide how the debug mode should be handled. Is recommendable to set this value either to true or false.");
        }
        if (config.mode) {
            this.ArtyomProperties.mode = config.mode;
        }
        if (this.ArtyomProperties.listen === true) {
            return new Promise(function (resolve, reject) {
                _this.hey(resolve, reject);
            });
        }
        return Promise.resolve(true);
    };
    /**
     * Add commands like an artisan. If you use artyom for simple tasks
     * then probably you don't like to write a lot to achieve it.
     *
     * Use the artisan syntax to write less, but with the same accuracy.
     *
     * @disclaimer Not a promise-based implementation, just syntax.
     * @returns {Boolean}
     */
    Artyom.prototype.on = function (indexes, smart) {
        var _this = this;
        return {
            then: function (action) {
                var command = {
                    indexes: indexes,
                    action: action
                };
                if (smart) {
                    command.smart = true;
                }
                _this.addCommands(command);
            }
        };
    };
    /**
     * Generates an artyom event with the designed name
     *
     * @param {type} name
     * @returns {undefined}
     */
    Artyom.prototype.triggerEvent = function (name, param) {
        var event = new CustomEvent(name, {
            'detail': param
        });
        document.dispatchEvent(event);
        return event;
    };
    /**
     * Repeats the last sentence that artyom said.
     * Useful in noisy environments.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/repeatlastsay
     * @param {Boolean} returnObject If set to true, an object with the text and the timestamp when was executed will be returned.
     * @returns {Object}
     */
    Artyom.prototype.repeatLastSay = function (returnObject) {
        var last = this.ArtyomProperties.helpers.lastSay;
        if (returnObject) {
            return last;
        }
        else {
            if (last != null) {
                this.say(last.text);
            }
        }
    };
    /**
     * Create a listener when an artyom action is called.
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/when
     * @param {type} event
     * @param {type} action
     * @returns {undefined}
     */
    Artyom.prototype.when = function (event, action) {
        return document.addEventListener(event, function (e) {
            action(e["detail"]);
        }, false);
    };
    /**
     * Process the recognized text if artyom is active in remote mode.
     *
     * @returns {Boolean}
     */
    Artyom.prototype.remoteProcessorService = function (action) {
        this.ArtyomProperties.helpers.remoteProcessorHandler = action;
        return true;
    };
    /**
     * Verify if there's a voice available for a language using its language code identifier.
     *
     * @return {Boolean}
     */
    Artyom.prototype.voiceAvailable = function (languageCode) {
        return typeof (this.getVoice(languageCode)) !== "undefined";
    };
    /**
     * A boolean to check if artyom is obeying commands or not.
     *
     * @returns {Boolean}
     */
    Artyom.prototype.isObeying = function () {
        return this.ArtyomProperties.obeying;
    };
    /**
     * Allow artyom to obey commands again.
     *
     * @returns {Boolean}
     */
    Artyom.prototype.obey = function () {
        return this.ArtyomProperties.obeying = true;
    };
    /**
     * Pause the processing of commands. Artyom still listening in the background and it can be resumed after a couple of seconds.
     *
     * @returns {Boolean}
     */
    Artyom.prototype.dontObey = function () {
        return this.ArtyomProperties.obeying = false;
    };
    /**
     * This function returns a boolean according to the speechSynthesis status
     * if artyom is speaking, will return true.
     *
     * Note: This is not a feature of speechSynthesis, therefore this value hangs on
     * the fiability of the onStart and onEnd events of the speechSynthesis
     *
     * @since 0.9.3
     * @summary Returns true if speechSynthesis is active
     * @returns {Boolean}
     */
    Artyom.prototype.isSpeaking = function () {
        return this.ArtyomProperties.speaking;
    };
    /**
     * This function returns a boolean according to the SpeechRecognition status
     * if artyom is listening, will return true.
     *
     * Note: This is not a feature of SpeechRecognition, therefore this value hangs on
     * the fiability of the onStart and onEnd events of the SpeechRecognition
     *
     * @since 0.9.3
     * @summary Returns true if SpeechRecognition is active
     * @returns {Boolean}
     */
    Artyom.prototype.isRecognizing = function () {
        return this.ArtyomProperties.recognizing;
    };
    /**
     * This function will return the webkitSpeechRecognition object used by artyom
     * retrieve it only to debug on it or get some values, do not make changes directly
     *
     * @readonly
     * @since 0.9.2
     * @summary Retrieve the native webkitSpeechRecognition object
     * @returns {Object webkitSpeechRecognition}
     */
    Artyom.prototype.getNativeApi = function () {
        return this.ArtyomWebkitSpeechRecognition;
    };
    /**
     * Returns the SpeechSynthesisUtterance garbageobjects.
     *
     * @returns {Array}
     */
    Artyom.prototype.getGarbageCollection = function () {
        return this.ArtyomGarbageCollection;
    };
    /**
     *  Retrieve a single voice of the browser by it's language code.
     *  It will return the first voice available for the language on every device.
     *
     * @param languageCode
     */
    Artyom.prototype.getVoice = function (languageCode) {
        var voiceIdentifiersArray = this.ArtyomVoicesIdentifiers[languageCode];
        if (!voiceIdentifiersArray) {
            console.warn("The providen language " + languageCode + " isn't available, using English Great britain as default");
            voiceIdentifiersArray = this.ArtyomVoicesIdentifiers["en-GB"];
        }
        var voice = undefined;
        var voices = speechSynthesis.getVoices();
        var voicesLength = voiceIdentifiersArray.length;
        var _loop_1 = function (i) {
            var foundVoice = voices.filter(function (voice) {
                return ((voice.name == voiceIdentifiersArray[i]) || (voice.lang == voiceIdentifiersArray[i]));
            })[0];
            if (foundVoice) {
                voice = foundVoice;
                return "break";
            }
        };
        for (var i = 0; i < voicesLength; i++) {
            var state_1 = _loop_1(i);
            if (state_1 === "break")
                break;
        }
        return voice;
    };
    /**
     * Artyom provide an easy way to create a
     * dictation for your user.
     *
     * Just create an instance and start and stop when you want
     *
     * @returns Object | newDictation
     */
    Artyom.prototype.newDictation = function (settings) {
        var _this = this;
        if (!_this.recognizingSupported()) {
            console.error("SpeechRecognition is not supported in this browser");
            return false;
        }
        var dictado = new window.webkitSpeechRecognition();
        dictado.continuous = true;
        dictado.interimResults = true;
        dictado.lang = _this.ArtyomProperties.lang;
        dictado.onresult = function (event) {
            var temporal = "";
            var interim = "";
            for (var i = 0; i < event.results.length; ++i) {
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
    /**
     * A voice prompt will be executed.
     *
     * @param {type} config
     * @returns {undefined}
     */
    Artyom.prototype.newPrompt = function (config) {
        if (typeof (config) !== "object") {
            console.error("Expected the prompt configuration.");
        }
        var copyActualCommands = Object.assign([], this.ArtyomCommands);
        var _this = this;
        this.emptyCommands();
        var promptCommand = {
            description: "Setting the artyom commands only for the prompt. The commands will be restored after the prompt finishes",
            indexes: config.options,
            action: function (i, wildcard) {
                _this.ArtyomCommands = copyActualCommands;
                var toExe = config.onMatch(i, wildcard);
                if (typeof (toExe) !== "function") {
                    console.error("onMatch function expects a returning function to be executed");
                    return;
                }
                toExe();
            }
        };
        if (config.smart) {
            promptCommand.smart = true;
        }
        this.addCommands(promptCommand);
        if (typeof (config.beforePrompt) !== "undefined") {
            config.beforePrompt();
        }
        var callbacks = {
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
        };
        this.say(config.question, callbacks);
    };
    /**
     * Says a random quote and returns it's object
     *
     * @param {type} data
     * @returns {object}
     */
    Artyom.prototype.sayRandom = function (data) {
        if (data instanceof Array) {
            var index = Math.floor(Math.random() * data.length);
            this.say(data[index]);
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
    /**
     * Shortcut method to enable the artyom debug on the fly.
     *
     * @returns {Array}
     */
    Artyom.prototype.setDebug = function (status) {
        if (status) {
            return this.ArtyomProperties.debug = true;
        }
        else {
            return this.ArtyomProperties.debug = false;
        }
    };
    /**
     * Simulate a voice command via JS
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/simulateinstruction
     * @param {type} sentence
     * @returns {undefined}
     */
    Artyom.prototype.simulateInstruction = function (sentence) {
        var _this = this;
        if ((!sentence) || (typeof (sentence) !== "string")) {
            console.warn("Cannot execute a non string command");
            return false;
        }
        var foundCommand = _this.execute(sentence); //Command founded object
        if (typeof (foundCommand) === "object") {
            if (foundCommand.instruction) {
                if (foundCommand.instruction.smart) {
                    _this.debug('Smart command matches with simulation, executing', "info");
                    foundCommand.instruction.action(foundCommand.index, foundCommand.wildcard.item, foundCommand.wildcard.full);
                }
                else {
                    _this.debug('Command matches with simulation, executing', "info");
                    foundCommand.instruction.action(foundCommand.index); //Execute Normal command
                }
                return true;
            }
        }
        else {
            console.warn("No command founded trying with " + sentence);
            return false;
        }
    };
    /**
     * Javascript implementation of the soundex algorithm.
     * @see https://gist.github.com/shawndumas/1262659
     * @returns {String}
     */
    Artyom.prototype.soundex = function (s) {
        var a = s.toLowerCase().split('');
        var f = a.shift();
        var r = '';
        var codes = { a: "", e: "", i: "", o: "", u: "", b: 1, f: 1, p: 1, v: 1, c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2, d: 3, t: 3, l: 4, m: 5, n: 5, r: 6 };
        r = f + a
            .map(function (v, i, a) {
            return codes[v];
        })
            .filter(function (v, i, a) {
            return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
        })
            .join('');
        return (r + '000').slice(0, 4).toUpperCase();
    };
    /**
     * Splits a string into an array of strings with a limited size (chunk_length).
     *
     * @param {String} input text to split into chunks
     * @param {Integer} chunk_length limit of characters in every chunk
     */
    Artyom.prototype.splitStringByChunks = function (input, chunk_length) {
        input = input || "";
        chunk_length = chunk_length || 100;
        var curr = chunk_length;
        var prev = 0;
        var output = [];
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
    /**
     * Allows to retrieve the recognized spoken text of artyom
     * and do something with it everytime something is recognized
     *
     * @param {String} action
     * @returns {Boolean}
     */
    Artyom.prototype.redirectRecognizedTextOutput = function (action) {
        if (typeof (action) != "function") {
            console.warn("Expected function to handle the recognized text ...");
            return false;
        }
        this.ArtyomProperties.helpers.redirectRecognizedTextOutput = action;
        return true;
    };
    /**
     * Restarts artyom with the initial configuration.
     *
     * @param configuration
     */
    Artyom.prototype.restart = function () {
        var _this = this;
        var _copyInit = _this.ArtyomProperties;
        return new Promise(function (resolve, reject) {
            _this.fatality().then(function () {
                _this.initialize(_copyInit).then(resolve, reject);
            });
        });
    };
    /**
     * Talks a text according to the given parameters.
     *
     * @private This function is only to be used internally.
     * @param {String} text Text to be spoken
     * @param {Int} actualChunk Number of chunk of the
     * @param {Int} totalChunks
     * @returns {undefined}
     */
    Artyom.prototype.talk = function (text, actualChunk, totalChunks, callbacks) {
        var _this = this;
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        msg.volume = this.ArtyomProperties.volume;
        msg.rate = this.ArtyomProperties.speed;
        // Select the voice according to the selected
        var availableVoice = _this.getVoice(_this.ArtyomProperties.lang);
        if (callbacks) {
            // If the language to speak has been forced, use it
            if (callbacks.hasOwnProperty("lang")) {
                availableVoice = _this.getVoice(callbacks.lang);
            }
        }
        // If is a mobile device, provide only the language code in the lang property i.e "es_ES"
        if (this.Device.isMobile) {
            // Try to set the voice only if exists, otherwise don't use anything to use the native voice
            if (availableVoice) {
                msg.lang = availableVoice.lang;
            }
            // If browser provide the entire object
        }
        else {
            msg.voice = availableVoice;
        }
        // If is first text chunk (onStart)
        if (actualChunk == 1) {
            msg.addEventListener('start', function () {
                // Set artyom is talking
                _this.ArtyomProperties.speaking = true;
                // Trigger the onSpeechSynthesisStart event
                _this.debug("Event reached : " + _this.ArtyomGlobalEvents.SPEECH_SYNTHESIS_START);
                _this.triggerEvent(_this.ArtyomGlobalEvents.SPEECH_SYNTHESIS_START);
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
                _this.ArtyomProperties.speaking = false;
                // Trigger the onSpeechSynthesisEnd event
                _this.debug("Event reached : " + _this.ArtyomGlobalEvents.SPEECH_SYNTHESIS_END);
                _this.triggerEvent(_this.ArtyomGlobalEvents.SPEECH_SYNTHESIS_END);
                // Trigger the onEnd callback if exists.
                if (callbacks) {
                    if (typeof (callbacks.onEnd) == "function") {
                        callbacks.onEnd.call(msg);
                    }
                }
            });
        }
        // Notice how many chunks were processed for the given text.
        this.debug((actualChunk) + " text chunk processed succesfully out of " + totalChunks);
        // Important : Save the SpeechSynthesisUtterance object in memory, otherwise it will get lost
        this.ArtyomGarbageCollection.push(msg);
        window.speechSynthesis.speak(msg);
    };
    /**
     * Process the given text into chunks and execute the private function talk
     *
     * @tutorial http://docs.ourcodeworld.com/projects/artyom-js/documentation/methods/say
     * @param {String} message Text to be spoken
     * @param {Object} callbacks
     * @returns {undefined}
     */
    Artyom.prototype.say = function (message, callbacks) {
        var artyom_say_max_chunk_length = 115;
        var _this = this;
        var definitive = [];
        if (this.speechSupported()) {
            if (typeof (message) != 'string') {
                return console.warn("Artyom expects a string to speak " + typeof message + " given");
            }
            if (!message.length) {
                return console.warn("Cannot speak empty string");
            }
            // If the providen text is long, proceed to split it
            if (message.length > artyom_say_max_chunk_length) {
                // Split the given text by pause reading characters [",",":",";",". "] to provide a natural reading feeling.
                var naturalReading = message.split(/,|:|\. |;/);
                naturalReading.forEach(function (chunk, index) {
                    // If the sentence is too long and could block the API, split it to prevent any errors.
                    if (chunk.length > artyom_say_max_chunk_length) {
                        // Process the providen string into strings (withing an array) of maximum aprox. 115 characters to prevent any error with the API.
                        var temp_processed = _this.splitStringByChunks(chunk, artyom_say_max_chunk_length);
                        // Add items of the processed sentence into the definitive chunk.
                        definitive.push.apply(definitive, temp_processed);
                    }
                    else {
                        // Otherwise just add the sentence to being spoken.
                        definitive.push(chunk);
                    }
                });
            }
            else {
                definitive.push(message);
            }
            // Clean any empty item in array
            definitive = definitive.filter(function (e) { return e; });
            // Finally proceed to talk the chunks and assign the callbacks.
            definitive.forEach(function (chunk, index) {
                var numberOfChunk = (index + 1);
                if (chunk) {
                    _this.talk(chunk, numberOfChunk, definitive.length, callbacks);
                }
            });
            // Save the spoken text into the lastSay object of artyom
            _this.ArtyomProperties.helpers.lastSay = {
                text: message,
                date: new Date()
            };
        }
    };
    return Artyom;
}());
exports.default = Artyom;
