import Button from '@/components/common/atoms/Button'
import Container from '@/components/common/atoms/Container'
import siteConfig from '@/config/site'
import { useTranslation } from 'next-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'

export default function DiscordRow() {
  const { t } = useTranslation()
  return (
    <>
      <Container className="py-48">
        <div className="mx-auto max-w-lg bg-discord px-4 py-5 shadow">
          <div className="flex flex-row items-center justify-center">
            <FontAwesomeIcon
              icon={faDiscord}
              size="lg"
              aria-label="Discord icon"
              className="h-9 w-9 text-white"
            />
            <h3 className="ml-3 text-2xl font-bold leading-6 tracking-tight text-white">
              {t('DiscordRow.title')}
            </h3>
          </div>
          <div className="ml-12 mt-6 sm:mt-3 sm:flex sm:items-end sm:justify-between">
            <div className="mr-4 max-w-xl text-sm text-gray-50 sm:mr-0">
              <p>{t('DiscordRow.body')}</p>
            </div>
            <div className="mr-2 mt-4 text-right sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-end">
              <Button
                color="white"
                href={siteConfig.discordInvitationLink}
                target="_blank"
                rel="noreferrer"
                className=""
              >
                {t('DiscordRow.button')}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}
