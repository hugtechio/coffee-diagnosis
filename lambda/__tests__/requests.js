exports.sessionPart = {
    "new": true,
    "sessionId": "amzn1.echo-api.session.xxxxx",
    "application": {
        "applicationId": "amzn1.ask.skill.xxxxx"
    },
    "user": {
        "userId": "amzn1.ask.account.xxxx"
    }
}

exports.launchRequestPart = {
    "type": "LaunchRequest",
    "requestId": "amzn1.echo-api.request.d3d29da9-89ec-425f-bddb-512ce5817625",
    "timestamp": "2020-06-08T23:04:11Z",
    "locale": "ja-JP",
    "shouldLinkResultBeReturned": false
}

exports.coffeeRequestPart = {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.c7d18478-629b-4291-9f61-0c0fbf22de20",
    "timestamp": "2020-06-08T23:01:20Z",
    "locale": "ja-JP",
    "intent": {
        "name": "DiagnosisRequestIntent",
        "confirmationStatus": "NONE",
        "slots": {
            "withMilk": {
                "name": "withMilk",
                "value": "低脂肪",
                "resolutions": {
                    "resolutionsPerAuthority": [
                        {
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.ddd.KIND_OF_MILK",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [
                                {
                                    "value": {
                                        "name": "低脂肪",
                                        "id": "milk"
                                    }
                                }
                            ]
                        }
                    ]
                },
            },
            "withSugar": {
                "name": "withSugar",
                "value": "黒砂糖",
                "resolutions": {
                    "resolutionsPerAuthority": [
                        {
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.xxxx.KIND_OF_SUGAR",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [
                                {
                                    "value": {
                                        "name": "砂糖",
                                        "id": "sugar"
                                    }
                                }
                            ]
                        }
                    ]
                },
            },
            "coffee": {
                "name": "coffee",
                "value": "エスプレッソ",
                "resolutions": {
                    "resolutionsPerAuthority": [
                        {
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.a7d67925-5538-43e0-82d8-5e76d6bf6d6d.KIND_OF_COFFEE",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [
                                {
                                    "value": {
                                        "name": "エスプレッソ",
                                        "id": "espresso"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "confirmationStatus": "NONE",
                "source": "USER"
            }
        }
    }
}

exports.coffeeRequestPartShortage = {
    "coffee": {
        "name": "coffee",
        "value": "ブレンドコーヒー",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.a7d67925-5538-43e0-82d8-5e76d6bf6d6d.KIND_OF_COFFEE",
                    "status": {
                        "code": "ER_SUCCESS_MATCH"
                    },
                    "values": [
                        {
                            "value": {
                                "name": "ブレンドコーヒー",
                                "id": "blend"
                            }
                        }
                    ]
                }
            ]
        },
        "confirmationStatus": "NONE",
        "source": "USER"
    }
}

exports.coffeeRequestPartSpecialItem = {
    "coffee": {
        "name": "coffee",
        "value": "カフェラテ",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.a7d67925-5538-43e0-82d8-5e76d6bf6d6d.KIND_OF_COFFEE",
                    "status": {
                        "code": "ER_SUCCESS_MATCH"
                    },
                    "values": [
                        {
                            "value": {
                                "name": "フレーバーラテ",
                                "id": "flavor_late"
                            }
                        }
                    ]
                }
            ]
        },
        "confirmationStatus": "NONE",
        "source": "USER"
    }
}

exports.coffeeRequestPartSpecialItemWithSugar = {
    "coffee": {
        "name": "coffee",
        "value": "カフェラテ",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.a7d67925-5538-43e0-82d8-5e76d6bf6d6d.KIND_OF_COFFEE",
                    "status": {
                        "code": "ER_SUCCESS_MATCH"
                    },
                    "values": [
                        {
                            "value": {
                                "name": "フレーバーラテ",
                                "id": "flavor_late"
                            }
                        }
                    ]
                }
            ]
        },
        "confirmationStatus": "NONE",
        "source": "USER"
    },
    "withSugar": {
        "name": "withSugar",
        "value": "黒砂糖",
        "resolutions": {
            "resolutionsPerAuthority": [
                {
                    "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.xxxx.KIND_OF_SUGAR",
                    "status": {
                        "code": "ER_SUCCESS_MATCH"
                    },
                    "values": [
                        {
                            "value": {
                                "name": "砂糖",
                                "id": "sugar"
                            }
                        }
                    ]
                }
            ]
        },
    }
}

exports.milkAndSugarRequestPart = {
    "type": "IntentRequest",
    "requestId": "amzn1.echo-api.request.c7d18478-629b-4291-9f61-0c0fbf22de20",
    "timestamp": "2020-06-08T23:01:20Z",
    "locale": "ja-JP",
    "intent": {
        "name": "MilkAndSugarRequestIntent",
        "confirmationStatus": "NONE",
        "slots": {
            "withMilk": {
                "name": "withMilk",
                "value": "低脂肪",
                "resolutions": {
                    "resolutionsPerAuthority": [
                        {
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.ddd.KIND_OF_MILK",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [
                                {
                                    "value": {
                                        "name": "低脂肪",
                                        "id": "milk"
                                    }
                                }
                            ]
                        }
                    ]
                },
            },
            "withSugar": {
                "name": "withSugar",
                "value": "黒砂糖",
                "resolutions": {
                    "resolutionsPerAuthority": [
                        {
                            "authority": "amzn1.er-authority.echo-sdk.amzn1.ask.skill.xxxx.KIND_OF_SUGAR",
                            "status": {
                                "code": "ER_SUCCESS_MATCH"
                            },
                            "values": [
                                {
                                    "value": {
                                        "name": "砂糖",
                                        "id": "sugar"
                                    }
                                }
                            ]
                        }
                    ]
                },
            }
        }
    }
}