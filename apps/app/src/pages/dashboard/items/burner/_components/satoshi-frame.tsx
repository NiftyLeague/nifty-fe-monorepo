import NativeImage from '@nl/ui/custom/native-image'

type SatoshiFrameProps = { frames: string[]; interval?: number }

const SatoshiFrame = ({ frames, interval = 0 }: SatoshiFrameProps) => {
  const frame = frames[(interval + 1) % frames.length]
  return frame ? (
    <NativeImage
      src={frame}
      alt={`Machine Frame: ${frame}`}
      class="pixelated"
      width={316}
      height={303}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '504px',
        'margin-left': 'auto',
        'margin-right': 'auto',
        width: '316px',
        height: 'auto',
      }}
    />
  ) : null
}

export default SatoshiFrame
