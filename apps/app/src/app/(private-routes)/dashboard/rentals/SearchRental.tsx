'use client';

import { useEffect, useRef } from 'react';
import { TextField, FormControl } from '@mui/material';

interface Props {
  handleSearch: (currentValue: string) => void;
  placeholder?: string;
}

const SearchRental = ({ handleSearch, placeholder }: Props): React.ReactNode => {
  const inputEl: any = useRef(null);
  let typingTimer: NodeJS.Timeout | undefined;

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
    };
  }, [typingTimer]);

  const onSearchLocation = () => {
    const currentValue = inputEl?.current?.value;
    handleSearch(currentValue);
  };

  const doneTyping = () => {
    onSearchLocation();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearchLocation();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') return;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, 500);
  };

  const handleKeyDown = () => {
    clearTimeout(typingTimer);
  };

  return (
    <FormControl>
      <TextField
        placeholder={placeholder || 'Search renter by name'}
        name="search"
        variant="outlined"
        fullWidth
        sx={{ minWidth: '480px' }}
        slotProps={{
          htmlInput: {
            ref: inputEl,
            onKeyDown: handleKeyDown,
            onKeyUp: handleKeyUp,
            onKeyPress: handleKeyPress,
          },
        }}
      />
    </FormControl>
  );
};

export default SearchRental;
