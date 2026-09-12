import NativeImage from '@nl/ui/custom/native-image'

type SatoshiFrameProps = { frames: string[]; interval?: number }

const SatoshiFrame = ({ frames, interval = 0 }: SatoshiFrameProps) => {
  const frame = frames[(interval + 1) % frames.length]
  return frame ? (
    <NativeImage
      src={frame}
      alt={`Machine Frame: ${frame}`}
      className="pixelated"
      width={316}
      height={303}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 504,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '316px',
        height: 'auto',
      }}
    />
  ) : null
}

export default SatoshiFrame
