import { config } from 'node-config-ts'
import { S3Client, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3'
import path from 'path'

const client = new S3Client(config.aws.s3.clientConfig)

type ExtType = '.png' | '.mp4' | '.gif' | '.json'

const mimeTypes = {
  '.png': 'image/png',
  '.mp4': 'video/mp4',
  '.gif': 'image/gif',
  '.json': 'application/json',
}

export const uploadToS3 = async (
  fileName: string,
  content: PutObjectCommandInput['Body'],
  retry = true,
  baseDirectory = ''
): Promise<void> => {
  const params = {
    Bucket: config.aws.s3.bucket,
    Key: `${baseDirectory}/${fileName}`,
    Body: content,
    ContentType: mimeTypes[path.extname(fileName) as ExtType] || 'application/json',
    ACL: 'public-read',
  } as PutObjectCommandInput

  try {
    const command = new PutObjectCommand(params)
    const response = await client.send(command)
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error(`Failed to upload to S3: ${response.$metadata.httpStatusCode}`)
    }
    console.log(`✅ Content uploaded to S3 ${baseDirectory}/${fileName}`)
  } catch (err) {
    console.error(err)
    // Retry once, awaiting the result so callers don't resolve before the
    // retry attempt completes (previous fire-and-forget call).
    if (retry) return uploadToS3(fileName, content, false, baseDirectory)
  }
}
