'use client';
import Image from 'next/image'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, MARKS } from '@contentful/rich-text-types'
import { shadesOfPurple } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

interface Asset {
  sys: {
    id: string
  }
  url: string
  description: string
}

interface Entry {
  sys: {
    id: string;
  };
  title: string;
  language: string;
  snippet: string;
  __typename: string;
}

interface EntryLink {
  block: Entry[];
}

interface AssetLink {
  block: Asset[]
}

interface Content {
  json: any
  links: {
    assets: AssetLink;
    entries: EntryLink;
  }
}

function RichTextAsset({
  id,
  assets,
}: {
  id: string
  assets: Asset[] | undefined
}) {
  const asset = assets?.find((asset) => asset.sys.id === id)

  if (asset?.url) {
    return <Image src={asset.url} layout="fill" alt={asset.description} />
  }

  return null
}

export function Markdown({ content }: { content: Content }) {
  console.log('content', content);
  const entries = content?.links?.entries?.block;
  return documentToReactComponents(content.json, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => (
        <RichTextAsset
          id={node.data.target.sys.id}
          assets={content.links.assets.block}
        />
      ),

      [BLOCKS.EMBEDDED_ENTRY]: (node, t) => {
        const id = node?.data?.target?.sys?.id || '';
        const entry = entries?.find((entry: any) => entry?.sys?.id === id);
        const contentType = entry?.__typename || '';

        if (!entry) {
          return null;
        }

        switch (contentType.toLowerCase()) {
          // Contentful Snippet entity.
          case 'snippet': {
            let { language, snippet } = entry;
            return (
              <SyntaxHighlighter
                language={language.toLowerCase()}
                style={shadesOfPurple}
                showLineNumbers={snippet.indexOf('\n') > -1}
                wrapLines
                wrapLongLines
              >
                {snippet}
              </SyntaxHighlighter>
            );
          }
        }
      },
    },
    renderMark: {
      [MARKS.CODE]: (text) => <code className='jses-inline-code'>{text}</code>,
    },
  })
}
