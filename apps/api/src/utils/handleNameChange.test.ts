import { beforeEach, describe, expect, it, mock } from 'bun:test'

const mockMakeDegen = mock()
const mockGetContractABI = mock()
const mockInterfaceDecode = mock()

const mockDegenInstance = {
  checkTokenMetadataExists: mock(),
  updateDegenName: mock(),
}

mock.module('@/classes/degen', () => ({
  MakeDegen: mockMakeDegen,
}))

mock.module('@/contracts', () => ({
  getContractABI: mockGetContractABI,
}))

mock.module('ethers', () => ({
  ethers: {
    Interface: class {
      decodeFunctionData(name: string, input: string) {
        return mockInterfaceDecode(name, input)
      }
    },
  },
}))

mock.module('json-colorizer', () => ({
  colorize: (s: string) => s,
  color: (s: string) => s,
}))

const { handleNameChangeById, handleNameChangeByInput } = await import('./handleNameChange')

beforeEach(() => {
  mockMakeDegen.mockClear()
  mockGetContractABI.mockClear()
  mockInterfaceDecode.mockClear()
  mockDegenInstance.checkTokenMetadataExists.mockClear()
  mockDegenInstance.updateDegenName.mockClear()
})

describe('handleNameChangeById', () => {
  it('updates metadata when the token already has metadata', async () => {
    mockMakeDegen.mockResolvedValue(mockDegenInstance)
    mockDegenInstance.checkTokenMetadataExists.mockResolvedValue({
      exists: true,
      metadata: { name: 'Old', id: 5 },
    })
    mockDegenInstance.updateDegenName.mockResolvedValue({
      newMetadata: { name: 'New', id: 5 },
    })

    const result = await handleNameChangeById('mainnet', 5)

    expect(mockMakeDegen).toHaveBeenCalledWith('mainnet')
    expect(mockDegenInstance.checkTokenMetadataExists).toHaveBeenCalledWith(5)
    expect(mockDegenInstance.updateDegenName).toHaveBeenCalledWith(5, { name: 'Old', id: 5 })
    expect(result).toEqual({ metadata: { name: 'New', id: 5 } })
  })

  it('returns undefined when the token has no metadata', async () => {
    mockMakeDegen.mockResolvedValue(mockDegenInstance)
    mockDegenInstance.checkTokenMetadataExists.mockResolvedValue({ exists: false, metadata: null })

    const result = await handleNameChangeById('mainnet', 99)
    expect(result).toBeUndefined()
    expect(mockDegenInstance.updateDegenName).not.toHaveBeenCalled()
  })
})

describe('handleNameChangeByInput', () => {
  it('decodes the input then delegates to handleNameChangeById', async () => {
    mockGetContractABI.mockReturnValue([{ type: 'function', name: 'changeName' }])
    mockInterfaceDecode.mockReturnValue([{ toNumber: () => 42 }])
    mockMakeDegen.mockResolvedValue(mockDegenInstance)
    mockDegenInstance.checkTokenMetadataExists.mockResolvedValue({
      exists: true,
      metadata: { name: 'X', id: 42 },
    })
    mockDegenInstance.updateDegenName.mockResolvedValue({ newMetadata: { name: 'Y' } })

    const result = await handleNameChangeByInput('mainnet', '0xdeadbeef')

    expect(mockGetContractABI).toHaveBeenCalledWith('mainnet', expect.anything())
    expect(mockInterfaceDecode).toHaveBeenCalledWith('changeName', '0xdeadbeef')
    expect(result).toEqual({ metadata: { name: 'Y' } })
  })
})
