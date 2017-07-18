interface ArtyomCommand {
    indexes: Array<any>;
    action: Function;
    description ?: string;
    smart ?: Boolean;
}

interface ArtyomFlags {
    restartRecognition ?: Boolean
}

interface ArtyomVoice { 
    voiceURI: string;
    name: string;
    lang: string;
    localService: boolean;
    default: boolean; 
}

interface ArtyomGlobalEvents {
    ERROR: string;
    SPEECH_SYNTHESIS_START: string;
    SPEECH_SYNTHESIS_END: string;
    TEXT_RECOGNIZED: string;
    COMMAND_RECOGNITION_START : string;
    COMMAND_RECOGNITION_END: string;
    COMMAND_MATCHED: string;
    NOT_COMMAND_MATCHED: string;
}

interface SayCallbacksObject {
    lang?: string;
    onStart?: Function;
    onEnd?: Function;
}

interface ArtyomProperties {
    lang: string;
    recognizing?: boolean;
    continuous?: boolean;
    speed?: number;
    volume?: number;
    listen: boolean;
    mode?: string;
    debug?: boolean;
    helpers?: {
        fatalityPromiseCallback?: any;
        redirectRecognizedTextOutput?: any;
        remoteProcessorHandler?: any;
        lastSay?: any;
    };
    executionKeyword?: string;
    obeyKeyword?: string;
    speaking?: boolean;
    obeying?: boolean;
    soundex?: boolean;
    name?: string;
}

interface PromptOptions {
    question: string;
    options: any;
    beforePrompt?: Function;
    onStartPrompt?: Function;
    onEndPrompt?: Function;
    onMatch?: Function;
    smart?: Boolean;
}

interface MatchedCommand {
    index: number;
    instruction: ArtyomCommand;
    wildcard?: any;
}

interface IDevice {
    isChrome?: Boolean;
    isMobile?: Boolean;
}