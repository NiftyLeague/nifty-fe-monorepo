import dynamic from '@/runtime/dynamic'

import { Input } from '@nl/ui/base/input'

import styles from './index.module.css'

const DegensTopNavControls = dynamic(() => import('./DegensTopNavControls'), {
  loading: () => (
    <div
      aria-label="Loading degen view controls"
      class="flex h-8 min-w-[238px] items-center justify-between gap-2"
      role="status"
    >
      <span aria-hidden="true" class="h-8 w-[150px] animate-pulse rounded-md bg-muted" />
      <span aria-hidden="true" class="h-8 w-[78px] animate-pulse rounded-md bg-muted" />
    </div>
  ),
})

interface DegensTopNavProps {
  searchTerm: string
  handleChangeSearchTerm: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement>
  handleSort: (sortOptions: string) => void
  sortValue: string
  layoutMode: string
  handleChangeLayoutMode: (_: MouseEvent & { currentTarget: HTMLElement }, newMode: string) => void
}

const DegensTopNav = ({
  searchTerm,
  handleChangeSearchTerm,
  handleSort,
  sortValue,
  layoutMode,
  handleChangeLayoutMode,
}: DegensTopNavProps) => (
  <div class={styles.topNav} data-slot="degen-top-nav">
    <div class={styles.searchToolbar} data-slot="degen-search-toolbar">
      <div class={styles.searchField} data-slot="degen-search-field">
        <Input
          aria-label="Search degens by token # or name"
          id="search-degen-by-token-id-name"
          class={`${styles.searchTextField} h-8 border-0 bg-muted`}
          name="search-degen-by-token-id-name"
          placeholder="Search degens by token # or name"
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
  </div>
)

export default DegensTopNav
