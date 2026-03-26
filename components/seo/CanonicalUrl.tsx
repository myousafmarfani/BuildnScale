type CanonicalUrlProps = {
  path: string;
};

export function CanonicalUrl({ path }: CanonicalUrlProps) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const href = `https://www.buildnscale.dev${normalizedPath === '/' ? '' : normalizedPath}`;

  return <link rel="canonical" href={href} />;
}
