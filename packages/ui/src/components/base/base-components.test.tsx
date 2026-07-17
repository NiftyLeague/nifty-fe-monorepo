import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { mock } from 'bun:test';
;
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';
import { Alert, AlertDescription, AlertTitle } from './alert';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Checkbox } from './checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Icon } from './icon';
import { Input } from './input';
import { Label } from './label';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from './navigation-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';
import { Progress } from './progress';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Separator } from './separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Skeleton } from './skeleton';
import { Slider } from './slider';
import { Switch } from './switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Toggle } from './toggle';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

mock.module('lucide-react/dynamic', () => ({
  DynamicIcon: ({ name, fallback: Fallback }: { name: string; fallback: () => React.ReactNode }) =>
    name === 'circle' ? <svg aria-label={name} /> : <Fallback />,
}));

describe('base visual primitives', () => {
  it('renders semantic content and style variants', () => {
    render(
      <>
        <Alert variant="destructive">
          <AlertTitle>Danger</AlertTitle>
          <AlertDescription>Take care</AlertDescription>
        </Alert>
        <Avatar>
          <AvatarImage src="/avatar.png" alt="Avatar" />
          <AvatarFallback>NL</AvatarFallback>
        </Avatar>
        <Badge variant="secondary">Member</Badge>
        <Badge asChild variant="outline">
          <a href="/badge">Linked badge</a>
        </Badge>
        <Button variant="dashed" size="lg">
          Save
        </Button>
        <Button asChild variant="link">
          <a href="/button">Button link</a>
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>Action</CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Degen" />
        <Icon name="circle" color="success" fill="purple" size="lg" aria-label="status icon" />
        <Icon name={'missing' as never} size={31} aria-label="fallback icon" />
        <Progress value={35} aria-label="progress" />
        <Progress value={0} aria-label="empty progress" />
        <Separator />
        <Skeleton>Loading</Skeleton>
      </>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Danger');
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('Degen');
    expect(screen.getByLabelText('circle')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'progress' })).toBeInTheDocument();
  });

  it('renders pagination navigation and active states', () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/0" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/1" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="/2">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/2" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );

    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByLabelText('Go to next page')).toHaveAttribute('href', '/2');
  });
});

describe('base controlled primitives', () => {
  it('renders disclosure, selection, range, tab, and toggle controls', () => {
    render(
      <>
        <Accordion type="single" defaultValue="details">
          <AccordionItem value="details">
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>Expanded details</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Checkbox defaultChecked aria-label="Accept" />
        <RadioGroup defaultValue="one">
          <RadioGroupItem value="one" aria-label="One" />
          <RadioGroupItem value="two" aria-label="Two" />
        </RadioGroup>
        <Slider defaultValue={[20, 80]} aria-label="Range" />
        <Slider min={5} max={10} aria-label="Default range" />
        <Switch defaultChecked aria-label="Enabled" />
        <Tabs defaultValue="first">
          <TabsList>
            <TabsTrigger value="first">First</TabsTrigger>
            <TabsTrigger value="second">Second</TabsTrigger>
          </TabsList>
          <TabsContent value="first">First panel</TabsContent>
          <TabsContent value="second">Second panel</TabsContent>
        </Tabs>
        <Toggle defaultPressed variant="outline" size="sm">
          Bold
        </Toggle>
        <ToggleGroup type="single" defaultValue="left" variant="outline" size="lg">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="right" variant="default" size="sm">
            Right
          </ToggleGroupItem>
        </ToggleGroup>
      </>,
    );

    expect(screen.getByText('Expanded details')).toBeVisible();
    expect(screen.getByRole('checkbox', { name: 'Accept' })).toBeChecked();
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('First panel')).toBeVisible();
  });
});

describe('base overlay and navigation primitives', () => {
  it('opens and closes dialogs while forwarding state callbacks', () => {
    const onOpenChange = mock();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>Dialog details</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>Done</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Dialog title');
    expect(document.documentElement.style.overflow).toBe('hidden');
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it('renders alert-dialog, sheet sides, tooltip, and navigation composition', () => {
    const { rerender } = render(
      <AlertDialog open>
        <AlertDialogTrigger>Open alert</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm</AlertDialogTitle>
            <AlertDialogDescription>Continue?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );
    expect(screen.getByRole('alertdialog')).toHaveTextContent('Confirm');

    rerender(
      <Sheet open>
        <SheetTrigger>Open sheet</SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Sheet title</SheetTitle>
            <SheetDescription>Sheet details</SheetDescription>
          </SheetHeader>
          <SheetFooter>
            <SheetClose>Finish</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    expect(screen.getByRole('dialog')).toHaveTextContent('Sheet title');

    rerender(
      <>
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover target</TooltipTrigger>
            <TooltipContent sideOffset={8}>Helpful text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/games">Games</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
      </>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful text');
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();
  });
});
