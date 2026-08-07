'use client'

import MyComics from './MyComics'
import MyDegens from './MyDegens'
import MyItems from './MyItems'
import MyNFTL from './_MyNFTL'
import MyStats from './MyStats'

const DashboardOverview = (): React.ReactNode => {
  return (
    <div className="flex h-inherit flex-col gap-8 lg:flex-row">
      <div className="flex w-full flex-col gap-8 lg:w-[45.8333%]">
        <div className="w-full">
          <MyNFTL />
        </div>
        <div className="w-full">
          <MyStats />
        </div>
      </div>
      <div className="flex w-full flex-col gap-8 lg:w-[54.1667%]">
        <div className="w-full">
          <MyDegens />
        </div>
        <div className="w-full">
          <MyComics />
        </div>
        <div className="w-full">
          <MyItems />
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
