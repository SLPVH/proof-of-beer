const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const create_event = require('./create.js').create;
let slputil = require("./slputil")

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();

const cors = require('cors')({
    origin: true
  });
  
admin.initializeApp()

exports.ssr = functions.https.onRequest((req, res) => {
    req.baseUrl = '';
    middleware(req, res);
});

exports.create_token = functions.https.onCall(async (data, context) => {
    const txid = await create_event(
        data.privkey_wif,
        data.token_name,
        data.token_symbol
    ).catch((e)=>{
        console.log(e)
        res.sendStatus(e)
    }) 
    res.send(txid)
})

exports.createUserData = functions.auth.user().onCreate((user) => {
    let SLP = slputil.get_slpsdk()

    const private_key = function gen_privkey() {
        let mnemonic = SLP.Mnemonic.generate()
        let rootseed = SLP.Mnemonic.toSeed(mnemonic)
        let hdnode = SLP.HDNode.fromSeed(rootseed)
        const account = SLP.HDNode.derivePath(hdnode, "m/44'/145'/0'")
        const privkey = SLP.HDNode.toWIF(account)
        return privkey
    }
    
    const [cash_addr, slp_addr] = slputil.priv_to_publickey(SLP, private_key)

    firebase.database().ref('users/' + userId).set({
        private_key: private_key,
        cash_addr: cash_addr,
        slp_addr: slp_addr,
        email: user.email
      });

  });

