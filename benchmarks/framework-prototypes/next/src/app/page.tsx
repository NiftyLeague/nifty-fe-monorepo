import hero from '../../../../../assets/img/misc/trio.webp'

export default function Page() {
  return (
    <main>
      <h1>M2 public fixture</h1>
      <p>Static framework-control content with production metadata.</p>
      <img src={hero.src} width={601} height={599} alt="Three Nifty League characters" />
    </main>
  )
}
