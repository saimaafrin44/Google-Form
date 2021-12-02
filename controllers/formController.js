const express = require('express'); // module
const router = express.Router(); // module
const Utils = require('../helpers/utils'); // mongoose model
const User = require('../models/User'); // mongoose model
const Session = require('../models/Session'); // mongoose model
const Form = require('../models/Form'); // mongoose model
const FormStep = require('../models/FormStep'); // mongoose model
const FormItem = require('../models/FormItem'); // mongoose model

const moment = require('moment'); // module
const argon2 = require('argon2');




module.exports = {
    
   
    
    createForm: async function (req, res) {


        try{


            

            let token = Utils.createToken({label: 'Form'});
            let title = req.body.title;
            let description = req.body.description;

            const {usertoken, sessiontoken} = req.headers;
            let proceed = await Utils.authenticate(usertoken, sessiontoken);
    
            console.log(proceed);
    
            let dataToSave = {
                'token': token,
                'title' : title,
                'description' : description,
                'createdBy' : usertoken,
                'sessionToken' : sessiontoken,
                'status' : 'Active',
                'existence' : 1,

            }
            
            if(proceed === true){
                let createForm = Form.create(dataToSave);

                if(createForm){

                    let token = Utils.createToken({label: 'FormStep'});

                    let formStepDataToSave = {
                        'token': token,
                        'formToken': dataToSave.token,
                        'title' : '',
                        'description' : '',
                        'previousStepToken' : '',
                        'nextStepToken' : '',
                        'createdBy' : usertoken,
                        'sessionToken' : sessiontoken,
                        'status' : 'Active',
                        'existence' : 1,

                    }
                    let createFormStep = FormStep.create(formStepDataToSave);

                    if(createFormStep){
                        res.send({
                            'status': "Success",
                            'data': {} 
                        });
    
                    }

                }

                
 
            }
            else{
                res.send("Please log in first")
            }
                
        }
        catch(error){
            res.send({
                'status': "Error",
                'data': error
            })
        }
    },


    createFormItem: async function(req, res){

        let token = Utils.createToken({label: 'FormItem'});
        let formToken = req.body.formToken;
        let stepToken = req.body.stepToken;
        let title = req.body.title;
        let inputType = req.body.inputType;
        let required = req.body.required;
        let image = req.body.image;

        const {usertoken, sessiontoken} = req.headers;
        let proceed = await Utils.authenticate(usertoken, sessiontoken);

        console.log(proceed);

        if(proceed === true){
            try{
                let dataToSave = {
                    token : token,
                    formToken : formToken,
                    stepToken : stepToken,
                    title : title,
                    image : image,
                    required : required,
                    inputType : inputType,
                    status : 'Active',
                    existence: 1,
                    createdBy: usertoken,
                    sessiontoken: sessiontoken
                }

                

                // @check formToken formStepToken and user relation
                let checkFormStepAndUser = await FormStep.find({
                    'token' : stepToken,
                    'formToken' : formToken,
                    'createdBy' : usertoken
                });

                if(checkFormStepAndUser.length === 1){

                    // @ check inputType

                    let validInputType = Utils.inputType.includes(inputType);

                    if(validInputType === true){
                        let createFormItem = FormItem.create(dataToSave);

                        if(createFormItem){
                            res.send({
                                'status': "Success",
                                'data': {} 
                            });

                        }
                    }
                    else{
                        res.send("Invalid Input Type");
                    }


                }
                else{
                    res.send("Invalid Input");
                }

                

            }
            catch(error){
                res.send(error);
            }
        }


    }











}
