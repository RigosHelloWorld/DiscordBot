import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../deps'))
from discord_interactions import verify_key
import boto3

ssm_client = boto3.client('ssm')

SSM_PUBLIC_KEY = os.environ.get("DISCORD_SSM_PUBLIC_KEY", "")
SSM_KEYS = [SSM_PUBLIC_KEY]


def validate_ssm_keys():
    for key in SSM_KEYS:
        if not key:
            raise ValueError("Missing environment variable")

def is_valid_signature(event):
    headers = event['headers']
    body = event.get('body', '')
    body_bytes = body.encode('utf-8')
    response = ssm_client.get_parameter(
            Name=SSM_PUBLIC_KEY,
            WithDecryption=False
        )
    public_key =  response['Parameter']['Value']
    return verify_key(body_bytes, headers.get('x-signature-ed25519'), headers.get('x-signature-timestamp'), public_key)


def handler(event, context):
    validate_ssm_keys()

    if not is_valid_signature(event):
        return { "statusCode": 401, "body": "invalid request signature" }

    body = event.get('body', '')
    data = json.loads(body)
    cmd = data.get("data", {}).get("name", "")

    if data["type"] == 1:  # PING
        return { "statusCode": 200, "body": json.dumps({ "type": 1 }) }
    elif cmd == "leetcode":
        return {
            "statusCode": 200,
            "body": json.dumps({
                "type": 4,
                "data": { "content": "LeetCode handler here." }
            })
        }

    return { "statusCode": 200, "body": json.dumps({ "type": 4, "data": { "content": "Unknown command" } }) }
