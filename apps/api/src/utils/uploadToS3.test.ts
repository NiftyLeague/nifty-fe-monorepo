import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const commandMock = mock()
const sendMock = mock()

mock.module('node-config-ts', () => ({
  config: {
    aws: {
      s3: { bucket: 'assets-bucket', clientConfig: { region: 'us-east-1' } },
    },
  },
}))
mock.module('@aws-sdk/client-s3', () => ({
  S3Client: class {
    get send() {
      return sendMock
    }
  },
  PutObjectCommand: class {
    constructor(params: unknown) {
      commandMock(params)
    }
  },
}))

// uploadToS3 creates `client = new S3Client(...)` at module top-level, so it must
// be imported AFTER the mocks above are registered (bun does not hoist mock.module
// like Bun's mock module API).
const uploadToS3 = (await import('./uploadToS3')).uploadToS3

beforeEach(() => {
  ;(commandMock.mockClear(), sendMock.mockClear())
  commandMock.mockClear()
  sendMock.mockClear()
  spyOn(console, 'log').mockImplementation(() => undefined)
  spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('uploadToS3', () => {
  it('uploads image content with its MIME type and base directory', async () => {
    sendMock.mockResolvedValue({ $metadata: { httpStatusCode: 200 } })

    await uploadToS3('character.png', Buffer.from('image'), true, 'mainnet/images')

    expect(commandMock).toHaveBeenCalledWith(
      expect.objectContaining({
        Bucket: 'assets-bucket',
        Key: 'mainnet/images/character.png',
        ContentType: 'image/png',
        ACL: 'public-read',
      })
    )
  })

  it('defaults unknown extensions to JSON', async () => {
    sendMock.mockResolvedValue({ $metadata: { httpStatusCode: 200 } })

    await uploadToS3('metadata.unknown', '{}', false)

    expect(commandMock).toHaveBeenCalledWith(
      expect.objectContaining({ Key: '/metadata.unknown', ContentType: 'application/json' })
    )
  })

  it('retries one failed upload and then stops', async () => {
    sendMock
      .mockResolvedValueOnce({ $metadata: { httpStatusCode: 503 } })
      .mockResolvedValueOnce({ $metadata: { httpStatusCode: 200 } })

    await uploadToS3('metadata.json', '{}')
    expect(sendMock).toHaveBeenCalledTimes(2)
  })

  it('does not retry when retry is disabled', async () => {
    sendMock.mockRejectedValue(new Error('network unavailable'))

    await uploadToS3('metadata.json', '{}', false)

    expect(sendMock).toHaveBeenCalledTimes(1)
  })
})
