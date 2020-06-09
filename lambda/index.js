const Alexa = require('ask-sdk');
const ddbAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const talk = require('./talk')

let storage = null

// Session Data Definition
let session = {
  // Skill can do diagnosis when all attributes was collected.
  diagnosisAttributes: {
    coffee: '',
    withMilk: '',
    withSugar: ''
  }
}

const RequestInterceptor = {
  async process(handlerInput) {
    const { attributesManager } = handlerInput;
    storage = await attributesManager.getPersistentAttributes() || {};
    session = attributesManager.getSessionAttributes();

    try {
      if (Object.keys(session).length === 0) {
        attributesManager.setSessionAttributes(session)      
      }
    } catch (error) {
      console.log(error)
      attributesManager.setSessionAttributes(session)  
    }
    console.log('storage:', storage)
    console.log('session:', session)
  }
};

const ResponseInterceptor = {
  async process(handlerInput) {
    storage.visit += 1
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
  const ret = {}
  index.forEach(
    key => {
      try {
        const value = Alexa.getSlot(handlerInput.requestEnvelope, key).resolutions.resolutionsPerAuthority[0].values[0].value.id
        ret[key] = value
      } catch (e) {
        console.log('not exist slot:', key, e)
      }
    }
  )
  return ret
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

      // [シチュエーション] コーヒーがオーダーされてない 
      && !session.diagnosisAttributes || !session.diagnosisAttributes.coffee
  },
  async handle(handlerInput) {
    session.diagnosisAttributes = getSynonymValues(handlerInput, ['coffee', 'withMilk', 'withSugar'])
    console.log('slot values:', session.diagnosisAttributes)
    return talk.diagnosisRequest(handlerInput.responseBuilder, session.diagnosisAttributes)
  }
};

const MilkAndSugarRequestIntent = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' 
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MilkAndSugarRequestIntent'
      // [シチュエーション] ユーザーはコーヒーに砂糖がミルクを入れるか聞かれている
      && session.diagnosisAttributes.coffee
  },
  async handle(handlerInput) {
    const values = getSynonymValues(handlerInput, ['withMilk', 'withSugar'])
    Object.keys(values).forEach(key => {
      session.diagnosisAttributes[key] = values[key]
    })
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
