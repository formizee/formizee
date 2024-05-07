import {Highlight, PrismTheme} from 'prism-react-renderer';

export type LanguageType = 'html' | 'js' | 'jsx' | 'ts' | 'tsx';

interface Props {
  children: string;
  language: LanguageType;
}

const theme: PrismTheme = {
  plain: {
    cursor: '#fbbf24',
    color: '#ffffff'
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#78716c'
      }
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7
      }
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: '#78716c'
      }
    },
    {
      types: ['property', 'function'],
      style: {
        color: '#9a86fd'
      }
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: '#eeebff'
      }
    },
    {
      types: ['attr-name'],
      style: {
        color: '#a3a3a3'
      }
    },
    {
      types: [
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'atrule',
        'placeholder',
        'variable'
      ],
      style: {
        color: '#fbbf24'
      }
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through'
      }
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline'
      }
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic'
      }
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold'
      }
    },
    {
      types: ['important'],
      style: {
        color: '#c4b9fe'
      }
    }
  ]
};

export const CodeBlock = (props: Props) => {
  return (
    <Highlight theme={theme} code={props.children} language={props.language}>
      {({tokens, getLineProps, getTokenProps}) => (
        <pre style={{}} className="flex flex-col md:text-lg">
          {tokens.map((line, i) => (
            <div key={i} style={getLineProps({line}).style} className="my-1">
              <span className="text-sm select-none text-neutral-400 mr-3">
                {i + 1}
              </span>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};

export default CodeBlock;
