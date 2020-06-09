const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');
jest.mock('ask-sdk-dynamodb-persistence-adapter')
const Alexa = require('ask-sdk')
const {
    sessionPart,
    launchRequestPart,
    coffeeRequestPart,
    coffeeRequestPartShortage,
    coffeeRequestPartSpecialItem,
    coffeeRequestPartSpecialItemWithSugar,
    milkAndSugarRequestPart
} = require('./requests')



const mockAttributeManager = (persistent, session) => {
    const spy = jest.spyOn(Alexa.AttributesManagerFactory, 'init').mockImplementation(() => {
        return {
            getPersistentAttributes: () => {
                return persistent 
            },
            getSessionAttributes: () => {
                return session
            },
            setSessionAttributes: () => {
                return session
            },
            savePersistentAttributes: () => {
                return true
            }
        }
    })
    return spy
}

describe('#index.js', () => {
    describe('welcome', () => {
        let request = {
            "version": "1.0",
            "session": sessionPart,
            "request": launchRequestPart
        }

        beforeEach(() => {
            jest.restoreAllMocks()
        })
        it('1st welcome', done => {
            mockAttributeManager({}, {}, {})
            const { handler } = require('../index')
            handler(request, {}, (err, data) => {
                try {
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /こんにちは。ご来店ありがとうございます。あなたのお好みのコーヒーから、あなたの性格を判定します。あなたの好きなコーヒーはなんですか？/
                    )
                    done()
                } catch (error) {
                    expect(null).toBe(true)
                    done(error) 
                }
            })
        })

        it('2nd welcome', done => {
            const { handler } = require('../index')
            mockAttributeManager({visit: 1}, {}, {})
            handler(request, {}, (err, data) => {
                try {
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /こんにちは。ご来店ありがとうございます。今日はどんなコーヒーを飲みますか/
                    )
                    done()
                } catch (error) {
                    expect(null).toBe(true)
                    done(error) 
                }
            })
        })
    });

    describe('Order coffee', () => {
        const { handler } = require('../index')
        let request = {
            "version": "1.0",
            "session": sessionPart,
            "request": coffeeRequestPart 
        }
        beforeEach(() => {
            jest.restoreAllMocks()
        })

        it ('could be gotten coffee and milk or sugar', done => {
            mockAttributeManager({}, {diagnosisAttributes: {}})
            handler(request, {}, (err, data) => {
                try {
                    console.log('response:', data) 
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /エスプレッソが好きなあなたは、とにかくカフェインを摂取したい人。とくにダブルのエスプレッソでカフェインを欲しているなら、ちょっと働きすぎ？かも。/
                    )
                    done()
                } catch (error) {
                    console.log('error:', error)
                    done()
                }
            })
        })

        it ('is shortage milk and sugar for diagnosis', done => {
            mockAttributeManager({}, {})
            request.request.intent.slots = coffeeRequestPartShortage
            handler(request, {}, (err, data) => {
                try {
                    console.log('response:', data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /スッキリしたコーヒーがお好きなんですか？ お砂糖かミルクは入れたりますか？/
                    )
                    done()
                } catch (error) {
                   console.log('error', error)
                   done() 
                }
            })
        })

        it ('is special handle late without sugar', done => {
            mockAttributeManager({}, {})
            request.request.intent.slots = coffeeRequestPartSpecialItem
            handler(request, {}, (err, data) => {
                try {
                    console.log('response:', data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /フレーバーラテがお好きなんですね。お砂糖かお好みのシロップはありますか？/
                    )
                    done()
                } catch (error) {
                   console.log('error', error)
                   done() 
                }
            })
        })

        it ('is special handle with sugar ', done => {
            mockAttributeManager({}, {})
            request.request.intent.slots = coffeeRequestPartSpecialItemWithSugar
            handler(request, {}, (err, data) => {
                try {
                    console.log('response:', data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /ラテが大好きなあなたは、ホイップクリームの追加だってためらいません。見た目も大事だし、かわいいラテアートも大好き。/
                    )
                    done()
                } catch (error) {
                   console.log('error', error)
                   done() 
                }
            })
        })
    });

    describe('Order milk and sugar', () => {
        const { handler } = require('../index')
        let request = {
            "version": "1.0",
            "session": sessionPart,
            "request": milkAndSugarRequestPart 
        }
        beforeEach(() => {
            jest.restoreAllMocks()
        })
        it ('accepted sugar and milk a', done => {
            mockAttributeManager({}, {diagnosisAttributes: {coffee: 'blend'}})
            handler(request, {}, (err, data) => {
                try {
                    console.log('response:', data)
                    expect(data.response.outputSpeech.ssml).toMatch(
                        /ラテが大好きなあなたは、ホイップクリームの追加だってためらいません。見た目も大事だし、かわいいラテアートも大好き。/
                    )
                    done()
                } catch (error) {
                   console.log('error', error)
                   done() 
                }
            })
        })      
    });
    
});