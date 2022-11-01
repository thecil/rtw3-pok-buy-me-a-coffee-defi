import Head from "next/head";

type MyComponentProps = React.PropsWithChildren<{
  title: string;
  description: string;
}>;

export default function Layout({
  children,
  title,
  description
}: MyComponentProps) {
  return (
    <div className="">
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <main>{children}</main>
    </div>
  );
}