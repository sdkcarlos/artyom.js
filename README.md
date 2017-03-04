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
- [Development](#development)
    * [Testing](#testing)
    * [Programming with Artyom](#programming-with-artyom)
- [Languages](#languages)
- [All you need to know about Artyom](#all-you-need-to-know-about-artyom)
- [Demonstrations](#demostrations)
- [Basic usage](#basic-usage)
    * [With just plain JavaScript](#with-just-plain-javascript)
    * [With Angular2 (TypeScript)](#with-angular2-typescript)
- [Thank-you note](#thank-you-note)

# About Artyom

Artyom.js is a robust and useful wrapper of the webkitSpeechRecognition and speechSynthesis APIs. Besides, artyom allows you to add dynamic commands to your web app (website).

Artyom is constantly updated with new gadgets and awesome features, star and watch this repository to be aware of artyom updates.

The most known features of artyom are:

### Speech Recognition

- Quick recognition of voice commands.
- Add commands easily.
- Smart commands (usage of wildcards).
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

# Development

If you're interested in modify, work with Artyom or *you just simply want to test it quickly in your environment* we recommend you to use the little Sandbox utility of Artyom. Using Node.js the Artyom Sandbox creates an HTTPS server accessible at https://localhost:8443, here artyom will be accesible in Continuous mode too.

Start by cloning the repository of artyom:

```bash
git clone https://github.com/sdkcarlos/artyom.js/
cd artyom.js
```

Install the dependencies:

```bash
npm install
```

#### Testing

If you only want to test Artyom.js, then you can simply navigate to the  `/development` folder and execute:

```bash
cd development
node server.js
```

#### Programming with Artyom

If you are interested in programming with Artyom, then you need to install [nodemon](https://github.com/remy/nodemon) globally using:

```bash
npm install -g nodemon
```

Nodemon will restart the server automatically everytime you make changes in Artyom or any file inside `/development`. Then start the sandbox using:

```bash
npm run sandbox
```

With any of the previous methods, navigate to `https://localhost:8443` and explore artyom in your browser. You can directly debug the sandbox from mobile devices in the Local Area Network ([read this article for more information](http://ourcodeworld.com/articles/read/404/how-to-use-the-artyom-js-sandbox-on-lan-connected-devices)).

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

# All you need to know about Artyom

- [Documentation and FAQ](http://docs.ourcodeworld.com/projects/artyom-js)

Do not hesitate to create a ticket on the issues area of the Github repository for any question, problem or inconvenient that you may have about artyom.

# Demonstrations

- [Homepage](https://sdkcarlos.github.io/sites/artyom.html)
- [Continuous mode J.A.R.V.I.S](https://sdkcarlos.github.io/jarvis.html)
- [Sticky Notes](https://sdkcarlos.github.io/demo-sites/artyom/artyom_sticky_notes.html)

# Basic usage

Artyom it's written in Vanilla JS and TypeScript (Angular2):

## With just plain JavaScript

Artyom is built from plain JavaScript (old-fashion way), where all logic is wrapped with an IIFE without any module loader. Example of use with JavaScript:

```javascript
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
    }
]);

// Start the commands !
artyom.initialize({
    lang: "en-GB", // GreatBritain english
    continuous: true, // Listen forever
    soundex: true,// Use the soundex algorithm to increase accuracy
    debug: true, // Show messages in the console
    executionKeyword: "and do it now",
    listen: true // Start to listen commands !
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

## With Angular2 (TypeScript)

Artyom is also written in TypeScript (.js transpiled from .ts + its definition file -.d.ts) in order to improve the performance in
some parts of the library. In that case, the module loader used is CommonJS. Example of use with Angular2 & TypeScript:

```javascript
import * as Artyom from 'artyom.js';
let artyom = Artyom.ArtyomBuilder.getInstance();

// Add a command (not smart)
artyom.addCommands({
    description: 'Test command',
    indexes: ['hello', 'hi'],
    action: (i) => {
        console.log('hello action');
    }
});
```

or

```javascript
import { ArtyomBuilder } from 'artyom.js';
let artyom = ArtyomBuilder.getInstance();

// Add a smart command
artyom.addCommands({
    description: 'Test command 2',
    smart: true,
    indexes: ['test *'],
    action: (i, wildcard) => {
        console.log('wildcard: ', wildcard);
    }
});
```

Ather that import, you can follow the rest of the snippet in the previous section (artyom.addCommands({...}, artyom.initialize({...}), ...)). The
typescript definition file (.d.ts) is also published in [that PR](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/13947) to install it from
DefinitelyTyped (npm install --save-dev @types/artyom.js) and reference it from tsconfig.json.

Moreover, you can see another real example in that repository: [Angular2 & WebAudio](https://github.com/semagarcia/poc-angular2-webaudio)


# Thank-you note

Working with artyom is cool and easy, read the documentation to discover more awesome features.

Thanks for visit the repository !

<p align="center">
  <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/artyom_make_sandwich.jpg" alt="Artyom example use" width="256"/>
</p>