import NativeImage from '@nl/ui/custom/native-image'

type MachineFrameProps = { frames: string[]; interval?: number }

const MachineFrame = (props: MachineFrameProps) => {
  const frame = () => props.frames[((props.interval ?? 0) + 1) % props.frames.length]
  return frame() ? (
    <NativeImage
      src={frame()}
      alt={`Machine Frame: ${frame()}`}
      width={550}
      height={1425}
      class="pixelated absolute inset-x-0 mx-auto w-137.5 max-w-[90%] h-auto"
      unoptimized={frame()?.endsWith('.gif')}
    />
  ) : null
}

export default MachineFrame
