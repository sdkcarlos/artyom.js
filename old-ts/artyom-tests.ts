import artyomjs = require('./artyom');

// Get an unique ArtyomJS instance
let artyom = artyomjs.ArtyomBuilder.getInstance();

// Add a command (not smart)
artyom.addCommands({
    description: 'Test command',
    indexes: ['hello', 'hi'],
    action: (i: number) => {
        console.log('Hello action');

        artyom.say("Hello World", {
            onEnd: () => {
                artyom.say("Hola Mundo", {
                    lang:"es-ES",
                });
            }
        });
    }
});

// Add a smart command
artyom.addCommands({
    description: 'Test command 2',
    smart: true,
    indexes: ['test *'],
    action: (i: number, wildcard: string) => {
        console.log('wildcard: ', wildcard);
    }
});

// Get the browser voices
artyom.getVoices();

// Get all supported languages for Artyom
artyom.getLanguage();

// Get the artyom.js version
artyom.getVersion();