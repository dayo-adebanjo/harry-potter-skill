/*var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
};*/

var hp_books = {
    "harry potter and the sorcerers stone" : {
        "description": "In this book, Harry discovers he is a wizard and heads to Hogwarts for the first time",
        "series_num": "first" 
    }, 
    "harry potter and the chamber of secrets" : {
        "description": "In this book, Harry heads back to Hogwarts for his second year, where mysterious things are stirring",
        "series_num": "second" 
    }, 
    "harry potter and the prizoner of azkaban" : {
        "description": "In this book, Hogwarts is shaken by the mysterious tales of a Sirius Black, the escaped convict",
        "series_num": "third" 
    }, 
    "harry potter and the goblet of fire" : {
        "description": "In this book, Harry fights for his life in the Triwizard Tournament, a dangerous competition he has been unwillingly thrown into",
        "series_num": "fourth" 
    }, 
    "harry potter and the order of the phoenix" : {
        "description": "In this book, Harry butts heads with the new and arguably insane Dolores Umbridge",
        "series_num": "fifth" 
    }, 
    "harry potter and the half blood prince" : {
        "description": "In this book, Harry finds a mysterious textbook and delves into the ast of his greatest enemy",
        "series_num": "sixth" 
    }, 
    "harry potter and the deathly hallows" : {
        "description": "This is the last book. I don't want to ruin it for you. You should maybe buy it.",
        "series_num": "seventh" 
    }, 
}


// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

    if (event.session.application.applicationId !== "AMAZON_ID_HERE") {
        context.fail("Invalid Application ID");
     }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    // add any session init logic here
}

/**
 * Called when the user invokes the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    getWelcomeResponse(callback)
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    var intent = intentRequest.intent
    var intentName = intentRequest.intent.name;

    // dispatch custom intents to handlers here
    if (intentName == "HPBooksIntent") {
        handleHPBooksResponse(intent, session, callback)
    } else if (intentName == "HPFactsIntent") {
        handleHPFactsResponse(intent, session, callback)
    } else if (intentName == "AMAZON.YesIntent") {
        handleYesResponse(intent, session, callback)
    } else if (intentName == "AMAZON.NoIntent") {
        handleNoResponse(intent, session, callback)
    } else if (intentName == "AMAZON.HelpIntent") {
        handleGetHelpRequest(intent, session, callback)
    } else if (intentName == "AMAZON.StopIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else if (intentName == "AMAZON.CancelIntent") {
        handleFinishSessionRequest(intent, session, callback)
    } else {
        throw "Invalid intent"
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {

}

// ------- Skill specific logic -------

function getWelcomeResponse(callback) {
    var speechOutput = "I can help you sharpen your Harry Potter knowledge! Which book would you like to know about?"

    var reprompt = "Which book would you like to know about?"

    var header = "All About HP."

    var shouldEndSession = false

    var sessionAttributes = {
        "speechOutput" : speechOutput,
        "repromptText" : reprompt
    }

    callback(sessionAttributes, buildSpeechletResponse(header, speechOutput, reprompt, shouldEndSession))

}

function handleHPBooksResponse(intent, session, callback) {

    var hpBook = intent.slots.HPBook.value.toLowerCase()

    if (!hp_books[hpBook]) {
        var speechOutput = "That doesn't seem to be a Harry Potter book. Try another."
        var repromptText = "Try another book."
        var header = "Not a Harry Potter book"
    } else {
        var description = hp_books[hpBook].description
        var series_num = hp_books[hpBook].series_num
        var speechOutput = hpBook + " is the " + series_num + " book in the Harry Potter series. " + description +
        ". Do you want to hear about another book?"    
        var repromptText = "Do you want to hear about another book?"
        var header = capitalizeFirst(hpBook)
    }

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))
}

function handleHPFactsResponse(intent, session, callback) {

    var speechOutput = "Harry Potter is a series of fantasy novels written by British author JK Rowling. " +
    "There are seven books in the series. Which would you like to hear about?" 
    var repromptText = "Which book would you like to hear about?"
    var header = "Harry Potter Introductions"

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponse(header, speechOutput, repromptText, shouldEndSession))

}

function handleYesResponse(intent, session, callback) {
    var speechOutput = "Great! Which book would you like to hear about?"
    var repromptText = speechOutput
    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))
}

function handleNoResponse(intent, session, callback) {
    handleFinishSessionRequest(intent, session, callback)
}

function handleGetHelpRequest(intent, session, callback) {
    // Ensure that session.attributes has been initialized
    if (!session.attributes) {
        session.attributes = {};
    }

    var speechOutput = "I can tell you about any of the Harry Potter books" +
    "Which would you like to hear about? Remember, I can only give facts about one book at a time." 

    var repromptText = speechOutput

    var shouldEndSession = false

    callback(session.attributes, buildSpeechletResponseWithoutCard(speechOutput, repromptText, shouldEndSession))

}

function handleFinishSessionRequest(intent, session, callback) {
    // End the session with a "Good bye!" if the user wants to quit the game
    callback(session.attributes,
        buildSpeechletResponseWithoutCard("Good bye!", "", true));
}


// ------- Helper functions to build responses for Alexa -------


function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseWithoutCard(output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

function capitalizeFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}
