#! /bin/sh
set -vx

for instance in `aws ec2 describe-instances --filters "Name=image-id,Values=ami-4fffc834" "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId]'|grep '"'`
do
 echo $instance
 aws lambda invoke --invocation-type RequestResponse --function-name cloudwatch-dev-createCloudwatchAlarm --log-type Tail --payload "{\"InstanceId\":"$instance"}" /tmp/outfile

done
