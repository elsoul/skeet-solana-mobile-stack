import Image from 'next/image'
import logoHorizontal from '@/assets/img/logo/projects/SolanaLogoHorizontal.svg'
import logoHorizontalInvert from '@/assets/img/logo/projects/SolanaLogoWhite.svg'
import clsx from 'clsx'

type Props = {
  className?: string
  onClick?: () => void
}

export default function SolanaLogoHorizontal({ className, ...rest }: Props) {
  return (
    <>
      <div {...rest}>
        <span className="sr-only">Solana</span>
        <Image
          src={logoHorizontal}
          alt="Solana"
          className={clsx('dark:hidden ', className)}
          unoptimized
        />
        <Image
          src={logoHorizontalInvert}
          alt="Solana"
          className={clsx('hidden dark:block', className)}
          unoptimized
        />
      </div>
    </>
  )
}
