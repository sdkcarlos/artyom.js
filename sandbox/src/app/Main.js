/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { deepOrange500 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Tabs, Tab } from 'material-ui/Tabs';
import Artyom from './artyom';
import ArtyomCommands from './ArtyomCommands';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

const muiTheme = getMuiTheme({
    palette: {
        accent1Color: deepOrange500,
    },
});

const Jarvis = new Artyom();

class Main extends Component {
    constructor(props, context) {
        super(props, context);
 
        this.handleInitializeArtyom = this.handleInitializeArtyom.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.showError = this.showError.bind(this);
        this.speakInputHandler = this.speakInputHandler.bind(this);
        this.speak = this.speak.bind(this);

        this.state = {
            btnActionText: "Start Artyom",
            artyomActive: false,
            btnArtyomActionDisabled: false,
            focusedTab: "a",
            snackbarOpen: false,
            snackbarMessage: "",
            speakTextInput: ""
        };

        let _this = this;

        // Add commands from the other file
        let CommandsInjector = new ArtyomCommands(Jarvis);
        CommandsInjector.injectCommands();

        window.Jarvis = Jarvis;


        Jarvis.redirectRecognizedTextOutput((recognized,isFinal) => {
            if(isFinal){
                // Nothing
                _this.setState({
                    recognizedText: ""
                }); 
            }else{
                // Nothing
                _this.setState({
                    recognizedText: recognized
                }); 
            }
        });

        Jarvis.when("ERROR", function(error){
            console.error(error);
            _this.showError(error.code + " " + error.message);
        });
    }
    
    showError(message){
        this.setState({
            snackbarMessage : message,
            snackbarOpen: true
        });
    }

    speak(){
        let txt = this.state.speakTextInput;
        Jarvis.say(txt);
    }

    handleTabChange (focusedTab){
        this.setState({
            focusedTab: focusedTab
        });
    }

    speakInputHandler(e, text){
        this.setState({
            speakTextInput: text
        });
    }

    handleInitializeArtyom(){
        let _this = this;

        this.setState({
            btnArtyomActionDisabled: true
        });

        if(this.state.artyomActive){
            Jarvis.fatality().then(() => {
                console.log("Artyom succesfully stopped");

                _this.setState({
                    btnActionText: "Start Artyom",
                    artyomActive: false,
                    btnArtyomActionDisabled: false
                });
            });
        }else{
            Jarvis.initialize({
                lang: "en-GB",
                continuous: true,
                debug: true,
                name: "Jarvis",
                listen: true
            }).then(() => {
                console.log("Artyom succesfully initialized");

                _this.setState({
                    btnActionText: "Stop Artyom",
                    artyomActive: true,
                    btnArtyomActionDisabled: false
                });
            }).catch(() => {

            });
        }
    }
 
    render() {
        const standardActions = (
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleRequestClose}
            />
        );

        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
               
                
                <Tabs
                    value={this.state.focusedTab}
                    onChange={this.handleTabChange}
                >
                    <Tab label="Voice Commands" value="a">
                         <div>
                            <h1>Artyom.js</h1>
                            <h2>Recognized text: {this.state.recognizedText}</h2>
                            <RaisedButton
                                disabled={this.state.btnArtyomActionEnabled}
                                label={this.state.btnActionText}
                                secondary={true}
                                onTouchTap={this.handleInitializeArtyom}
                            />
                            <br /><br />
                         </div>
                    </Tab>
                    <Tab label="Speech Synthesis" value="b">
                        <TextField
                            value={this.speakTextInput}
                            multiLine={true}
                            rows={2}
                            rowsMax={4}
                            id={"artyom-speech-field"}
                            onChange={this.speakInputHandler}
                        />
                        <RaisedButton
                            label="Speak"
                            secondary={true}
                            onTouchTap={this.speak}
                            
                        />
                    </Tab>
                </Tabs>


                    

                    <Snackbar
                        open={this.state.snackbarOpen}
                        message={this.state.snackbarMessage}
                        autoHideDuration={4000}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Main;