'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

const loadCommunityConversation = () => import('@/components/CommunityConversation')

export function DeferredCommunityConversation() {
  return (
    <DeferredSection
      label="community conversation"
      load={loadCommunityConversation}
      minHeightClassName="min-h-[48rem]"
      rootMargin="0px 0px -160px 0px"
    />
  )
}
