import { render } from '@testing-library/react';
import { describe, expect, it, mock } from 'bun:test';
import { Link } from './link';
import { Text } from './text';
import { Title } from './title';
import Typography from './index';

describe('Text', () => {
  it('renders a span by default', () => {
    const { container } = render(<Text>hello</Text>);
    const span = container.querySelector('span');
    expect(span).toBeTruthy();
    expect(span?.textContent).toBe('hello');
  });

  it('renders blockquote variant', () => {
    const { container } = render(<Text blockquote>quote</Text>);
    expect(container.querySelector('blockquote')?.textContent).toBe('quote');
  });

  it('renders code variant', () => {
    const { container } = render(<Text code>code</Text>);
    expect(container.querySelector('code')?.textContent).toBe('code');
  });

  it('renders mark variant', () => {
    const { container } = render(<Text mark>mark</Text>);
    expect(container.querySelector('mark')?.textContent).toBe('mark');
  });

  it('renders keyboard variant', () => {
    const { container } = render(<Text keyboard>K</Text>);
    expect(container.querySelector('kbd')?.textContent).toBe('K');
  });

  it('renders strong variant', () => {
    const { container } = render(<Text strong>bold</Text>);
    expect(container.querySelector('strong')?.textContent).toBe('bold');
  });

  it('applies disabled, underline, strikethrough, sm and xs classes', () => {
    const { container } = render(
      <Text disabled underline strikethrough sm xs className="custom">
        styled
      </Text>,
    );
    const el = container.querySelector('span');
    expect(el?.className).toContain('custom');
    expect(el?.className).toContain('line-through');
    expect(el?.className).toContain('cursor-not-allowed');
    expect(el?.className).toContain('text-xs');
  });

  it('applies the error variant color', () => {
    const { container } = render(<Text variant="error">e</Text>);
    expect(container.querySelector('span')?.className).toContain('text-error');
  });

  it('applies underline and sm classes', () => {
    const { container } = render(
      <Text underline sm>
        u
      </Text>,
    );
    const el = container.querySelector('span');
    expect(el?.className).toContain('underline');
    expect(el?.className).toContain('text-sm');
  });

  it.each(['default', 'error', 'muted', 'primary', 'secondary', 'success', 'warning'] as const)(
    'renders variant %s',
    variant => {
      const { container } = render(<Text variant={variant}>v</Text>);
      expect(container.querySelector('span')?.textContent).toBe('v');
    },
  );

  it('applies inline style', () => {
    const { container } = render(<Text style={{ color: 'red' }}>styled</Text>);
    expect(container.querySelector('span')?.getAttribute('style')).toContain('red');
  });
});

describe('Title', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)('renders h%s for level %s', level => {
    const { container } = render(<Title level={level}>heading</Title>);
    const el = container.querySelector(`h${level}`);
    expect(el).toBeTruthy();
    expect(el?.textContent).toBe('heading');
  });

  it('applies className and style', () => {
    const { container } = render(
      <Title level={1} className="mytitle" style={{ margin: '4px' }}>
        t
      </Title>,
    );
    const el = container.querySelector('h1');
    expect(el?.className).toContain('mytitle');
    expect(el?.getAttribute('style')).toContain('margin');
  });
});

describe('Link', () => {
  it('renders an anchor with href and target', () => {
    const { container } = render(
      <Link href="https://example.com" target="_blank">
        go
      </Link>,
    );
    const a = container.querySelector('a');
    expect(a?.getAttribute('href')).toBe('https://example.com');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
    expect(a?.textContent).toBe('go');
  });

  it('calls onClick when enabled', () => {
    const onClick = mock();
    const { container } = render(
      <Link href="/path" onClick={onClick}>
        click
      </Link>,
    );
    container.querySelector('a')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalled();
  });

  it('does not call onClick and omits href when disabled', () => {
    const onClick = mock();
    const { container } = render(
      <Link href="/path" onClick={onClick} disabled className="dis">
        click
      </Link>,
    );
    const a = container.querySelector('a');
    expect(a?.getAttribute('href')).toBeNull();
    a?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    expect(a?.className).toContain('dis');
  });
});

describe('Typography', () => {
  it('renders a div by default', () => {
    const { container } = render(<Typography>content</Typography>);
    expect(container.querySelector('div')?.textContent).toBe('content');
  });

  it('renders a custom tag with className and style', () => {
    const { container } = render(
      <Typography tag="section" className="wrap" style={{ padding: '2px' }}>
        s
      </Typography>,
    );
    const el = container.querySelector('section');
    expect(el?.className).toContain('wrap');
    expect(el?.getAttribute('style')).toContain('padding');
  });

  it('exposes Link, Text and Title as members', () => {
    expect(Typography.Link).toBe(Link);
    expect(Typography.Text).toBe(Text);
    expect(Typography.Title).toBe(Title);
  });
});
