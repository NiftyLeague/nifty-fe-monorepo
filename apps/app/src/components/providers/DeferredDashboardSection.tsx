'use client'

import DeferredSection, { DeferredSectionLoading } from '@nl/ui/custom/deferred-section'

/**
 * Compatibility adapter for dashboard callers. The deferred loading behavior
 * and accessible shadcn loading state live in the shared UI package so apps
 * use one implementation and one visual treatment.
 */
export const DashboardSectionLoading = DeferredSectionLoading
export default DeferredSection
