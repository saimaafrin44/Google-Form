const express = require('express'); // module
const router = express.Router(); // module
const Utils = require('../helpers/utils'); // mongoose model
const User = require('../models/User'); // mongoose model
const Session = require('../models/Session'); // mongoose model

const moment = require('moment'); // module
const argon2 = require('argon2');


module.exports = {
   
    
    createUser: async function (req, res) {


        try{
    
            let token = Utils.createToken({label: 'User'});
            let name = req.body.name;
            let username = req.body.username;
            let password = req.body.password;
    
            let passwordHash = await argon2.hash(password);
            //console.log(passwordHash)
    
            let checkAlreadyExistOrNot = await User.find({
                'username':username
            });
    
            let dataToSave = {
                'token': token,
                'name' : name,
                'username' : username,
                'password' : passwordHash      
            }
            if(checkAlreadyExistOrNot.length === 0){
                let createUser = new User(dataToSave);
                let records = await createUser.save();
    
                res.send({
                    'status': "Success",
                    'data': {} 
                });
            }
            else{
                res.send({
                    'status': "UserName Already Exist! Please Try Another",
                    'data': {} 
                });
    
            }
    
            
        }
        catch(error){
            res.send({
                'status': "Error",
                'data': error
            })
        }
    },



    userLogin: async function (req, res) {


        try{
            let proceed = true;
    
            let today = moment().format('YYYY-MM-DD');
            
            let username = req.body.username;
            let password = req.body.password;
    
            
    
            let checkUser = await User.find({
                'username' : username,
            });
            if(checkUser.length != 0){
    
                for(let i = 0; i < checkUser.length; i++){
                    let thisUser = checkUser[i];
    
                
    
                    if (await argon2.verify(thisUser.password, password)) {
                        console.log('password match')
    
                        
    
                        let token = Utils.createToken({label:''});
                        let ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
                        let sessionDataToSave = {
                            'token' : token,
                            'userToken' : thisUser.token,
                            'ipAddress' : ipAddress,
                            'sessionEndedAt' : 'Hi',
                            'status' : 'Active'
                        }
    
                        let dataSave = new Session(sessionDataToSave);
                        await dataSave.save();
    
                        if(dataSave){
                            res.send({
                                'status': "Login Success",
                                'data': {
                                    'session': sessionDataToSave
                                } 
                            });
                        }
    
    
                        } else {
                        console.log('password did not match')
                        }
    
                }
            }
                    
                
            else{
                res.send({
                    'status': "User doesn't exist!!",
                    'data': {} 
                });
            } 
         
        }
        catch(error){
            res.send({
                'status': "Error",
                'data': error
            })
        }
        
        
    },

    userLogout: async function (req, res) {


        let {usertoken, sessiontoken} = req.headers;
        let today = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    
        let proceed = await Utils.authenticate(usertoken, sessiontoken);
    
        console.log(proceed);
    
        try{
            let dataToUpdate = {
                'status' : "Inactive",
                'sessionEndedAt' : today
            }
            if(proceed === true){
    
                let sessionRecords = await Session.findOneAndUpdate(
                    {'token' : sessiontoken},
                    {'$set' : dataToUpdate},
                    {new : true}
                );
                if(sessionRecords){
                    res.send("logged out")
                }
            }
            else{
                res.send("You are not Logged In")
            }
    
        }
        catch(error){
    
            res.send(error)
    
        }     
    },





}
