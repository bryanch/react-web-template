const express = require('express');
const config = require('../config');

const env=config.env;
const defaultDistName = 'dev';

var distName=null;
if(process.argv.length>2){
    var option=process.argv[2];
    if(option.startsWith('--dist=')){
        distName=option.split('=')[1];
    }
}

const distPrefix = "dist/";
distName = distName || env.dist || defaultDist;

var dist = distPrefix + distName;

function sendStaticFile(res, builtPath){
    res.sendFile(builtPath, {root: __dirname+'/../'+dist });
}

module.exports = {
    dist: dist,
    name: distName,
    sendStaticFile: sendStaticFile,
    static: function(){return express.static(dist);},
    withEnv: function(env){
        if(env&&env.dist){
            distName = env.dist;
            dist = distPrefix + distName;
        }

        return {
            dist: dist,
            name: distName
        };
    }
}
