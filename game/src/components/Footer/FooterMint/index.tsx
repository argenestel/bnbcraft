import React, { useState, useEffect } from "react";
import { Node } from "reactflow";
import { useToast } from "@/components/ui/use-toast";
import LoadingIndicator from "components/LoadingIndicator";
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { ConnectWallet } from "components/Button/ConnectWallet";
import { addresses } from "constants/addresses";
import ZeekCraft from "../../../../public/ZeekCraft.sol/ZeekCraft.json";
import { createWalletClient, custom } from "viem";
import { opBNBTestnet } from "wagmi/chains";
interface FooterMintProps {
  node: Node | undefined;
  nodeA: Node | undefined;
  nodeB: Node | undefined;
}
import { getWalletClient } from '@wagmi/core'
import {config }from "../../../config/config"


// "GaslessPaymaster" was successfully deployed:
//  - Contract address: 0x71C8e4F11988A5f0b70Eb93BcCacb94B1D6D758C
//  - Contract source: contracts/GaslessPaymaster.sol:GaslessPaymaster
//  - Encoded constructor arguments: 0x



const FooterMint: React.FC<FooterMintProps> = ({ node, nodeA, nodeB }) => {
  const { address, isConnected } = useAccount();
  const { data: hash, isPending, error, writeContract } = useWriteContract();
  const [recipeCount, setRecipeCount] = useState(0);
  const [minted, setMinted] = useState(false);
  const { toast } = useToast();


  // const walletClient = getWalletClient(config)


  // Read the total number of recipes
  const { data: totalRecipes } = useReadContract({
    address: addresses.ZeekCraft as `0x${string}`,
    abi: ZeekCraft.abi,
    functionName: "nextRecipeId",
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (totalRecipes) {
      setRecipeCount(Number(totalRecipes) - 1); // Subtract 1 as nextRecipeId is always one ahead
    }
  }, [totalRecipes]);

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Recipe created successfully",
        description: `Transaction hash: ${hash}`,
      });
      setMinted(true);
    }
  }, [isConfirmed, hash, toast]);

  const createRecipe = async () => {
    if (!node || !nodeA || !nodeB) return;

    // writeContract({
    //   address: addresses.ZeekCraft as `0x${string}`,
    //   abi: ZeekCraft.abi,
    //   functionName: "createRecipe",
    //   args: [
    //     BigInt(nodeA.data.craft_id),
    //     BigInt(nodeB.data.craft_id),
    //     node.data.label,
    //     node.data.emoji,
    //   ],
    // });

    await writeContract( {
      address: addresses.ZeekCraft as `0x${string}`,
      abi: ZeekCraft.abi,
      functionName: "createRecipe",
      args: [
        BigInt(nodeA.data.craft_id),
        BigInt(nodeB.data.craft_id),
        node.data.label,
        node.data.emoji,
      ],
    });
  };

  if (!node) return null;

  return (
    <div className="left-12 inset-x-0 bottom-0 bg-white p-4 flex items-center justify-center z-10 mx-auto">
      <p className="mx-2 font-bold">{`${recipeCount} recipes created`}</p>
      <div className="mx-2 items-center border border-gray-100 bg-gray-100 rounded-md">
        {node.data.label && (
          <div className="p-2">
            <span className="font-bold">{`${node.data.emoji}${node.data.label}`}</span>
          </div>
        )}
      </div>
      <p className="mx-2">{" -> "}</p>
      {isConnected ? (
        <button
          disabled={minted || isPending || isConfirming}
          className={`${
            !minted
              ? "bg-blue hover:bg-primary"
              : "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
          } mx-2 text-white font-bold py-2 px-4 rounded m-1`}
          onClick={createRecipe}
        >
          {isPending || isConfirming ? (
            <LoadingIndicator />
          ) : minted ? (
            "Recipe Created"
          ) : (
            "Create Recipe"
          )}
        </button>
      ) : (
        <ConnectWallet buttonText="Connect to create recipe" />
      )}
    </div>
  );
};

export default FooterMint;