
var allPOS = [
    {
        ja:'代名詞',
        en:'pronoun'
    },
    {
        ja:'副詞]',
        en:'adverb'
    },
    {
        ja:'助動詞',
        en:'auxiliary_verb'
    },
    {
        ja:'助詞',
        en:'particle',
        subPOS:[
            {
                ja:'係助詞',
                en:'binding'
            },
            {
                ja:'副助詞',
                en:'adverbial'
            },
            {
                ja:'接続助詞',
                en:'conjunctive'
            },
            {
                ja:'格助詞',
                en:'case'
            },
            {
                ja:'準体助詞',
                en:'nominal'
            },
            {
                ja:'終助詞',
                en:'phrase_final'
            }
        ]
    },
    {
        ja:'動詞',
        en:'verb',
        subPOS:[
            {
                ja:'一般',
                en:'general'
            },
            {
                ja:'非自立可能',
                en:'bound'
            }
        ]
    },
    {
        ja:'名詞',
        en:'noun',
        subPOS:[
            {
                ja: '固有名詞',
                en: 'proper'
            },
            {
                ja: '数詞',
                en: 'numeral'
            },
            {
                ja:'一般',
                en:'general'
            },
            {
                ja: '普通名詞',
                en: 'common',
                subPOS:[
                    {
                        ja:'サ変可能',
                        en:'verbal_suru'
                    },
                    {
                        ja:'サ変形状詞可能',
                        en:'verbal.adjectival'
                    },
                    {
                        ja:'一般',
                        en:'general'
                    },
                    {
                        ja:'副詞可能',
                        en:'adverbial'
                    },
                    {
                        ja:'助数詞可能',
                        en:'counter'
                    },
                    {
                        ja:'形状詞可能',
                        en:'adjectival'
                    },
                    {
                        ja:'形状詞可能',
                        en:'adjectival'
                    }
                ]
            }
        ]
    },
    {
        ja:'形容詞',
        en:'adjective',
        subPOS:[
            {
                ja:'一般',
                en:'general'
            },
            {
                ja:'非自立可能',
                en:'bound'
            },
            {
                ja:'形状詞',
                en:'noun(tari)'
            },
            {
                ja:'形状詞',
                en:'noun(tari)'
            },
            {
                ja:'助動詞語幹',
                en:'noun(auxiliary)'
            }
        ]
    },
    {
        ja:'感動詞',
        en:'interjection',
        subPOS:[
            {
                ja:'フィラー',
                en:'filler'
            },
            {
                ja:'一般',
                en:'general'
            }
        ]
    },
    {
        ja:'接尾辞',
        en:'suffix',
        subPOS:[
            {
                ja:'動詞的',
                en:'verbal'
            },
            {
                ja:'名詞的',
                en:'nominal',
                subPOS:[
                    {
                        ja:'サ変可能',
                        en:'verbal_suru'
                    },
                    {
                        ja:'一般',
                        en:'general'
                    },
                    {
                        ja:'副詞可能',
                        en:'adverbial'
                    },
                    {
                        ja:'助数詞',
                        en:'counter'
                    }
                ]
            },
            {
                ja:'形容詞的',
                en:'adjective_i'
            },
            {
                ja:'形状詞的',
                en:'adjectival_noun'
            }
        ]
    },
    {
        ja:'接続詞',
        en:'conjunction'
    },
    {
        ja:'接頭辞',
        en:'prefix'
    }
];

var Mecab = require('mecab-lite'),
    Vocab = require('../../api/vocab/vocab.model'),
    ParsedWord = require('../../api/parsed_word/parsed_word.model');

var mecab = new Mecab();
var finalParsedWords = [];


var MecabHelper = {
    parseText: function(text){
        var parsed_display_text = [];

        var result = mecab.parseSync(text);

        for(var i in result){
            var returnObj = {};
            for(var j in allPOS){
                if(result[i][1] == allPOS[j].ja){

                    returnObj.text = result[i][0];
                    returnObj.pos_main = allPOS[j].en;

                    if(allPOS[j].subPOS && result[i][2] != '*'){
                        for(var k in allPOS[j].subPOS){
                            if(result[i][2] == allPOS[j].subPOS[k].ja){
                                returnObj.pos_sub = allPOS[j].subPOS[k].en;
                            }
                        }
                    }
                }
            }
            if(returnObj.text) parsed_display_text.push(returnObj);
        }
        return parsed_display_text;
    },
    findVocabRef: function(text){
        Vocab.findOne({"text" : text}, '_id', function(err, vocab){
            if(vocab) return vocab._id;
            return null;
        });
    },
    getWordEntries: function(text){

        var parsedText;
        if(text) parsedText = MecabHelper.parseText(text);

        var length = parsedText.length;

        for(var i = 0; i<length; i++){
            var wordEntry = new ParsedWord({
                active: true,
                text: parsedText[i].text,
                pos_main: parsedText[i].pos_main,
                pos_sub: parsedText[i].pos_sub,
                vocab_link: MecabHelper.findVocabRef(parsedText[i].text)
            });

            finalParsedWords.push(wordEntry);

        }
        return finalParsedWords;
    }
};


module.exports = MecabHelper;