import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectBtn: React.FC = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        openAccountModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div>
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-slate-300 rounded px-2 hover:bg-slate-400"
                    >
                      Connect Wallet
                    </button>
                  </div>
                );
              }

              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button" className="">
                    Swith To Supported Network
                  </button>
                );
              }

              return (
                <div className="bg-slate-300 rounded px-2 hover:bg-slate-400">
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
