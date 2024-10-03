import React, { type SVGProps } from "react";

export default function Close(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="512px"
      enableBackground="new 0 0 512 512;"
      viewBox="0 0 512 512"
      width="512px"
      {...props}
    >
      <path
        d="M437.5,386.6L306.9,256l130.6-130.6c14.1-14.1,14.1-36.8,0-50.9c-14.1-14.1-36.8-14.1-50.9,0L256,205.1L125.4,74.5  c-14.1-14.1-36.8-14.1-50.9,0c-14.1,14.1-14.1,36.8,0,50.9L205.1,256L74.5,386.6c-14.1,14.1-14.1,36.8,0,50.9  c14.1,14.1,36.8,14.1,50.9,0L256,306.9l130.6,130.6c14.1,14.1,36.8,14.1,50.9,0C451.5,423.4,451.5,400.6,437.5,386.6z"
        fill="currentColor"
      />
    </svg>
  );
}