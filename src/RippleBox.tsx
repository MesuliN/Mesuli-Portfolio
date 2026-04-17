import {
  useCallback,
  useRef,
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react'

export function setBodyCursorActive(active: boolean) {
  if (active) document.body.classList.add('cursor-active')
  else document.body.classList.remove('cursor-active')
}

export type RippleBoxProps = {
  children: ReactNode
  className?: string
  onClick?: HTMLAttributes<HTMLDivElement>['onClick']
} & Omit<HTMLAttributes<HTMLDivElement>, 'onClick' | 'children' | 'className'>

export function RippleBox({
  children,
  className = '',
  onClick,
  onPointerEnter,
  onPointerLeave,
  ...rest
}: RippleBoxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const handleClick = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const wave = document.createElement('span')
        wave.className = 'ripple-wave'
        wave.style.left = `${e.clientX - rect.left}px`
        wave.style.top = `${e.clientY - rect.top}px`
        el.appendChild(wave)
        wave.addEventListener('animationend', () => wave.remove())
      }
      onClick?.(e)
    },
    [onClick],
  )

  return (
    <div
      ref={ref}
      {...rest}
      className={`interactive ripple relative cursor-pointer overflow-hidden ${className}`}
      onClick={handleClick}
      onPointerEnter={(e) => {
        setBodyCursorActive(true)
        onPointerEnter?.(e)
      }}
      onPointerLeave={(e) => {
        setBodyCursorActive(false)
        onPointerLeave?.(e)
      }}
    >
      {children}
    </div>
  )
}
