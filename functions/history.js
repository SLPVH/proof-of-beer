const slp = require('slp-sdk')
const SLP = new slp()

const NERD = "364f1366f32a4d3b15945300964e824754fc5434a3ee892b7718a912a464f56a"


function render_output(output) {
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

    events = [ ]

    res['c'].forEach((entry) => {
        type = entry['slp']['detail']['transactionType']

        if (type == "MINT") {
           entry['slp']['detail']['outputs'].forEach((out) => {
              console.log("WOW! NEW BEER! " + render_output(out))
           })
        }
        if (type == "SEND") {
           entry['slp']['detail']['outputs'].forEach((out) => {
              console.log("CHHERS! A TRANSFER! " + render_output(out))
           })



        }
        /*console.log(type)
        // e['type'] = entry['slp']['detail']['transactionType'];
        entry['slp']['detail']['outputs'].forEach((o) => {
            console.log(o)
        })*/
    })
    // console.log(res['c'])
}
token_history(NERD)


/*
let socket = new SLP.Socket({
    callback: () => {
        console.log("connected")
    },
})

socket.listen({
  "v": 3,
  "q": {
  "find": {
    "slp.valid": true,
    "slp.detail.tokenIdHex": tokenid,
    "$or": [ { "slp.detail.transactionType": "SEND"}, { "slp.detail.transactionType": "MINT" }]
}}},    function(data) { console.log(data) }) */

