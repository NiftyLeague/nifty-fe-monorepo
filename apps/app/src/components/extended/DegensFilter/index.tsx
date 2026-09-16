import { createMemo, createSignal, For, Show, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { useQueryStates } from '@/url/nuqs-solid'
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

const DegensFilter = (props: DegensFilterProps): JSX.Element => {
  const [queryState, setQueryState] = useQueryStates(degenSearchParsers, {
    history: 'push',
    shallow: true,
  })
  const state = createMemo(() => normalizeDegenSearchState(queryState))
  const isParamsEmpty = () =>
    state().page === 1 &&
    state().sort === 'idUp' &&
    !state().searchTerm &&
    !state().prices.length &&
    !state().multipliers.length &&
    !state().rentals.length &&
    !state().tribes.length &&
    !state().backgrounds.length &&
    !state().cosmetics.length &&
    !state().wearables.length &&
    !state().walletAddress &&
    !state().tokenId

  const [showMore, setShowMore] = createSignal(false)
  const tribesValue = () =>
    state().tribes.length ? state().tribes : props.defaultFilterValues.tribes
  const backgroundsValue = () =>
    state().backgrounds.length ? state().backgrounds : props.defaultFilterValues.backgrounds
  const cosmeticsValue = () =>
    state().cosmetics.length ? state().cosmetics : props.defaultFilterValues.cosmetics

  const handleCheckboxChange = (
    checked: boolean,
    source: FilterSource,
    current: string[],
    value: string
  ) => {
    const next = checked ? [...current, value] : current.filter((item) => item !== value)
    const update = next.length ? next : null
    if (source === 'tribes') void setQueryState({ tribes: update, page: 1 })
    if (source === 'backgrounds') void setQueryState({ backgrounds: update, page: 1 })
    if (source === 'cosmetics') void setQueryState({ cosmetics: update, page: 1 })
  }

  const handleReset = () => {
    if (isParamsEmpty()) return
    void setQueryState({
      prices: null,
      multipliers: null,
      rentals: null,
      tribes: null,
      backgrounds: null,
      cosmetics: null,
      wearables: null,
      walletAddress: null,
      tokenId: null,
      searchTerm: null,
      sort: null,
      page: null,
      layout: null,
    })
  }

  return (
    <div class="flex flex-col gap-3 overflow-x-hidden max-sm:py-4">
      <div class="flex flex-row items-center justify-between">
        <Title level={3}>Filter Degens</Title>
        <div class="flex flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isParamsEmpty()}
            onClick={handleReset}
            class="h-7 border-error text-error"
          >
            Reset
          </Button>
        </div>
      </div>
      <div class="flex flex-col gap-3 rounded-md bg-muted py-3">
        <FilterAccordion
          summary={<Title level={4}>Tribe</Title>}
          expanded={true}
          length={tribes.length}
        >
          <div class="flex flex-row flex-wrap">
            <For each={tribes}>
              {(tribe) => (
                <label
                  class={cn(
                    'flex min-w-0 shrink-0 grow-0 basis-1/2 items-center',
                    styles.filterOption
                  )}
                >
                  <Checkbox
                    name={tribe.name}
                    value={tribe.name}
                    checked={tribesValue().includes(tribe.name)}
                    class={styles.inputCheck}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(checked === true, 'tribes', tribesValue(), tribe.name)
                    }
                  />
                  <div class="flex flex-row items-center">
                    <NativeImage src={tribe.icon} alt="" width={18} height={18} />
                    <span class="ml-2 text-base">{tribe.name}</span>
                  </div>
                </label>
              )}
            </For>
          </div>
        </FilterAccordion>
        <FilterAccordion
          summary={<Title level={4}>Background</Title>}
          length={backgrounds.length}
          expanded={true}
        >
          <div class="flex flex-row flex-wrap">
            <For each={backgrounds}>
              {(background) => (
                <label
                  class={`${styles.inputCheckFormControl} ${styles.filterOption} flex shrink-0 grow-0 basis-1/2 items-center`}
                >
                  <Checkbox
                    name={background}
                    value={background}
                    checked={backgroundsValue().includes(background)}
                    class={styles.inputCheck}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        checked === true,
                        'backgrounds',
                        backgroundsValue(),
                        background
                      )
                    }
                  />
                  <span class="text-base">{background}</span>
                </label>
              )}
            </For>
          </div>
        </FilterAccordion>
        <Show
          when={showMore()}
          fallback={
            <Button
              type="button"
              variant="link"
              class="mx-3.5 h-auto justify-start p-0 py-2 text-base font-normal text-purple-300"
              onClick={() => setShowMore(true)}
            >
              More
            </Button>
          }
        >
          <For each={Object.keys(CosmeticsFilter.TRAIT_VALUE_MAP).toSorted()}>
            {(categoryKey) => {
              const traitGroup = Object.entries(
                CosmeticsFilter.TRAIT_VALUE_MAP[
                  categoryKey as keyof typeof CosmeticsFilter.TRAIT_VALUE_MAP
                ]
              )
                .toSorted((a: [string, unknown], b: [string, unknown]) =>
                  (a[1] as string).localeCompare(b[1] as string)
                )
                .map((item) => item[0])
              return (
                <div class="flex flex-row flex-wrap">
                  <FilterAccordion
                    summary={<Title level={4}>{categoryKey}</Title>}
                    length={traitGroup.length}
                    expanded={false}
                  >
                    <FilterAllTraitCheckboxes
                      traitGroup={traitGroup}
                      categoryKey={categoryKey}
                      cosmeticsValue={cosmeticsValue()}
                      onCheckboxChange={(checked, value) =>
                        handleCheckboxChange(checked, 'cosmetics', cosmeticsValue(), value)
                      }
                      inputCheckBoxStyle={cn(styles.inputCheck)}
                      inputCheckFormControlStyle={cn(styles.inputCheckFormControl)}
                    />
                  </FilterAccordion>
                </div>
              )
            }}
          </For>
        </Show>
      </div>
    </div>
  )
}

export default DegensFilter
