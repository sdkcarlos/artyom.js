(() => {

    window.SANDBOX = {
        checkIfLoaded: () => {
            if(typeof(window["artyom"]) != "object"){
                $("#check-if-loaded").removeClass("hidden");
                return false;
            }

            return true;
        },
        checkCommands: () => {
            SANDBOX.LOG(artyom.getAvailableCommands().length + " commands loaded");
        },
        loadCommands: () => {
            $('#command-table > tbody').empty();

            var commands = artyom.getAvailableCommands();
            var html;

            for (var i = 0; i < commands.length; i++) {
                var cm = commands[i];

                html += '<tr>';
                html += '<td>' + cm.indexes.join(",") + '</td>';
                html += '<td>' + cm.description + '</td>';
                html += '<td>' + (cm.smart || "no") + '</td>';
                html += '</tr>';

                $('#command-table > tbody').html(html);
            }
        },
        LOG: (message,type) => {
            var date = new Date();

            if(type){
                switch (type) {
                    case "error":case "ERROR":
                        type = 'style="background-color:red;color:white;"';
                    break;
                    case "info":case "INFO":
                        type = 'style="background-color:#2196f3;color:white;"';
                    break;
                    case "warning":case "WARNING":
                        type = 'style="background-color:#f3cf21;color:black;"';
                    break;
                }
            }

            var html = '<a href="javascript:void(0);" class="list-group-item remove-on-click" '+type+'>  ';
            html += message +" | " + date.toLocaleTimeString();
            html += "</a>";

            $("#log-panel").prepend(html);
        }
    };

    $(window).on("load",() => {
        var status = SANDBOX.checkIfLoaded();
        SANDBOX.checkCommands();
        SANDBOX.loadCommands();

        if(status){
            artyom.initialize({
                lang:"en-GB",
                continuous:true,
                debug:true,
                listen:true,
                obeyKeyword: "and do it now"
            }).then(() => {
                console.log("Artyom succesfully initialized");
            }).catch((err) => {
                console.error("Artyom couldn't be initialized: ", err);
            });
        }

        $("#btn-speak").click(() => {
            $("#btn-speak").attr("disabled","disabled");

            SANDBOX.LOG("Converting text to speech ... wait");

            artyom.say($("#sandbox-speech-synthesis").val(), {
                onStart: () => {
                    SANDBOX.LOG("Talking");
                },
                onEnd: () => {
                    $("#btn-speak").removeAttr("disabled");
                }
            });
        });

        $("#btn-stop").click(() => {
            artyom.shutUp();
            $("#btn-speak").removeAttr("disabled");
        });

        $("#voice-sim-trigger").click(() => {
            var cmd = $("#voice-sim-command").val();

            if(artyom.simulateInstruction(cmd)){
                SANDBOX.LOG("Command matched with simulation","info");
            }else{
                SANDBOX.LOG("No command found with simulation","warning");
            }
        });
    });

    $(document).on("click",".remove-on-click", (event) => {
        event.target.remove();
    });
})();
