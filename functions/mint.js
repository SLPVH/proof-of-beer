
const util = require('./slputil')
const SLP = util.get_slpsdk()

// Mint quantity of tokenid to dst_addr.
// * Minting baton needs to be in privkey.
// * Privkey needs to hold BCH for fees.
// * Privkey receives change
async function mintbeer(tokenid, quantity, privkey_wif, dst_slpaddr) {
    let [cashAddress, slpAddress] = util.priv_to_publickey(SLP, privkey_wif)
    console.log(cashAddress)
    console.log(slpAddress)

    const mintConfig = {
        fundingAddress: slpAddress,
        fundingWif: privkey_wif,
        tokenReceiverAddress: dst_slpaddr,
        batonReceiverAddress: slpAddress,
        bchChangeReceiverAddress: cashAddress,
        tokenId: tokenid,
        additionalTokenQty: quantity
    }
    console.log(mintConfig)

    const mintTxId = await SLP.TokenType1.mint(mintConfig)
    return mintTxId;
}

async function test(dst_slpaddr) {
    let mnemonic = "stuff goes here"
    let rootseed = SLP.Mnemonic.toSeed(mnemonic)
    let hdnode = SLP.HDNode.fromSeed(rootseed)
    const account = SLP.HDNode.derivePath(hdnode, "m/44'/145'/0'")
    const change = SLP.HDNode.derivePath(account, "0/0")
    const privkey = SLP.HDNode.toWIF(change)

    try {
        let tokenid = "364f1366f32a4d3b15945300964e824754fc5434a3ee892b7718a912a464f56a"
        let txid = await mintbeer(tokenid, 100, privkey, dst_slpaddr)
        console.log("Success! " + txid)
    }
    catch (err) {
        console.error(err)
    }
}

exports.mint = mintbeer
// test("simpleledger:qqv9hfwy5jfmuz5gnyrqf7u6snqk4gk0jv829es2kz")
