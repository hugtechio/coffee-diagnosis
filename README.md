# Alexa Dojo サンプルスキル 朝のコーヒーで性格診断 

このスキルは、YouTube チャンネル [Alexa Developers JP](https://www.youtube.com/channel/UC_oCQTeG5bQUyn_7tvyEuSw) から配信されました alexa道場 #004 で使用したサンプルスキルです。
Situational Design Principal No3 "Be available" の実装例として SessionAttributes を利用して、ストーリーボードでデザインした シチュエーションをコードに落とす方法を紹介します。

# スキルの概要
ユーザーにコーヒーの飲みかたと砂糖かミルクは入れるかを聞いて、得られた情報からユーザーの性格を予想します。

例）
ユーザー： アレクサ、朝のコーヒーで性格診断 を開いて
アレクサ： ご来店ありがとうございます。あなたのお好みのコーヒーから、あなたの性格を判定します。あなたの好きなコーヒーはなんですか？
ユーザー： エスプレッソをダブルで飲むのが好き。
アレクサ： お砂糖は入れたりしますか？
ユーザー： はい。入れます。
アレクサ： あなたは、XXXXXXX なタイプの人です。ご来店ありがとうございました。またお待ちしております。

# 実装の内容
以下、２つのシチュエーションを実装します。
- ユーザーがどんなコーヒーが好きか聞かれている
- ユーザーが好きなコーヒーに対して、砂糖かミルクは入れるか聞かれている

# サンプルスキルで扱う内容
- DynamoDBPersistentAdapter を 利用した 起動回数の保存
- SessionAttributes を 利用した シチュエーション管理
- シチュエーションとユーザの発話状況に応じた応答の変更
- SlotとSynonymを扱う例
- テスト

# サンプルスキルで扱うライブラリ
- ask-sdk
- S3PersistenceAdapter
- DynamoDBPersistenceAdapter
- jest(テスト)

