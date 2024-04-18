import Image from 'next/image';

type MachineFrameProps = {
  frames: string[];
  interval?: number;
};

const MachineFrame = ({ frames, interval = 0 }: MachineFrameProps) => {
  const frame = frames[(interval + 1) % frames.length];
  return frame ? (
    <Image
      src={frame}
      alt={`Machine Frame: ${frame}`}
      width={550}
      height={1425}
      className="pixelated"
      unoptimized={frame.endsWith('.gif')}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '550px',
        maxWidth: '90%',
        height: 'auto',
      }}
    />
  ) : null;
};

export default MachineFrame;
