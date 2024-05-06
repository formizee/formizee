import {Highlight} from 'prism-react-renderer';

export type LanguageType = 'html' | 'js' | 'jsx' | 'ts' | 'tsx';

interface Props {
  children: string;
  language: LanguageType;
}

export const CodeBlock = (props: Props) => {
  return (
    <Highlight code={props.children} language={props.language}>
      {({tokens, getLineProps, getTokenProps}) => (
        <pre style={{}} className="text-lg">
          {tokens.map((line, i) => (
            <div key={i} style={getLineProps({line}).style} className="my-1">
              <span className="text-sm text-neutral-400 mr-3">{i + 1}</span>
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
