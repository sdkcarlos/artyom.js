<p align="center">
  <img src="https://raw.githubusercontent.com/sdkcarlos/artyom.js/master/src/images/artyomjs-logo.png" width="256" title="Artyom logo">
</p>

#About Artyom

Artyom.js is a robust and useful wrapper of the webkitSpeechRecognition and speechSynthesis APIs written in Javascript.
Besides, artyom allow you to add dinamically commands to your web app (website).

Artyom is constantly updated with new gadgets and awesome features, star and watch this repository to be aware of artyom updates.

Between the most known features of artyom are :

### Speech Recognition

- Quick recognition of voice commands.
- Add commands easily.
- Smart commands (usage of wildcards).
- Create a dictation object to convert easily voice to text.
- Simulate commands without microphone.
- Execution keyword to execute a command immediately after the use of the keyword.
- Pause and resume command recognition.
- Artyom has available the soundex algorithm to increase the accuracy of the recognition of commands (disabled by default).
- Use a remote command processor service instead of local processing with Javascript.

### Voice Synthesis

- Synthesize large blocks of text without.
- onStart and onEnd callbacks will be always executed.

#Installation

#### NPM

```batch
npm install artyom.js
```

#### Bower

```batch
bower install artyom.js
```
Or just download a .zip package with the source code, minified file and commands examples : [download .zip file](https://github.com/sdkcarlos/artyom.js/raw/master/public/artyom-source.zip)

# Languages

Artyom provides **complete** support for the following languages. Every language needs an initialization code that needs to be provided in the lang property at the initialization.

| |Description |Codes for initialization|
------------- | ------------- | ------------- |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-usa.png" alt="Supported language"/>| English (USA)<br/>English (Great Britain) Great Britain <br/> United States of America | en-US<br/>en-GB<br/>en |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-spanish.png" alt="Supported language"/>| Español |es-CO<br/>es-ES<br/>es |
|<img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-german.png" alt="Supported language"/>| Deutsch | de-DE<br/>de |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-italy.png" alt="Supported language"/> | Italiano |it-IT |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-france.png" alt="Supported language"/> | Français |fr-FR<br/>fr |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-japan.png" alt="Supported language"/> | Japanese 日本人 | ja-JP<br/>jp |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-russia.png" alt="Supported language"/> | Russian | ru-RU<br/>ru |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-brasil.png" alt="Supported language"/> | Brazil | pt-PT<br/>pt |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-netherlands.png" alt="Supported language"/> | Dutch (netherlands)| nl-NL<br/>nl |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-poland.png" alt="Supported language"/> | Polski (polonia)| pl-PL<br/>pl |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-indonesia.png" alt="Supported language"/> | Indonesian (Indonesia)| id-ID<br/>id |
| <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/flag-china.png" alt="Supported language"/> | Chinese (Cantonese[ 粤語（香港）] <br/> Mandarin[普通话（中国大陆）])| Cantonese<br/>zh-HK<br/> Mandarin<br />zh-CN|

# All you need to know about Artyom

- [Documentation](http://ourcodeworld.com/projects/projects-documentation/1/list/artyom-js)
- [Frequently Asked Questions](http://ourcodeworld.com/projects/projects-faq/1/list/artyom-js)
- [Changelog](http://ourcodeworld.com/projects/projects-documentation/2/read-doc/official-changelog/artyom-js)

Do not hesitate to create a ticket on the issues area of the Github repository for any question, problem or inconvenient that you may have about artyom.

# Basic usage

```javascript
// Add command (Short code artisan way)
artyom.on(['Good morning','Good afternoon']).then(function(i){
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
artyom.on(['Repeat after me *'] , true).then(function(i,wildcard){
    artyom.say("You've said : " + wildcard);
});

// or add some commands in the normal way

artyom.addCommands([
    {
        indexes: ['Hello','Hi','is someone there'],
        action: function(i){
            artyom.say("Hello, it's me");
        }
    },
    {
        indexes: ['Repeat after me *'],
        smart:true,
        action: function(i,wildcard){
            artyom.say("You've said : "+ wildcard);
        }
    }
]);

// Start the commands !
artyom.initialize({
    lang:"en-GB", // GreatBritain english
    continuous:true, // Listen forever
    soundex:true,// Use the soundex algorithm to increase accuracy
    debug:true, // Show messages in the console
    executionKeyword: "and do it now",
    listen:true // Start to listen commands !
});
```

Working with artyom is cool and easy, read the documentation to discover more awesome features.

# Demostrations

- [Homepage](https://sdkcarlos.github.io/jarvis.html)
- [Continuous mode J.A.R.V.I.S](https://sdkcarlos.github.io/jarvis.html)
- [Sticky Notes](https://sdkcarlos.github.io/demo-sites/artyom/artyom_sticky_notes.html)


Thanks for visit the repository !

<p align="center">
  <img src="https://raw.githubusercontent.com/sdkcarlos/sdkcarlos.github.io/master/sites/artyom-resources/images/artyom_make_sandwich.jpg" alt="Artyom example use" width="256"/>
</p>
