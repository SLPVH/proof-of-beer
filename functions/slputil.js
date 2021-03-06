
module.exports.get_slpsdk = function() {
    const SLPSDK = require('slp-sdk/lib/SLP')
    return new SLPSDK({ restURL: 'https://rest.bitcoin.com/v2/' })
}

module.exports.get_bitbox = function() {
    const BITBOXSDK = require('bitbox-sdk')
    const BITBOX = new BITBOXSDK.BITBOX({
        restURL: 'https://rest.bitcoin.com/v2/'
    })
    return BITBOX
}

module.exports.priv_to_publickey = function(SLP, privkey_wif) {
    let ecPair = SLP.ECPair.fromWIF(privkey_wif)
    let cashAddress = SLP.ECPair.toCashAddress(ecPair)
    let slpAddress = SLP.ECPair.toSLPAddress(ecPair)
    return [cashAddress, slpAddress]
}

