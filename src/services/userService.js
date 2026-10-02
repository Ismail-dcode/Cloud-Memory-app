const { PutCommand, GetCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("../config/dynamodb");

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "Users";

async function findUserByEmail(email) {
    const result = await docClient.send(new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email.toLowerCase() }
    }));

    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

async function findUserById(userId) {
    const result = await docClient.send(new GetCommand({
        TableName: USERS_TABLE,
        Key: { userId }
    }));

    return result.Item || null;
}

async function findUserByUsername(username) {
    const result = await docClient.send(new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: { ":username": username.toLowerCase() }
    }));

    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
}

async function createUser(user) {
    await docClient.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: user
    }));

    return user;
}

async function updateUser(userId, updates) {
    const user = await findUserById(userId);

    if (!user) {
        return null;
    }

    const updated = { ...user, ...updates, userId };

    await docClient.send(new PutCommand({
        TableName: USERS_TABLE,
        Item: updated
    }));

    return updated;
}

module.exports = { findUserByEmail, findUserById, findUserByUsername, createUser, updateUser };
