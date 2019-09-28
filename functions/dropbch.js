let SlpdbQueries = require('slp-list').SlpdbQueries
let Big = require('big.js').Big
let slputil = require('./slputil')
const slpjs = require('slpjs')
const bitboxNetwork = new slpjs.BitboxNetwork(slputil.get_bitbox());

SLP = slputil.get_slpsdk()
BITBOX = slputil.get_bitbox()

/// keep a some bch for future
const KEEP_AMOUNT = 2000 // sat
const FEE = 5000 // fixme, calc fee

// TODO: Find actual dust limit
const DUST_LIMIT = 1000


async function get_bch_balance(privkey) {
    const [cashaddr, _] = slputil.priv_to_publickey(SLP, privkey)

   const utxos = await bitboxNetwork.getAllSlpBalancesAndUtxos(cashaddr)
   let inputs = utxos.nonSlpUtxos
   let balance = 0
   inputs.forEach((input) => {
        balance += BITBOX.BitcoinCash.toSatoshi(input['amount'])
   })
   return balance

}

async function airdrop_bch(privkey, tokenid) {

   const [cashaddr, _] = slputil.priv_to_publickey(SLP, privkey)

    let balances = await SlpdbQueries.GetAddressListFor(-1, tokenid)

    const slp_total = Array.from(
        balances.values()).reduce((a, c) => a.plus(c), new Big(0));

    let keep = KEEP_AMOUNT
    let balance = await get_bch_balance(privkey)
    let dropamount = balance - keep - FEE
    if (dropamount <= 0) {
        throw Error("BCH balance in " + cashaddr + " too low for airdrop")
    }
    dropamount = BITBOX.BitcoinCash.toBitcoinCash(dropamount)

    outputs = [ ]
    balances.forEach((v, k) => {
        k = SLP.Address.toLegacyAddress(k)
        let d = BITBOX.BitcoinCash.toSatoshi(v.div(slp_total).mul(dropamount).toFixed(8))
        if(d > DUST_LIMIT) {
            outputs.push({ dst: k, amount: d })
        }
        else {
            keep += d
        }
   });

   let transactionBuilder = new BITBOX.TransactionBuilder('mainnet');
   transactionBuilder.setLockTime(31337)
   outputs.forEach((o) => {
       transactionBuilder.addOutput(o['dst'], o['amount'])
   })
   // return KEEP_AMOUNT to ourselves
   transactionBuilder.addOutput(cashaddr, keep)

   const utxos = await bitboxNetwork.getAllSlpBalancesAndUtxos(cashaddr)

   let inputs = utxos.nonSlpUtxos

   // add inputs
   inputs.forEach((input) => {
        transactionBuilder.addInput(input['txid'], input['vout'])

   })

   // sign inputs
   let i = 0
   let keypair = BITBOX.ECPair.fromWIF(privkey)
   let redeemScript
   inputs.forEach((input) => {
        let amount = BITBOX.BitcoinCash.toSatoshi(input['amount'])
        transactionBuilder.sign(i, keypair, redeemScript,
            transactionBuilder.hashTypes.SIGHASH_ALL, amount,
            transactionBuilder.signatureAlgorithms.SCHNORR)
        i = i + 1
   })

   let tx = transactionBuilder.build()
   let txid = null
  BITBOX.RawTransactions.sendRawTransaction(tx.toHex())
    .then((result) => { txid = result }, (err) => { console.log(err); });
    return txid
}




async function test() {
    privkey = "L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"
    tokenid = "364f1366f32a4d3b15945300964e824754fc5434a3ee892b7718a912a464f56a"
    try {
        airdrop_bch(privkey, tokenid)
    }
    catch (err) { console.log(err) }
}

exports.get_balance = get_bch_balance
// test
