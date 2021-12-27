import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';

import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

const _mapProps = (props) => ({
  ...props,
  escapeHtml: false,
  plugins: [
    RemarkMathPlugin
  ],
  renderers: {
    ...props.renderers,
    math: ({ value }) => <BlockMath>{value}</BlockMath>,
    inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>
  }
});

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown; 