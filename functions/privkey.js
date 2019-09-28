let slputil = require("./slputil")

function gen_privkey() {
    let SLP = slputil.get_slpsdk()
    let mnemonic = SLP.Mnemonic.generate()
    let rootseed = SLP.Mnemonic.toSeed(mnemonic)
    let hdnode = SLP.HDNode.fromSeed(rootseed)
    const account = SLP.HDNode.derivePath(hdnode, "m/44'/145'/0'")
    const privkey = SLP.HDNode.toWIF(account)
    return privkey
}

