const functions = require('firebase-functions');
const express = require('express');
const create_event = require('./create');

// We have to import the built version of the server middleware.
const { sapper } = require('./__sapper__/build/server/server');
const middleware = sapper.middleware();

exports.ssr = functions.https.onRequest((req, res) => {
    req.baseUrl = '';
    middleware(req, res);
});

exports.create_token = functions.https.onRequest((req, res) => {
    res.send("asdasd")
})