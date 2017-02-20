'use strict';

const _ = require('lodash');
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const qs = require('qs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const AWS_CONF = require('../../config/aws.json');
const FORM_CONF = require('../../config/form.json');

const REGION = AWS_CONF['region'];
const FORM_KEYS = FORM_CONF['formKeys'];
const TOPIC_NAME = FORM_CONF['topicName'];
const MAIL_TITLE = "[Contact Form Submission] - " + new Date();
const DUMMY_ACCOUNT_ID = 111582575083;
const HEADERS = {
  "Access-Control-Allow-Origin" : "http://shaheenghiassy.com", // Required for CORS support to work
  "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
};

function format_email(dictionary) {
  var message = "\n";

  FORM_KEYS.forEach(function(val, i) {
    if (dictionary[val] === undefined) {
      console.log('Message is deemed invalid: ', message);
      message = false;
      return message;
    } else {
      message += val.toUpperCase() + "\n" + entities.decode("" + dictionary[val]) + "\n\n";
    }
  });

  message += "\n\n-----\n\n";
  return message;
}

module.exports.submit = (event, context, callback) => {
  const accountId = _.get(context, ".invokedFunctionArn.split(':')[4]", DUMMY_ACCOUNT_ID);
  const TOPIC_ARN = 'arn:aws:sns:' + REGION + ':' + accountId + ':' + TOPIC_NAME;

  // create callback
  const done = (err, result) => {
    callback(null, {
      statusCode: err ? '500' : '200',
      headers: HEADERS,
      body: JSON.stringify({'status': err ? 'bad': 'roger'})
    });
  };

  const message = format_email(qs.parse(event.body));

  if (message) {
    console.log('Message is valid');
    console.log('Publishing message:\n', message);
    sns.publish({
      Message: message,
      Subject: MAIL_TITLE,
      TopicArn: TOPIC_ARN
    }, (err, result) => {
      console.log('SNS Publish completed', err, result);
      done(err, result);
    });
  } else {
    done(true, 'The message is NOT valid');
  }
};
