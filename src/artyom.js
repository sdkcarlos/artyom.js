/**
 * Artyom uses webkitSpeechRecognition && SpeechSynthesisUtterance property of Google Inc.
 * Artyom only works in browsers based in Chromium (Google Chrome or Electron)
 *
 * @version 0.9.6
 * @copyright Carlos Delgado 2016
 * @author Carlos Delgado - www.ourcodeworld.com
 * @param {type} window
 * @see http://sdkcarlos.github.io/artyom.html
 * @returns Artyom
 */
(function (window) {'use strict';
    // getVoices is an asynchronous native method. At firs time it will ALWAYS return an empty array
    // after it will return an array with all the available voices in the browser
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
    }

    if (('webkitSpeechRecognition' in window)) {
        var reconocimiento = new webkitSpeechRecognition();
    }

    var artyomProperties = {
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
            lastSay: null
        },
        executionKeyword: null,
        speaking:false
    };

    /**
     * Due to problems with the javascript garbage collector the SpeechSynthesisUtterance object
     * onEnd event doesn't get triggered sometimes. Therefore we need to keep the reference of the
     * object inside this global array variable.
     *
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=509488
     * @global
     */
    var artyom_garbage_collector = [];

    /**
     * @var artyomFlags {object}
     * @global
     */
    var artyomFlags = {
        restartRecognition: false
    };

    /**
     * This object contains all available languages that support speechSynthesis and SpeechRecognition
     * on the Google Chrome browser. Those identifiers will be used to select the voice on artyom.say
     *
     * @var artyomLanguages {object}
     * @global
     */
    var artyomLanguages = {
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
        cantoneseChinese: "Google 粤語（香港）"
    };

    var artyom_global_events = {
        ERROR: "ERROR",
        SPEECH_SYNTHESIS_START: "SPEECH_SYNTHESIS_START",
        SPEECH_SYNTHESIS_END: "SPEECH_SYNTHESIS_END",
        TEXT_RECOGNIZED: "TEXT_RECOGNIZED",
        COMMAND_RECOGNITION_START : "COMMAND_RECOGNITION_START",
        COMMAND_RECOGNITION_END: "COMMAND_RECOGNITION_END",
        COMMAND_MATCHED: "COMMAND_MATCHED"
    };

    var artyomVoice = 'Google UK English Male';
    var device = {
        isMobile: false,
        isChrome: true
    };

    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        device.isMobile = true;
    }

    if (navigator.userAgent.indexOf("Chrome") == -1) {
        device.isChrome = false;
    }

    function ArtyomAI() {
        var artyom = {};
        var artyomCommands = [];

        /**
         * Contains some basic information that artyom needs to know as the type of device and browser
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/6/read-doc/artyom-device/artyom-js
         * @since 0.5.1
         * @type {Object}
         */
        artyom.device = device;

        /**
         * Artyom can return inmediately the voices available in your browser.
         *
         * @readonly
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/14/read-doc/artyom-getvoices/artyom-js
         * @returns {Array}
         */
        artyom.getVoices = function () {
            return window.speechSynthesis.getVoices();
        };

        /**
         * Returns an array with all the available commands for artyom.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/10/read-doc/artyom-getavailablecommands/artyom-js
         * @readonly
         * @returns {Array}
         */
        artyom.getAvailableCommands = function () {
            var availables = [];

            for (var i = 0; i < artyomCommands.length; i++) {
                var command = artyomCommands[i];
                var aval = {};
                aval.indexes = command.indexes;

                if (command.smart) {
                    aval.smart = true;
                }

                if (command.description) {
                    aval.description = command.description;
                }

                availables.push(aval);
            }

            return availables;
        };

        /**
         * Set up artyom for the application.
         *
         * This function will set the default language used by artyom
         * or notice the user if artyom is not supported in the actual
         * browser
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/15/read-doc/artyom-initialize/artyom-js
         * @param {Object} config
         * @returns {Boolean}
         */
        artyom.initialize = function (config) {
            if (typeof (config) !== "object") {
                console.error("You must give the configuration for start artyom properly.");
                return;
            }

            if (config.hasOwnProperty("lang")) {
                switch (config.lang) {
                    case 'de':case 'de-DE':
                        artyomVoice = artyomLanguages.german;
                        break;
                    case 'en-GB':
                        artyomVoice = artyomLanguages.englishGB;
                        break;
                    case "pt":case "pt-br":case "pt-PT":
                        artyomVoice = artyomLanguages.brasilian;
                        break;
                    case "ru":case "ru-RU":
                        artyomVoice = artyomLanguages.russia;
                        break;
                    case "nl":case "nl-NL":
                        artyomVoice = artyomLanguages.holand;
                        break;
                    case 'es':case 'es-CO':case 'es-ES':
                        artyomVoice = artyomLanguages.spanish;
                        break;
                    case "en":case 'en-US':
                        artyomVoice = artyomLanguages.englishUSA;
                        break;
                    case 'fr':case 'fr-FR':
                        artyomVoice = artyomLanguages.france;
                        break;
                    case 'it':case 'it-IT':
                        artyomVoice = artyomLanguages.italian;
                        break;
                    case 'jp':case 'ja-JP':
                        artyomVoice = artyomLanguages.japanese;
                        break;
                    case 'id':case 'id-ID':
                        artyomVoice = artyomLanguages.indonesia;
                        break;
                    case 'pl':case 'pl-PL':
                        artyomVoice = artyomLanguages.polski;
                        break;
                    case 'zh-CN':
                        artyomVoice = artyomLanguages.mandarinChinese;
                        break;
                    case 'zh-HK':
                        artyomVoice = artyomLanguages.cantoneseChinese;
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

            if (artyom.is.number(config.speed)) {
                artyomProperties.speed = config.speed;
            }

            if (config.hasOwnProperty("executionKeyword")) {
                artyomProperties.executionKeyword = config.executionKeyword;
            }

            if (artyom.is.number(config.volume)) {
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
            }

            return true;
        };

        /**
         * Force artyom to stop listen even if is in continuos mode.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/9/read-doc/artyom-fatality/artyom-js
         * @returns {Boolean}
         */
        artyom.fatality = function () {
            try{
                // if config is continuous mode, deactivate anyway.
                artyomFlags.restartRecognition = false;
                reconocimiento.stop();
                return true;
            }catch(e){
                console.log(e);
                return false;
            }
        };

        /**
         * Add dinamically commands to artyom using
         * You can even add commands while artyom is active.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/4/read-doc/artyom-addcommands/artyom-js
         * @since 0.6
         * @param {Object | Array[Objects]} param
         * @returns {undefined}
         */
        artyom.addCommands = function (param) {
            var _processObject = function (obj) {
                if(obj.hasOwnProperty("indexes")){
                    artyomCommands.push(obj);
                }else{
                    console.error("The following command doesn't provide any index to execute :");
                    console.dir(obj);
                }
            };

            if (param instanceof Array) {
                for (var i = 0; i < param.length; i++) {
                    _processObject(param[i]);
                }
            } else {
                _processObject(param);
            }

            return true;
        };

        /**
         * Remove the commands of artyom with indexes that matches with the given text.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/19/read-doc/artyom-removecommands/artyom-js
         * @param {type} identifier
         * @returns {array}
         */
        artyom.removeCommands = function (identifier) {
            if (typeof (identifier) === "string") {
                var toDelete = [];

                for (var i = 0; i < artyomCommands.length; i++) {
                    var command = artyomCommands[i];
                    if (command.indexes.indexOf(identifier)) {
                        toDelete.push(i);
                    }
                }

                for (var o = 0; o < toDelete.length; o++) {
                    artyomCommands.splice(o, 1);
                }
            }

            return toDelete;
        };

        /**
         * Removes all the added commands of artyom.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/7/read-doc/artyom-emptycommands/artyom-js
         * @since 0.6
         * @returns {Array}
         */
        artyom.emptyCommands = function () {
            return artyomCommands = [];
        };


        /**
         * Stops the actual and pendings messages that artyom have to say.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/23/read-doc/artyom-shutup/artyom-js
         * @returns {undefined}
         */
        artyom.shutUp = function () {
            if ('speechSynthesis' in window) {
                do {
                    window.speechSynthesis.cancel();
                } while (window.speechSynthesis.pending === true);
            }

            artyomProperties.speaking = false;
            artyom.clearGarbageCollection();
        };

        /**
         * Returns an object with the actual properties of artyom.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/12/read-doc/artyom-getproperties/artyom-js
         * @returns {object}
         */
        artyom.getProperties = function () {
            return artyomProperties;
        };

        /**
         * Generates an artyom event with the designed name
         *
         * @param {type} name
         * @returns {undefined}
         */
        var artyom_triggerEvent = function (name, param) {
            var event = new CustomEvent(name, {'detail': param});
            document.dispatchEvent(event);
            return event;
        };

        /**
         * Create a listener when an artyom action is called.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/24/read-doc/artyom-when/artyom-js
         * @param {type} event
         * @param {type} action
         * @returns {undefined}
         */
        artyom.when = function (event, action) {
            return document.addEventListener(event, function (e) {
                action(e.detail);
            }, false);
        };

        /**
         * Returns the language of artyom according to initialize function.
         * if initialize not used returns english GB.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/11/read-doc/artyom-getlanguage/artyom-js
         * @param {Boolean} short If the first parameter set to true, if the language has a short code, it will be returned.
         * @returns {String}
         */
        artyom.getLanguage = function (short) {
            if (short) {
                switch (artyomVoice) {
                    case 'Google UK English Male':
                        return "en-GB";
                    case 'Google español':
                        return "es";
                    case 'Google Deutsch':
                        return "de";
                    case 'Google français':
                        return "fr";
                    case 'Google italiano':
                        return "it";
                    case 'Google 日本人':
                        return "jp";
                    case 'Google US English':
                        return "en-US";
                    case 'Google português do Brasil':
                        return "pt";
                    case 'Google русский':
                        return "ru";
                    case 'Google Nederlands':
                        return "nl";
                    case 'Google polski':
                        return "pl";
                    case 'Google Bahasa Indonesia':
                        return "id";
                    case 'Google 普通话（中国大陆）':
                        return "zh-CN";
                    case 'Google 粤語（香港）':
                        return "zh-HK";
                }
            }

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
            }
        };

        /**
         * Talks a text according to the given parameters.
         *
         * @private
         * @param {String} text Text to be spoken
         * @param {Int} actualChunk Number of chunk of the
         * @param {Int} totalChunks
         * @returns {undefined}
         */
        var artyom_talk = function (text, actualChunk, totalChunks, callbacks) {
            var msg = new SpeechSynthesisUtterance();
            msg.text = text;
            msg.volume = artyomProperties.volume;
            msg.rate = artyomProperties.speed;

            // Select the voice according to the selected
            if (artyomVoice) {
                msg.voice = speechSynthesis.getVoices().filter(function (voice) {
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
                    artyom_triggerEvent(artyom_global_events.SPEECH_SYNTHESIS_START);
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
                    artyom_triggerEvent(artyom_global_events.SPEECH_SYNTHESIS_END);
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
            window.speechSynthesis.speak(msg);
        };

        /**
         * Process the given text into chunks and execute the private function artyom_talk
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/20/read-doc/artyom-say/artyom-js
         * @param {String} message Text to be spoken
         * @param {Object} callbacks
         * @returns {undefined}
         */
        artyom.say = function (message, callbacks) {
            if (artyom.speechSupported()) {
                if (typeof (message) == 'string') {
                    if (message.length > 0) {
                        var finalTextA = message.split(",");
                        var finalTextB = message.split(".");
                        var definitive;

                        //Declare final chunk container and clear any empty item !
                        if ((finalTextA.length) > (finalTextB.length)) {
                            definitive = finalTextA.filter(function(e){return e;});
                        } else {
                            definitive = finalTextB.filter(function(e){return e;});
                        }

                        //Process given text into chunks !
                        definitive.forEach(function (chunk, index) {
                            var numberOfChunk = (index + 1);

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

        /**
         * Repeats the last sentence that artyom said.
         * Useful in noisy environments.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/25/read-doc/artyom-repeatlastsay/artyom-js
         * @param {Boolean} returnObject If set to true, an object with the text and the timestamp when was executed will be returned.
         * @returns {Object}
         */
        artyom.repeatLastSay = function (returnObject) {
            var last = artyomProperties.helpers.lastSay;

            if (returnObject) {
                return last;
            } else {
                if (last != null) {
                    artyom.say(last.text);
                }
            }
        };

        /**
         * Verify if the browser supports speechSynthesis.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/40/read-doc/artyom-speechsupported/artyom-js
         * @returns {Boolean}
         */
        artyom.speechSupported = function () {
            return 'speechSynthesis' in window;
        };

        /**
         * Verify if the browser supports webkitSpeechRecognition.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/39/read-doc/artyom-recognizingsupported/artyom-js
         * @returns {Boolean}
         */
        artyom.recognizingSupported = function () {
            return 'webkitSpeechRecognition' in window;
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
        var artyom_hey = function () {
            var start_timestamp;
            var artyom_is_allowed;

            reconocimiento.continuous = true;
            reconocimiento.interimResults = true;
            reconocimiento.lang = artyomProperties.lang;

            reconocimiento.onstart = function () {
                artyom.debug("Event reached : " + artyom_global_events.COMMAND_RECOGNITION_START);
                artyom_triggerEvent(artyom_global_events.COMMAND_RECOGNITION_START);
                artyomProperties.recognizing = true;
                artyom_is_allowed = true;
            };

            /**
             * Handle all artyom posible exceptions
             *
             * @param {type} event
             * @returns {undefined}
             */
            reconocimiento.onerror = function (event) {
                // Dispath error globally (artyom.when)
                artyom_triggerEvent(artyom_global_events.ERROR,{
                    code: event.error
                });

                if (event.error == 'audio-capture') {
                    artyom_is_allowed = false;
                }

                if (event.error == 'not-allowed') {
                    artyom_is_allowed = false;
                    if (event.timeStamp - start_timestamp < 100) {
                        artyom_triggerEvent(artyom_global_events.ERROR, {
                            code: "info-blocked",
                            message: "Artyom needs the permision of the microphone, is blocked."
                        });
                    } else {
                        artyom_triggerEvent(artyom_global_events.ERROR, {
                            code: "info-denied",
                            message: "Artyom needs the permision of the microphone, is denied"
                        });
                    }
                }
            };

            /**
             * Check if continuous mode is active and restar the recognition.
             * Throw events too.
             *
             * @returns {undefined}
             */
            reconocimiento.onend = function () {
                if (artyomFlags.restartRecognition === true) {
                    if (artyom_is_allowed === true) {
                        reconocimiento.start();
                        artyom.debug("Continuous mode enabled, restarting", "info");
                    } else {
                        console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                    }

                    artyom_triggerEvent(artyom_global_events.COMMAND_RECOGNITION_END,{
                        code: "continuous_mode_enabled",
                        message: "OnEnd event reached with continuous mode"
                    });
                }else{
                    artyom_triggerEvent(artyom_global_events.COMMAND_RECOGNITION_END,{
                        code: "continuous_mode_disabled",
                        message: "OnEnd event reached without continuous mode"
                    });
                }

                artyomProperties.recognizing = false;
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
            if(artyomProperties.mode == "normal"){
                onResultProcessor = function(event){
                    if (!artyomCommands.length) {
                        artyom.debug("No commands to process in normal mode.");
                        return;
                    }

                    var cantidadResultados = event.results.length;

                    artyom_triggerEvent(artyom_global_events.TEXT_RECOGNIZED);

                    for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                        var identificated = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            var comando = artyom_execute(identificated.trim());

                            // Redirect the output of the text if necessary
                            if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                            }

                            if ((comando !== false) && (artyomProperties.recognizing == true)) {
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
                            //Redirect output when necesary
                            if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                            }

                            if (typeof (artyomProperties.executionKeyword) === "string") {
                                if (identificated.indexOf(artyomProperties.executionKeyword) != -1) {
                                    var comando = artyom_execute(identificated.replace(artyomProperties.executionKeyword, '').trim());

                                    if ((comando !== false) && (artyomProperties.recognizing == true)) {
                                        artyom.debug("<< Executing command ordered by ExecutionKeyword >>", 'info');
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;

                                        //Executing Command Action
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
            if(artyomProperties.mode == "quick"){
                onResultProcessor = function(event){
                    if (!artyomCommands.length) {
                        artyom.debug("No commands to process.");
                        return;
                    }

                    var cantidadResultados = event.results.length;

                    artyom_triggerEvent(artyom_global_events.TEXT_RECOGNIZED);

                    for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                        var identificated = event.results[i][0].transcript;

                        if (!event.results[i].isFinal) {
                            var comando = artyom_execute(identificated.trim());

                            //Redirect output when necesary
                            if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                artyomProperties.helpers.redirectRecognizedTextOutput(identificated, true);
                            }

                            if ((comando !== false) && (artyomProperties.recognizing == true)) {
                                artyom.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                reconocimiento.stop();
                                artyomProperties.recognizing = false;

                                //Executing Command Action
                                if (comando.wildcard) {
                                    comando.objeto.action(comando.indice, comando.wildcard.item);
                                } else {
                                    comando.objeto.action(comando.indice);
                                }

                                break;
                            }
                        } else {
                            var comando = artyom_execute(identificated.trim());

                            //Redirect output when necesary
                            if (typeof (artyomProperties.helpers.redirectRecognizedTextOutput) === "function") {
                                artyomProperties.helpers.redirectRecognizedTextOutput(identificated, false);
                            }

                            if ((comando !== false) && (artyomProperties.recognizing == true)) {
                                artyom.debug("<< Executing Matching Recognition in quick mode >>", "info");
                                reconocimiento.stop();
                                artyomProperties.recognizing = false;

                                //Executing Command Action
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

            /**
             * Process the recognition event with the previously
             * declared processor function.
             *
             * @param {type} event
             * @returns {undefined}
             */
            reconocimiento.onresult = onResultProcessor;

            if (artyomProperties.recognizing) {
                reconocimiento.stop();
                artyom.debug("Event reached : " + artyom_global_events.COMMAND_RECOGNITION_END);
                artyom_triggerEvent(artyom_global_events.COMMAND_RECOGNITION_END);
            } else {
                try {
                    reconocimiento.start();
                } catch (e) {
                    artyom_triggerEvent(artyom_global_events.ERROR,{
                        code: "recognition_overlap",
                        message: "A webkitSpeechRecognition instance has been started while there's already running. Is recommendable to restart the Browser"
                    });
                }
            }
        };

        /**
         * Simulate a voice command via JS
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/22/read-doc/artyom-simulateinstruction/artyom-js
         * @param {type} sentence
         * @returns {undefined}
         */
        artyom.simulateInstruction = function (sentence) {
            if ((!sentence) || (typeof (sentence) !== "string")) {
                console.warn("Cannot execute a non string command");
                return false;
            }

            var foundCommand = artyom_execute(sentence);//Command founded object

            if (typeof (foundCommand) === "object") {
                if (foundCommand.objeto) {
                    if (foundCommand.objeto.smart) {
                        artyom.debug('Smart command matches with simulation, executing', "info");
                        foundCommand.objeto.action(foundCommand.indice, foundCommand.wildcard.item, foundCommand.wildcard.full);
                    } else {
                        artyom.debug('Command matches with simulation, executing', "info");
                        foundCommand.objeto.action(foundCommand.indice);//Execute Normal command
                    }
                    return true;
                }
            } else {
                console.warn("No command founded trying with " + sentence);
                return false;
            }
        };

        /**
         * Returns an object with data of the matched element
         *
         * @private
         * @param {string} comando
         * @returns {Boolean || Function}
         */
        var artyom_execute = function (voz) {
            if (!voz) {
                console.warn("Internal error: Execution of empty command");
                return false;
            }

            artyom.debug(">> " + voz);//Show tps in consola

            /** @3
             * Artyom needs time to think that
             */
            for (var i = 0; i < artyomCommands.length; i++) {
                var instruction = artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;

                for (var c = 0; c < opciones.length; c++) {
                    var opcion = opciones[c];

                    if (!instruction.smart) {
                        continue;//Jump if is not smart command
                    }

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

                        //Wildcard in the end
                        if ((later == "") || (later == " ")) {
                            if ((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                var wildy = voz.replace(before, '');
                                wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '');
                                encontrado = parseInt(c);
                            }
                        } else {
                            if ((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)) {
                                if ((voz.indexOf(later) != -1) || ((voz.toLowerCase()).indexOf(later.toLowerCase()) != -1)) {
                                    var wildy = voz.replace(before, '').replace(later, '');
                                    wildy = (wildy.toLowerCase()).replace(before.toLowerCase(), '').replace(later.toLowerCase(), '');

                                    wildy = (wildy.toLowerCase()).replace(later.toLowerCase(), '');
                                    encontrado = parseInt(c);
                                }
                            }
                        }
                    } else {
                        console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                    }

                    if ((encontrado >= 0)) {
                        encontrado = parseInt(c);
                        break;
                    }
                }

                if (encontrado >= 0) {
                    artyom_triggerEvent(artyom_global_events.COMMAND_MATCHED);
                    return {
                        indice: encontrado,
                        objeto: instruction,
                        wildcard: {
                            item: wildy,
                            full: voz
                        }
                    };
                }
            }//End @3

            /** @1
             * Search for IDENTICAL matches in the commands if nothing matches
             * start with a index match in commands
             */
            for (var i = 0; i < artyomCommands.length; i++) {
                var instruction = artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;

                /**
                 * Execution of match with identical commands
                 */
                for (var c = 0; c < opciones.length; c++) {
                    var opcion = opciones[c];
                    if (instruction.smart) {
                        continue;//Jump wildcard commands
                    }

                    if ((voz === opcion)) {
                        artyom.debug(">> MATCHED FULL EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = parseInt(c);
                        break;
                    } else if ((voz.toLowerCase() === opcion.toLowerCase())) {
                        artyom.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = parseInt(c);
                        break;
                    }
                }

                if (encontrado >= 0) {
                    artyom_triggerEvent(artyom_global_events.COMMAND_MATCHED);
                    return {
                        indice: encontrado,
                        objeto: instruction
                    };
                }
            }//End @1

            /**
             * Step 3 Commands recognition.
             * If the command is not smart, and any of the commands match exactly then try to find
             * a command in all the quote.
             */
            for (var i = 0; i < artyomCommands.length; i++) {
                var instruction = artyomCommands[i];
                var opciones = instruction.indexes;
                var encontrado = -1;

                /**
                 * Execution of match with index
                 */
                for (var c = 0; c < opciones.length; c++) {
                    if (instruction.smart) {
                        continue;//Jump wildcard commands
                    }

                    var opcion = opciones[c];
                    if ((voz.indexOf(opcion) >= 0)) {
                        artyom.debug(">> MATCHED INDEX EXACT OPTION " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = parseInt(c);
                        break;
                    } else if (((voz.toLowerCase()).indexOf(opcion.toLowerCase()) >= 0)) {
                        artyom.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST " + voz + " WITH INDEX " + c + " IN COMMAND ", "info");
                        encontrado = parseInt(c);
                        break;
                    }
                }

                if (encontrado >= 0) {
                    artyom_triggerEvent(artyom_global_events.COMMAND_MATCHED);
                    return {
                        indice: encontrado,
                        objeto: instruction
                    };
                }
            }//End Step 3

            return false;
        };

        /**
         * Displays a message in the console if the artyom propery DEBUG is set to true.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/38/read-doc/artyom-debug/artyom-js
         * @param {type} e
         * @param {type} o
         * @returns {undefined}
         */
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

        artyom.is = {
            integer: function (a) {
                return Number(a) === a && 0 === a % 1
            }, "float": function (a) {
                return a === Number(a) && 0 !== a % 1
            }, "function": function (a) {
                return"function" == typeof a ? !0 : !1
            }, object: function (a) {
                return"object" == typeof a ? !0 : !1
            }, "boolean": function (a) {
                return"boolean" == typeof a ? !0 : !1
            }, array: function (a) {
                return a.constructor === Array ? !0 : !1
            }, number: function (a) {
                return a === parseFloat(a)
            }, odd: function (a) {
                return artyom.is.number(a) && 1 === Math.abs(a) % 2
            }, even: function (a) {
                return artyom.is.number(a) && 0 === a % 2
            }, jQueryObject: function (a) {
                return a instanceof jQuery ? !0 : !1
            },
        };

        /**
         * Artyom have it's own diagnostics.
         * Run this function in order to detect why artyom is not initialized.
         *
         * @tutorial http://ourcodeworld.com/projects/projects-documentation/5/read-doc/artyom-detecterrors/artyom-js
         * @param {type} callback
         * @returns {}
         */
        artyom.detectErrors = function () {
            if ((window.location.protocol) == "file:") {
                var message = "Fatal Error Detected : It seems you're running the artyom demo from a local file ! The SpeechRecognitionAPI Needs to be hosted someway (server as http or https). Artyom will NOT work here, Sorry.";
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
        };


        /**
         * Allows to retrieve the recognized spoken text of artyom
         * and do something with it everytime something is recognized
         *
         * @param {String} action
         * @returns {Boolean}
         */
        artyom.redirectRecognizedTextOutput = function (action) {
            if (typeof (action) != "function") {
                console.warn("Expected function to handle the recognized text ...");
                return false;
            }

            artyomProperties.helpers.redirectRecognizedTextOutput = action;

            return true;
        };

        /**
         * Says a random quote and returns it's object
         *
         * @param {type} data
         * @returns {object}
         */
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

        /**
         * Artyom provide an easy way to create a
         * dictation for your user.
         *
         * Just create an instance and start and stop when you want
         *
         * @returns Object | newDictation
         */
        artyom.newDictation = function (settings) {
            if (!artyom.recognizingSupported()) {
                console.error("SpeechRecognition is not supported in this browser");
                return false;
            }

            var dictado = new webkitSpeechRecognition();
            dictado.continuous = true;
            dictado.interimResults = true;
            dictado.lang = artyomProperties.lang;
            dictado.onresult = function (event) {
                var temporal = "";
                var interim = "";

                for (var i = 0; i < event.results.length; ++i) {
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


        /**
         * A voice prompt will be executed.
         *
         * @param {type} config
         * @returns {undefined}
         */
        artyom.newPrompt = function (config) {
            if (typeof (config) !== "object") {
                console.error("Expected the prompt configuration.");
            }

            var copyActualCommands = Object.assign([], artyomCommands);
            artyom.emptyCommands();

            var promptCommand = {
                description: "Setting the artyom commands only for the prompt. The commands will be restored after the prompt finishes",
                indexes: config.options,
                action: function (i, wildcard) {
                    artyomCommands = copyActualCommands;
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
         * Extend the functions of artyom as you like.
         *
         * It's no possible to add properties to the artyom object as artyom is a non-extensible object.
         * If you need to extend the artyom functions you can easily extend the "extensions" properties.
         *
         * @example <caption>Creating a custom artyom method</caption>
         * // creates artyom.extensions.hello method
         * artyom.extensions.hello = function(){
         *   artyom.say("Hello !");
         * };
         * @since 0.5
         * @returns {artyom.extensions}
         */
        artyom.extensions = function () {
            return {};
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
        artyom.getNativeApi = function () {
            return reconocimiento;
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
        artyom.isRecognizing = function(){
            return artyomProperties.recognizing;
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
        artyom.isSpeaking = function(){
            return artyomProperties.speaking;
        };

        /**
         * The SpeechSynthesisUtterance objects are stored in the artyom_garbage_collector variable
         * to prevent the wrong behaviour of artyom.say.
         * Use this method to clear all spoken SpeechSynthesisUtterance unused objects.
         *
         * @returns {Boolean}
         */
        artyom.clearGarbageCollection = function(){
            return artyom_garbage_collector = [];
        };

        /**
         * Returns the SpeechSynthesisUtterance garbageobjects.
         *
         * @returns {Array}
         */
        artyom.getGarbageCollection = function(){
            return artyom_garbage_collector;
        };

        /**
         * Shortcut method to enable the artyom debug on the fly.
         *
         * @returns {Array}
         */
        artyom.setDebug = function(status){
            if(status){
                return artyomProperties.debug = true;
            }else{
                return artyomProperties.debug = false;
            }
        };

        /**
         * Returns a string with the actual version of Artyom script.
         *
         * @summary Returns the actual version of artyom
         * @returns {String}
         */
        artyom.getVersion = function () {
            return "0.9.6";
        };

        return artyom;
    }

    if (typeof (artyom) === 'undefined') {
        window.artyom = Object.preventExtensions(new ArtyomAI());
    } else {
        console.warn("Artyom is being loaded twice in your document or you're injecting the artyom script via console (injected webkitSpeechRecognition will not work due to security reasons)");
    }
})(window);
