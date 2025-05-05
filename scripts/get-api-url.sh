
#!/bin/bash
set -e

BOT_NAME=$(grep '^BOT_NAME=' .env | cut -d '=' -f2)

if [[ -z $BOT_NAME ]]; then 
    echo "❌ BOT_NAME not found in .env"
    exit 1
fi

PARAMETER_NAME="/Discord/${BOT_NAME}/ApiUrl"

echo "✅ Fetching API Gateway URL from SSM: $PARAMETER_NAME"

URL=$(aws ssm get-parameter --name "$PARAMETER_NAME" --with-decryption --query 'Parameter.Value' --output text)

if [[ -z "$URL" ]]; then
  echo "❌ Parameter not found or empty"
  exit 1
fi

echo "✅ Discord Interactions Endpoint URL: $URL"