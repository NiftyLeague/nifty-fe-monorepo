import NativeImage from '@nl/ui/custom/native-image'

type SatoshiFrameProps = { frames: string[]; interval?: number }

const SatoshiFrame = ({ frames, interval = 0 }: SatoshiFrameProps) => {
  const frame = frames[(interval + 1) % frames.length]
  return frame ? (
    <NativeImage
      src={frame}
      alt={`Machine Frame: ${frame}`}
      class="pixelated absolute inset-x-0 top-126 mx-auto w-79 h-auto"
      width={316}
      height={303}
    />
  ) : null
}

export default SatoshiFrame
