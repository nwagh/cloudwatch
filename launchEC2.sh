#! /bin/sh

for i in {1..2}
do
echo "Launching Linux"$i 

aws ec2 run-instances --image-id ami-4fffc834 --iam-instance-profile 'Arn=arn:aws:iam::<account_id>:instance-profile/AmazonEC2RoleforSSM' --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=Linux$i},{Key=environment,Value=Production}]" --count 1 --instance-type t2.micro --key-name <key_name> --security-group-ids sg-34dc4847 --user-data file://conf/user-data-file

aws ec2 run-instances --image-id ami-27a58d5c --iam-instance-profile 'Arn=arn:aws:iam::<account_id>:instance-profile/AmazonEC2RoleforSSM' --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=Windows$i}]" --count 1 --instance-type t2.micro --key-name <key_name> --security-group-ids sg-cdbf2bbe

done
