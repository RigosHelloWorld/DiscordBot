# DiscordBot

A serverless Discord bot powered by AWS Lambda, API Gateway, and AWS CDK. This bot supports slash commands like `/leetcode` and is designed with modular infrastructure using TypeScript and Python.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (configured with appropriate credentials)
- [Python 3.10](https://www.python.org/downloads/release/python-3100/)
- [pip](https://pip.pypa.io/en/stable/)
- [AWS CDK v2](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)  
  Install via:
  ```bash
  npm install -g aws-cdk
  ```

## 📐 Architecture Overview

- **AWS CDK (TypeScript)**: Defines infrastructure for API Gateway, Lambda, IAM, and SSM parameters.
- **Lambda Function (Python)**: Handles Discord interactions and verifies requests.
- **API Gateway**: Public HTTP endpoint for Discord to call your bot.
- **SSM Parameter Store**: Stores environment values like Discord bot tokens and public key.

## 🚀 Getting Started

### 1. Clone the repo

```
git clone https://github.com/RigosHelloWorld/DiscordBot.git
cd DiscordBot
```

### 2. Setup .env

```bash
BOT_NAME=YourBotName
APPLICATION_ID=YourApplicationId
DISCORD_PUBLIC_KEY=YourPublicKey
DISCORD_BOT_TOKEN=YourBotToken
```

### 3. Install dependencies

```bash
npm run setup
```

### 4. Deploy the cdk app

```bash
npm run deploy
```

### Post Deploy

ℹ️ After deploying with npm run deploy, a post-deploy script will automatically fetch and print your Discord API Gateway interaction URL to the terminal — no need to check the AWS Console manually.

ex.
```
✅ Fetching API Gateway URL from SSM: <SSM_PARAMETER>
✅ Discord Interactions Endpoint URL: <ENDPOINT>
```


🧪 NPM Scripts

| Script                | Description                         |
| --------------------- | ----------------------------------- |
| `npm run setup`       | Install all the dependencies        |
| `npm run deploy`      | Deploy the CDK stacks to AWS        |
| `npm run bye-bye`     | Destroy the deployed stacks         |
| `npm run post-deploy` | Deploy + fetch API URL from SSM     |
| `npm run get-api-url` | Fetch API Gateway endpoint from SSM |

## 📦 Slash Command Registration

Slash commands need to be registered using HTTP see [Registering a Command](https://discord.com/developers/docs/interactions/application-commands)

Small example below using curl

```bash
APPLICATION_ID=your_application_id
BOT_TOKEN=your_bot_token

curl -X POST https://discord.com/api/v10/applications/$APPLICATION_ID/commands \
  -H "Authorization: Bot $BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "leetcode",
    "description": "Start a LeetCode challenge",
    "type": 1
}'
```
