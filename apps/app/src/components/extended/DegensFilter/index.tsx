'use client'
import {
  ChangeEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import NativeImage from '@nl/ui/custom/native-image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@nl/ui/utils'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import { Title } from '@nl/ui/custom/typography'
import { FilterSource, backgrounds, tribes } from '@/constants/filters'
import * as CosmeticsFilter from '@/constants/cosmeticsFilters'
import type { DegenFilter } from '@/types/degenFilter'
import { updateFilterValue } from './utils'
import FilterAccordion from './FilterAccordion'
import FilterAllTraitCheckboxes from '../FilterAllTraitCheckboxes'
import { hasEntries } from '@/utils/collections'

import styles from './index.module.css'

interface DegensFilterProps {
  onFilter?: (filter: DegenFilter) => void
  defaultFilterValues: DegenFilter
  searchTerm?: string
}

const DegensFilter = ({
  onFilter,
  defaultFilterValues,
  searchTerm,
}: DegensFilterProps): React.ReactNode => {
  const mountedRef = useRef(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = useMemo(
    () => Object.fromEntries(searchParams.entries()) as { [key in FilterSource]?: string },
    [searchParams]
  )
  const isParamsEmpty = !hasEntries(params)

  // Filter states
  const [showMore, setShowMore] = useState(false)
  const [pricesRangeValue, setPricesRangeValue] = useState<number[]>(defaultFilterValues.prices)
  const [tribesValue, setTribesValue] = useState<string[]>(defaultFilterValues.tribes)
  const [backgroundsValue, setBackgroundsValue] = useState<string[]>(
    defaultFilterValues.backgrounds
  )
  const [cosmeticsValue, setCosmeticsValue] = useState<string[]>(defaultFilterValues.cosmetics)

  // Set search params from filter values
  // Use value to manually set the source's value
  // Useful for checkbox filters since using setState won't update the value fast enough
  // Previously tried useEffect but it was unreliable since tribe and backgrounds will overwrite each other
  const handleChangeCommitted = useCallback(
    (source: FilterSource, value: string | null = null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      switch (source) {
        case 'prices':
          if (!value) current.delete('prices')
          else current.set('prices', pricesRangeValue.join('-'))
          break
        case 'multipliers':
          if (!value) current.delete('multipliers')
          else current.set('multipliers', value)
          break
        case 'rentals':
          if (!value) current.delete('rentals')
          else current.set('rentals', value)
          break
        case 'tribes':
          if (!value) current.delete('tribes')
          else current.set('tribes', value)
          break
        case 'backgrounds':
          if (!value) current.delete('backgrounds')
          else current.set('backgrounds', value)
          break
        case 'cosmetics':
          if (!value) current.delete('cosmetics')
          else current.set('cosmetics', value)
          break
        case 'wearables':
          if (!value) current.delete('wearables')
          else current.set('wearables', value)
          break
        case 'searchTerm':
          if (!value) current.delete('searchTerm')
          // else current.set('searchTerm', [value]);
          else current.set('searchTerm', value)
          break
        case 'walletAddress':
          if (!value) current.delete('walletAddress')
          // else current.set('searchTerm', [value]);
          else current.set('walletAddress', value)
          break
      }

      const search = current.toString()
      const query = search ? `?${search}` : ''
      router.push(`${pathname}${query}`)
    },
    [pricesRangeValue, pathname, router, searchParams]
  )

  // For checkbox filter
  const handleCheckboxChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      source: FilterSource,
      state: string[],
      setState: React.Dispatch<SetStateAction<string[]>>
    ) => {
      const { checked, value } = e.target
      let newState: string[]
      if (checked) {
        newState = [...state, value]
      } else {
        newState = state.filter((item) => item !== value)
      }
      setState(newState)
      handleChangeCommitted(source, newState.length > 0 ? newState.join('-') : '')
    },
    [handleChangeCommitted]
  )

  const setAllFilterValues = useCallback(() => {
    setPricesRangeValue(defaultFilterValues.prices)
    // setMultipliersValue(defaultFilterValues.multipliers);
    // setRentalsValue(defaultFilterValues.rentals);
    setTribesValue(defaultFilterValues.tribes)
    setBackgroundsValue(defaultFilterValues.backgrounds)
    setCosmeticsValue(defaultFilterValues.cosmetics)
    // setWearablesValue(defaultFilterValues.wearables);
  }, [defaultFilterValues])

  const handleReset = () => {
    if (isParamsEmpty) return
    setAllFilterValues()
    router.push(pathname)
  }

  useEffect(() => {
    if (searchTerm === undefined) return
    handleChangeCommitted('searchTerm', searchTerm)
  }, [handleChangeCommitted, searchTerm])

  // Updates local filter state on defaultFilterValues change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllFilterValues()
  }, [setAllFilterValues])

  // Update local state on mount & on filter params update
  useEffect(() => {
    // Once mounted, show only DEGENs with Common backgrounds if non DEGEN owner
    const newFilters = updateFilterValue(
      !params.backgrounds && !mountedRef.current
        ? { ...defaultFilterValues, backgrounds: defaultFilterValues.backgrounds }
        : defaultFilterValues,
      params,
      {
        prices: setPricesRangeValue,
        // multipliers: setMultipliersValue,
        // rentals: setRentalsValue,
        tribes: setTribesValue,
        backgrounds: setBackgroundsValue,
        cosmetics: setCosmeticsValue,
        // wearables: setWearablesValue,
      }
    )
    mountedRef.current = true
    if (newFilters)
      onFilter?.({
        prices: newFilters.prices,
        multipliers: newFilters.multipliers,
        rentals: newFilters.rentals,
        tribes: newFilters.tribes,
        tokenId: newFilters.tokenId,
        backgrounds: newFilters.backgrounds,
        cosmetics: newFilters.cosmetics,
        wearables: newFilters.wearables,
        searchTerm: newFilters.searchTerm,
        walletAddress: newFilters.walletAddress,
      })
  }, [defaultFilterValues, onFilter, params])

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
                    handleCheckboxChange(
                      {
                        target: { checked: checked === true, value: tribe.name },
                      } as ChangeEvent<HTMLInputElement>,
                      'tribes',
                      tribesValue,
                      setTribesValue
                    )
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
                      {
                        target: { checked: checked === true, value: background },
                      } as ChangeEvent<HTMLInputElement>,
                      'backgrounds',
                      backgroundsValue,
                      setBackgroundsValue
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
                        onCheckboxChange={handleCheckboxChange}
                        setCosmeticsValue={setCosmeticsValue}
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
