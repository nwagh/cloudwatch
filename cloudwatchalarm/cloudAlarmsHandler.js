'use strict';


module.exports.createCloudwatchAlarm = (event, context, callback) => {

  var AWS = require('aws-sdk');
  var cw = new AWS.CloudWatch({apiVersion: '2010-08-01'});
  var message;

  var cpuAlarm = {
    AlarmName: 'EC2 Instance CPU Utilization',
    ComparisonOperator: 'GreaterThanThreshold',
    EvaluationPeriods: 1,
    MetricName: 'CPUUtilization',
    Namespace: 'AWS/EC2',
    Period: 60,
    Statistic: 'Average',
    Threshold: 1.0,
    ActionsEnabled: true,
    AlarmDescription: 'Alarm when server CPU exceeds 70%',
    AlarmActions: [ 'arn:aws:sns:us-east-1:980457846850:EmailNotifier' ],
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: event.InstanceId
      },
    ],
    Unit: 'Percent'
  };

  var memoryAlarm = {
    AlarmName: 'EC2 Instance Memory Utilization',
    ComparisonOperator: 'GreaterThanThreshold',
    EvaluationPeriods: 1,
    MetricName: 'MemoryUtilization',
    Namespace: 'System/Linux',
    Period: 60,
    Statistic: 'Average',
    Threshold: 1.0,
    ActionsEnabled: true,
    AlarmDescription: 'Alarm when server Memory exceeds 70%',
    AlarmActions: [ 'arn:aws:sns:us-east-1:980457846850:EmailNotifier' ],
    Dimensions: [
      {
        Name: 'InstanceId',
        Value: event.InstanceId
      },
    ],
    Unit: 'Percent'
  };

  cw.putMetricAlarm(cpuAlarm, function(err, data) {
    if (err) {
      message = "Error happened during creating metrics :" + err;
      console.log("Error", err);
    } else {
      cw.putMetricAlarm(memoryAlarm, function(err,data){
        if(err){
          message = "Error happened during creating metrics :" + err;
          console.log("Error", err);
        }else{
          message = data;
          console.log("Success", data);
        }
        });
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
