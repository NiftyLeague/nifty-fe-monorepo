import { memo } from 'react'
import { BookOpenCheck } from 'lucide-react'

import { Avatar, AvatarFallback } from '@nl/ui/base/avatar'
import { Card, CardContent } from '@nl/ui/base/card'
import { Progress } from '@nl/ui/base/progress'

// styles
import styles from './OnboardingCard.module.css'

interface LinearProgressWithLabelProps {
  value: number
}

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

const LinearProgressWithLabel = ({ value, ...others }: LinearProgressWithLabelProps) => (
  <div className="mt-1.5 flex flex-col gap-1">
    <div className="flex justify-between">
      <h6 className="text-foreground">Progress</h6>
      <h6 style={{ color: 'inherit' }}>{`${Math.round(value)}%`}</h6>
    </div>
    <Progress className={styles.borderLinearProgress} value={value} {...others} />
  </div>
)

// ==============================|| SIDEBAR - ONBOARDING CARD ||============================== //

const OnboardingCard = () => {
  return (
    <Card className={styles.cardStyle}>
      <CardContent className="p-2">
        <ul className="m-0 list-none p-0">
          <li className="flex items-start p-0">
            <div className="mt-0">
              <Avatar
                className="mr-3 size-11 cursor-pointer rounded-md"
                style={{
                  color: 'var(--color-purple)',
                  border: 'var(--border-purple)',
                  background: 'var(--color-background)',
                }}
              >
                <AvatarFallback>
                  <BookOpenCheck
                    aria-hidden="true"
                    absoluteStrokeWidth
                    size={20}
                    strokeWidth={1.5}
                  />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-0">
              <div className="text-sm font-medium text-foreground">Onboarding</div>
              <span className="text-xs text-muted-foreground"> 28/23 Tasks</span>
            </div>
          </li>
        </ul>
        <LinearProgressWithLabel value={80} />
      </CardContent>
    </Card>
  )
}

export default memo(OnboardingCard)
