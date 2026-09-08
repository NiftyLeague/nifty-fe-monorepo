import heroUrl from '../../../../../assets/img/misc/trio.webp'

export function meta() {
  return [
    { title: 'M2 React Router prototype' },
    { name: 'description', content: 'Disposable React Router framework benchmark prototype' },
  ]
}
export default function Home() {
  return (
    <main>
      <h1>M2 public fixture</h1>
      <p>SSR framework-candidate content with production metadata.</p>
      <img src={heroUrl} width={601} height={599} alt="Three Nifty League characters" />
    </main>
  )
}
