import NativeImage from '@nl/ui/custom/native-image'

type SatoshiFrameProps = { frames: string[]; interval?: number }

const SatoshiFrame = (props: SatoshiFrameProps) => {
  const frame = () => props.frames[((props.interval ?? 0) + 1) % props.frames.length]
  return frame() ? (
    <NativeImage
      src={frame()}
      alt={`Machine Frame: ${frame()}`}
      class="pixelated absolute inset-x-0 top-126 mx-auto w-79 h-auto"
      width={316}
      height={303}
    />
  ) : null
}

export default SatoshiFrame
