const express = require('express'); // module
const User = require('../models/User'); // mongoose model
const Session = require('../models/Session'); // mongoose model






// @returns a random number 
const numRand = (length) => {
    let result           = [];
    let characters       = '123456789';
    let charactersLength = characters.length;
    for ( let j = 0; j < length; j++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
   return result.join('');
}

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

const createToken = (t) => {
    let token = getRandomString(2) + numRand(2) + t.label + getRandomString(2) + numRand(2);
    return token;
} 

const unixMS = () => {
    return moment().format('x');
 }

 const commonColumns = () => {
    return {
        "status" : 'Active',
        "existence" : 1,
        "createdBy" : "Authorized User"
    }
  }


 const authenticate = async ( usertoken, sessiontoken) => {
    try{

        //check headers

        let checkSessionExistence = await Session.find({
            'userToken' : usertoken,
            'token' : sessiontoken,
            'sessionEndedAt' : "Hi",

        })

        if(checkSessionExistence.length === 1){
            return true;
        }
        else{
            return false;
        }


    }
    catch(error){
        res.send(error);

    }


 }

 let inputType = ["Short Text", "Long Text", "File", "Radio Button", "Checkbox"];


 

 

exports.numRand = numRand;
exports.getRandomString = getRandomString;
exports.createToken = createToken;
exports.unixMS = unixMS;
exports.authenticate = authenticate;
exports.commonColumns = commonColumns;
exports.inputType = inputType;
