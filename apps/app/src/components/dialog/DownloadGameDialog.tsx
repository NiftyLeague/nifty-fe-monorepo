'use client'

import { Button } from '@nl/ui/base/button'
import { Icon } from '@nl/ui/base/icon'
import { Dialog, DialogTrigger, DialogContent } from '@/components/dialog'
import useVersion from '@/hooks/useVersion'

export const Downloader = (): React.ReactNode => {
  const { isWindows, isMacOs, downloadURL, version, message } = useVersion()

  return (
    <div className="container p-10 text-left">
      <span className="text-base">
        Nifty League Desktop{' '}
        <span role="img" aria-label="joystick emoji">
          🕹️
        </span>
      </span>
      <p>The Nifty League Desktop is recommended for best performance and latest game updates.</p>
      <span className="text-base">Setup Steps:</span>
      <ol style={{ lineHeight: '2.5rem' }}>
        <li>Download the installer below</li>
        {isMacOs || !version ? (
          <Button size="lg" disabled>
            <Icon name="download" />
            {!version && isWindows ? 'Fetching installer version...' : message}
          </Button>
        ) : (
          <Button asChild size="lg">
            <a href={downloadURL}>
              <Icon name="download" />
              {message}
            </a>
          </Button>
        )}
        <li>
          Run the installer to install <strong>Nifty Launcher</strong> and an optional shortcut
        </li>
        <li>
          Launch the game using <strong>Nifty Launcher</strong>
        </li>
        <li>
          The game opens up <strong>nifty-league.com</strong> for account verification
        </li>
        <li>Sign a message via MetaMask or other accepted Web3 providers to verify your account</li>
        <li>
          Return to the game and <strong>SMASH</strong>!!
        </li>
      </ol>
      <p>
        <em>
          * We are in the process of obtaining a Code Signing Certificate to avoid the Windows&apos;
          SmartScreen warning
        </em>
      </p>
    </div>
  )
}

const DownloadGameDialog = () => {
  return (
    <Dialog>
      {/* <DialogTrigger>
        <Button variant="outline" className="w-full min-w-[80px] flex-1">
          Desktop App (Deprecated)
        </Button>
      </DialogTrigger> */}
      <DialogContent aria-labelledby="customized-dialog-title" dialogTitle="Nifty League Desktop">
        <Downloader />
      </DialogContent>
    </Dialog>
  )
}

export default DownloadGameDialog
