import * as React from "react";

import { css } from "@emotion/react";

const STYLES_SPINNER = css`
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 2px solid #000;
  border-radius: 50%;
  border-top-color: #fff;
  animation: animation-spin 1s ease-in-out infinite;

  @keyframes animation-spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
`;

const LoaderSpinner = (props) => <div css={STYLES_SPINNER} {...props} />;
export default LoaderSpinner;
