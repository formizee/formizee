import {Highlight, Prism} from 'prism-react-renderer';
import {getTheme} from './themes';
import {cn} from '@formizee/ui';

(typeof global !== 'undefined' ? global : window).Prism = Prism;
require('prismjs/components/prism-bash');

interface CodeBlockProps {
  color: string;
  children: string;
  language: string;
  className?: string;
  theme?: 'light' | 'dark';
}

export function CodeBlock(props: CodeBlockProps): JSX.Element {
  const theme = getTheme(props.color, props.theme);

  return (
    <div
      className={cn(
        props.className,
        'animate-in fade-in slide-in-from-bottom-4 ease-in-out duration-1000'
      )}
    >
      <Highlight
        prism={Prism}
        code={props.children}
        language={props.language}
        theme={theme}
      >
        {({tokens, getLineProps, getTokenProps}) => (
          <pre className="flex flex-col" style={{}}>
            {tokens.map((line, i) => (
              <div
                className="my-[1px] text-sm"
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={i}
                style={getLineProps({line}).style}
              >
                <span className="mr-3 select-none text-sm text-neutral-400">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <span key={key} {...getTokenProps({token})} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default CodeBlock;
