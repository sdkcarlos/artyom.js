/**
 * Artyom uses webkitSpeechRecognition && SpeechSynthesisUtterance property of Google Inc.
 * Requires browser with WebKit -  This object is only supported by Google Chrome and Apple Safari.
 * 
 * @version 0.6
 * @copyright 2015, Deutschland.
 * @author Carlos Delgado | 2015
 * @param {type} window
 * @see http://sdkcarlos.github.io/artyom.html
 * @returns {object}
 */
(function(window){'use strict';
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices(); // This is an async method so will return anything on first call. Then will return the available voices.
    }
    
    if(('webkitSpeechRecognition' in window)){
        var reconocimiento = new webkitSpeechRecognition();
        var artyomProperties = {
            lang:'en-GB',
            recognizing:false,
            continuous:false,
            speed:1,
            volume:1,
            listen:true,
            mode:"normal",
            debug:false,
            helpers:{
                redirectRecognizedTextOutput:null
            }
        };
        // Allow to artyom continue with tasks
        var artyomFlags = {
            restartRecognition:false
        };
    }
    
    var artyDeutsch = 'Google Deutsch';
    var artySpanish = 'Google Español';
    var artyFrance = 'Google Français';
    var artyItaliano = 'Google Italiano';
    var artyJapanese = 'Google 日本人';
    var artyUSA = 'Google US English';
    var artyomEnglish = 'Google UK English Male';
    var artyomVoice = 'Google UK English Male';
    var device = {
        isMobile:false,
        isChrome:true
    };
    
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))){
        device.isMobile = true;
    } 
    
    if(navigator.userAgent.indexOf("Chrome") == -1){
        device.isChrome = false;
    }
    
    function ArtyomAI(){
            var artyom = {};
            var artyomCommands = [];
            artyom.device = device;
            
            /*
             * Artyom can return inmediately the voices available in your browser !
             * 
             * @returns {Array}
             */
            artyom.getVoices = function(){
                return window.speechSynthesis.getVoices();
            };
            
            /*
             * Returns an array with all the available commands for artyom in the moment is executed.
             * 
             * @returns {Array}
             */
            artyom.getAvailableCommands = function(){
                var availables = [];
                
                for (var i = 0; i < artyomCommands.length; i++) {
                    var command = artyomCommands[i];
                    var aval = {};
                    aval.indexes = command.indexes;
                    
                    if(command.smart){
                        aval.smart = true;
                    } 
                    
                    if(command.description){
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
             * 
             * @param {type} language
             * @returns {undefined}
             */
            artyom.initialize = function (config){
                if(typeof(config) !== "object"){
                    console.error("You must give the configuration for start artyom properly.");
                    return;
                }
                
                if ('speechSynthesis' in window) {
                    if(config.lang){
                        switch(config.lang){
                            case 'de':
                            case 'de-DE':
                                artyomVoice = artyDeutsch;
                            break;
                            case 'en-GB':
                                artyomVoice = artyomEnglish;
                            break;
                            case 'es':
                            case 'es-CO':
                            case 'es-ES':
                                artyomVoice = artySpanish;
                            break;
                            case "en":
                            case 'en-US':
                                artyomVoice = artyUSA;
                            break;
                            case 'fr':
                            case 'fr-FR':
                                artyomVoice = artyFrance;
                            break;
                            case 'it':
                            case 'it-IT':
                                artyomVoice = artyItaliano;
                            break;
                            case 'jp':
                            case 'ja-JP':
                                artyomVoice = artyJapanese;
                            break;
                            default:
                                console.info("The given language for artyom is not supported yet. English has been set to default");
                            break;
                        }
                        artyomProperties.lang = config.lang;
                    }
                    
                    if(config.continuous){
                        artyomProperties.continuous = true;
                        artyomFlags.restartRecognition = true;
                    }else{
                        artyomProperties.continuous = false;
                        artyomFlags.restartRecognition = false;
                    }
                    
                    if(artyom.is.number(config.speed)){
                        artyomProperties.speed = config.speed;
                    }
                    
                    if(artyom.is.number(config.volume)){
                        artyomProperties.volume = config.volume;
                    }
                    
                    artyomProperties.listen = config.listen;
                    
                    artyomProperties.debug = config.debug;
                    
                    if(config.mode){
                        artyomProperties.mode = config.mode;
                    }
                    
                    if(artyomProperties.listen === true){
                        artyom_hey();
                    }
                    
                    return true;
                }else{
                    artyom_triggerEvent("error",{
                        code: "artyom_unsupported",
                        message: "Artyom is not supported in this browser. Please consider in update for a WebKit browser like Google Chrome"
                    });
                    console.error('Artyom is not supported in this browser. Please consider in update for a WebKit browser like Google Chrome');
                    return false;
                }
            };
            
            /**
             * Force artyom to stop listen even if
             * is in continuos mode.
             * 
             * @returns {Boolean}
             */
            artyom.fatality = function(){
                //if config is continuous mode, deactivate anyway.
                artyomFlags.restartRecognition = false;
                reconocimiento.stop();
                return true;
            };
            
            /**
             * Since artyom v0.6, the commands can only be added via artyom.addCommands due to performance enhance.
             * This function can be executed at any time and replaces the old file and function
             * artyCommands.extend
             * You can even add commands while artyom is running !
             * 
             * @param {type} param
             * @returns {undefined}
             */
            artyom.addCommands = function(param){
                var _processObject = function(obj){
                    artyomCommands.push(obj);
                };
                
                if(param instanceof Array){
                    for(var i = 0;i < param.length;i++){
                        _processObject(param[i]);
                    }
                }else{
                    _processObject(param);
                }
                
                return true;
            };
            
            /**
             * Removes all the commands added to artyom.
             * 
             * @returns {Array|window.artyom.min_L14.ArtyomAI.artyom.emptyCommands.artyomCommands}#
             */
            artyom.emptyCommands = function(){
                return artyomCommands = [];
            };
            
            
            /**
             * Stops the actual and pendings messages that artyom have to say.
             * 
             * @returns {undefined}
             */
            artyom.shutUp = function(){
                do {
                    window.speechSynthesis.cancel();
                }
                while (window.speechSynthesis.pending === true);
            };
            
            /**
             * Returns an object with the actual properties
             * of artyom.
             * 
             * @returns {object}
             */
            artyom.getProperties = function(){
                return artyomProperties;
            };
            
            /**
             * Generates an artyom event with the designed name
             * 
             * @param {type} name
             * @returns {undefined}
             */
            var artyom_triggerEvent = function(name,param){
                var event = new CustomEvent(name, { 'detail': param });
                document.dispatchEvent(event);
                return event;
            };
            
            /**
             * Create a listener when an artyom action is called
             * 
             * @param {type} event
             * @param {type} action
             * @returns {undefined}
             */
            artyom.when = function(event,action){
                document.addEventListener(event, function (e) {
                    action(e.detail);
                }, false);
            };
            
            /**
             * Returns the language of artyom according to initialize function.
             * if initialize not used returns english
             * 
             * @returns {String}
             */
            artyom.getLanguage = function(short){
                if(short){
                    switch(artyomVoice){
                    case 'Google UK English Male':
                        return "en-GB";
                    break;
                    case 'Google Español':
                        return "es";
                    break;
                    case 'Google Deutsch':
                        return "de";
                    break;
                    case 'Google Français':
                        return "fr";
                    break;
                    case 'Google Italiano':
                        return "it";
                    break;
                    case 'Google 日本人':
                        return "jp";
                    break;
                    case 'Google US English':
                        return "en-US";
                    break;
                    }
                }
                
                switch(artyomVoice){
                    case 'Google UK English Male':
                        return "en-GB";
                    break;
                    case 'Google Español':
                        return "es-CO";
                    break;
                    case 'Google Deutsch':
                        return "de-DE";
                    break;
                    case 'Google Français':
                        return "fr-FR";
                    break;
                    case 'Google Italiano':
                        return "it-IT";
                    break;
                    case 'Google 日本人':
                        return "ja-JP";
                    break;
                    case 'Google US English':
                        return "en-US";
                    break;
                }
            };
            
            /**
             * Artyom deliver the given message to the PC user
             * 
             * @param {string} message
             * @returns {undefined}
             */
            artyom.say = function(message,callbacks){
                    if (artyom.speechSupported()) {
                        
                        /**
                         * Process string to be synthesized.
                         * 
                         * @param {type} text
                         * @param {type} actualChunk
                         * @param {type} totalChunks
                         * @returns {undefined}
                         */
                        var talk = function(text,actualChunk,totalChunks) {
                            var msg = new SpeechSynthesisUtterance();
                            msg.text = text;
                            msg.volume = artyomProperties.volume;
                            msg.rate = artyomProperties.speed;

                            if (artyomVoice) {
                                msg.voice = speechSynthesis.getVoices().filter(function(voice) { 
                                    return voice.name == artyomVoice; 
                                })[0];
                            }
                            
                            if(callbacks){
                                if(typeof(callbacks.onEnd) == "function"){
                                    msg.addEventListener('end', function () {//Handle onEnd callback
                                        if((actualChunk) >= totalChunks){
                                            callbacks.onEnd();
                                        }
                                    });
                                }
                                
                                if(typeof(callbacks.onStart) == "function"){//Handle onStart callback
                                    msg.addEventListener('start', function () {
                                        if(actualChunk == 1){ // If the chunk is the first trigger the onStart event
                                            callbacks.onStart();
                                        }
                                    });
                                }
                            }
                            
                            artyom.debug((actualChunk) +" text chunks processed succesfully out of " + totalChunks);//Notice how many chunks were processed for the given text.
                            window.speechSynthesis.speak(msg);
                        };

                        if(typeof(message.length) !== "undefined"){
                            if(message.length > 0){
                                var finalTextA = message.split(",");
                                var finalTextB = message.split(".");
                                var definitive;
                                
                                //Declare final chunk container and clear any empty item !
                                if((finalTextA.length) > (finalTextB.length)){
                                    definitive = finalTextA.filter(function(e){return e;});
                                }else{
                                    definitive = finalTextB.filter(function(e){return e;});
                                }
                                
                                //Process given text into chunks !
                                definitive.forEach(function(chunk,index){
                                    var numberOfChunk = (index + 1);
                                    
                                    if(chunk){
                                        talk(chunk,numberOfChunk,definitive.length);
                                    }
                                });

                                artyom_triggerEvent("saySomething");
                            }else{
                                artyom.debug("Artyom expects a string to say ... none given.",'warn');
                            }
                        }else{
                            artyom.debug("Artyom expects a string to say ... "+typeof(message)+" given.",'warn');
                        }
                    }
                };
            
            
            /**
             * Test artyom in the browser.
             * 
             * @returns {undefined}
             */
            artyom.test = function(){
                if(('webkitSpeechRecognition' in window)){
                    alert("I can hear you ! Initialize me now.");
                    artyom.initialize({
                        lang:"en-GB",
                        listen:false
                    });
                }else{
                    alert("Artyom can't listen to you in this browser. Speech Recognition is not supported in this browser.");
                }
                
                if ('speechSynthesis' in window) {
                    artyom.say("1,2,3,4,5,6,7,8,9,10. Well, all is in order here.",{
                        onEnd:function(){
                            alert("The test of speech is over.");
                        }
                    });
                }else{
                    alert("Artyom can't say nothing in this browser. Speech Synthesis is not supported in this browser.");
                }
            };
            
            /**
             * verify if artyom can talk or not.
             * 
             * @returns {Boolean}
             */
            artyom.speechSupported = function(){
                return 'speechSynthesis' in window;
            };
            
            /**
             * verify if artyom can listen you or not.
             * 
             * @public
             * @returns {Boolean}
             */
            artyom.recognizingSupported = function(){
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
            var artyom_hey = function(){
                    var start_timestamp;
                    var artyom_is_allowed;

                    reconocimiento.continuous = true;
                    reconocimiento.interimResults = true;
                    reconocimiento.lang = artyomProperties.lang;
                    
                    reconocimiento.onstart = function() {
                        artyom.debug("Event reached : onStart");
                        artyomProperties.recognizing = true;
                        artyom_is_allowed = true;
                    };
                    
                    /**
                     * Handle all artyom posible exceptions
                     * 
                     * @param {type} event
                     * @returns {undefined}
                     */
                    reconocimiento.onerror = function(event) {
                        if(event.error == 'network'){
                            artyom_triggerEvent("error",{
                                code:"network",
                                message:"Artyom needs internet to work properly"
                            });
                        }
                        
                        if (event.error == 'no-speech') {
                            if(artyomProperties.continuous === false){
                                artyom_triggerEvent("info",{
                                    code:"info_no_speech",
                                    message:"Artyom didn't hear anything. It will take a break."
                                });
                            }
                        }
                        
                        if (event.error == 'audio-capture') {
                            artyom_is_allowed = false;
                            artyom_triggerEvent("error",{
                                code:"audio-capture",
                                message:"There's not any audiocapture device installed on this computer."
                            });
                            
                        }
                        
                        if (event.error == 'not-allowed') {
                            artyom_is_allowed = false;
                            if (event.timeStamp - start_timestamp < 100) {
                                artyom_triggerEvent("error",{
                                    code:"info_blocked",
                                    message:"Artyom needs the permision of the microphone, is blocked."
                                });
                            } else {
                                artyom_triggerEvent("error",{
                                    code:"info_denied",
                                    message:"Artyom needs the permision of the microphone, is denied"
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
                    reconocimiento.onend = function() {
                        
                        artyom_triggerEvent("FinishRecognition",{
                            code: "artyom_dont_listen",
                            message: "Artyom stop listening."
                        });
                        
                        if(artyomFlags.restartRecognition === true){
                            if(artyom_is_allowed === true){
                                reconocimiento.start();
                                artyom.debug("Artyom initialization finished. Restarting","info");
                            }else{
                                console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/sites/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                            }
                        }
                        
                        artyomProperties.recognizing = false;
                    };
                    
                    /**
                     * Procesar cada reconocimiento de voz.
                     * 
                     * @param {type} event
                     * @returns {undefined}
                     */
                    reconocimiento.onresult = function(event){
                        if(!artyomCommands.length){return;}
                        
                        var cantidadResultados = event.results.length;
                        
                        artyom_triggerEvent("Recognition",{
                            code: "artyom_listen",
                            message: "Artyom is listening to you."
                        });
                        
                        if(artyomProperties.mode == "normal"){
                            for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                                var identificated = event.results[i][0].transcript;
                                if (event.results[i].isFinal) {
                                    var comando = artyom_execute(identificated.trim());
                                    
                                    //Redirect output when necesary
                                    if(typeof(artyomProperties.helpers.redirectRecognizedTextOutput) === "function"){
                                        artyomProperties.helpers.redirectRecognizedTextOutput(identificated,true);
                                    }
                                    
                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in normal mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;
                                        
                                        //Executing Command Action
                                        if(comando.wildcard){
                                            comando.objeto.action(comando.indice,comando.wildcard.item,comando.wildcard.full);
                                        }else{
                                            comando.objeto.action(comando.indice);
                                        }

                                        break;
                                    }
                                }else{
                                    //Redirect output when necesary
                                    if(typeof(artyomProperties.helpers.redirectRecognizedTextOutput) === "function"){
                                        artyomProperties.helpers.redirectRecognizedTextOutput(identificated,false);
                                    }
                                    artyom.debug("Normal mode : " + identificated);
                                }
                            }
                        }else if(artyomProperties.mode == "quick"){
                            for (var i = event.resultIndex; i < cantidadResultados; ++i) {
                                var identificated = event.results[i][0].transcript;

                                if (!event.results[i].isFinal) {
                                    var comando = artyom_execute(identificated.trim());
                                    
                                    //Redirect output when necesary
                                    if(typeof(artyomProperties.helpers.redirectRecognizedTextOutput) === "function"){
                                        artyomProperties.helpers.redirectRecognizedTextOutput(identificated,true);
                                    }
                                    
                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in quick mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;
                                        
                                        //Executing Command Action
                                        if(comando.wildcard){
                                            comando.objeto.action(comando.indice,comando.wildcard.item);
                                        }else{
                                            comando.objeto.action(comando.indice);
                                        }

                                        break;
                                    }
                                }else{
                                    var comando = artyom_execute(identificated.trim());
                                    
                                    //Redirect output when necesary
                                    if(typeof(artyomProperties.helpers.redirectRecognizedTextOutput) === "function"){
                                        artyomProperties.helpers.redirectRecognizedTextOutput(identificated,false);
                                    }
                                    
                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in quick mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;

                                        //Executing Command Action
                                        if(comando.wildcard){
                                            comando.objeto.action(comando.indice,comando.wildcard.item);
                                        }else{
                                            comando.objeto.action(comando.indice);
                                        }

                                        break;
                                    }
                                }
                                
                                artyom.debug("Quick mode : " + identificated);
                            }
                        }
                    };
                    
                    if(artyomProperties.recognizing){
                        reconocimiento.stop();
                        artyom.debug("Voice recognition stopped");
                    }else{
                        try{
                            reconocimiento.start();
                        }catch(e){
                            console.warn("Fatal Error There's already a instance of me running in the background . It's recommendable to restart Google Chrome to fix this issue.");
                        }
                    }
            };
            
            
            /**
             * Simulate a voice command via JS
             * 
             * @example artyom.doInstruction("Hello"); Will execute the action of hello command
             * @param {type} sentence
             * @returns {undefined}
             */
            artyom.doInstruction = function(sentence){
                if((!sentence) || (typeof(sentence) !== "string")){
                    console.warn("Cannot execute a non string command");
                    return false;
                }
                
                var foundCommand = artyom_execute(sentence);//Command founded object
                
                if(typeof(foundCommand) === "object"){
                    if(foundCommand.objeto){
                        if(foundCommand.objeto.smart){
                            foundCommand.objeto.action(foundCommand.indice,foundCommand.wildcard.item,foundCommand.wildcard.full);//Execute Smart command
                        }else{
                            foundCommand.objeto.action(foundCommand.indice);//Execute Normal command
                        }
                        return true;
                    }
                }else{
                    console.warn("No command founded trying with "+sentence);
                    return false;
                }
            };
            
            /**
             * Returns an object with data of the matched element
             * 
             * @param {string} comando
             * @returns {Boolean || Function}
             */
            var artyom_execute = function(voz){
                if(!voz){console.error("Internal error: Execution of empty command");return false;}
                
                artyom.debug(">> " +voz);//Show tps in consola
                
                 /** @3
                 * Artyom needs time to think that
                 */
                for (var i = 0; i < artyomCommands.length; i++) {
                    var instruction =  artyomCommands[i];
                    var opciones = instruction.indexes;
                    var encontrado = -1;
                    
                    for (var c = 0; c < opciones.length; c++) {
                        var opcion = opciones[c];
                        
                        if(!instruction.smart){
                            continue;//Jump if is not smart command
                        }
                        
                        if(opcion.indexOf("*") != -1){
                            ///LOGIC HERE
                            var grupo = opcion.split("*");
                            
                            if(grupo.length > 2){
                                console.warn("Artyom found a smart command with "+(grupo.length - 1)+" wildcards. Artyom only support 1 wildcard for each command. Sorry");
                                continue;
                            }
                            //START SMART COMMAND
                            
                            var before = grupo[0];
                            var later = grupo[1];
                            
                            //Wildcard in the end
                            if((later == "") || (later == " ")){
                                if((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)){
                                    var wildy = voz.replace(before,'');
                                    wildy = (wildy.toLowerCase()).replace(before.toLowerCase(),'');
                                    encontrado = parseInt(c);
                                }
                            }else{
                                if((voz.indexOf(before) != -1) || ((voz.toLowerCase()).indexOf(before.toLowerCase()) != -1)){
                                    if((voz.indexOf(later) != -1) || ((voz.toLowerCase()).indexOf(later.toLowerCase()) != -1)){
                                        var wildy = voz.replace(before,'').replace(later,'');
                                        wildy = (wildy.toLowerCase()).replace(before.toLowerCase(),'').replace(later.toLowerCase(),'');
                                        
                                        wildy = (wildy.toLowerCase()).replace(later.toLowerCase(),'');
                                        encontrado = parseInt(c);
                                    }
                                }
                            }
                        }else{
                            console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                        }
                        
                        if((encontrado >= 0)){
                            encontrado = parseInt(c);
                            break;
                        }
                    }

                    if(encontrado >= 0){
                        return {
                            indice : encontrado,
                            objeto : instruction,
                            wildcard : {
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
                    var instruction =  artyomCommands[i];
                    var opciones = instruction.indexes;
                    var encontrado = -1;

                    /**
                     * Execution of match with identical commands
                     */
                    for (var c = 0; c < opciones.length; c++) {
                        var opcion = opciones[c];
                        if(instruction.smart){
                            continue;//Jump wildcard commands
                        }

                        if((voz === opcion)){
                            artyom.debug(">> MATCHED FULL EXACT OPTION " + opcion + " AGAINST "+ voz + " WITH INDEX " + c + " IN COMMAND ","info");
                            encontrado = parseInt(c);
                            break;
                        }else if((voz.toLowerCase() === opcion.toLowerCase())){
                            artyom.debug(">> MATCHED OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST "+ voz + " WITH INDEX " + c + " IN COMMAND ","info");
                            encontrado = parseInt(c);
                            break;
                        }
                    }

                    if(encontrado >= 0){
                        return {
                            indice : encontrado,
                            objeto : instruction
                        };
                    }
                }//End @1
                
                /**
                 * Step 3 Commands recognition.
                 * If the command is not smart, and any of the commands match exactly then try to find
                 * a command in all the quote.
                 */ 
                for (var i = 0; i < artyomCommands.length; i++) {
                    var instruction =  artyomCommands[i];
                    var opciones = instruction.indexes;
                    var encontrado = -1;

                    /**
                     * Execution of match with index
                     */
                    for (var c = 0; c < opciones.length; c++) {
                        if(instruction.smart){
                            continue;//Jump wildcard commands
                        }
                        
                        var opcion = opciones[c];
                        if((voz.indexOf(opcion) >= 0)){
                            artyom.debug(">> MATCHED INDEX EXACT OPTION " + opcion + " AGAINST "+ voz + " WITH INDEX " + c + " IN COMMAND ","info");
                            encontrado = parseInt(c);
                            break;
                        }else if(((voz.toLowerCase()).indexOf(opcion.toLowerCase()) >= 0)){
                            artyom.debug(">> MATCHED INDEX OPTION CHANGING ALL TO LOWERCASE " + opcion + " AGAINST "+ voz + " WITH INDEX " + c + " IN COMMAND ","info");
                            encontrado = parseInt(c);
                            break;
                        }
                    }

                    if(encontrado >= 0){
                        return {
                            indice : encontrado,
                            objeto : instruction
                        };
                    }
                }//End Step 3
                 
                return false;
            };
            
            /**
             * Displays a message in the console if the artyom propery DEBUG is set to true.
             * 
             * @param {type} e
             * @param {type} o
             * @returns {undefined}
             */
            artyom.debug = function(e,o){
                if(artyomProperties.debug === true){
                    switch(o){
                        case"error":
                            console.error(e);
                        break;
                        case"warn":
                            console.warn(e);
                        break;
                        case"info":
                            console.info(e);
                        break;
                        default:
                            console.log(e);
                        break;
                    }
                }
            };
            
            artyom.is = {
                integer:function(a){return Number(a)===a&&0===a%1},"float":function(a){return a===Number(a)&&0!==a%1},"function":function(a){return"function"==typeof a?!0:!1},object:function(a){return"object"==typeof a?!0:!1},"boolean":function(a){return"boolean"==typeof a?!0:!1},array:function(a){return a.constructor===Array?!0:!1},number:function(a){return a===parseFloat(a)},odd:function(a){return artyom.is.number(a)&&1===Math.abs(a)%2},even:function(a){return artyom.is.number(a)&&0===a%2},jQueryObject:function(a){return a instanceof jQuery?!0:!1},
            };
            
            /**
             * Artyom have it's own diagnostics.
             * Run this function in order to detect why artyom is not initialized.
             * 
             * @param {type} callback
             * @returns {}
             */
            artyom.detectErrors = function(callback){
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                
                if((window.location.origin) == "file://"){
                    console.error("Fatal Error Detected : It seems you're running the artyom demo from a local file ! The SpeechRecognitionAPI Needs to be hosted someway (server as http or https). Artyom will NOT work here, Sorry.");
                    return {
                        code:"artyom_error_localfile",
                        message: "Fatal Error Detected : It seems you're running the artyom demo from a local file ! The SpeechRecognitionAPI Needs to be hosted someway (server as http or https). Artyom will NOT work here, Sorry."
                    };
                }
                
                if(!artyom.device.isChrome){
                    console.error("Fatal Error Detected: You are not running Google Chrome ! SpeechRecognitionAPI and SpeechSynthesisAPI is only available in google chrome ! ");
                    return {
                        code:"artyom_error_browser_unsupported",
                        message: "Fatal Error Detected: You are not running Google Chrome ! SpeechRecognitionAPI and SpeechSynthesisAPI is only available in google chrome ! "
                    };
                }

                if (window.location.protocol != "https:"){
                    console.warn("Artyom is not running in HTTPS protocol,running in protocol : "+window.location.protocol+" that means the browser will ask the permission of microphone too often. You need a HTTPS Connection if you want artyom in continuous mode !");
                }
                
                if (navigator.getUserMedia) {
                    navigator.getUserMedia({ audio: true },
                        null,
                        function(err) {
                            if(typeof(callback) == "function"){
                                callback(err);
                            }
                        }
                    );
            
                    return {};
                } else {
                    console.log("Artyom couldn't found more errors in this browser.");
                    return false;
                }
            };
            
            
            /**
             * Allows to retrieve the recognized spoken text of artyom
             * and do something with it everytime something is recognized
             * 
             * @param {type} action
             * @returns {undefined}
             */
            artyom.redirectRecognizedTextOutput = function(action){
                if(typeof(action) != "function"){
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
            artyom.sayRandom = function(data){
                if(data instanceof Array){
                    var index = Math.floor(Math.random() * data.length);
                    artyom.say(data[index]);
                    return {
                        text:data[index],
                        index:index
                    };
                }else{
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
            artyom.newDictation = function(settings){
                if(!artyom.recognizingSupported()){
                    console.error("SpeechRecognition is not supported in this browser");
                    return false;
                }
                
                var dictado = new webkitSpeechRecognition();
                dictado.continuous = true;
                dictado.interimResults = true;
                dictado.lang = artyomProperties.lang;
                dictado.onresult = function(event){
                    var temporal = "";
                    var interim = "";
                    
                    for (var i = 0; i < event.results.length; ++i) {
                        if (event.results[i].final) {
                            temporal += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }
                    
                    if(settings.onResult){
                        settings.onResult(interim,temporal);
                    }
                };
                
                return new function () {
                    var dictation = dictado;
                    var flagStartCallback = true;
                    var flagRestart = false;
                    this.onError = null;
                    
                    this.start = function(){
                        if(settings.continuous === true){
                            flagRestart = true;
                        }
                        
                        dictation.onstart = function(){
                            if(typeof(settings.onStart) === "function"){
                                if(flagStartCallback === true){
                                    settings.onStart();
                                }
                            }
                        };
                        
                        dictation.onend = function(){
                            if(flagRestart === true){
                                flagStartCallback = false;
                                dictation.start();
                            }else{
                                flagStartCallback = true;
                                if(typeof(settings.onEnd) === "function"){
                                    settings.onEnd();
                                }
                            }
                        };
                        
                        dictation.start();
                    };
                    
                    this.stop = function(){
                        flagRestart = false;
                        dictation.stop();
                    };
                    
                    if(typeof(settings.onError) === "function"){
                        dictation.onerror = settings.onError;
                    }
                };
            };
            
            /**
             * Extend the functions of artyom as you like !
             * 
             * It's no possible to add properties to the artyom object
             * If you need to extend the artyom functions you can easily 
             * extend the "extensions" properties.
             * 
             * artyom.extensions.cores = 15;
             * 
             * @returns {artyom.extensions}
             */
            artyom.extensions = function(){
                return {};
            };
            
            /**
             * Returns a string with artyom actual version.
             * 
             * @returns {String}
             */
            artyom.getVersion = function(){
                return "0.6";
            };
            
        return artyom;
    }
    
    if(typeof(artyom) === 'undefined'){
        window.artyom = Object.preventExtensions(new ArtyomAI()); 
    }else{
        console.warn("Artyom seems to be loaded twice, it will work anyway but is recommendable for increase the visualization time of your document");
    }
})(window);