#! /bin/sh

for instance in `aws ec2 describe-instances | grep "InstanceId"|awk -F'"' '{print $4}'`
do
echo $instance

aws cloudwatch put-metric-alarm --alarm-name cpu-mon-$instance --alarm-description "Alarm when CPU exceeds 70 percent" --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 70 --comparison-operator GreaterThanThreshold  --dimensions "Name=InstanceId,Value=$instance" --evaluation-periods 2 --alarm-actions arn:aws:sns:us-east-1:<account_id>:EmailNotifier --unit Percent

done
