'use client'

import { Button } from '@nl/ui/base/button'
import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadInstallerAction = () => import('./InstallerAction')

function InstallerActionLoading() {
  return (
    <Button type="button" variant="outline" disabled aria-label="Loading installer action">
      Checking installer…
    </Button>
  )
}

function InstallerActionError(onRetry: () => void) {
  return (
    <Button type="button" variant="outline" onClick={onRetry}>
      Retry installer
    </Button>
  )
}

export default function DeferredInstallerAction() {
  return (
    <DeferredComponent
      label="installer action"
      load={loadInstallerAction}
      loadingFallback={<InstallerActionLoading />}
      errorFallback={(onRetry) => InstallerActionError(onRetry)}
      props={{}}
    />
  )
}
