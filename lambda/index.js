const Alexa = require('ask-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter'); // included in ask-sdk
const talk = require('./talk')

let storage = null
let session = null

const INDEX = {
  coffee: 0,
  milk: 1,
  sugar: 2
}

const RequestInterceptor = {
  async process(handlerInput) {
    const { attributesManager } = handlerInput;
    storage = await attributesManager.getPersistentAttributes() || {};
    session = attributesManager.getSessionAttributes();

    if (Object.keys(session).length === 0) {
      session = {}
      attributesManager.setSessionAttributes(session)      
    }
    console.log(session)
  }
};

const ResponseInterceptor = {
  async process(handlerInput) {
    storage.visit = 1
    const { attributesManager } = handlerInput;
    await attributesManager.savePersistentAttributes(storage);
    attributesManager.setSessionAttributes(session);
  }
};

function getPersistenceAdapter(tableName) {
  return new ddbAdapter.DynamoDbPersistenceAdapter({
    tableName: tableName,
    createTable: true
  });
}

function getSynonymValues(handlerInput, index) {
  const values = index.map(
    key => {
      try {
        return Alexa.getSlot(handlerInput.requestEnvelope, key).resolutions.resolutionsPerAuthority[0].values[0].value.name
      } catch (e) {
        console.log(e)
      }
    }
  )
  return values
}

const LaunchRequest = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  async handle(handlerInput) {
    return talk.launch(handlerInput.responseBuilder, storage)
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return talk.exit(handlerInput.responseBuilder)
  },
};

const SessionEndedRequest = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const HelpIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return talk.help(handlerInput.responseBuilder)
  }
};

const UnhandledIntent = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    return talk.unhandled(handlerInput.responseBuilder)
  },
};

const DiagnosisRequestIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DiagnosisRequestIntent'

      // coffeeを頼んでない状態
      && !session.diagnosisAttributes[INDEX.coffee]
  },
  async handle(handlerInput) {
    session.diagnosisAttributes = getSynonymValues(handlerInput, ['coffee', 'withMilk', 'withSugar'])
    return talk.diagnosisRequest(handlerInput.responseBuilder, session.diagnosisAttributes)
  }
};

const MilkAndSugarRequestIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MilkAndSugarRequestIntent'
      && session.diagnosisAttributes[INDEX.coffee]
  },
  async handle(handlerInput) {
    const values = getSynonymValues(handlerInput, ['milk', 'sugar'])

    // Situationを更新
    session.diagnosisAttributes[1] = values[0]
    session.diagnosisAttributes[2] = values[1]
    return talk.milkAndSugarRequest(handlerInput.responseBuilder, session.diagnosisAttributes) 
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);

    return talk.error(handlerInput.responseBuilder, session.diagnosisAttributes)
  },
};

const FallbackHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent');
  },
  handle(handlerInput) {
    return talk.fallback(handlerInput.responseBuilder)
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .withPersistenceAdapter(getPersistenceAdapter('AlexaCoffeeDiagnosis'))
  .addRequestHandlers(
    LaunchRequest,
    ExitHandler,
    SessionEndedRequest,
    HelpIntent,
    DiagnosisRequestIntent,
    MilkAndSugarRequestIntent,
    FallbackHandler,
    UnhandledIntent,
  )
  .addRequestInterceptors(RequestInterceptor)
  .addErrorHandlers(ErrorHandler)
  .addResponseInterceptors(ResponseInterceptor)
  .lambda();
