const functions = require('firebase-functions');
const express = require('express');
const create_event = require('./create.js').create;
const mint_beer = require('./mint').mint
const burn_beer = require('./burn').burn

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();
const request = require('request')

const privkey_wif = "L4BwXDmjzEyzKHbAfGruhieUDPs8KTx7DMgqPk4aF9GefzgqPENV"
const tokenid = "9c06d069cb63aafc40c50b4c1f45d48e4fae4f77577a052c64073e76c98c85db"

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