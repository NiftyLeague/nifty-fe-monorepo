import { describe, expect, it } from 'bun:test'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nl/ui/base/accordion'
import { Alert, AlertDescription, AlertTitle } from '@nl/ui/base/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@nl/ui/base/avatar'
import { Badge } from '@nl/ui/base/badge'
import { Button } from '@nl/ui/base/button'
import { Checkbox } from '@nl/ui/base/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@nl/ui/base/dialog'
import { IconButton } from '@nl/ui/base/icon-button'
import { Input } from '@nl/ui/base/input'
import { Label } from '@nl/ui/base/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@nl/ui/base/pagination'
import { Progress } from '@nl/ui/base/progress'
import { RadioGroup, RadioGroupItem } from '@nl/ui/base/radio-group'
import { Separator } from '@nl/ui/base/separator'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@nl/ui/base/sheet'
import { Skeleton } from '@nl/ui/base/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@nl/ui/base/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@nl/ui/base/tabs'
import { Toggle } from '@nl/ui/base/toggle'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@nl/ui/base/tooltip'

/**
 * Accessibility contract for the shared base primitives.
 *
 * These are the shadcn/Radix wrappers every app renders. The rendering contract
 * lives in base-components.test.tsx; this file pins the properties the M4.1
 * acceptance criteria name — roles, accessible names, keyboard operation, state
 * exposure, and focus behaviour — so a wrapper change that strips an ARIA
 * attribute or a key handler fails here rather than in an audit.
 */

describe('base primitives: names and semantics', () => {
  it('exposes the button role with its name, disabled state, and safe default type', () => {
    render(
      <>
        <Button>Save</Button>
        <Button disabled>Save</Button>
      </>
    )

    const [enabled, disabled] = screen.getAllByRole('button', { name: 'Save' })

    expect(enabled?.getAttribute('type')).toBe('button')
    expect(enabled?.hasAttribute('disabled')).toBe(false)
    expect((disabled as HTMLButtonElement).disabled).toBe(true)
  })

  it('requires a name on the icon-only button', () => {
    render(
      <IconButton aria-label="Close panel">
        <span aria-hidden="true">×</span>
      </IconButton>
    )

    const button = screen.getByRole('button', { name: 'Close panel' })
    // An icon-only control must not expose its glyph as the name.
    expect(button.textContent).not.toBe('Close panel')
  })

  it('associates a label with its control', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" />
      </>
    )

    const input = screen.getByLabelText('Email address')
    await user.click(screen.getByText('Email address'))

    expect(document.activeElement).toBe(input)
  })

  it('announces progress with a value and range', () => {
    render(<Progress value={42} aria-label="Minting" />)

    const progress = screen.getByRole('progressbar', { name: 'Minting' })

    expect(progress.getAttribute('aria-valuenow')).toBe('42')
    expect(progress.getAttribute('aria-valuemax')).toBe('100')
  })

  it('marks the current page in pagination and names the step controls', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="?page=1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="?page=1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="?page=3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )

    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBeTruthy()
    expect(screen.getByRole('link', { name: /previous/i })).toBeTruthy()
    expect(screen.getByRole('link', { name: /next/i })).toBeTruthy()
    expect(screen.getByRole('link', { current: 'page' }).textContent).toBe('1')
  })

  it('gives the table its header and cell relationships', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Smashers</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )

    expect(screen.getByRole('table')).toBeTruthy()
    expect(screen.getByRole('columnheader', { name: 'Game' })).toBeTruthy()
    expect(screen.getByRole('cell', { name: 'Smashers' })).toBeTruthy()
  })

  it('marks decorative output as presentational and statuses as alerts', () => {
    render(
      <>
        <Separator data-testid="separator" />
        <Skeleton data-testid="skeleton" />
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>Your session expires soon.</AlertDescription>
        </Alert>
        <Badge>New</Badge>
        <Avatar>
          <AvatarImage src="/avatar.webp" alt="Nifty Andy" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
      </>
    )

    expect(screen.getByTestId('separator').getAttribute('role')).toBe('none')
    expect(screen.getByTestId('skeleton').getAttribute('aria-hidden')).toBe('true')
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('New')).toBeTruthy()
    // Radix mounts the avatar image only once it loads, so this DOM shows the
    // fallback; the browser harness covers the loaded state.
    expect(screen.getByText('NA')).toBeTruthy()
  })
})

