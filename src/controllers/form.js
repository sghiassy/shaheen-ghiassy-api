'use strict';

const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const qs = require('qs');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const conf = require('../../config/form.json');

module.exports.submit = (event, context, callback) => {
  console.log('The Context is', context);
  const functionArnCols = context.invokedFunctionArn.split(':');
  const region = functionArnCols[3];
  const accountId = functionArnCols[4];
  const topicArn = 'arn:aws:sns:' + region + ':' + accountId + ':' + topicName;

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

  formKeys.forEach(function(val, i) {
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
      TopicArn: topicArn
    }, done);
  } else {
    done();
  }
};
