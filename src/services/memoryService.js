const { PutCommand, GetCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const docClient = require("../config/dynamodb");

const MEMORIES_TABLE = process.env.DYNAMODB_MEMORIES_TABLE || "Memories";

async function createMemory(memory) {
    await docClient.send(new PutCommand({
        TableName: MEMORIES_TABLE,
        Item: memory
    }));

    return memory;
}

async function listMemories(userId) {
    const result = await docClient.send(new QueryCommand({
        TableName: MEMORIES_TABLE,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
    }));

    return result.Items || [];
}

async function getMemory(userId, memoryId) {
    const result = await docClient.send(new GetCommand({
        TableName: MEMORIES_TABLE,
        Key: { userId, memoryId }
    }));

    return result.Item || null;
}

async function updateMemory(userId, memoryId, updates) {
    const memory = await getMemory(userId, memoryId);

    if (!memory) {
        return null;
    }

    const updated = {
        ...memory,
        ...updates,
        userId,
        memoryId,
        updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
        TableName: MEMORIES_TABLE,
        Item: updated
    }));

    return updated;
}

async function deleteMemory(userId, memoryId) {
    const memory = await getMemory(userId, memoryId);

    if (!memory) {
        return null;
    }

    await docClient.send(new DeleteCommand({
        TableName: MEMORIES_TABLE,
        Key: { userId, memoryId }
    }));

    return memory;
}

module.exports = { createMemory, listMemories, getMemory, updateMemory, deleteMemory };
