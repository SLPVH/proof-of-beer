const util = require('./slputil')
const SLP = util.get_slpsdk()

const slpjs = require('slpjs')
const BITBOXSDK = require('bitbox-sdk')
const BITBOX = new BITBOXSDK.BITBOX({
    restURL: 'https://rest.bitcoin.com/v2/'
});
const bitboxNetwork = new slpjs.BitboxNetwork(BITBOX);



/// Burns *ALL* tokens of tokenid held by privatekey
async function burn_beer(privkey_wif, tokenid) {
    const [cashaddr, slpaddr] = util.priv_to_publickey(SLP, privkey_wif)
    console.log("Cashaddr: " + cashaddr)
    console.log("slpaddr: " + slpaddr)

    const balances = await bitboxNetwork.getAllSlpBalancesAndUtxos(slpaddr)
    const amount = balances.slpTokenBalances[tokenid]
    const utxos = balances.slpTokenUtxos[tokenid]
    if (!utxos) {
        return;
    }

    // Just add all BCH utxos and hope they cover fee.
    const inputUtxos = utxos.concat(balances.nonSlpUtxos)

    inputUtxos.forEach((txo) => {
        txo.wif = privkey_wif
    })

    const bchChangeReceiverAddress = cashaddr

    // If this throws "Transaction has no outputs", it means
    // that there wasn't enough BCH to pay fees + change.
    // No change == no output.
    const burnTxID = await bitboxNetwork.simpleTokenBurn(
        tokenid, amount, inputUtxos, bchChangeReceiverAddress)
    return burnTxID
}

async function test_burn() {
    try {
        const privkey_wif
            = "L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"
        const tokenid = "364f1366f32a4d3b15945300964e824754fc5434a3ee892b7718a912a464f56a"
        let txid = await burn_beer(privkey_wif, tokenid)
        console.log("Success! " + txid)

    }
    catch (err) {
        console.error(err)
    }
}
//test_burn()
