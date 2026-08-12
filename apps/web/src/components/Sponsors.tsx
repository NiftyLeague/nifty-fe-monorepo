import Image from 'next/image'

type Sponsor = { image: string; url: string; width: number; height: number }

const RenderSponsor = ({ image, url, width, height }: Sponsor) => (
  <SponsorItem key={image} image={image} url={url} width={width} height={height} />
)

const SponsorItem = ({ image, url, width, height }: Sponsor): React.ReactNode => (
  <a href={url} target="_blank" rel="noreferrer" className="block">
    <div className="m-6 w-20 md:m-8 md:w-40">
      <Image
        alt="sponsor image"
        src={image}
        width={width}
        height={height}
        sizes="(min-width: 768px) 160px, 80px"
        className="w-full h-auto"
      />
    </div>
  </a>
)

const Sponsors = ({ sponsors }: { sponsors: Sponsor[] }) => (
  <>
    <div className="container mx-auto px-0 md:hidden">
      <div className="m-0 p-0 relative py-0 sm:py-5 flex items-center justify-center text-center">
        <section className="flex flex-wrap items-center justify-center max-w-[1600px] mx-auto">
          {sponsors.map(RenderSponsor)}
        </section>
      </div>
    </div>
    <div className="hidden md:block">
      <div className="w-full relative flex-grow">
        <Image
          alt="Proudly Backed By"
          className="w-full h-auto"
          width={1920}
          height={925}
          src="/img/sponsors/sponsors.webp"
          sizes="100vw"
        />
        <div className="dark-gradient-overlay" />
      </div>
    </div>
  </>
)

export default Sponsors
