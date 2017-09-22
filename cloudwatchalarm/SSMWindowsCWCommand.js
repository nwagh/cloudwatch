'use strict';


module.exports.executeSSMWindowsCWcommand = (event, context, callback) => {

  var AWS = require('aws-sdk');
  var ssm = new AWS.SSM();
  var message;

  var commandStr = {
      "IsEnabled": true,
      "EngineConfiguration": {
          "PollInterval": "00:00:30",
          "Components": [
              {
                  "Id": "PerformanceCounter",
                  "FullName": "AWS.EC2.Windows.CloudWatch.PerformanceCounterComponent.PerformanceCounterInputComponent,AWS.EC2.Windows.CloudWatch",
                  "Parameters": {
                      "CategoryName": "Memory",
                      "CounterName": "Available MBytes",
                      "InstanceName": "",
                      "MetricName": "Memory",
                      "Unit": "Megabytes",
                      "DimensionName": "InstanceId",
                      "DimensionValue": event.instanceId
                  }
              },
              {
                  "Id": "PerformanceCounter2",
                  "FullName": "AWS.EC2.Windows.CloudWatch.PerformanceCounterComponent.PerformanceCounterInputComponent,AWS.EC2.Windows.CloudWatch",
                  "Parameters": {
                      "CategoryName": "LogicalDisk",
                      "CounterName": "% Free Space",
                      "InstanceName": "_Total",
                      "MetricName": "LogicalDisk",
                      "Unit": "Percent",
                      "DimensionName": "InstanceId",
                      "DimensionValue": event.instanceId
                  }
              },
              {
                  "Id": "CloudWatch",
                  "FullName": "AWS.EC2.Windows.CloudWatch.CloudWatch.CloudWatchOutputComponent,AWS.EC2.Windows.CloudWatch",
                  "Parameters":
                  {
                      "AccessKey": "",
                      "SecretKey": "",
                      "Region": "us-east-1",
                      "NameSpace": "Windows/Default"
                  }
              }
          ],
          "Flows": {
              "Flows":
              [
                  "PerformanceCounter,CloudWatch","PerformanceCounter2,CloudWatch"
              ]
          }
      }
  };

  console.log("commandStr", JSON.stringify(commandStr));

  var params = {
  DocumentName: "AWS-ConfigureCloudWatch", /* required */
  Comment: "Configure CloudWatch Metrics for Windows",
  InstanceIds: [
    event.instanceId
  ],
  Parameters: {
    'status': ['Enabled'],
      /* more items */
    'properties': [ JSON.stringify(commandStr) ]
    /* '<ParameterName>': ... */
  },
  TimeoutSeconds: 600
};

  console.log("params", params);

  ssm.sendCommand(params, function(err, data) {
    if (err) {
      message = "Error happened during creating metrics :" + err;
      console.log("Error", err);
    } else {
      message = data;
      console.log("Success", data);
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
