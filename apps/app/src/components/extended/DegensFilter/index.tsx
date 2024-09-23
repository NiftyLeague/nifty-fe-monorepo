'use client';
import { ChangeEvent, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { styled, useTheme } from '@nl/theme';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
// import useFlags from '@/hooks/useFlags';
import isEmpty from 'lodash/isEmpty';
import { Button, Checkbox, FormControlLabel, FormGroup, Stack, Typography } from '@mui/material';
import {
  FilterSource,
  backgrounds,
  // multipliers,
  // rentals,
  tribes,
  // wearables,
} from '@/constants/filters';
import * as CosmeticsFilter from '@/constants/cosmeticsFilters';
import type { DegenFilter } from '@/types/degenFilter';
import { updateFilterValue } from './utils';
import FilterAccordion from './FilterAccordion';
// import FilterRangeSlider from './FilterRangeSlider';
import FilterAllTraitCheckboxes from '../FilterAllTraitCheckboxes';

const PREFIX = 'DegensFilter';

const classes = {
  inputCheck: `${PREFIX}-inputCheck`,
  tribeCheckFormControl: `${PREFIX}-tribeCheckFormControl`,
  inputCheckFormControl: `${PREFIX}-inputCheckFormControl`,
  tribeName: `${PREFIX}-tribeName`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.inputCheck}`]: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 8,
    color: '#4D4D4D',
    '& .MuiSvgIcon-root': {
      width: '0.75em',
      height: '0.75em',
    },
  },

  [`& .${classes.tribeCheckFormControl}`]: {
    marginLeft: -8,
    minWidth: 108,
  },

  [`& .${classes.inputCheckFormControl}`]: {
    marginLeft: -8,
    marginRight: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '0.75rem',
      lineHeight: '0.75rem',
    },
  },

  [`& .${classes.tribeName}`]: {
    marginLeft: 8,
  },
}));

interface DegensFilterProps {
  onFilter: (filter: DegenFilter) => void;
  defaultFilterValues: DegenFilter;
  isDegenOwner?: boolean;
  searchTerm?: string;
}

const DegensFilter = ({ onFilter, defaultFilterValues, isDegenOwner, searchTerm }: DegensFilterProps): JSX.Element => {
  const theme = useTheme();
  const mountedRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () =>
      Object.fromEntries(searchParams.entries()) as {
        [key in FilterSource]?: string;
      },
    [searchParams],
  );
  const isParamsEmpty = isEmpty(params);
  // const { displayMyItems } = useFlags();

  // Filter states
  const [showMore, setShowMore] = useState(false);
  const [pricesRangeValue, setPricesRangeValue] = useState<number[]>(defaultFilterValues.prices);
  // const [multipliersValue, setMultipliersValue] = useState<string[]>(
  //   defaultFilterValues.multipliers,
  // );
  // const [rentalsValue, setRentalsValue] = useState<string[]>(
  //   defaultFilterValues.rentals,
  // );
  const [tribesValue, setTribesValue] = useState<string[]>(defaultFilterValues.tribes);
  const [backgroundsValue, setBackgroundsValue] = useState<string[]>(defaultFilterValues.backgrounds);
  const [cosmeticsValue, setCosmeticsValue] = useState<string[]>(defaultFilterValues.cosmetics);
  // const [wearablesValue, setWearablesValue] = useState<string[]>(
  //   defaultFilterValues.wearables,
  // );

  // Set search params from filter values
  // Use value to manually set the source's value
  // Useful for checkbox filters since using setState won't update the value fast enough
  // Previously tried useEffect but it was unreliable since tribe and backgrounds will overwrite each other
  const handleChangeCommitted = useCallback(
    (source: FilterSource, value: string | null = null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      switch (source) {
        case 'prices':
          if (!value) current.delete('prices');
          else current.set('prices', pricesRangeValue.join('-'));
          break;
        case 'multipliers':
          if (!value) current.delete('multipliers');
          else current.set('multipliers', value);
          break;
        case 'rentals':
          if (!value) current.delete('rentals');
          else current.set('rentals', value);
          break;
        case 'tribes':
          if (!value) current.delete('tribes');
          else current.set('tribes', value);
          break;
        case 'backgrounds':
          if (!value) current.delete('backgrounds');
          else current.set('backgrounds', value);
          break;
        case 'cosmetics':
          if (!value) current.delete('cosmetics');
          else current.set('cosmetics', value);
          break;
        case 'wearables':
          if (!value) current.delete('wearables');
          else current.set('wearables', value);
          break;
        case 'searchTerm':
          if (!value) current.delete('searchTerm');
          // else current.set('searchTerm', [value]);
          else current.set('searchTerm', value);
          break;
        case 'walletAddress':
          if (!value) current.delete('walletAddress');
          // else current.set('searchTerm', [value]);
          else current.set('walletAddress', value);
          break;
      }

      const search = current.toString();
      const query = search ? `?${search}` : '';
      router.push(`${pathname}${query}`);
    },
    [pricesRangeValue, pathname, router, searchParams],
  );

  // For checkbox filter
  const handleCheckboxChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      source: FilterSource,
      state: string[],
      setState: React.Dispatch<SetStateAction<string[]>>,
    ) => {
      const { checked, value } = e.target;
      let newState: string[] = [];
      if (checked) {
        newState = [...state, value];
      } else {
        newState = state.filter(item => item !== value);
      }
      setState(newState);
      handleChangeCommitted(source, newState.length > 0 ? newState.join('-') : '');
    },
    [handleChangeCommitted],
  );

  const setAllFilterValues = useCallback(() => {
    setPricesRangeValue(defaultFilterValues.prices);
    // setMultipliersValue(defaultFilterValues.multipliers);
    // setRentalsValue(defaultFilterValues.rentals);
    setTribesValue(defaultFilterValues.tribes);
    setBackgroundsValue(defaultFilterValues.backgrounds);
    setCosmeticsValue(defaultFilterValues.cosmetics);
    // setWearablesValue(defaultFilterValues.wearables);
  }, [defaultFilterValues]);

  const handleReset = () => {
    if (isParamsEmpty) return;
    setAllFilterValues();
    router.push(pathname);
  };

  useEffect(() => {
    if (searchTerm === undefined) return;
    handleChangeCommitted('searchTerm', searchTerm);
  }, [handleChangeCommitted, searchTerm]);

  // Updates local filter state on defaultFilterValues change
  useEffect(() => {
    setAllFilterValues();
  }, [setAllFilterValues]);

  // Update local state on mount & on filter params update
  useEffect(() => {
    // Once mounted, show only DEGENs with Common backgrounds if non DEGEN owner
    const newFilters = updateFilterValue(
      !params.backgrounds && !mountedRef.current
        ? {
            ...defaultFilterValues,
            backgrounds: defaultFilterValues.backgrounds,
          }
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
      },
    );
    mountedRef.current = true;
    if (newFilters)
      onFilter({
        prices: newFilters.prices,
        multipliers: newFilters.multipliers,
        rentals: newFilters.rentals,
        tribes: newFilters.tribes,
        backgrounds: newFilters.backgrounds,
        cosmetics: newFilters.cosmetics,
        wearables: newFilters.wearables,
        searchTerm: newFilters.searchTerm,
        walletAddress: newFilters.walletAddress,
      });
  }, [defaultFilterValues, isDegenOwner, onFilter, params]);

  return (
    <StyledStack
      gap={1.5}
      sx={{
        overflowX: 'hidden',
        [theme.breakpoints.down('sm')]: {
          paddingY: 2,
        },
      }}
    >
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3">Filter Degens</Typography>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            disabled={isParamsEmpty}
            onClick={handleReset}
            sx={{ height: 28, color: theme.palette.primary.main }}
          >
            Reset
          </Button>
        </Stack>
      </Stack>
      <Stack py={1.5} borderRadius="10px" sx={{ background: '#1E2023' }}>
        <FilterAccordion summary={<Typography variant="h4">Tribe</Typography>} expanded={true} length={tribes.length}>
          <FormGroup sx={{ flexDirection: 'row' }}>
            {tribes.map(tribe => (
              <FormControlLabel
                key={tribe.name}
                control={
                  <Checkbox
                    name={tribe.name}
                    value={tribe.name}
                    checked={tribesValue.includes(tribe.name)}
                    className={classes.inputCheck}
                    onChange={e => handleCheckboxChange(e, 'tribes', tribesValue, setTribesValue)}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center">
                    <Image src={tribe.icon} alt="Tribe Icon" width={18} height={18} />
                    <Typography variant="body1" className={classes.tribeName}>
                      {tribe.name}
                    </Typography>
                  </Stack>
                }
                className={classes.tribeCheckFormControl}
                sx={{ flex: '0 0 33.333333%' }}
              />
            ))}
          </FormGroup>
        </FilterAccordion>
        {/* 
        <FilterAccordion
          summary={<Typography variant="h4">Price</Typography>}
          expanded={false}
        >
          <Stack gap={4}>
            <FilterRangeSlider
              value={pricesRangeValue}
              min={defaultFilterValues.prices[0]}
              max={defaultFilterValues.prices[1]}
              unit=" NFTL"
              label="Price"
              onChange={(_, value) => setPricesRangeValue(value as number[])}
              onChangeCommitted={() => handleChangeCommitted('prices')}
            />
          </Stack>
        </FilterAccordion> */}
        {/* <FilterAccordion
          summary={<Typography variant="h4">Queue</Typography>}
          expanded={false}
          length={rentals.length}
        >
          <FormGroup sx={{ flexDirection: 'column' }}>
            {rentals.map((item) => (
              <FormControlLabel
                key={`Queue${item}`}
                control={
                  <Checkbox
                    name={`Queue${item}`}
                    value={item}
                    checked={rentalsValue.includes(item)}
                    className={classes.inputCheck}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        'rentals',
                        rentalsValue,
                        setRentalsValue,
                      )
                    }
                  />
                }
                label={<Typography variant="body1">{item}</Typography>}
                className={classes.inputCheckFormControl}
              />
            ))}
          </FormGroup>
        </FilterAccordion> */}
        {/* <FilterAccordion
          summary={<Typography variant="h4">Multiplier</Typography>}
          expanded={false}
          length={multipliers.length}
        >
          <FormGroup sx={{ flexDirection: 'column' }}>
            {multipliers.map((item) => (
              <FormControlLabel
                key={`Multiplier${item}`}
                control={
                  <Checkbox
                    name={`Multiplier${item}`}
                    value={item}
                    checked={multipliersValue.includes(item)}
                    className={classes.inputCheck}
                    onChange={(e) =>
                      handleCheckboxChange(
                        e,
                        'multipliers',
                        multipliersValue,
                        setMultipliersValue,
                      )
                    }
                  />
                }
                label={<Typography variant="body1">{item}</Typography>}
                className={classes.inputCheckFormControl}
              />
            ))}
          </FormGroup>
        </FilterAccordion> */}
        {/* {displayMyItems && (
          <FilterAccordion
            summary={<Typography variant="h4">Wearable</Typography>}
            expanded={false}
            length={wearables.length}
          >
            <FormGroup sx={{ flexDirection: 'row' }}>
              {wearables.map((wearable) => (
                <FormControlLabel
                  key={wearable}
                  control={
                    <Checkbox
                      name={wearable}
                      value={wearable}
                      checked={wearablesValue.includes(wearable)}
                      className={classes.inputCheck}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          'wearables',
                          wearablesValue,
                          setWearablesValue,
                        )
                      }
                    />
                  }
                  label={<Typography variant="body1">{wearable}</Typography>}
                  className={classes.inputCheckFormControl}
                  sx={{ flex: '0 0 50%' }}
                />
              ))}
            </FormGroup>
          </FilterAccordion>
        )} */}
        <FilterAccordion
          summary={<Typography variant="h4">Background</Typography>}
          length={backgrounds.length}
          expanded={true}
        >
          <FormGroup sx={{ flexDirection: 'row' }}>
            {backgrounds.map(background => (
              <FormControlLabel
                key={background}
                control={
                  <Checkbox
                    name={background}
                    value={background}
                    checked={backgroundsValue.includes(background)}
                    className={classes.inputCheck}
                    onChange={e => handleCheckboxChange(e, 'backgrounds', backgroundsValue, setBackgroundsValue)}
                  />
                }
                label={<Typography variant="body1">{background}</Typography>}
                className={classes.inputCheckFormControl}
                sx={{ flex: '0 0 50%' }}
              />
            ))}
          </FormGroup>
        </FilterAccordion>
        {!showMore ? (
          <Typography
            variant="body1"
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              margin: '0 14px',
              lineHeight: '36px',
            }}
            onClick={() => setShowMore(true)}
          >
            More
          </Typography>
        ) : (
          <>
            {Object.keys(CosmeticsFilter.TRAIT_VALUE_MAP)
              .sort()
              .map(categoryKey => {
                const traitGroup = Object.entries(
                  CosmeticsFilter.TRAIT_VALUE_MAP[categoryKey as keyof typeof CosmeticsFilter.TRAIT_VALUE_MAP],
                )
                  .sort((a: [string, unknown], b: [string, unknown]) => (a[1] as string).localeCompare(b[1] as string))
                  .map(item => item[0]);
                return (
                  <FormGroup key={categoryKey} sx={{ flexDirection: 'row' }}>
                    <FilterAccordion
                      summary={<Typography variant="h4">{categoryKey}</Typography>}
                      length={traitGroup.length}
                      expanded={false}
                    >
                      <FilterAllTraitCheckboxes
                        traitGroup={traitGroup}
                        categoryKey={categoryKey}
                        cosmeticsValue={cosmeticsValue}
                        onCheckboxChange={handleCheckboxChange}
                        setCosmeticsValue={setCosmeticsValue}
                        inputCheckBoxStyle={classes.inputCheck}
                        inputCheckFormControlStyle={classes.inputCheckFormControl}
                      />
                    </FilterAccordion>
                  </FormGroup>
                );
              })}
          </>
        )}
      </Stack>
    </StyledStack>
  );
};

export default DegensFilter;
