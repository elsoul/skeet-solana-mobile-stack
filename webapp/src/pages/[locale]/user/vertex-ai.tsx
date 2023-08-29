import { ReactElement, Suspense } from 'react'
import UserLayout from '@/layouts/user/UserLayout'
import siteConfig from '@/config/site'
import { getStaticPaths, makeStaticProps } from '@/lib/getStatic'
import VertexChatScreen from '@/components/pages/user/vertex-ai/VertexChatScreen'
import UserScreenLoading from '@/components/loading/UserScreenLoading'

const seo = {
  pathname: '/user/vertex-ai',
  title: {
    ja: 'Vertex AI チャット',
    en: 'Vertex AI Chat',
  },
  description: {
    ja: siteConfig.descriptionJA,
    en: siteConfig.descriptionEN,
  },
  img: null,
}

const getStaticProps = makeStaticProps(['common', 'user', 'vertex-ai'], seo)
export { getStaticPaths, getStaticProps }

export default function VertexAi() {
  return (
    <>
      <div className="content-height">
        <Suspense fallback={<UserScreenLoading />}>
          <VertexChatScreen />
        </Suspense>
      </div>
    </>
  )
}

VertexAi.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>
}
