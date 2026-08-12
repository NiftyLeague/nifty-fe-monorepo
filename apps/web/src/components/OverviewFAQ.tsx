'use client'

import { Accordion } from '@nl/ui/custom/accordion'

import { FAQS } from '@/constants/faq'

export default function OverviewFAQ() {
  return <Accordion items={FAQS} defaultValue="item-1" />
}
