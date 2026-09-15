import { Show, createEffect, createSignal } from 'solid-js'
import { toast } from 'solid-sonner'

import { fetchJson } from '../../utils/fetchJson'
import { parseLinkedWalletResult } from '../../utils/parseData'
import { useUserContext } from '../../hooks/useUserContext'
import { useProviders } from '@nl/ui/hooks/useProviders'

import { Icon } from '@nl/ui/base/icon'
import { Label } from '@nl/ui/base/label'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from '@nl/ui/base/input-group'
import { Separator } from '@nl/ui/base/separator'

import Avatar from '../Avatar'
import DeleteAccountDialog from './DeleteAccountDialog'
import LinkedProviders from './LinkedProviders'
import LinkWalletInput from './LinkWalletInput'
import LogoutButton from './LogoutButton'

type Profile = { avatar_url?: string; displayName?: string; email?: string }

export type AccountDetailsProps = {
  enableAvatars?: boolean
  enableLinkProviders?: boolean
  enableLinkWallet?: boolean
}

export default function AccountDetails(props: AccountDetailsProps) {
  const player = useUserContext()
  const [loading, setLoading] = createSignal(true)
  const [email, setEmail] = createSignal<Profile['email']>()
  const [displayName, setDisplayName] = createSignal<Profile['displayName']>()
  const [linkedWallets, setLinkedWallets] = createSignal<string[]>([])
  const [avatarUrl, setAvatarUrl] = createSignal<Profile['avatar_url']>()
  const providers = useProviders()

  createEffect(() => {
    const account = player.userInfo()?.AccountInfo
    if (account && Object.keys(account).length > 0) {
      const profile = player.userInfo()?.PlayerProfile
      const publisherData = player.userInfo()?.PublisherData
      setEmail(account.PrivateInfo?.Email)
      setAvatarUrl(profile?.AvatarUrl)
      setDisplayName(publisherData?.DisplayName?.Value)
      setLinkedWallets(parseLinkedWalletResult(publisherData) ?? [])
      setLoading(false)
    }
  })

  async function updateProfile(profileUpdate: Profile) {
    const {
      avatar_url: updatedAvatarUrl,
      displayName: updatedDisplayName,
      email: updatedEmail,
    } = profileUpdate
    try {
      setLoading(true)
      const account = player.userInfo()?.AccountInfo
      const profile = player.userInfo()?.PlayerProfile
      const publisherData = player.userInfo()?.PublisherData
      if (!account || !profile) throw new Error('No user')
      const body = {} as Profile

      // Update Account Display Name
      if (updatedDisplayName && updatedDisplayName !== publisherData?.DisplayName?.Value)
        body.displayName = updatedDisplayName
      // Update Profile Contact Email
      if (updatedEmail && updatedEmail !== account.PrivateInfo?.Email) body.email = updatedEmail
      // Update Profile Avatar
      if (updatedAvatarUrl && updatedAvatarUrl !== profile.AvatarUrl)
        body.avatar_url = updatedAvatarUrl

      await fetchJson('/api/playfab/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      toast.success('Profile updated!')
      await player.refetchPlayer()
    } catch (error) {
      toast.error('Error updating the data.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Show when={player.isLoggedIn()}>
      <div class="grid gap-4">
        <Show when={props.enableAvatars ? player.user()?.PlayFabId : undefined}>
          {(uid) => (
            <Avatar
              uid={String(uid())}
              url={avatarUrl()}
              size={125}
              onUpload={(url) => {
                setAvatarUrl(url)
                void updateProfile({ avatar_url: url })
              }}
            />
          )}
        </Show>

        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <Icon name="mail" aria-hidden="true" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="email" type="email" value={email() ?? ''} disabled />
          </InputGroup>
        </div>

        <div class="grid gap-2">
          <Label for="display-name">Display Name</Label>
          <InputGroup>
            <InputGroupAddon>
              <InputGroupText>
                <Icon name="user-pen" aria-hidden="true" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
              id="display-name"
              type="text"
              value={displayName() ?? ''}
              disabled={loading()}
              onInput={(e) => setDisplayName(e.currentTarget.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="sm"
                disabled={loading()}
                className="cursor-pointer disabled:cursor-progress"
                onClick={() => updateProfile({ displayName: displayName() })}
              >
                <Show when={loading()} fallback={<Icon name="save" />}>
                  <Icon name="loader" className="animate-spin" />
                </Show>
                <Show when={loading()} fallback="Update">
                  Loading
                </Show>
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Show when={props.enableLinkWallet}>
          <fieldset>
            <div class="grid gap-2">
              <legend>Linked Wallet(s)</legend>
              <div class="grid gap-1">
                <LinkWalletInput index={1} address={linkedWallets()[0] || ''} loading={loading()} />
                <Show when={Boolean(linkedWallets()[0])}>
                  <LinkWalletInput
                    index={2}
                    address={linkedWallets()[1] || ''}
                    loading={loading()}
                  />
                </Show>
                <Show when={Boolean(linkedWallets()[1])}>
                  <LinkWalletInput
                    index={3}
                    address={linkedWallets()[2] || ''}
                    loading={loading()}
                  />
                </Show>
              </div>
            </div>
          </fieldset>
        </Show>

        <Show when={props.enableLinkProviders}>
          <fieldset>
            <div class="grid gap-2">
              <legend>Linked Provider(s)</legend>
              <LinkedProviders providers={providers} loading={loading()} />
            </div>
          </fieldset>
        </Show>

        <Separator orientation="horizontal" />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
          <LogoutButton loading={loading()} />
          <DeleteAccountDialog loading={loading()} />
        </div>
      </div>
    </Show>
  )
}
