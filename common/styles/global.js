import { css } from '@emotion/react';

/* prettier-ignore */
export const injectGlobalStyles = () => css`
  @font-face {
    font-family: "Mono";
    src: url("/static/JetBrainsMono-Regular.woff") format("woff");
  }

  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
  }

  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  html, body {
    --color-primary: #0047ff;

    background: #fff;
    color: #000;
    font-family: -apple-system, BlinkMacSystemFont, helvetica neue, helvetica, sans-serif;
    font-size: 14px;
    scrollbar-width: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;

    ::-webkit-scrollbar {
      display: none;
    }
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;
