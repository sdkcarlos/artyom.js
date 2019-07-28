# Update for Chrome 71

Due to abuse of users with the Speech Synthesis API (ADS, Fake system warnings), Google decided to remove the usage of the API in the browser when it's not triggered by an user gesture (click, touch etc.). This means that calling for example <code>artyom.say("Hello")</code> if it's not wrapped inside an user event won't work.

So on every page load, the user will need to click at least once time per page to allow the usage of the API in the website, otherwise the following exception will be raised: "[Deprecation] speechSynthesis.speak() without user activation is no longer allowed since M71, around December 2018. See https://www.chromestatus.com/feature/5687444770914304 for more details"

For more information, visit the bug or [this entry in the forum](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/WsnBm53M4Pc). To bypass this error, the user will need to interact manually with the website at least once, for example with a click:

```html
<button id="btn">Allow Voice Synthesis</button>
<script src="artyom.window.js"></script>
<script>
    var Jarvis = new Artyom();
    
    // Needed user interaction at least once in the website to make
    // it work automatically without user interaction later... thanks google .i.
    document.getElementById("btn").addEventListener("click", function(){
        Jarvis.say("Hello World !");
    }, false);
</script>
```

<p align="center">
    <img src="https://raw.githubusercontent.com/sdkcarlos/artyom.js/master/public/images/artyomjs-logo.png" width="256" title="Artyom logo">
</p>

