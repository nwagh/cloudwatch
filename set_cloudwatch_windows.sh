#! /bin/sh
set -vx

for instance in `aws ec2 describe-instances --filters "Name=image-id,Values=ami-27a58d5c" "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[*].[InstanceId]'|grep '"'`
do
 echo $instance
 aws lambda invoke --invocation-type RequestResponse --function-name cloudwatch-dev-executeSSMWindowsCWcommand --log-type Tail --payload "{\"instanceId\":"$instance"}" /tmp/outfile

done
