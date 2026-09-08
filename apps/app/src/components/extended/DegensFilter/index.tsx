'use client'
import { useCallback, useMemo, useState } from 'react'
import NativeImage from '@nl/ui/custom/native-image'
import { useQueryStates } from 'nuqs'
import { cn } from '@nl/ui/utils'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Title } from '@nl/ui/custom/typography'
import { FilterSource, backgrounds, tribes } from '@/constants/filters'
import * as CosmeticsFilter from '@/constants/cosmeticsFilters'
import type { DegenFilter } from '@/types/degenFilter'
import FilterAccordion from './FilterAccordion'
import FilterAllTraitCheckboxes from '../FilterAllTraitCheckboxes'
import { degenSearchParsers, normalizeDegenSearchState } from '@/url/search-state'

import styles from './index.module.css'

interface DegensFilterProps {
  defaultFilterValues: DegenFilter
}

const DegensFilter = ({ defaultFilterValues }: DegensFilterProps): React.ReactNode => {
  const [queryState, setQueryState] = useQueryStates(degenSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const queryStateKey = JSON.stringify(queryState)
  const state = useMemo(() => normalizeDegenSearchState(queryState), [queryStateKey])
  const isParamsEmpty =
    state.page === 1 &&
    state.sort === 'idUp' &&
    !state.searchTerm &&
    !state.prices.length &&
    !state.multipliers.length &&
    !state.rentals.length &&
    !state.tribes.length &&
    !state.backgrounds.length &&
    !state.cosmetics.length &&
    !state.wearables.length &&
    !state.walletAddress &&
    !state.tokenId

  const [showMore, setShowMore] = useState(false)
  const tribesValue = state.tribes.length ? state.tribes : defaultFilterValues.tribes
  const backgroundsValue = state.backgrounds.length
    ? state.backgrounds
    : defaultFilterValues.backgrounds
  const cosmeticsValue = state.cosmetics.length ? state.cosmetics : defaultFilterValues.cosmetics

  const handleCheckboxChange = useCallback(
    (checked: boolean, source: FilterSource, current: string[], value: string) => {
      const next = checked ? [...current, value] : current.filter((item) => item !== value)
      const update = next.length ? next : null
      if (source === 'tribes') void setQueryState({ tribes: update, page: 1 })
      if (source === 'backgrounds') void setQueryState({ backgrounds: update, page: 1 })
      if (source === 'cosmetics') void setQueryState({ cosmetics: update, page: 1 })
    },
    [setQueryState]
  )

  const handleReset = () => {
    if (isParamsEmpty) return
    void setQueryState(null)
  }

  return (
    <div className="flex flex-col gap-3 overflow-x-hidden max-sm:py-4">
      <div className="flex flex-row items-center justify-between">
        <Title level={3}>Filter Degens</Title>
        <div className="flex flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isParamsEmpty}
            onClick={handleReset}
            className="h-7 text-error"
            style={{ borderColor: 'var(--color-error)' }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-md bg-muted py-3">
        <FilterAccordion
          summary={<Title level={4}>Tribe</Title>}
          expanded={true}
          length={tribes.length}
        >
          <div className="flex flex-row flex-wrap">
            {tribes.map((tribe) => (
              <label
                key={tribe.name}
                className={cn('flex min-w-0 items-center', styles.filterOption)}
                style={{ flex: '0 0 50%' }}
              >
                <Checkbox
                  name={tribe.name}
                  value={tribe.name}
                  checked={tribesValue.includes(tribe.name)}
                  className={styles.inputCheck}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked === true, 'tribes', tribesValue, tribe.name)
                  }
                />
                <div className="flex flex-row items-center">
                  <NativeImage src={tribe.icon} alt="" width={18} height={18} />
                  <span className="ml-2 text-base">{tribe.name}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterAccordion>
        <FilterAccordion
          summary={<Title level={4}>Background</Title>}
          length={backgrounds.length}
          expanded={true}
        >
          <div className="flex flex-row flex-wrap">
            {backgrounds.map((background) => (
              <label
                key={background}
                className={`${styles.inputCheckFormControl} ${styles.filterOption} flex items-center`}
                style={{ flex: '0 0 50%' }}
              >
                <Checkbox
                  name={background}
                  value={background}
                  checked={backgroundsValue.includes(background)}
                  className={styles.inputCheck}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      checked === true,
                      'backgrounds',
                      backgroundsValue,
                      background
                    )
                  }
                />
                <span className="text-base">{background}</span>
              </label>
            ))}
          </div>
        </FilterAccordion>
        {!showMore ? (
          <Button
            type="button"
            variant="link"
            className="mx-3.5 h-auto justify-start p-0 py-2 text-base font-normal"
            onClick={() => setShowMore(true)}
          >
            More
          </Button>
        ) : (
          <>
            {Object.keys(CosmeticsFilter.TRAIT_VALUE_MAP)
              .sort()
              .map((categoryKey) => {
                const traitGroup = Object.entries(
                  CosmeticsFilter.TRAIT_VALUE_MAP[
                    categoryKey as keyof typeof CosmeticsFilter.TRAIT_VALUE_MAP
                  ]
                )
                  .sort((a: [string, unknown], b: [string, unknown]) =>
                    (a[1] as string).localeCompare(b[1] as string)
                  )
                  .map((item) => item[0])
                return (
                  <div key={categoryKey} className="flex flex-row flex-wrap">
                    <FilterAccordion
                      summary={<Title level={4}>{categoryKey}</Title>}
                      length={traitGroup.length}
                      expanded={false}
                    >
                      <FilterAllTraitCheckboxes
                        traitGroup={traitGroup}
                        categoryKey={categoryKey}
                        cosmeticsValue={cosmeticsValue}
                        onCheckboxChange={(checked, value) =>
                          handleCheckboxChange(checked, 'cosmetics', cosmeticsValue, value)
                        }
                        inputCheckBoxStyle={cn(styles.inputCheck)}
                        inputCheckFormControlStyle={cn(styles.inputCheckFormControl)}
                      />
                    </FilterAccordion>
                  </div>
                )
              })}
          </>
        )}
      </div>
    </div>
  )
}

export default DegensFilter
