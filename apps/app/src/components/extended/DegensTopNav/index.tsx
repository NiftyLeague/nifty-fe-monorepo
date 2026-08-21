import dynamic from 'next/dynamic'

import { Label } from '@nl/ui/base/label'
import { Input } from '@nl/ui/base/input'

import styles from './index.module.css'

const DegensTopNavControls = dynamic(() => import('./DegensTopNavControls'), {
  loading: () => (
    <div
      aria-label="Loading degen view controls"
      className="flex h-8 min-w-[238px] items-center justify-between gap-2"
      role="status"
    >
      <span aria-hidden="true" className="h-8 w-[150px] animate-pulse rounded-md bg-muted" />
      <span aria-hidden="true" className="h-8 w-[78px] animate-pulse rounded-md bg-muted" />
    </div>
  ),
})

interface DegensTopNavProps {
  searchTerm: string
  handleChangeSearchTerm: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  handleSort: (sortOptions: string) => void
  sortValue: string
  layoutMode: string
  handleChangeLayoutMode: (_: React.MouseEvent<HTMLElement>, newMode: string) => void
}

const DegensTopNav = ({
  searchTerm,
  handleChangeSearchTerm,
  handleSort,
  sortValue,
  layoutMode,
  handleChangeLayoutMode,
}: DegensTopNavProps) => (
  <div className="flex flex-col gap-2 sm:flex-row">
    <div className="grid flex-1 gap-2">
      <Label htmlFor="search-degen-by-token-id-name">Search degens by token # or name</Label>
      <Input
        id="search-degen-by-token-id-name"
        className={`${styles.searchTextField} h-8 border-0 bg-muted`}
        name="search-degen-by-token-id-name"
        value={searchTerm}
        onChange={handleChangeSearchTerm}
      />
    </div>
    <DegensTopNavControls
      handleChangeLayoutMode={handleChangeLayoutMode}
      handleSort={handleSort}
      layoutMode={layoutMode}
      sortValue={sortValue}
    />
  </div>
)

export default DegensTopNav