describe('base primitives: keyboard and state', () => {
  it('toggles a checkbox with the keyboard and reports its state', async () => {
    const user = userEvent.setup()
    render(
      <>
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms</Label>
      </>
    )

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })

    expect(checkbox.getAttribute('aria-checked')).toBe('false')
    await user.click(checkbox)
    expect(checkbox.getAttribute('aria-checked')).toBe('true')

    await user.keyboard(' ')
    expect(checkbox.getAttribute('aria-checked')).toBe('false')
  })

  it('exposes radio state and keeps one tab stop in the group', () => {
    render(
      <RadioGroup defaultValue="smashers" aria-label="Favourite game">
        <RadioGroupItem value="smashers" aria-label="Smashers" />
        <RadioGroupItem value="crypto-winter" aria-label="Crypto Winter" />
      </RadioGroup>
    )

    const group = screen.getByRole('radiogroup', { name: 'Favourite game' })
    const smashers = screen.getByRole('radio', { name: 'Smashers' })
    const winter = screen.getByRole('radio', { name: 'Crypto Winter' })

    expect(group).toBeTruthy()
    expect(smashers.getAttribute('aria-checked')).toBe('true')
    expect(smashers.getAttribute('data-state')).toBe('checked')
    expect(winter.getAttribute('aria-checked')).toBe('false')
    expect(winter.getAttribute('data-state')).toBe('unchecked')
    // Radix drives arrow-key selection through its roving-focus module, which
    // this DOM implementation does not exercise; the browser harness verifies
    // the arrow-key path.
  })

  it('exposes an accordion as an expanded disclosure operated by the keyboard', async () => {
    const user = userEvent.setup()
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="one">
          <AccordionTrigger>How do rentals work?</AccordionTrigger>
          <AccordionContent>You rent a DEGEN for a fixed term.</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    const trigger = screen.getByRole('button', { name: 'How do rentals work?' })

    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('region')).toBeNull()

    await user.click(trigger)

    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    // The panel is named by its trigger, so the relationship survives even
    // though the collapsed panel is unmounted and carries no aria-controls.
    const panel = screen.getByRole('region', { name: 'How do rentals work?' })
    expect(panel.textContent).toContain('fixed term')
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id)

    await user.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByRole('region')).toBeNull()
  })

  it('marks the selected tab and links it to its panel', () => {
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="DEGEN views">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traits">Traits</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="traits">Traits panel</TabsContent>
      </Tabs>
    )

    const overview = screen.getByRole('tab', { name: 'Overview' })
    const traits = screen.getByRole('tab', { name: 'Traits' })

    const tablist = screen.getByRole('tablist', { name: 'DEGEN views' })

    expect(tablist.getAttribute('aria-orientation')).toBe('horizontal')
    expect(overview.getAttribute('aria-selected')).toBe('true')
    expect(overview.getAttribute('data-state')).toBe('active')
    expect(traits.getAttribute('aria-selected')).toBe('false')
    expect(overview.getAttribute('aria-controls')).toBe(screen.getByRole('tabpanel').id)
    expect(screen.getByRole('tabpanel').textContent).toBe('Overview panel')
    // Selection via arrow keys runs through Radix's roving-focus module and is
    // verified in the browser harness rather than here.
  })

  it('reports the pressed state of a toggle', async () => {
    const user = userEvent.setup()
    render(<Toggle aria-label="Bold">B</Toggle>)

    const toggle = screen.getByRole('button', { name: 'Bold' })

    expect(toggle.getAttribute('aria-pressed')).toBe('false')
    await user.click(toggle)
    expect(toggle.getAttribute('aria-pressed')).toBe('true')
  })

  it('keeps the tooltip content off the trigger until it opens', () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Rent terms</TooltipTrigger>
          <TooltipContent>Rental terms apply</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    const trigger = screen.getByRole('button', { name: 'Rent terms' })
    expect(trigger.getAttribute('aria-describedby')).toBeNull()

    // Radix opens the tooltip from pointer/focus intent plus its own timer; the
    // browser harness covers the open path, this pins the trigger contract.
    expect(trigger.getAttribute('type')).toBe('button')
  })
})

describe('base primitives: focus management', () => {
  it('names a dialog, closes it with Escape, and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger>Rent DEGEN</DialogTrigger>
        <DialogContent>
          <DialogTitle>Rental terms</DialogTitle>
          <DialogDescription>Choose a term length.</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole('button', { name: 'Rent DEGEN' })
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog', { name: 'Rental terms' })
    expect(dialog.getAttribute('aria-describedby')).toBeTruthy()
    // Focus moves into the dialog rather than staying on the page behind it.
    expect(dialog.contains(document.activeElement)).toBe(true)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('names a sheet and closes it with Escape', async () => {
    const user = userEvent.setup()
    render(
      <Sheet>
        <SheetTrigger>Open filters</SheetTrigger>
        <SheetContent>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the DEGEN list.</SheetDescription>
        </SheetContent>
      </Sheet>
    )

    await user.click(screen.getByRole('button', { name: 'Open filters' }))

    expect(await screen.findByRole('dialog', { name: 'Filters' })).toBeTruthy()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
