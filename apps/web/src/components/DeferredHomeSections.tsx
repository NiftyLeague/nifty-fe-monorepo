'use client'

import { DeferredSection } from '@nl/ui/custom/deferred-section'

import { HOME_SECTION_CONFIG, HOME_SECTION_ROOT_MARGIN } from './home-section-config'

// Keep the first below-fold chunk close enough for a smooth scroll handoff
// without pulling marketing sections into the initial mobile load.
const HOME_SECTION_LOADERS = [
  () => import('@/components/HomeSections/HomeDegensSection'),
  () => import('@/components/HomeSections/HomeCompeteSection'),
  () => import('@/components/HomeSections/HomeNiftyWorldSection'),
  () => import('@/components/HomeSections/HomeDashboardSection'),
  () => import('@/components/HomeSections/HomeTokenSection'),
  () => import('@/components/HomeSections/HomeCommunitySection'),
  () => import('@/components/HomeSections/HomeSponsorsSection'),
] as const

const HOME_SECTIONS = HOME_SECTION_CONFIG.map((section, index) => ({
  ...section,
  load: HOME_SECTION_LOADERS[index]!,
}))

function DeferredHomeSection({
  label,
  load,
  minHeightClassName,
}: {
  label: string
  load: () => Promise<{ default: React.ComponentType }>
  minHeightClassName: string
}) {
  return (
    <DeferredSection
      label={label}
      load={load}
      minHeightClassName={minHeightClassName}
      rootMargin={HOME_SECTION_ROOT_MARGIN}
      loadingMode="minimal"
    />
  )
}

export function DeferredHomeSections() {
  return HOME_SECTIONS.map((section) => <DeferredHomeSection key={section.label} {...section} />)
}

export default DeferredHomeSections
