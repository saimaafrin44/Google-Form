const express = require('express'); // module
const router = express.Router(); // module
const Utils = require('../helpers/utils'); // mongoose model
const User = require('../models/User'); // mongoose model
const Session = require('../models/Session'); // mongoose model
const Form = require('../models/Form'); // mongoose model
const FormStep = require('../models/FormStep'); // mongoose model
const FormItem = require('../models/FormItem'); // mongoose model
const ItemOption = require('../models/ItemOption'); // mongoose model

const moment = require('moment'); // module
const argon2 = require('argon2');
const { title } = require('process');




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

        let totalDocument = await FormItem.find();

        let positionKey = totalDocument.length + 1;

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
                    sessiontoken: sessiontoken,
                    positionKey: positionKey
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


    },

    createFormStep: async function(req, res){

        let token = Utils.createToken({label:'formStep'});
        let formToken = req.body.formToken;
        let title = req.body.title;
        let description = req.body.description;

        const {usertoken, sessiontoken} = req.headers;


        let proceed = await Utils.authenticate(usertoken, sessiontoken)


        try{

            if(proceed === true){
                //@ check form existence 

            let checkForm = await Form.find({
                token : formToken,
                status : 'Active',
                existence : 1
            });

            //console.log(checkForm);

            if(checkForm.length === 1){
                //console.log("hi");
                let findPreviousStep = await FormStep.find({
                    formToken : formToken,
                    status : "Active",
                    existence: 1
                }).sort({"createdAt":"desc"}).limit(1).exec();

                //console.log(findPreviousStep);
        
        
                if(findPreviousStep.length === 1){


                    let updatePreviousStep = await FormStep.findOneAndUpdate(
                        {_id : findPreviousStep[0]._id},
                        {'$set': {nextStepToken : token}},{new : true}
                    );

                    if(updatePreviousStep){
                        let dataToSave = {

                            token : token,
                            formToken : formToken,
                            title : title,
                            description : description,
                            previousStepToken : findPreviousStep[0].token,
                            nextStepToken : '',
                            status : 'Active',
                            existence : 1,
                            createdBy : usertoken,
                            sessionToken : sessiontoken
            
                        }
    
                        let createStep = await FormStep.create(dataToSave);
    
                        if(createStep){
                            res.send("Success");
                        }

                    }
                    
                }

            }
            else{
                res.send("Form doesn't Exist");
            }

            }
            else{
                res.send("Please log in First");
            }
        }
        catch(error){
            res.send(error);
        }

    },


    editForm: async function(req, res){

        let formToken = req.params.formToken;
        const {usertoken, sessiontoken} = req.headers;
        let {title, description} = req.body;

        let proceed = await Utils.authenticate(usertoken, sessiontoken);
        //console.log(proceed)

        try{

            if(proceed === true){
                

                //@check form
                let checkForm = await Form.find({
                    token : formToken,
                    status : 'Active',
                    existence : 1,
                    createdBy : usertoken     
                });

                //console.log(checkForm);

                if(checkForm.length === 1){

                    if (title != undefined){
                        titleToUpdate = title;
                    }
                    else{
                        titleToUpdate = checkForm[0].title;
                    }
                    if (description != undefined){
                        descriptionToUpdate = description;
                    }
                    else{
                        descriptionToUpdate = checkForm[0].description;
                    }

                    dataToUpdate = {
                        title : titleToUpdate,
                        description : descriptionToUpdate
                    }

                    let updateForm = await Form.findOneAndUpdate(
                        {_id : checkForm[0]._id},
                        {'$set': dataToUpdate},
                        {new : true}
                    )

                    if(updateForm){
                        res.send("Success Edit")
                    }
                }
            }

        }
        catch(error){
            res.send(error);
        }

    },

    createFormItemOption: async function(req, res){

        let token = Utils.createToken({label : 'itemOption'});
        const {usertoken, sessiontoken} = req.headers;
        const { formToken, stepToken, itemToken, itemType, items} = req.body;
        let proceed = await Utils.authenticate(sessiontoken, usertoken);

        try{

            let otherList = [];

            for(let i = 0; i < items.length; i++){

                //let thisItem = items[i];

                if(data[i].titleType === 'other'){
                    otherList.push(i)
                }
            }

            if(otherList.length === 1){
                let lastIndex = data.length - 1;
                if(otherList[0] !== lastIndex){
                    proceed = false;
            }
        }
        else{
            proceed = false;
        }

        if (proceed) {

            let newItemOption;
            for (let i = 0; i < items.length; i++) {
                newItemOption = await ItemOption.create({
                    'token': token,
                    "formToken": formToken,
                    "stepToken": stepToken,
                    "itemToken": itemToken,
                    "title": items[i].title,
                    "itemType": itemType,
                    "titleType": data[i].titleType,
                    "status": "Active",
                    "existence": 1,
                    "createdBy": usertoken,
                    "sessionToken": sessiontoken,
                });
            }
            res.send({
                "type": "success",
                "data": newItemOption
            });    

        }
    }
        catch(error){
            res.send(error);
        }

    },


    updateItemPositionKey: async function(req, res){

        const {usertoken, sessiontoken} = req.headers;
        let proceed = await Utils.authenticate(usertoken, sessiontoken);
        let formToken = req.body.formToken;
        let stepToken = req.body.stepToken;
        let data = req.body.data;

        try{


            // @ checkForm
            let checkForm = await FormStep.find({
                'token' : stepToken,
                'formToken' : formToken

            })

            if(checkForm.length === 0){
                proceed = false;
            }

            // @check step
            if(proceed === true){

                console.log(proceed);

                for(let i = 0; i < data.length; i++){
                    let thisData = data[i];

                    let updatePositionKey = await FormItem.findOneAndUpdate(
                        {'token' : thisData.itemToken},
                        {'$set' : {positionKey : thisData.positionKey}},
                        {new : true}
                    )
                }

                res.send("Items position keys updated")
            }


        }
        catch(error){
            res.send(error);
        }
    }











}
