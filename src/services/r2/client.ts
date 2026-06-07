import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '@/env'

let client: S3Client | null = null

function getR2Client(): S3Client {
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    })
  }
  return client
}

export async function uploadFile(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
  await getR2Client().send(new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
}

export async function getFileUrl(key: string, expiresIn = 3600): Promise<string> {
  return getSignedUrl(getR2Client(), new GetObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
  }), { expiresIn })
}
