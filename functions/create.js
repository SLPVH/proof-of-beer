const util = require('./slputil')
const SLP = util.get_slpsdk()

/// Creates a new token for the event, but mints zero.
async function create_event(privkey_wif, token_name, token_symbol) {

    const [cashaddr, slpaddr] = util.priv_to_publickey(
        SLP, privkey_wif)

    console.log("Cashaddr: " + cashaddr)
    console.log("slpaddr: " + slpaddr)

    const cfg = {
        fundingAddress: slpaddr,
        fundingWif: privkey_wif,
        tokenReceiverAddress: slpaddr,
        batonReceiverAddress: slpaddr,
        bchChangeReceiverAddress: cashaddr,
        decimals: 0,
        name: token_name,
        symbol: token_symbol,
        documentUri: "https://slp.dev !! PROOF OF BEER",
        documentHash: null,
        initialTokenQty: 0
    }

    const txid = await SLP.TokenType1.create(cfg);
    return txid
}


async function test_create() {
    try {
        const privkey_wif
            = "L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"
        const txid = await create_event(privkey_wif, "TEST", "TEST")
        console.log("Success! Token: " + tokenid + " TX: " + txid)
    }
    catch (err) {
        console.error(err)
    }
}

exports.create = create_event
// test_create()
