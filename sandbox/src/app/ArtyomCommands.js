export default class ArtyomCommands{
    constructor(_InstanceArtyom){
        this.InstanceArtyom = _InstanceArtyom;
    }

    injectCommands(){
        let Jarvis = this.InstanceArtyom;

        Jarvis.addCommands([
            {
                indexes: ["Hello"],
                action: () => {
                    Jarvis.say("Hello");
                }
            },
            {
                description: "Restarts artyom with the initial configuration",
                indexes: ["Restart yourself", "Shut down yourself"],
                action: (i) => {
                    if(i == 0 ){
                        Jarvis.restart().then(() => {
                            Jarvis.say("Succesfully restarted sir");
                        });
                    }else{
                        Jarvis.say("Goodbye sir");
                        Jarvis.fatality();
                    }
                }
            },
        ]);
    }
}