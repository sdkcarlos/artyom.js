declare var {webkitSpeechRecognition, speechSynthesis, SpeechSynthesisUtterance}: any;

interface Window {
    artyom: any;
    speechSynthesis: any;
}

interface IDevice {
    isMobile: Boolean;
    isChrome: Boolean;
}

(() => {
    /**
     * Due to problems with the javascript garbage collector the SpeechSynthesisUtterance object
     * onEnd event doesn't get triggered sometimes. Therefore we need to keep the reference of the
     * object inside this global array variable.
     *
     * @see https://bugs.chromium.org/p/chromium/issues/detail?id=509488
     * @global
     */
    let artyom_garbage_collector = []

    /**
     * artyomCommands stores all the loaded commands in artyom
     * @type {Array}
     * @global
     */
    let artyomCommands = []

    /**
     * An object with 
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
        mandarinChinese: "Google 普通话（中国大陆）",
        cantoneseChinese: "Google 粤語（香港）",
        native: "native"
    };

    let artyomProperties = {
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
    }

    /**
     * The webkitSpeechRecognition object will be stored in this variable once loaded
     */
    let reconocimiento = null;

    let artyom_global_events = {
        ERROR: "ERROR",
        SPEECH_SYNTHESIS_START: "SPEECH_SYNTHESIS_START",
        SPEECH_SYNTHESIS_END: "SPEECH_SYNTHESIS_END",
        TEXT_RECOGNIZED: "TEXT_RECOGNIZED",
        COMMAND_RECOGNITION_START : "COMMAND_RECOGNITION_START",
        COMMAND_RECOGNITION_END: "COMMAND_RECOGNITION_END",
        COMMAND_MATCHED: "COMMAND_MATCHED"
    };

    /**
     * Default voice of artyom
     */
    let artyomVoice = 'Google UK English Male';

    /**
     * A class with some helper functions that artyom requires
     */
    class ArtyomInternals {
        /**
         * Javascript implementation of the soundex algorithm.
         * @see https://gist.github.com/shawndumas/1262659
         * @returns {String}
         */
        soundex(s: string){
            var a = s.toLowerCase().split(''),
                f = a.shift(),
                r = '',
                codes={a:"",e:"",i:"",o:"",u:"",b:1,f:1,p:1,v:1,c:2,g:2,j:2,k:2,q:2,s:2,x:2,z:2,d:3,t:3,l:4,m:5,n:5,r:6};

            r = f + a
                .map((v, i, a) => {
                    return codes[v]
                })
                .filter((v, i, a) => {
                    return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
                })
                .join('');

            return (r + '000').slice(0, 4).toUpperCase();
        }

        /**
         * Splits a string into an array of strings with a limited size (chunk_length).
         *
         * @param {String} input text to split into chunks
         * @param {Integer} chunk_length limit of characters in every chunk
         */
        artyom_splitStringByChunks(input: string, chunk_length: number){
            input = input || ""
            chunk_length = chunk_length || 100

            var curr = chunk_length
            var prev = 0
            var output = []

            while (input[curr]) {
                if (input[curr++] == ' ') {
                    output.push(input.substring(prev,curr))
                    prev = curr
                    curr += chunk_length
                }
            }

            output.push(input.substr(prev))

            return output;
        }

        artyom_triggerEvent(name:string, param?:any){
            var event = new CustomEvent(name, {'detail': param});
            document.dispatchEvent(event);
            return event;
        }

        artyom_debug(e:string, o?:string){
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
        }

        /**
         * Talks a text according to the given parameters.
         *
         * @private
         * @param {String} text Text to be spoken
         * @param {Int} actualChunk Number of chunk of the
         * @param {Int} totalChunks
         * @returns {undefined}
         */
        artyom_talk(text: string, actualChunk: number, totalChunks :number, callbacks: any) {
            let _parent = this;
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
                    _parent.artyom_debug("Event reached : " + artyom_global_events.SPEECH_SYNTHESIS_START);
                    _parent.artyom_triggerEvent(artyom_global_events.SPEECH_SYNTHESIS_START);
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
                    _parent.artyom_debug("Event reached : " + artyom_global_events.SPEECH_SYNTHESIS_END);
                    _parent.artyom_triggerEvent(artyom_global_events.SPEECH_SYNTHESIS_END);
                    // Trigger the onEnd callback if exists.
                    if(callbacks){
                        if(typeof(callbacks.onEnd) == "function"){
                            callbacks.onEnd.call(msg);
                        }
                    }
                });
            }

            // Notice how many chunks were processed for the given text.
            _parent.artyom_debug((actualChunk) + " text chunk processed succesfully out of " + totalChunks);
            // Important : Save the SpeechSynthesisUtterance object in memory, otherwise it will get lost
            // thanks to the Garbage collector of javascript
            artyom_garbage_collector.push(msg);
            window.speechSynthesis.speak(msg);
        }
    }

    class Artyom {
        private InstanceArtyomInternals: ArtyomInternals;

        public device: IDevice;

        constructor() {
            /**
             * Retrieve voices of the browser once the script is loaded
             */
            if (window.hasOwnProperty('speechSynthesis')) {
                window.speechSynthesis.getVoices()
            }

            /**
             * Set a new webkitSpeechRecognition object in case it's available
             */
            if (window.hasOwnProperty('webkitSpeechRecognition')) {
                reconocimiento = new webkitSpeechRecognition()
            }

            let device = {isMobile:false,isChrome:true}

            /**
             * If used in mobile device
             */
            if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)){
                device.isMobile = true;
            }

            /**
             * If the browser is chrome
             */
            if (navigator.userAgent.indexOf("Chrome") == -1) {
                device.isChrome = false;
            }

            this.device = device;
            this.InstanceArtyomInternals = new ArtyomInternals();
        }

        speechSupported() {
            return window.hasOwnProperty("speechSynthesis");
        }


        getVoices() {
            return window.speechSynthesis.getVoices();
        }

        say(message: string, callbacks:any){
          
            var artyom_say_max_chunk_length = 115;

            if (this.speechSupported()) {
                if (typeof (message) == 'string') {
                    if (message.length > 0) {
                        var definitive = [];

                        // If the providen text is long, proceed to split it
                        if(message.length > artyom_say_max_chunk_length){
                            // Split the given text by pause reading characters [",",":",";","."] to provide a natural reading feeling.
                            var naturalReading = message.split(/,|:|\.|;/);

                            naturalReading.forEach(function(chunk, index){
                                // If the sentence is too long and could block the API, split it to prevent any errors.
                                if(chunk.length > artyom_say_max_chunk_length){
                                    // Process the providen string into strings (withing an array) of maximum aprox. 115 characters to prevent any error with the API.
                                    var temp_processed = this.InstanceArtyomInternals.artyom_splitStringByChunks(chunk, artyom_say_max_chunk_length);
                                    // Add items of the processed sentence into the definitive chunk.
                                    definitive.push.apply(definitive, temp_processed);
                                }else{
                                    // Otherwise just add the sentence to being spoken.
                                    definitive.push(chunk);
                                }
                            });
                        }else{
                            definitive.push(message);
                        }

                        // Clean any empty item in array
                        definitive = definitive.filter(function(e){return e;});

                        let _parent = this.InstanceArtyomInternals;

                        // Finally proceed to talk the chunks and assign the callbacks.
                        definitive.forEach(function (chunk, index) {
                            var numberOfChunk = (index + 1);

                            if (chunk) {
                                _parent.artyom_talk(chunk, numberOfChunk, definitive.length, callbacks);
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
        }

        fatality() {
            try{
                // Deactivate artyom even if continuous mode enabled.
                artyomFlags.restartRecognition = false;
                reconocimiento.stop();
                return true;
            }catch(e){
                console.log(e);
                return false;
            }
        }

       
    }   


    /**
     * Export artyom to the Window object of the browser
     */
    window.artyom = new Artyom();

})();