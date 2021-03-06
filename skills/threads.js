//
// Illustrates a muti-threaded conversation
//
// Q: "What about coffee (yes / no / cancel)"
// A: no
// Q: "What would you like to drink?"
// A: Coke
//
module.exports = function (controller) {

    controller.hears([/^threads$/], 'direct_message,direct_mention', function (bot, message) {

        bot.startConversation(message, function (err, convo) {

            convo.ask("What about coffee (yes/**no**/cancel)", [
                {
                    pattern: "yes|yeh|sure|oui|si",
                    callback: function (response, convo) {
                        convo.say("Go, get some !");
                        convo.next();
                    },
                }
                , {
                    pattern: "no|neh|non|na|birk",
                    callback: function (response, convo) {
                        convo.gotoThread('ask_drink');
                    },
                }
                , {
                    pattern: "cancel|stop|exit",
                    callback: function (response, convo) {
                        convo.say("Got it, cancelling...");
                        convo.next();
                    },
                }
                , {
                    default: true,
                    callback: function (response, convo) {
                        // We've got 2 options at this point:

                        // 1. simply repeat the question
                        //convo.repeat();
                        //convo.next();

                        // 2. or provide extra info, then repeat the question
                        convo.gotoThread("bad_response");
                    }
                }
            ]);

            // Bad response
            convo.addMessage({
                text: "Sorry, I did not understand!<br/>_Tip: try 'yes', 'no' or 'cancel._'",
                action: 'default', // goes back to the thread's current state, where the question is not answered
            }, 'bad_response');

            // Thread: ask for a drink
            convo.addQuestion('What would you like to drink?', function (response, convo) {
                convo.say(`I love '${response.text}' too`);
                convo.next();
            }, {}, 'ask_drink');
        });
    });
};
