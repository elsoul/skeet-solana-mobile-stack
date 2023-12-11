import ScrollSyncToc from '@/components/articles/ScrollSyncToc'
import Container from '@/components/common/atoms/Container'
import type { LegalContent } from '@common/types/article'

type Props = {
  article: LegalContent
  articleHtml: string
}

export default function LegalContents({ article, articleHtml }: Props) {
  return (
    <>
      <Container>
        <div className="flex justify-center py-12 lg:gap-12">
          <div>
            <h1 className="text-4xl font-bold">{article.title}</h1>
            <div className="py-8 lg:hidden">
              <ScrollSyncToc rawMarkdownBody={article.content} />
            </div>
            <div className="prose dark:prose-invert lg:prose-lg break-all">
              <div dangerouslySetInnerHTML={{ __html: articleHtml }} />
            </div>
          </div>
          <div className="relative hidden pt-24 lg:block">
            <ScrollSyncToc rawMarkdownBody={article.content} />
          </div>
        </div>
      </Container>
    </>
  )
}
