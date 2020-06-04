const response = (builder, data) => {
    return builder
        .speak(data.speak)
        .reprompt(data.reprompt)
        .withShouldEndSession(data.shouldEndSession)
        .getResponse()
}

const charactor = {
    black: `ブラックコーヒーが好きなあなたは、コーヒーそのものの味を楽しみたい人。そんなあなたは無駄なことはしない主義で、仕事も定時でおわらせたい人。`,
    flavor: `ラテが大好きなあなたは、ホイップクリームの追加だってためらいません。見た目も大事だし、かわいいラテアートも大好き。
        そんなあなたは、おいしいものを食べたり、楽しいことをするのが大好きな人。ルールにしばられるのがキライで楽観的なタイプ。遊びすぎて疲れてしまわないように気をつけて！`,
    espresso: `エスプレッソが好きなあなたは、とにかくカフェインを摂取したい人。とくにダブルのエスプレッソでカフェインを欲しているなら、ちょっと働きすぎ？かも。`,
    blend: `オーソドックスなコーヒーが好きなあなたは、つねに冷静で、自分をコントロールするのが得意。自分で決めたルールに従って、淡々と仕事ができるのもこのタイプの人たちです。`,
    decafe: `カフェインが入っていない「デカフェ」が好きなあなた。四六時中コーヒーが手放せなくて油断すると1日のカフェイン摂取許容量を軽くこえてしまうのかな？
        いつでも自分のペースを崩さないあなたは、立ち回りがうまいはず。安全な道をいくタイプ。`
}

const decision = {
    'ブラック': charactor.black,
    'エスプレッソ': charactor.espresso,
    'ブレンド': charactor.blend,
    'フレーバーラテ': charactor.flavor,
    'デカフェ': charactor.decafe
}

module.exports = {
    launch: (responseBuilder, storage) => {
        if (Object.keys(storage).length === 0) {
            return response(responseBuilder, {
                speak: 'こんにちは。ご来店ありがとうございます。あなたのお好みのコーヒーから、あなたの性格を判定します。あなたの好きなコーヒーはなんですか？',
                reprompt: 'あなたが好きなコーヒーは何ですか？',
                shouldEndSession: false
            })
        } else {
            return response(responseBuilder, {
                speak: 'こんにちは。ご来店ありがとうございます。今日はどんなコーヒーを飲みますか？',
                reprompt: 'あなたが好きなコーヒーは何ですか？',
                shouldEndSession: false
            })        
        }

    },
    coffeeRequestIntent: (responseBuilder, session) => {
        const index = {
            coffee: 0,
            milk: 1,
            sugar: 2
        }
        console.log(session)
        if (session[index.coffee] && !session[index.milk] && !session[index.sugar]) {
            // スッキリしたのが好きかも？と予想
            return ''
        }
        if (session[index.coffee] && session[index.milk] && !session[index.sugar]) {
            // マイルドなやつがが好きかも？と予想
            return ''
        }
        if (session[index.coffee] && session[index.milk] && !session[index.sugar]) {
            // 甘くてスイートなやつが好きかも？と予想
            return ''
        }
        if (session[index.coffee] && session[index.milk] && session[index.sugar]) {
            // 全部一度に言った
            return ''
        }
    },
    milkAndSugarRequest: (responseBuilder, session) => {
        console.log(session)
        return response(responseBuilder, {
            speak: `${decision[session[0]]}。ご来店ありがとうございました。またお越しください`,
            reprompt: '',
            shouldEndSession: true
        })
    },
    exit: (responseBuilder) => {
        return response(responseBuilder, {
            speak: 'ご来店ありがとうございました。またお待ちしてます。',
            reprompt: ''
        })
    },
    help: (responseBuilder) => {
        return response(responseBuilder, {
            speak: 'あなたの好きなコーヒーから、あなたの性格を予想します。アレクサ、コーヒー診断を開いて、と話しかけてください。',
            reprompt: ''
        })
    },
    unhandled: (responseBuilder) => {
        return response(responseBuilder, {
            speak: 'あなたの好きなコーヒーから、あなたの性格を予想します。アレクサ、コーヒー診断を開いて、と話しかけてください。',
            reprompt: ''
        })
    },
    error: (responseBuilder, session) => {
        console.log(session)
        if (session) {
            return response(responseBuilder, {
                speak: 'あなたの好きなコーヒーを教えてください',
                reprompt: 'もう一度教えてください。',
                shouldEndSession: false
            })     
        }
        return response(responseBuilder, {
            speak: 'すみません。聞き取れませんでした。もう一度教えてください。',
            reprompt: 'もう一度教えてください。'
        })
    },
    fallback: (responseBuilder) => {
        return response(responseBuilder, {
            speak: 'すみません。聞き取れませんでした。もう一度教えてください。',
            reprompt: 'もう一度教えてください。'
        })
    }
}