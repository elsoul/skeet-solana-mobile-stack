import Container from '@/components/common/atoms/Container'
import ScrollSyncToc from '@/components/articles/ScrollSyncToc'
import Image from 'next/image'
import type { NewsContent } from '@common/types/article'

type Props = {
  article: NewsContent
  articleHtml: string
}

export default function NewsContents({ article, articleHtml }: Props) {
  return (
    <>
      <Container>
        <div className="flex justify-center py-12 lg:grid lg:grid-cols-8 lg:gap-12">
          <div className="lg:col-span-5">
            <h1 className="text-4xl font-extrabold tracking-tighter">
              {article.title}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-200">
              {article.date}
            </p>
            <div className="prose dark:prose-invert lg:prose-lg break-all">
              <div className="py-8">
                <Image
                  src={article.thumbnail}
                  alt={article.title}
                  width="16"
                  height="9"
                  className="aspect-video w-full bg-gray-100 object-cover group-hover:opacity-80"
                  unoptimized
                />
              </div>
              <div className="py-8 lg:hidden">
                <ScrollSyncToc rawMarkdownBody={article.content} />
              </div>
              <div
                className="prose dark:prose-invert lg:prose-lg break-all"
                dangerouslySetInnerHTML={{ __html: articleHtml }}
              />
            </div>
          </div>
          <div className="relative hidden pt-24 lg:col-span-3 lg:block">
            <ScrollSyncToc rawMarkdownBody={article.content} />
          </div>
        </div>
      </Container>
    </>
  )
}
