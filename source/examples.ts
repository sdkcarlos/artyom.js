import Artyom from './artyom';

// Create artyom instance
var Jarvis = new Artyom();

// Add some commands in batch
Jarvis.addCommands([
    {
        indexes: ["Hello", "Hi"],
        action: () => {
            Jarvis.say("Hello");
        }
    }
]);

// Add a single command with less lines
Jarvis.on(["Good Morning"]).then(() => {
    Jarvis.say("Good Morning !");
});

// Initialize and Start Artyom
Jarvis.initialize({
    debug: true,
    continuous: true,
    lang: "en-GB",
    listen: true
}).then(() => {
    console.log("Jarvis succesfully initialized");
}).catch(() => {
    console.log("Oops, something went wrong with your configuration ... ");
});

// Stop Artyom
setTimeout(() => {
    Jarvis.fatality().then(() => {
        console.log("Jarvis succesfully stopped !");
    }).catch(() => {
        console.log("Well, this shouldn't happen :) ... ");
    });
}, 5000);

// Restart Artyom
Jarvis.restart().then(() => {
    console.log("Artyom succesfully restarted with the same initialization configuration");
}).catch((err) => {
    console.error("Cannot restart", err);
});