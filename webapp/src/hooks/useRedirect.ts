import { useEffect } from 'react'
import { useRouter } from 'next/router'
import languageDetector from '@/lib/languageDetector'

export default function useRedirect(to?: string) {
  const router = useRouter()
  to = to || router.asPath

  useEffect(() => {
    void (async () => {
      try {
        const detectedLng = languageDetector.detect() as string
        if (to?.startsWith('/' + detectedLng) && router.route === '/404') {
          await router.replace('/' + detectedLng + router.route)
          return
        }

        languageDetector.cache?.(detectedLng)
        await router.replace('/' + detectedLng + to)
      } catch (e) {
        console.error(e)
      }
    })()
  }, [router, to])
}
