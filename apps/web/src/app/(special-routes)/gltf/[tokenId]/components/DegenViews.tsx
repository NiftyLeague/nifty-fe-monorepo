'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import dynamic from 'next/dynamic'

import { cx } from '@nl/ui/class-names'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import { SRC, Color } from '@/types/gltf'

import styles from '../gltf.module.css'

const TokenMenu = dynamic(() => import('./TokenMenuBoundary'), { ssr: false })
const loadModelView = () => import('./ModelView')
const loadModelActions = () => import('./ModelActions')

export interface DegenViewsProps {
  tokenId: string
  initialImage: ReactNode
  spriteImage: ReactNode
  logo: ReactNode
}

export default function DegenViews({ tokenId, initialImage, spriteImage, logo }: DegenViewsProps) {
  const [source, setSource] = useState<SRC>(SRC.IMAGE)
  const [color, setColor] = useState<Color>('purple')
  const tokenNumber = Number(tokenId)
  const { Component: ModelView } = useDeferredComponent(loadModelView, source === SRC.MODEL)
  const { Component: ModelActions } = useDeferredComponent(loadModelActions, source === SRC.MODEL)

  return (
    <>
      <main
        className={cx(styles.main__wrapper, {
          [styles.image__surface as string]: source === SRC.IMAGE,
          ...(source === SRC.MODEL && {
            [styles.gradient_salmon as string]: color === 'salmon',
            [styles.gradient_purple as string]: color === 'purple',
            [styles.gradient_blue as string]: color === 'blue',
            [styles.gradient_bluegrey as string]: color === 'bluegrey',
            [styles.gradient_bluepurple as string]: color === 'bluepurple',
            [styles.gradient_green as string]: color === 'green',
            [styles.gradient_bluegreen as string]: color === 'bluegreen',
            [styles.gradient_brown as string]: color === 'brown',
            [styles.gradient_ochre as string]: color === 'ochre',
            [styles.gradient_palepink as string]: color === 'palepink',
            [styles.gradient_yellow as string]: color === 'yellow',
            [styles.gradient_greenish as string]: color === 'greenish',
            [styles.gradient_lightblue as string]: color === 'lightblue',
            [styles.gradient_ochretwo as string]: color === 'ochretwo',
          }),
        })}
      >
        {source === SRC.IMAGE ? initialImage : null}
        {source === SRC.SPRITE ? spriteImage : null}
        {source === SRC.MODEL ? (
          ModelView ? (
            <ModelView source={source} tokenId={tokenId} />
          ) : (
            <div className={styles.model__wrapper} role="status" aria-live="polite">
              Loading 3D viewer…
            </div>
          )
        ) : null}
        {tokenNumber < 9999 ? (
          <div className={styles.menu__overlay}>
            <ToggleGroup
              type="single"
              variant="outline"
              value={source}
              onValueChange={(value: SRC) => value && setSource(value)}
              className={styles.menu__overlay__toggle}
            >
              <ToggleGroupItem value={SRC.IMAGE} aria-label="Toggle 2D">
                2D
              </ToggleGroupItem>
              <ToggleGroupItem value={SRC.MODEL} aria-label="Toggle 3D">
                3D
              </ToggleGroupItem>
              {tokenNumber < 9901 ? (
                <ToggleGroupItem value={SRC.SPRITE} aria-label="Toggle Sprite" className="px-5">
                  SPRITE
                </ToggleGroupItem>
              ) : null}
            </ToggleGroup>
            {source === SRC.MODEL && ModelActions ? (
              <ModelActions color={color} setColor={setColor} />
            ) : null}
          </div>
        ) : null}
        {source === SRC.IMAGE ? (
          <TokenMenu tokenId={tokenId} />
        ) : (
          <div className={styles.menu__logo}>{logo}</div>
        )}
      </main>
    </>
  )
}