# Table of Contents
- [About Artyom](#about-artyom)
    * [Speech Recognition](#speech-recognition)
    * [Voice Synthesis](#voice-synthesis)
- [Installation](#installation)
    * [NPM](#npm)
    * [Bower](#bower)
- [How to use](#how-to-use)
- [Basic usage](#basic-usage)
- [All you need to know about Artyom](#all-you-need-to-know-about-artyom)
- [Development](#development)
    * [Building Artyom from source](#building-artyom-from-source)
    * [Testing](#testing)
- [Languages](#languages)
- [Demonstrations](#demonstrations)
- [Thanks](#thanks)

# About Artyom

Artyom.js is a robust and useful wrapper of the webkitSpeechRecognition and speechSynthesis APIs. Besides, artyom allows you to add dynamic commands to your web app (website).

Artyom is constantly updated with new gadgets and awesome features, so be sure to star and watch this repository to be aware of any update. The main features of Artyom are:

### Speech Recognition

- Quick recognition of voice commands.
- Add commands easily.
- Smart commands (usage of wildcards and regular expressions).
- Create a dictation object to convert voice to text easily.
- Simulate commands without microphone.
- Execution keyword to execute a command immediately after the use of the keyword.
- Pause and resume command recognition.
- Artyom has available the soundex algorithm to increase the accuracy of the recognition of commands (disabled by default).
- Use a remote command processor service instead of local processing with Javascript.
- Works both in desktop browser and mobile device.

### Voice Synthesis

- Synthesize extreme huge blocks of text (+20K words according to the last test).
- onStart and onEnd callbacks **will be always executed independently of the text length**.
- Works both in desktop browser and mobile device.

Read [the changelog to be informed about changes and additions in Artyom.js](http://docs.ourcodeworld.com/projects/artyom-js/documentation/getting-started/official-changelog)

# Installation

#### NPM

```batch
npm install artyom.js
```

#### Bower

```batch
bower install artyom.js
```

Or just download a .zip package with the source code, minified file and commands examples : [download .zip file](https://github.com/sdkcarlos/artyom.js/raw/master/public/artyom-source.zip)


# How to use

Artyom is totally written in TypeScript, but it's transpiled on every version to JavaScript. 2 files are built namely `artyom.js` (used with Bundlers like Webpack, Browserify etc.) and `artyom.window.js` (only for the web browser). As everyone seems to use a bundler nowadays, for  the module loader used is CommonJS:

```javascript
// Using the /build/artyom.js file
import Artyom from './artyom.js';

const Jarvis = new Artyom();

Jarvis.say("Hello World !");

```

Alternatively, if you are of the old school and just want to use it with a script tag, you will need to use the `artyom.window.js` file instead:

```html
<script src="artyom.window.js"></script>
<script>
    var Jarvis = new Artyom();

    Jarvis.say("Hello World !");
</script>
```

The source code of artyom handles a single TypeScript file `/source/artyom.ts`.

# Basic usage

Writing code with artyom is very simple:

```javascript

// With ES6,TypeScript etc
import Artyom from './artyom.js';

// Create a variable that stores your instance
const artyom = new Artyom();

// Or if you are using it in the browser
// var artyom = new Artyom();// or `new window.Artyom()`

// Add command (Short code artisan way)
artyom.on(['Good morning','Good afternoon']).then((i) => {
    switch (i) {
        case 0:
            artyom.say("Good morning, how are you?");
        break;
        case 1:
            artyom.say("Good afternoon, how are you?");
        break;            
    }
});

// Smart command (Short code artisan way), set the second parameter of .on to true
artyom.on(['Repeat after me *'] , true).then((i,wildcard) => {
    artyom.say("You've said : " + wildcard);
});

// or add some commandsDemostrations in the normal way
artyom.addCommands([
    {
        indexes: ['Hello','Hi','is someone there'],
        action: (i) => {
            artyom.say("Hello, it's me");
        }
    },
    {
        indexes: ['Repeat after me *'],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    // The smart commands support regular expressions
    {
        indexes: [/Good Morning/i],
        smart:true,
        action: (i,wildcard) => {
            artyom.say("You've said : "+ wildcard);
        }
    },
    {
        indexes: ['shut down yourself'],
        action: (i,wildcard) => {
            artyom.fatality().then(() => {
                console.log("Artyom succesfully stopped");
            });
        }
    },
]);

// Start the commands !
artyom.initialize({
    lang: "en-GB", // GreatBritain english
    continuous: true, // Listen forever
    soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    executionKeyword: "and do it now",
    listen: true, // Start to listen commands !

    // If providen, you can only trigger a command if you say its name
    // e.g to trigger Good Morning, you need to say "Jarvis Good Morning"
    name: "Jarvis" 
}).then(() => {
    console.log("Artyom has been succesfully initialized");
}).catch((err) => {
    console.error("Artyom couldn't be initialized: ", err);
});

/**
 * To speech text
 */
artyom.say("Hello, this is a demo text. The next text will be spoken in Spanish",{
    onStart: () => {
        console.log("Reading ...");
    },
    onEnd: () => {
        console.log("No more text to talk");

        // Force the language of a single speechSynthesis
        artyom.say("Hola, esto está en Español", {
            lang:"es-ES"
        });
    }
});
```

# All you need to know about Artyom

- [Documentation and FAQ](http://docs.ourcodeworld.com/projects/artyom-js)

Do not hesitate to create a ticket on the issues area of the Github repository for any question, problem or inconvenient that you may have about artyom.

# Development

## Building Artyom from source

On every update, we build the latest version that can be retrieved from `/build` (for the browser and module). However, if you are willing to create your own version of Artyom, you would just need to modify the source file `/source/artyom.ts` and generate the build files using the following commands.

If you want to create the Browser version, you will need as first remove the `export default` keywords at the beginning of the class and run then the following command:

```bash
npm run build-artyom-window
```

If you want to create the Module version with CommonJS (for webpack, browserify etc) just run:

```bash
npm run build-artyom-module
```

## Testing

If you're interested in modify, work with Artyom or *you just simply want to test it quickly in your environment* we recommend you to use the little Sandbox utility of Artyom. Using Webpack the Artyom Sandbox creates an HTTPS server accessible at https://localhost:3000, here artyom will be accesible in Continuous mode too.

Start by cloning the repository of artyom:

```bash
git clone https://github.com/sdkcarlos/artyom.js/
cd artyom.js
```

Switch to the sandbox directory:

```bash
cd sandbox
```

Then install the dependencies:

```bash
npm install
```

And start the Webpack dev server using:

```bash
npm start
```

and finally access to the [https://localhost:3000](https://localhost:3000) address from your browser and you will see a little UI interface to interact with Artyom. This is only meant to work on Artyom, so it still in development.

# Languages

Artyom provides **complete** support for the following languages. Every language needs an initialization code that needs to be provided in the lang property at the initialization.

| |Description |Code for initialization|
------------- | ------------- | ------------- |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-usa.png" alt="Supported language"/>| English (USA)<br/>English (Great Britain) Great Britain| en-US<br/>en-GB |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-spanish.png" alt="Supported language"/>| Español | es-ES |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-german.png" alt="Supported language"/>| Deutsch (German) | de-DE |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-italy.png" alt="Supported language"/> | Italiano |it-IT |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-france.png" alt="Supported language"/> | Français |fr-FR |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-japan.png" alt="Supported language"/> | Japanese 日本人 | ja-JP |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-russia.png" alt="Supported language"/> | Russian | ru-RU |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-brasil.png" alt="Supported language"/> | Brazil | pt-PT |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-netherlands.png" alt="Supported language"/> | Dutch (netherlands)| nl-NL |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-poland.png" alt="Supported language"/> | Polski (polonia)| pl-PL |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-indonesia.png" alt="Supported language"/> | Indonesian (Indonesia)| id-ID |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-china.png" alt="Supported language"/> | Chinese (Cantonese[ 粤語（香港）] <br/> Mandarin[普通话（中国大陆）])| Cantonese<br/>zh-HK<br/> Mandarin<br />zh-CN|
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-hindi.png" alt="Supported language" />| Hindi (India) | hi-IN |

# Demonstrations

- [Homepage](https://sdkcarlos.github.io/sites/artyom.html)
- [Continuous mode J.A.R.V.I.S](https://sdkcarlos.github.io/jarvis.html)
- [Sticky Notes](https://sdkcarlos.github.io/demo-sites/artyom/artyom_sticky_notes.html)

# Thanks

Working with artyom is cool and easy, read the documentation to discover more awesome features.

Thanks for visit the repository !

<p align="center">
    <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/artyom_make_sandwich.jpg" alt="Artyom example use" width="256"/>
</p>
