'use client'

import { buttonVariants } from '@nl/ui/base/button-variants'
import DeferredComponent from '@nl/ui/custom/deferred-component'

const loadInstallerAction = () => import('./InstallerAction')

function InstallerActionLoading() {
  return (
    <button
      type="button"
      className={buttonVariants({ variant: 'outline' })}
      disabled
      aria-label="Loading installer action"
    >
      Checking installer…
    </button>
  )
}

function InstallerActionError(onRetry: () => void) {
  return (
    <button type="button" className={buttonVariants({ variant: 'outline' })} onClick={onRetry}>
      Retry installer
    </button>
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
