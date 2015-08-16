/**
 * Artyom uses webkitSpeechRecognition && SpeechSynthesisUtterance property of Google Inc.
 * Requires browser with WebKit -  This object is only supported by Google Chrome and Apple Safari.
 * 
 * @dependencies [artyomCommands.js]
 * @copyright 2015, Deutschland.
 * @author Carlos Delgado
 * @param {type} window
 * @Description Artyom JS Core - See Documentation for further information
 * @see http://sdkcarlos.github.io/artyom.html
 * @ignore 22.07.2015 17:17
 * @returns {object}
 */
(function(window){'use strict';
    if ('speechSynthesis' in window) {
        speechSynthesis.getVoices();
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
            debug:false
        };
    }
    
    var artyDeutsch = 'Google Deutsch';
    var artySpanish = 'Google Español';
    var artyomEnglish = 'Google UK English Male';
    var artyomVoice = 'Google UK English Male';
    
    function ArtyomAI(){
            if(typeof(artyCommands) !== "object"){
                console.warn("Hey .. pss ! You have not loaded the artyom commands file. I can't do anything without it, only (artyom.test()), otherwise the execution of the things could get very very bad.");
            }else{
                var allCommands = artyCommands.getCommands('en-GB');
            }
           
            var artyom = {}; 
            
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
                            case 'de-DE':
                                artyomVoice = artyDeutsch;
                            break;
                            case 'en-GB':
                                artyomVoice = artyomEnglish;
                            break;
                            case 'es-CO':
                                artyomVoice = artySpanish;
                            break;
                            default:
                                console.info("The given language for artyom is not supported yet. English has been set to default");
                            break;
                        }
                        artyomProperties.lang = config.lang;
                    }
                    
                    artyomProperties.continuous = config.continuous;
                    
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
                    
                    if(typeof(artyCommands) !== "undefined"){
                        allCommands = artyCommands.getCommands(config.lang);
                    }
                    
                    if(artyomProperties.listen === true){
                        if(!artyom.is.active()){
                            artyom.hey();
                            //SetArtyomAsActive !
                            localStorage.setItem("artyom",JSON.stringify({
                                "active":true
                            }));
                            
                            window.onbeforeunload = function(e) {
                                localStorage.removeItem("artyom");
                            };
                        }else{
                            artyom.triggerEvent("info",{
                                code: "artyom_is_running_already",
                                message: "Artyom is already running in other window, only 1 instance of artyom is available in the browser at time"
                            });
                        }
                    }
                    
                    return true;
                }else{
                    alert("Error en   mobil");
                    artyom.triggerEvent("error",{
                        code: "artyom_unsupported",
                        message: "Artyom is not supported in this browser. Please consider in update for a WebKit browser like Google Chrome"
                    });
                    console.error('Artyom is not supported in this browser. Please consider in update for a WebKit browser like Google Chrome');
                    return false;
                    //artyom.throw.error("Artyom is not supported in this browser. Please consider in update for a WebKit browser like Google Chrome",'Compatibility Error');
                }
            };
            
            /**
             * Force artyom to stop listen even if
             * is in continuos mode.
             * 
             * @returns {Boolean}
             */
            artyom.fatality = function(){
                artyomProperties.continuous = false;
                reconocimiento.stop();
                return true;
            };
            
            
            /**
             * Stops the actual and pendings messages that artyom have to say.
             * 
             * @returns {undefined}
             */
            artyom.shutUp = function(){
                do {
                    speechSynthesis.cancel();
                }
                while (speechSynthesis.pending === true);
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
            artyom.triggerEvent = function(name,param){
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
                        return "en";
                    break;
                    case 'Google Español':
                        return "es";
                    break;
                    case 'Google Deutsch':
                        return "de";
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
                }
            };
            
            /**
             * Artyom deliver the given message to the
             * user.
             * 
             * @param {string} message
             * @returns {undefined}
             */
            artyom.say = function(message,action){
                if (artyom.speechSupported()) {
                    var talk = function(text) {
                        var msg = new SpeechSynthesisUtterance();
                        msg.text = text;
                        msg.volume = artyomProperties.volume;
                        msg.rate = artyomProperties.speed;

                        if (artyomVoice) {
                            msg.voice = speechSynthesis.getVoices().filter(function(voice) { 
                                return voice.name == artyomVoice; 
                            })[0];
                        }

                        msg.onend = function(event) {
                            if(speechSynthesis.pending === false && speechSynthesis.speaking === false){
                                if(typeof(action) === "function"){
                                    action();
                                }
                            }
                        };

                        window.speechSynthesis.speak(msg);
                    };

                    if(typeof(message.length) !== "undefined"){
                        if(message.length > 0){
                            var finalTextA = message.split(",");
                            var finalTextB = message.split(".");

                            /**
                             * Leer el lote más extenso con el fin de evitar el 
                             * bloqueo de speechSynthesis si el texto es muy extenso.
                             */
                            if((finalTextA.length) > (finalTextB.length)){
                                finalTextA.forEach(function(chunk){
                                    if(chunk){
                                        talk(chunk);
                                    }
                                });
                            }else{
                                finalTextB.forEach(function(chunk){
                                    if(chunk){
                                        talk(chunk);
                                    }
                                });
                            }

                            artyom.triggerEvent("saySomething");

                        }else{
                            artyom.debug("Artyom expects a string to say ... none given.",'warn');
                        }
                    }else{
                        artyom.debug("Artyom expects a string to say ... undefined given.",'warn');
                    }
                }
            };
            
            /**
             * Test artyom in the browser
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
                    artyom.say("1,2,3,4,5,6,7,8,9,10. Well, all is in order here.",function(){
                        alert("The test of speech is over.");
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
                if ('speechSynthesis' in window) {
                    return true;
                }
                return false;
            };
            
            /**
             * verify if artyom can listen you or not.
             * 
             * @returns {Boolean}
             */
            artyom.recognizingSupported = function(){
                if ('webkitSpeechRecognition' in window) {
                    return true;
                }
                return false;
            };
            
            /**
             * Artyom awaits for orders when this function 
             * is executed.
             * 
             * If artyom gets a first parameter the instance will be stopped.
             * 
             * @returns {undefined}
             */
            artyom.hey = function(stop){
                    if(stop){
                        artyomProperties.recognizing = false;
                        reconocimiento.stop();
                        return;
                    }
                
                    var final_transcript = '';
                    var ignore_onend;
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
                            artyom.triggerEvent("error",{
                                code:"network",
                                message:"Artyom needs internet to work properly"
                            });
                        }
                        
                        if (event.error == 'no-speech') {
                            if(artyomProperties.continuous === false){
                                artyom.triggerEvent("info",{
                                    code:"info_no_speech",
                                    message:"Artyom didn't hear anything. It will take a break."
                                });
                            }
                            ignore_onend = true;
                        }
                        
                        if (event.error == 'audio-capture') {
                            artyom_is_allowed = false;
                            artyom.triggerEvent("error",{
                                code:"audio-capture",
                                message:"There's not any audiocapture device installed on this computer."
                            });
                            
                            ignore_onend = true;
                        }
                        
                        if (event.error == 'not-allowed') {
                            artyom_is_allowed = false;
                            
                            if (event.timeStamp - start_timestamp < 100) {
                                artyom.triggerEvent("error",{
                                    code:"info_blocked",
                                    message:"Artyom needs the permision of the microphone, is blocked."
                                });
                            } else {
                                artyom.triggerEvent("error",{
                                    code:"info_denied",
                                    message:"Artyom needs the permision of the microphone, is denied"
                                });
                            }
                            
                            
                            ignore_onend = true;
                        }
                    };
                    
                    /**
                     * El reconocimiento de voz finalizo, inicielo nuevamente
                     * 
                     * @returns {undefined}
                     */
                    reconocimiento.onend = function() {
                        
                        artyom.triggerEvent("FinishRecognition",{
                            code: "artyom_dont_listen",
                            message: "Artyom stop listening."
                        });
                        
                        if(artyomProperties.continuous === true){
                            if(artyom_is_allowed === true){
                                reconocimiento.start();
                                artyom.debug("Artyom initialization finished. Restarting","info");
                            }else{
                                console.error("Verify the microphone and check for the table of errors in sdkcarlos.github.io/artyom.html to solve your problem. If you want to give your user a message when an error appears add an artyom listener");
                            }
                        }
                        
                        artyomProperties.recognizing = false;
                        
                        if (ignore_onend) {
                            return;
                        }
                        
                        if (!final_transcript) {
                            return;
                        }
                    };
                    
                    /**
                     * Procesar cada reconocimiento de voz.
                     * 
                     * @param {type} event
                     * @returns {undefined}
                     */
                    reconocimiento.onresult = function(event){
                        var interim_transcript = '';
                        var cantidadResultados = event.results.length;
                        
                        artyom.triggerEvent("Recognition",{
                            code: "artyom_listen",
                            message: "Artyom is listening to you."
                        });
                        
                        if(artyomProperties.mode == "normal"){
                            for (var i = event.resultIndex; i < cantidadResultados; ++i) {	
                                var identificated = event.results[i][0].transcript;
                                if (event.results[i].isFinal) {
                                    var comando = artyom.execute(identificated.trim());

                                    interim_transcript += event.results[i][0].transcript;

                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in normal mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;

                                        //Execute function and send parameters when executing
                                        
                                        if(comando.wildcard){
                                            console.log(comando);
                                            comando.objeto.action(comando.indice,comando.wildcard.item,comando.wildcard.full);
                                        }else{
                                            comando.objeto.action(comando.indice);
                                        }

                                        break;
                                    }
                                }else{
                                    artyom.debug("Normal mode : " + identificated);
                                }
                            }
                        }else if(artyomProperties.mode == "quick"){
                            for (var i = event.resultIndex; i < cantidadResultados; ++i) {	
                                var identificated = event.results[i][0].transcript;

                                if (!event.results[i].isFinal) {
                                    var comando = artyom.execute(identificated.trim());

                                    interim_transcript += event.results[i][0].transcript;

                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in quick mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;

                                        //Execute function and send parameters when executing
                                        if(comando.wildcard){
                                            comando.objeto.action(comando.indice,comando.wildcard.item);
                                        }else{
                                            comando.objeto.action(comando.indice);
                                        }

                                        break;
                                    }
                                }else{
                                    var comando = artyom.execute(identificated.trim());

                                    if((comando !== false) && (artyomProperties.recognizing == true)){
                                        artyom.debug("<< Executing Matching Recognition in quick mode>>");
                                        reconocimiento.stop();
                                        artyomProperties.recognizing = false;

                                        //Execute function and send parameters when executing
                                        comando.objeto.action(comando.indice);

                                        break;
                                    }
                                }
                                
                                artyom.debug("Complex mode : " + identificated);
                            }
                        }
                    };
                    
                    if(artyomProperties.recognizing){
                        reconocimiento.stop();
                        artyom.debug("Reconocimiento de voz detenido.");
                    }else{
                        try{
                            reconocimiento.start();
                            ignore_onend = false;
                        }catch(e){
                            artyom.notice({
                                callback : function(){
                                    alertify.notify('Restart', 'custom', 15, function(){
                                        location.reload();
                                    });
                                },
                                es : "Error fatal 01: Ya hay una instancia de artyom ejecutandose. Es recomendable reiniciar la conexión. Haga clic en el banner para reiniciarla ahora.",
                                de : "Schwerwiegender Fehler 01: Es gibt bereits eine Instanz von artyom laufen in die background.It ist empfehlenswert, um die Verbindung neu starten Klicken Sie auf das Banner, um die Verbindung neu zu starten.",
                                en : "Fatal Error 01 :There's already a instance of me running in the background sor. It's recommendable to restart the connection. Click the banner to restart the connection"
                            });
                        }
                    }
            };
            
            
            /**
             * Simulate a voice command via JS
             * 
             * @param {type} sentence
             * @returns {undefined}
             */
            artyom.doInstruction = function(sentence){
                if((!sentence) || (typeof(sentence) !== "string")){
                    console.warn("Cannot execute a non string command");
                    return;
                }
                var a = artyom.execute(sentence);
                if(typeof(a) === "object"){
                    if(a.objeto){
                        a.objeto.action(a.indice);
                    }
                }else{
                    console.warn("No command founded trying with "+sentence);
                }
            };
            
            /**
             * Returns an object with data of the matched element
             * 
             * @param {string} comando
             * @returns {Boolean || Function}
             */
            artyom.execute = function(voz){
                if(!voz){console.log("Ejecución de comando vacío.");return false;}
                
                artyom.debug(">> " +voz);//Show tps in consola
                
                 /** @3
                 * Artyom needs time to think that
                 */
                for (var i = 0; i < allCommands.length; i++) {
                    var instruction =  allCommands[i];
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
                            
                            //FIN SMART COMMAND
                        }else{
                            console.warn("Founded command marked as SMART but have no wildcard in the indexes, remove the SMART for prevent extensive memory consuming or add the wildcard *");
                        }
                        
                        if((encontrado >= 0)){
                            //console.info(">> Matching full wildcard | "+before + " AND "+ later);
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
                for (var i = 0; i < allCommands.length; i++) {
                    var instruction =  allCommands[i];
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
                
                
                /** @2
                 * Search for index match of command if nothing matches try then
                 * with the smart commands
                 */
                for (var i = 0; i < allCommands.length; i++) {
                    var instruction =  allCommands[i];
                    var opciones = instruction.indexes;
                    var encontrado = -1;

                    /**
                     * Execution of match with index
                     */
                    for (var c = 0; c < opciones.length; c++) {
                        var opcion = opciones[c];
                        if(instruction.smart){
                            continue;//Jump wildcard commands
                        }

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
                }//End @2
                 
                return false;
            };
            
            /**
             * Activate browser fullscreen
             * 
             * @returns {undefined}
             */
            artyom.fullscreen = function(){
                if ((document.fullScreenElement && document.fullScreenElement !== null) ||(!document.mozFullScreen && !document.webkitIsFullScreen)) {            
                    if (document.documentElement.requestFullScreen) {
                        document.documentElement.requestFullScreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullScreen) {
                        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                } else {
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                }
            };
            
            /**
             * Shorthand functions
             */
            
            //If @global[debug] == true | Display a message in the console.
            artyom.debug=function(e,o){if(artyomProperties.debug===!0)switch(o){case"error":console.error(e);break;case"warn":console.warn(e);case"info":console.info(e);break;default:console.log(e)}};
            
            /**
             * Artyom Microcomparator library
             */
            artyom.is = {
                active : function(){
                    if(localStorage.getItem("artyom")){
                        return true;
                    }else{
                        return false;
                    }
                },
                integer:function(a){return Number(a)===a&&0===a%1},"float":function(a){return a===Number(a)&&0!==a%1},"function":function(a){return"function"==typeof a?!0:!1},object:function(a){return"object"==typeof a?!0:!1},"boolean":function(a){return"boolean"==typeof a?!0:!1},array:function(a){return a.constructor===Array?!0:!1},number:function(a){return a===parseFloat(a)},odd:function(a){return artyom.is.number(a)&&1===Math.abs(a)%2},even:function(a){return artyom.is.number(a)&&0===a%2},jQueryObject:function(a){return a instanceof jQuery?!0:!1},
            };
            
            artyom.detectErrors = function(callback){
                navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (navigator.getUserMedia) {
                    navigator.getUserMedia({ audio: true },
                        function(stream) {
                            callback(null);
                        },
                        function(err) {
                            callback(err);
                        }
                    );
                } else {
                    console.log("Artyom cant detect errors in this browser.");
                }
                
                return false;
            };
            
            artyom.sayRandom = function(data){
                if(data instanceof Array){
                    artyom.say(data[Math.floor(Math.random() * data.length)]);
                }else{
                    console.error("Random quotes must be in an array !");
                }
            };
            
        return artyom;
    }
    
    if(typeof(artyom) === 'undefined'){
        window.artyom = ArtyomAI();
    }
})(window);
