import Link from "next/link";

export const ProjectLinks: React.FC = () => {
  return (
    <>
      <div className="mt-3 flex flex-col">
        <h3>Read more about this project:</h3>
        <ul className="list-disc pl-8">
          <li>
            <Link href="https://docs.alchemy.com/docs/how-to-build-buy-me-a-coffee-defi-dapp#build-the-frontend-buy-me-a-coffee-website-dapp-with-replit-and-ethersjs">
              <a target="_blank" className="text-blue-400 text-sm">
                How to Build "Buy Me a Coffee" DeFi dapp
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://goerli.etherscan.io/address/0x28cd3D2d2f00f4EE0ea2450756e6b6102a598F3c#code">
              <a target="_blank" className="text-blue-400 text-sm">
                Goerli Verified Contract
              </a>
            </Link>
          </li>
          <li>
            <Link href="https://github.com/thecil/rtw3-pok-buy-me-a-coffee-defi">
              <a target="_blank" className="text-blue-400 text-sm">
                GitHub Repo
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};
