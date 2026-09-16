import { For } from 'solid-js'

import { Separator } from '@nl/ui/base/separator'

import { DEGEN_SPECIALS, type DegenSpecial } from './constants'

export function DegenSpecialsTable() {
  return (
    <>
      <div class="mb-5">
        <div class="flex flex-wrap -mx-4">
          <div class="w-1/2 sm:w-1/3 px-4">
            <h3 class="text-center">TRIBE</h3>
          </div>
          <div class="w-1/2 sm:w-2/3 px-4">
            <h3 class="text-center">SPECIAL</h3>
          </div>
        </div>
      </div>

      <div class="relative border-2 rounded-2xl overflow-clip">
        <Separator
          orientation="vertical"
          aria-hidden="true"
          class="absolute top-0 bottom-0 left-1/2 h-full w-0.5 my-0 mx-0 md:left-1/3"
        />
        <For each={DEGEN_SPECIALS}>
          {({ name, description, specialName, gif, image }: DegenSpecial) => (
            <div class="flex flex-row py-8">
              <div class="w-1/2 sm:w-1/3 my-auto sm:mx-auto">
                <div class="flex flex-col">
                  <div class="text-center">
                    {/* This table is dynamically loaded from a client boundary; native lazy images
                        avoid shipping a stateful image runtime into that deferred chunk. */}
                    <img
                      src={image.link}
                      alt={name}
                      width={image.width}
                      height={image.height}
                      loading="lazy"
                      decoding="async"
                      class="mx-auto h-auto w-3/10 sm:w-auto sm:max-w-22.5 lg:max-w-30"
                    />
                  </div>
                  <h5 class="mt-2 text-center">{name}</h5>
                </div>
              </div>

              <div class="hidden w-0 md:block md:w-5/12 m-auto md:ps-6 lg:ps-8">
                <p class="font-bold">{description}</p>
              </div>

              <div class="w-1/2 sm:w-1/4 my-auto sm:mx-auto">
                <div class="-mt-12 text-center">
                  <img
                    src={gif.link}
                    alt={name}
                    width={gif.width}
                    height={gif.height}
                    loading="lazy"
                    decoding="async"
                    class="mx-auto h-auto w-auto"
                  />
                </div>
                <h6 class="-mt-6 mx-auto max-w-[90%] text-center">{specialName}</h6>
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  )
}

export default DegenSpecialsTable
