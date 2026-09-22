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

/**
 * CDN objects are immutable by policy, except metadata JSON, which webhooks
 * rewrite in place and which the cdn.niftyleague.com cache rules serve with a
 * short TTL ("immutable statics, 5min mutable metadata"). Without this header
 * an uploaded object inherits zone defaults instead of the policy its
 * consumers expect.
 */
const cacheControlFor = (key: string): string =>
  key.includes('/metadata/') ? 'public, max-age=300' : 'public, max-age=31536000, immutable'

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
    CacheControl: cacheControlFor(`${baseDirectory}/${fileName}`),
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
