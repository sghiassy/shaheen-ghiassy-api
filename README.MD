

## Provisioning

### Setup

If you're on a new machine, you will need to configure the keys again by running

```
serverless config credentials --provider aws --key XXXXXXXX --secret XXXXXXX
```

### Passwords
The AWS Access Keys are stored in `provisioning/secrets.yml`. To decrypt the file you can run `ansible-vault view provisioning/secrets.yml`. The password for Ansible-vault is in 1password.

### SNS

I had to manually add the following to the SNS Topic for it to authorize the requester

```json
{
  "Sid": "__console_pub_0",
  "Effect": "Allow",
  "Principal": {
    "AWS": "*"
  },
  "Action": "SNS:Publish",
  "Resource": "arn:aws:sns:us-west-2:330949121912:SlsFormMailTopic"
}
```
