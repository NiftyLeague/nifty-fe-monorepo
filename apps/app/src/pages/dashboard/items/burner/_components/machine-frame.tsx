import NativeImage from '@nl/ui/custom/native-image'

type MachineFrameProps = { frames: string[]; interval?: number }

const MachineFrame = ({ frames, interval = 0 }: MachineFrameProps) => {
  const frame = frames[(interval + 1) % frames.length]
  return frame ? (
    <NativeImage
      src={frame}
      alt={`Machine Frame: ${frame}`}
      width={550}
      height={1425}
      class="pixelated"
      unoptimized={frame.endsWith('.gif')}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        'margin-left': 'auto',
        'margin-right': 'auto',
        width: '550px',
        'max-width': '90%',
        height: 'auto',
      }}
    />
  ) : null
}

export default MachineFrame
