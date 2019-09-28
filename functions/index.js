const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const create_event = require('./create.js').create;
const mint_beer = require('./mint').mint
const burn_beer = require('./burn').burn
let slputil = require("./slputil")

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();
const request = require('request')

const privkey_wif = "L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"
const tokenid = "9c06d069cb63aafc40c50b4c1f45d48e4fae4f77577a052c64073e76c98c85db"
const cors = require('cors')({
    origin: true
  });
  
firebase.initializeApp()

exports.ssr = functions.https.onRequest((req, res) => {
    req.baseUrl = '';
    middleware(req, res);
});

exports.create_token = functions.https.onCall(async (data, context) => {
    const txid = await create_event(
        privkey_wif,
        data.token_name,
        data.token_symbol
    ).catch((e)=>{
        console.log(e)
        return(e)
    }) 
    return(txid)
})

exports.mint_beer = functions.https.onCall(async (data, context) => {
    const txid = await mint_beer(
        tokenid,
        data.quantity,
        privkey_wif,
        data.dst_slpaddr
    ).catch((e)=>{
        console.log(e)
        return(e)
    })
    return(txid)
})

exports.end_event = fundtions.https.onCall(async (data, context) => {
    const txid = await burn_beer(privkey_wif, tokenid).catch(e=>console.log(e))
})

exports.createUserData = functions.auth.user().onCreate((user) => {
    let SLP = slputil.get_slpsdk()

    function createPrivateKey() {
        let mnemonic = SLP.Mnemonic.generate()
        let rootseed = SLP.Mnemonic.toSeed(mnemonic)
        let hdnode = SLP.HDNode.fromSeed(rootseed)
        const account = SLP.HDNode.derivePath(hdnode, "m/44'/145'/0'")
        const privkey = SLP.HDNode.toWIF(account)
        return privkey
    }

    const privateKey = createPrivateKey()
    const userId = user.uid
    
    const [cash_addr, slp_addr] = slputil.priv_to_publickey(SLP, privateKey)

    return firebase.database().ref('users/' + userId).set({
        private_key: privateKey,
        cash_addr: cash_addr,
        slp_addr: slp_addr,
        email: user.email
      });

  });

