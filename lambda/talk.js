// レスポンス組み立て
const response = (builder, data) => {
    return builder
        .speak(data.speak)
        .reprompt(data.reprompt)
        .withShouldEndSession(data.shouldEndSession)
        .getResponse()
}

// 性格診断結果テーブル
// Keyの値は、Slotのidに揃えてある
const character = {
    black: {
        coffee: `ブラックコーヒーが好きなあなたは、コーヒーそのものの味を楽しみたい人。そんなあなたは無駄なことはしない主義で、仕事も定時でおわらせたい人。`,
        milk: `test`,
        sugar: `memory`
    },
    flavor_late: {
        coffee: `ラテが大好きなあなたは、ホイップクリームの追加だってためらいません。見た目も大事だし、かわいいラテアートも大好き。
            そんなあなたは、おいしいものを食べたり、楽しいことをするのが大好きな人。ルールにしばられるのがキライで楽観的なタイプ。遊びすぎて疲れてしまわないように気をつけて！`,
        milk: `test`,
        sugar: `そしてお砂糖もしっかり入れるあなたは欲張りさん。`
    },
    espresso: {
        coffee: `エスプレッソが好きなあなたは、とにかくカフェインを摂取したい人。とくにダブルのエスプレッソでカフェインを欲しているなら、ちょっと働きすぎ？かも。`,
        milk: `ミルクは入れるけど少しでいい。普段厳しそうに見えるあなたは時にとてもやさしい一面も見せる意外性も持ち合わせたタイプ`,
        sugar: `砂糖をたっぷり入れて一気に飲み干すあなたは生粋のイタリアン。朝はせっかち、仕事が終わればゆっくりプライベートを楽しみたいのかもしれません`
    },
    ice: {
        coffee: `アイスコーヒーが好きなあなたは、冷静沈着。`,
        milk: ``,
        sugar: ``
    },
    blend: {
        coffee: `オーソドックスなコーヒーが好きなあなたは、つねに冷静で、自分をコントロールするのが得意。自分で決めたルールに従って、淡々と仕事ができるのもこのタイプの人たちです。`,
        milk: `ミルクを入れるあなたはさらにオーソドックス。みんなに合わせがちなとこありませんか？`,
        sugar: `お砂糖も入れるあなたは平穏がとても好きなタイプ`
    },
    decafe: {
        coffee: `カフェインが入っていない「デカフェ」が好きなあなた。四六時中コーヒーが手放せなくて油断すると1日のカフェイン摂取許容量を軽くこえてしまうのかな？
        いつでも自分のペースを崩さないあなたは、立ち回りがうまいはず。安全な道をいくタイプ。`,
        milk: ``,
        sugar: ``
    }
}

//　聞き返すときのリスト
const question = {
    flavor_late: `フレーバーラテがお好きなんですね。お砂糖かお好みのシロップはありますか？`,
    blend: 'スッキリしたコーヒーがお好きなんですか？ お砂糖かミルクは入れたりしますか？',
}

// インテントと対になるように設計。SessionAttributesを必要なら使ってメッセージを組み立てる。
// Keyの値は、Slotのidに揃えてある
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
    // da = diagnosisAttributes
    diagnosisRequest: (responseBuilder, da) => {
        console.log(da)
        if (da.coffee === 'black') {
            // ブラックと言われたら砂糖とミルクの入る余地がないので診断結果を伝える
            return response(responseBuilder, {
                speak: character.black.coffee,
                shouldEndSession: true
            })
        }
        if (da.coffee === 'flavor_late') {
            // ラテはすでにミルクが入っているので、砂糖が入ってなければ次の質問へ
            if (da.withSugar) {
                return response(responseBuilder, {
                    speak: character.flavor_late.coffee + character.flavor_late.sugar,
                    shouldEndSession: true
                })
            } else {
                return response(responseBuilder, {
                    speak: question.flavor_late,
                    reprompt: 'お気に入りのお砂糖がシロップはあったりしますか？',
                    shouldEndSession: false
                })
            }
        }

        // エスプレッソ、ブレンドコーヒー、デカフェ は 同じパスを通せばOK
        // 声のインタラクションでは、応答に「予想(想像)」や「提案」の要素を入れて返してあげるとよい。
        if (da.coffee && !da.withMilk && !da.withSugar) {
            // スッキリしたのが好きかも？と予想
            return response(responseBuilder, {
                speak: question.blend,
                reprompt: 'お砂糖かミルクは入れたりしますか？',
                shouldEndSession: false
            })
        }
        if (da.coffee && da.withMilk && !da.withSugar) {
            // マイルドなやつがが好きかも？と予想
            return response(responseBuilder, {
                speak: '少しマイルドなコーヒーがお気に入りですか？ お砂糖は入れたりしますか？',
                reprompt: 'お砂糖は入れますか？',
                shouldEndSession: false
            })
        }
        if (da.coffee && !da.withMilk && da.withSugar) {
            // キリッとした甘さのやつが好きかも？と予想
            return response(responseBuilder, {
                speak: 'キリッとした甘さのコーヒーがお好きなんですか？ ミルクは入れたりしますか？',
                reprompt: 'ミルクは入れますか？',
                shouldEndSession: false
            })
        }
        if (da.coffee && da.withMilk && da.withSugar) {
            // 全部一度に言った
            return response(responseBuilder, {
                speak: character[da.coffee].coffee + character[da.coffee].milk + character[da.coffee].sugar,
                shouldEndSession: true
            })
        }
    },
    milkAndSugarRequest: (responseBuilder, da) => {
        console.log('talk:milkAndSugar:', da)
       
        let speak = character[da.coffee].coffee
        if (da.withMilk) speak += character[da.coffee].milk
        if (da.withSugar) speak += character[da.coffee].sugar

        return response(responseBuilder, {
            speak: speak,
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