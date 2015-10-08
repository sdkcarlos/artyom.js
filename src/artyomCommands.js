/**
 * artyom.js can't do anything without commands , this file will set up
 * artyom for it's final use
 * 
 * @dependencies [artyom.js]
 * @copyright 2015, Deutschland.
 * @author Carlos Delgado
 * @param {type} window
 * @Description Artyom JS Core - See Documentation for further information
 * @see http://sdkcarlos.github.io/artyom.html
 * @ignore 08.10.2015 17:17
 * @returns {object}
 */

(function(window){
    'use strict';
    
    /**
     * Example Artyom Commands
     * @type Array
     */
    var artyomCommands = [
        //Simple Command Example
        {
            indexes: ['hello'],
            action : function(i){
                artyom.say("How's going !");
            }
        },
        //Smart Command Example
        {
            indexes: ['pronunciate * please'],
            smart:true,
            action : function(i){
                artyom.say("How's going !");
            }
        }
        //Continue adding your own commands here
    ];
    
    artyom.addCommands(artyomCommands);
})(window);