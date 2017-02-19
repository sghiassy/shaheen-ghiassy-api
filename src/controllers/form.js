'use strict';

const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const qs = require('qs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const CONF = require('../../config/form.json');
const FORM_KEYS = CONF['formKeys'];
const TOPIC_ARN = 'arn:aws:sns:us-west-2:111582575083:SlsFormMailTopic';
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
    console.log('Message is valid');
    console.log('Publishing message', message);
    sns.publish({
      Message: message,
      Subject: MAIL_TITLE,
      TopicArn: TOPIC_ARN
    }, function(err, result) {
      console.log('SNS Publish completed', err, result);
      done(err, result);
    });
  } else {
    console.log('The message is NOT valid');
    console.log('Discarding message', message);
    done(true, 'The message is NOT valid');
  }
};
