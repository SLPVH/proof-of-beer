const functions = require('firebase-functions');
const express = require('express');
const create_event = require('./create.js').create;

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();

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