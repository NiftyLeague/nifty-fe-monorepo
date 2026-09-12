import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@nl/ui/base/dialog'
import { Button } from '@nl/ui/base/button'

type DraggableDialogProps = { open: boolean; setOpen: (open: boolean) => void }

export default function DraggableDialog({ open, setOpen }: DraggableDialogProps) {
  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="cursor-move">HELP</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground">
          Welcome to SATOSHI&apos;S COMICS BURNING MACHINE where you can burn your COMICS for
          in-game WEARABLE ITEMS!
          <ul style={{ lineHeight: 2 }}>
            <li>
              First, if not already connected, connect your wallet with the CONNECT WALLET button at
              the top left of the machine.
            </li>
            <li>
              Each COMIC burned yields 1 WEARABLE ITEM. You can also create a CITADEL KEY by burning
              a FULL SET of COMICS.
              <ul>
                <li>COMIC 1 = CAPE</li>
                <li>COMIC 2 = HALO</li>
                <li>COMIC 3 = DIAMOND BAT</li>
                <li>COMIC 4 = BREAD BAT</li>
                <li>COMIC 5 = PURPLE BAT</li>
                <li>COMIC 6 = COMPANION</li>
                <li>COMIC 1+2+3+4+5+6 = CITADEL KEY</li>
              </ul>
            </li>
            <li>
              CONSOLE 1 shows you the amount of COMICS you currently own, and allows you to select
              the COMICS and amounts of each you wish to burn.
            </li>
            <li>
              CONSOLE 2 shows you the total KEYS and ITEMS you&apos;ll receive for burning your
              selected COMICS.
            </li>
            <li>
              Once you are satisfied with your selection, hit the &quot;BURN 4 WEARABLES!&quot;
              button on CONSOLE 4. <br />
              <strong>*NOTE: When you burn a COMIC, it&apos;s gone for good!*</strong>
            </li>
            <li>
              CONSOLE 3 shows a real-time animation of Satoshi transforming your crisp COMICS into
              sparkly new WEARABLES or RARE KEYS with his fiery COMICS BURNER machine!
            </li>
            <li>
              Congratulations! Your freshly-minted ITEMS are now in your IMX WALLET and will show up
              in CONSOLE 5, as well as on the COMICS &amp; ITEMS page in your DASHBOARD.
            </li>
          </ul>
        </div>
        <DialogFooter>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
