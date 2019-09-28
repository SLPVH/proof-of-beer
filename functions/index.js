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

exports.create_token = functions.https.onRequest(async (req, res) => {
    const txid = await create_event(
        req.body.privkey_wif,
        req.body.token_name,
        req.body.token_symbol
    ).catch((e)=>{
        console.log(e)
        res.sendStatus(500)
    }) 
    res.send(txid)
})