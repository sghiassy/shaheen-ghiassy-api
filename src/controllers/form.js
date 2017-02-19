'use strict';

const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const qs = require('qs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const CONF = require('../../config/form.json');

const TOPIC_NAME = CONF['topicName'];
const FORM_KEYS = CONF['formKeys'];
const REGION = 'us-west-2';
const ACCOUNT_ID = '111582575083';
const TOPIC_ARN = 'arn:aws:sns:' + REGION + ':' + ACCOUNT_ID + ':' + TOPIC_NAME;
const MAIL_TITLE = "[Contact Form Submission] - " + new Date();

module.exports.submit = (event, context, callback) => {
  // create callback
  const done = (err, result) => callback(null, {
    statusCode: err ? '500' : '200',
    body: JSON.stringify({'status':err ? 'bad': 'roger'}),
    headers: {
        "Access-Control-Allow-Origin" : "http://shaheenghiassy.com", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
  });

  var obj = qs.parse(event.body);
  var message = "";
  var validMessage = true;

  FORM_KEYS.forEach(function(val, i) {
    if (obj[val] === undefined) {
      validMessage = false;
    }
    message += val.toUpperCase() + "\n" + entities.decode("" + obj[val]) + "\n\n";
  });

  message += "\n\n-----\n\n";

  if (validMessage) {
    sns.publish({
      Message: message,
      Subject: MAIL_TITLE,
      TopicArn: TOPIC_ARN
    }, done);
  } else {
    done();
  }
};
