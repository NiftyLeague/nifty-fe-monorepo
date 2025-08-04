'use client';

// import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog } from '@nl/ui/custom/Dialog';
import { Text } from '@nl/ui/custom/Typography';
import useVersion from '@/hooks/useVersion';

// const UnityDialog = dynamic(() => import('@/components/UnityDialog'), { ssr: false, loading: () => null });

const PlayContent = () => (
  <>
    <Text>
      This party platform fighter will have you on the edge of your seat as you and three other players grab your bats,
      unleash unique abilities, and smash each other out of the arena in a winner-takes-all battle!
    </Text>
    <div className="grid grid-cols-3 gap-2 items-center">
      <Link
        href="/android/&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
        target="_blank"
        rel="noreferrer"
        className="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <Image
          src="/img/badges/google-play-badge.webp"
          alt="Get it on Google Play"
          width={234}
          height={70}
          priority
          style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
        />
      </Link>
      <Link
        href="/ios"
        target="_blank"
        rel="noreferrer"
        className="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <Image
          src="/img/badges/apple-store-badge.svg"
          alt="Apple Store Badge"
          width={215}
          height={72}
          priority
          style={{ width: '92%', maxWidth: '100%', height: 'auto' }}
        />
      </Link>
      <Link
        href="/steam"
        target="_blank"
        rel="noreferrer"
        className="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <Image
          src="/img/badges/steam-badge.webp"
          alt="Steam Store Badge"
          width={234}
          height={69}
          priority
          style={{ width: '100%', maxWidth: '100%', height: 'auto' }}
        />
      </Link>
      {/* <UnityDialog /> */}
    </div>
  </>
);

const PlayDialog = ({ open }: { open: boolean }) => {
  const { message } = useVersion();
  return (
    <Dialog
      defaultOpen={open}
      title="Let's Brawl!"
      description={message}
      triggerElement={
        <button id="play-dialog-trigger">
          <Image
            src="/icons/controller.svg"
            alt="Game Icon"
            width={22}
            height={22}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          Play
        </button>
      }
    >
      <PlayContent />
    </Dialog>
  );
};

export default PlayDialog;
