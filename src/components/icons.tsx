import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={32}
      height={32}
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={20}
        d="M168 128h48m-48-48h48m-96 0h48m-48 48h48M40 40v176"
      />
      <path
        d="M40 128c0-48.4 39.6-88 88-88s88 39.6 88 88-39.6 88-88 88"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={20}
      />
    </svg>
  );
}
