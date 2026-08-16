import Image from 'next/image'
import { DEGEN_SPECIALS, type DegenSpecial } from './constants'

export function DegenSpecialsTable() {
  return (
    <>
      <div className="mb-5">
        <div className="flex flex-wrap -mx-4">
          <div className="w-1/2 sm:w-1/3 px-4">
            <h3 className="text-center">TRIBE</h3>
          </div>
          <div className="w-1/2 sm:w-2/3 px-4">
            <h3 className="text-center">SPECIAL</h3>
          </div>
        </div>
      </div>

      <div className="relative border-2 rounded-2xl overflow-clip">
        <hr className="absolute top-0 bottom-0 left-1/2 w-[2px] h-full my-0 mx-0 border-0 bg-border md:left-1/3" />
        {DEGEN_SPECIALS.map(({ name, description, specialName, gif, image }: DegenSpecial) => (
          <div key={name} className="flex flex-row py-8">
            <div className="w-1/2 sm:w-1/3 my-auto sm:mx-auto">
              <div className="flex flex-col">
                <div className="text-center">
                  <Image
                    src={image.link}
                    alt={name}
                    width={image.width}
                    height={image.height}
                    className="mx-auto h-auto w-[30%] sm:w-auto sm:max-w-[90px] lg:max-w-[120px]"
                  />
                </div>
                <h5 className="mt-2 text-center">{name}</h5>
              </div>
            </div>

            <div className="hidden w-0 md:block md:w-5/12 m-auto md:ps-6 lg:ps-8">
              <p className="font-bold">{description}</p>
            </div>

            <div className="w-1/2 sm:w-1/4 my-auto sm:mx-auto">
              <div className="-mt-12 text-center">
                <Image
                  src={gif.link}
                  unoptimized
                  alt={name}
                  width={gif.width}
                  height={gif.height}
                  className="mx-auto h-auto w-auto"
                />
              </div>
              <h6 className="-mt-6 mx-auto max-w-[90%] text-center">{specialName}</h6>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default DegenSpecialsTable
