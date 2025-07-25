import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Select from './Select';

describe('#Select', () => {
  it('should render select correctly', async () => {
    render(
      <Select data-testid="form-select">
        <option>1</option>
        <option>2</option>
      </Select>,
    );
    expect(screen.queryByTestId('form-select')).toBeInTheDocument();
  });

  it('should have "form-select--error" class', () => {
    render(
      <Select error data-testid="form-select">
        <option>1</option>
        <option>2</option>
      </Select>,
    );
    expect(screen.queryByTestId('form-select')).toHaveClass('sbui-select sbui-select--error sbui-select--md');
  });
});
