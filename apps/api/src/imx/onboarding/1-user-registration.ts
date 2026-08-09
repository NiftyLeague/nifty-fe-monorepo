import { config } from 'node-config-ts'
import type { TargetNetwork, Signer } from '@/types'
import { getWallet } from '@/utils/wallet'
import { getUser, registerUser } from '@/imx/client'

const network = config.eth.network as TargetNetwork

;(async (): Promise<void> => {
  console.group('IMX-USER-REGISTRATION')
  const { client } = config.imx[network]
  const signer = getWallet<Signer>()
  const address = (await signer.getAddress()).toLowerCase()

  console.log('Registering user...')

  let existingUser
  let newUser
  try {
    // Fetching existing user
    existingUser = await getUser(client.publicApiUrl, address)
  } catch {
    try {
      // If user doesnt exist, create user
      newUser = await registerUser(client.publicApiUrl, signer)
    } catch (error) {
      throw new Error(JSON.stringify(error, null, 2), { cause: error })
    }
  }

  if (existingUser) {
    console.log(`❌ User already exists ${address}:`)
  } else {
    console.log(`✅ User has been created ${address}:`)
  }
  console.log(JSON.stringify({ newUser, existingUser }, null, 2))
  console.groupEnd()
})().catch((e) => {
  console.error(`❌ ${e} - ${e.response?.data?.message}`)
  console.groupEnd()
  process.exit(1)
})
