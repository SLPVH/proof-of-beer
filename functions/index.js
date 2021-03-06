const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const create_event = require('./create.js').create;
const mint_beer = require('./mint').mint
const burn_beer = require('./burn').burn
const airdrop = require('./dropbch').airdrop
let slputil = require("./slputil")
const history = require('./history').history

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();
const request = require('request')

const tokenid = "9c06d069cb63aafc40c50b4c1f45d48e4fae4f77577a052c64073e76c98c85db"
const cors = require('cors')({
    origin: ['*']
  });

const admin = require('firebase-admin');
  
firebase.initializeApp()

exports.get_history = functions.https.onCall(async(data, context) => {
    let user
    await admin.database().ref('users').child(context.auth.uid).once("value").then(d=>{
        user = d.val()
    })
    const res = await history(user.event.txid)

    return ({res})
})

exports.ssr = functions.https.onRequest((req, res) => {
    req.baseUrl = '';
    middleware(req, res);
});

exports.create_token = functions.https.onCall(async (data, context) => {
    let user
    await admin.database().ref('users').child(context.auth.uid).once("value").then(d=>{
        user = d.val()
    })
    const txid = await create_event(
        user.private_key,
        data.token_name,
        data.token_symbol
    ).catch((e)=>{
        console.log(e)
        return({error:e})
    })
    await admin.database().ref('users').child(context.auth.uid).child('event')
    .set({
        txid: txid,
        token_name: data.token_name,
        token_symbol: data.token_symbol,
        price: data.price,
        url: data.url
    })
    return({txid})
})

exports.mint_beer = functions.https.onCall(async (data, context) => {
    let user
    await admin.database().ref('users').child(context.auth.uid).once("value").then(d=>{
        user = d.val()
    })
    const txid = await mint_beer(
        user.event.txid,
        data.quantity,
        user.private_key,
        data.dst_slpaddr
    ).catch((e)=>{
        console.log(e)
        return({error:e})
    })
    return({txid})
})

exports.end_event = functions.https.onCall(async (data, context) => {
    let user

    await admin.database().ref('users').child(context.auth.uid).once("value").then(d=>{
        user = d.val()
    })

    const burn_txid = await burn_beer(user.private_key, user.event.txid).catch(e=>{
        console.log(e)
        return ({error:e})
    })

    const drop_txid = await airdrop(user.private_key, user.event.txid).catch(e=>{
        console.log(e)
        return({error:e})
    })

    await admin.database().ref('users').child(context.auth.uid).child('event')
    .set({eventName: "eventName"})
    
    return ({burn_txid, drop_txid})
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

