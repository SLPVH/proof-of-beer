
const slp = require('slp-sdk')
const SLP = new slp()

const NERD = "364f1366f32a4d3b15945300964e824754fc5434a3ee892b7718a912a464f56a"


function output_as_emoji(output) {
    res = ""
    for (var i = 0; i < output['amount']; ++i) {
        res += "🍺"
    }
    res += " 👉 " + output['address']
    return res
}

async function token_history (tokenid, fridge_addr) {
    let res = await SLP.SLPDB.get(
    {
      "v": 3,
      "q": {
      "find": {
        "slp.valid": true,
        "slp.detail.tokenIdHex": tokenid,
        "$or": [ { "slp.detail.transactionType": "SEND"}, { "slp.detail.transactionType": "MINT" }]
    }}})

    let events = [ ]

    res['c'].forEach((entry) => {
        type = entry['slp']['detail']['transactionType']
        outputs = [ ]

        entry['slp']['detail']['outputs'].forEach((out) => {
            outputs.push(output_as_emoji(out))
        })

        events.push({
            'type': type,
            'outputs': outputs
        })
    })
    return events
}

async function test_history() {
    try {
        let h = await token_history("9c06d069cb63aafc40c50b4c1f45d48e4fae4f77577a052c64073e76c98c85db")
        console.log(h)
    }
    catch (err) {
        console.log(err)
    }
 }

// test_history()
exports.history = token_history
