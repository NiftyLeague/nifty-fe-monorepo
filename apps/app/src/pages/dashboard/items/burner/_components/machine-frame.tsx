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
      class="pixelated absolute inset-x-0 mx-auto w-137.5 max-w-[90%] h-auto"
      unoptimized={frame.endsWith('.gif')}
    />
  ) : null
}

export default MachineFrame
