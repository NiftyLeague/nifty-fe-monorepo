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
  <div className="grid gap-2 pt-6">
    <Label htmlFor="search-degen-by-token-id-name">Search degens by token # or name</Label>
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        id="search-degen-by-token-id-name"
        className={`${styles.searchTextField} h-8 min-w-0 border-0 bg-muted`}
        name="search-degen-by-token-id-name"
        placeholder="Search degens by token # or name"
        value={searchTerm}
        onChange={handleChangeSearchTerm}
      />
      <DegensTopNavControls
        handleChangeLayoutMode={handleChangeLayoutMode}
        handleSort={handleSort}
        layoutMode={layoutMode}
        sortValue={sortValue}
      />
    </div>
  </div>
)

export default DegensTopNav
