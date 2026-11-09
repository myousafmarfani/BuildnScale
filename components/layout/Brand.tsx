import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type BrandProps = {
  /** Pass `null` to render the brand without a link. */
  href?: string | null
  className?: string
  priority?: boolean
  ariaLabel?: string
  tabIndex?: number
  textClassName?: string
  onClick?: () => void
}

export function Brand({
  href = '/',
  className,
  priority,
  ariaLabel = 'BuildnScale home',
  tabIndex,
  textClassName,
  onClick,
}: BrandProps) {
  const content = (
    <>
      <span className="brand-mark">
        <Image
          src="/logo.png"
          alt=""
          width={500}
          height={500}
          sizes="(min-width: 640px) 32px, 28px"
          priority={priority}
          className="h-full w-full scale-125 object-contain"
        />
      </span>
      <span className={textClassName}>
        build<span className="text-teal">n</span>scale
      </span>
    </>
  )

  if (href === null) {
    return <span className={cn('brand', className)}>{content}</span>
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onClick={onClick}
      className={cn('brand', className)}
    >
      {content}
    </Link>
  )
}
