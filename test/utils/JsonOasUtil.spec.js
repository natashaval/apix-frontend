import JsonOasUtil from "@/utils/JsonOasUtil";

describe('all function tests', ()=>{

    test('should convert plain json to swagger json oas correctly', () => {
        let input = {
            "string1": "",
            "string2": "myValue",
            "number1": 1,
            "number2": 1.2,
            "obj1": {
                "obj-str": "",
                "obj-num": 2
            },
            "array1": [
                1
            ],
            "array2": [
                ""
            ],
            "array3": [
                {
                    "arr-obj-str": ""
                }
            ],
            "array4": [
                [
                    {
                        "arr-arr-obj-str": ""
                    }
                ]
            ]
        }

        let expected = {
            "type": "object",
            "properties": {
                "string1": {
                    "type": "string",
                    "name": "string1"
                },
                "string2": {
                    "type": "string",
                    "default": "myValue",
                    "name": "string2"
                },
                "number1": {
                    "type": "number",
                    "default": "1",
                    "name": "number1"
                },
                "number2": {
                    "type": "number",
                    "default": "1.2",
                    "name": "number2"
                },
                "obj1": {
                    "type": "object",
                    "name": "obj1",
                    "properties": {
                        "obj-str": {
                            "type": "string",
                            "name": "obj-str"
                        },
                        "obj-num": {
                            "type": "number",
                            "enum": [],
                            "default": "2",
                            "name": "obj-num"
                        }
                    }
                },
                "array1": {
                    "type": "array",
                    "uniqueItems": false,
                    "name": "array1",
                    "items": {
                        "type": "number",
                        "enum": [],
                        "default": "1"
                    }
                },
                "array2": {
                    "type": "array",
                    "uniqueItems": false,
                    "name": "array2",
                    "items": {
                        "type": "string",
                        "enum": [],
                        "default": ""
                    }
                },
                "array3": {
                    "type": "array",
                    "uniqueItems": false,
                    "name": "array3",
                    "items": {
                        "type": "object",
                        "properties": {
                            "arr-obj-str": {
                                "type": "string",
                                "enum": [],
                                "default": "",
                                "name": "arr-obj-str"
                            }
                        }
                    }
                },
                "array4": {
                    "type": "array",
                    "uniqueItems": false,
                    "name": "array4",
                    "items": {
                        "type": "array",
                        "uniqueItems": false,
                        "items": {
                            "type": "object",
                            "properties": {
                                "arr-arr-obj-str": {
                                    "type": "string",
                                    "enum": [],
                                    "default": "",
                                    "name": "arr-arr-obj-str"
                                }
                            }
                        }
                    }
                }
            }
        }

        expect(JsonOasUtil.toSwaggerOas(input)).toEqual(expected)
    })

    test('should replace $ref correctly', () => {
        let input = {
            type : 'object',
            properties : {
                prop1 : {
                    name : 'prop1',
                    $ref : '#ref1Before'
                },
                prop2 : {
                    name : 'prop2',
                    $ref : '#ref2Before'
                },
                prop3 : {
                    name : 'prop3',
                    type : 'object',
                    properties : {
                        prop34 : {
                            $ref : '#ref34Before'
                        }
                    }

                }
            }
        }

        let expected = {
            type : 'object',
            properties : {
                prop1 : {
                    name : 'prop1',
                    $ref : '#ref1After'
                },
                prop2 : {
                    name : 'prop2',
                    $ref : '#ref2After'
                },
                prop3 : {
                    name : 'prop3',
                    type : 'object',
                    properties : {
                        prop34 : {
                            $ref : '#ref34After'
                        }
                    }

                }
            }
        }

        JsonOasUtil.replaceValueWithKey(input, '$ref', {
            '#ref1Before' : '#ref1After',
            '#ref2Before' : '#ref2After',
            '#ref34Before' : '#ref34After'
        })

        expect(input).toEqual(expected)

    })
})
