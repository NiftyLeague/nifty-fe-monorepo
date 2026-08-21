'use client'

import SocialCards from '@/components/SocialCards'

export default function CommunityConversation() {
  return (
    <section className="container section">
      <div className="relative text-center mb-8">
        <h3>Join the conversation</h3>
        <p className="text-center my-3 mx-auto max-w-2xl">
          Nifty League&apos;s community is unlike any other. Get your questions answered and connect
          with fellow DEGENs!
        </p>
      </div>

      <SocialCards />
    </section>
  )
}
