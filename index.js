const express = require('express');
const app = express();
const mongoose = require('mongoose');

const SYSTEM_SETTINGS = {
    APP_TITLE : '',
    APP_ROOT : 'http://localhost',
    PORT : 3000,
    MONGO_HOST : 'localhost',
    MONGO_PORT : '27017',
    MONGO_DB : 'google_form',
    AT : ''
}

// @connect database
const dbURL = `mongodb://${SYSTEM_SETTINGS.MONGO_HOST}:${SYSTEM_SETTINGS.MONGO_PORT}/${SYSTEM_SETTINGS.MONGO_DB}?readPreference=primary&ssl=false`;
mongoose.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once ('open', () => console.log(`Mongo Connected. Database: ${SYSTEM_SETTINGS.MONGO_DB}. Port: ${SYSTEM_SETTINGS.MONGO_PORT}. Host: ${SYSTEM_SETTINGS.MONGO_HOST}`));
//mongoose.set('useFindAndModify', false);



app.use(express.json({limit: '500mb'}));
app.use(express.urlencoded({
  extended: true,
  limit: '500mb'
}));

app.use('/api', require('./api.js'));


app.listen(SYSTEM_SETTINGS.PORT, () => {
    console.log(`${SYSTEM_SETTINGS.APP_TITLE} is listening at port ${SYSTEM_SETTINGS.PORT}, Stable : ${SYSTEM_SETTINGS.AT}`);
    console.log(`Root URL Is : ${SYSTEM_SETTINGS.APP_ROOT}:${SYSTEM_SETTINGS.PORT}`);
})












