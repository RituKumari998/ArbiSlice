import { NextRequest } from "next/server";
import { ethers } from "ethers";
import { canUserMint, incrementDailyMintCount, saveUserMint, getUserDailyMintCount } from "@/lib/database";
import { successResponse, validationErrorResponse, serverErrorResponse, validateRequiredFields } from "@/lib/api-helpers";

const PRIVATE_KEY = process.env.SERVER_PRIVATE_KEY;
const CHAINCRUSH_NFT_ADDRESS = process.env.CHAINCRUSH_NFT_ADDRESS || "0x0000000000000000000000000000000000000000";
const DAILY_MINT_LIMIT = parseInt(process.env.DAILY_MINT_LIMIT || "6");

if (!PRIVATE_KEY) {
  throw new Error("SERVER_PRIVATE_KEY is not set");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, score } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['userAddress', 'score']);
    if (!validation.isValid) {
      return validationErrorResponse(
        `Missing required fields: ${validation.missingFields.join(', ')}`,
        { missingFields: validation.missingFields }
      );
    }

    // Validate userAddress format (basic Ethereum address validation)
    if (!ethers.isAddress(userAddress)) {
      return validationErrorResponse('Invalid userAddress format');
    }

    // Validate score
    if (typeof score !== 'number' || score < 0) {
      return validationErrorResponse('Score must be a non-negative number');
    }

    // Check daily mint limit
    const canMint = await canUserMint(userAddress, DAILY_MINT_LIMIT);
    if (!canMint) {
      const currentCount = await getUserDailyMintCount(userAddress);
      return validationErrorResponse(
        `Daily mint limit reached. You have minted ${currentCount}/${DAILY_MINT_LIMIT} today.`,
        { dailyMintCount: currentCount, dailyMintLimit: DAILY_MINT_LIMIT }
      );
    }

    // Create signature for NFT minting
    const timestamp = Math.floor(Date.now() / 1000);
    const packedData = ethers.solidityPacked(
      ["address", "uint256", "uint256"],
      [userAddress, score, timestamp]
    );

    const messageHash = ethers.keccak256(packedData);

    // Sign the message
    const wallet = new ethers.Wallet(PRIVATE_KEY);
    const signature = await wallet.signMessage(ethers.getBytes(messageHash));

    // Increment daily mint count
    await incrementDailyMintCount(userAddress);

    // Save mint record to database
    await saveUserMint({
      userAddress,
      score,
      timestamp,
      signature
    });

    const dailyMintsRemaining = DAILY_MINT_LIMIT - (await getUserDailyMintCount(userAddress));

    return successResponse({
      signature,
      timestamp,
      score,
      dailyMintsRemaining
    });
  } catch (error) {
    console.error("Error generating NFT mint signature:", error);
    return serverErrorResponse(
      "Failed to generate signature",
      error instanceof Error ? { message: error.message } : undefined
    );
  }
} 