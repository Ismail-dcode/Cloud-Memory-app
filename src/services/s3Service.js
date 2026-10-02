const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: process.env.AWS_REGION
});

async function uploadToS3({ key, body, contentType }) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: contentType
    });

    await s3.send(command);

    return { key };
}

async function getPhotoUrl(key) {
    const { GetObjectCommand } = require("@aws-sdk/client-s3");

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });

    // Private bucket: URLs expire after 1 hour
    return getSignedUrl(s3, command, { expiresIn: 3600 });
}

async function deleteFromS3(key) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    });

    await s3.send(command);
}

module.exports = { uploadToS3, deleteFromS3, getPhotoUrl };
