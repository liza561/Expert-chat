import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to a JSON file to store wallet balances
const filePath = path.resolve("wallets.json");

// Load wallets
function loadWallets(): Record<string, number> {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

// Save wallets
function saveWallets(wallets: Record<string, number>) {
  fs.writeFileSync(filePath, JSON.stringify(wallets, null, 2));
}

// GET: fetch current balance
export async function GET(req: Request) {
  const userId = "default-user"; // Replace with actual userId from auth if using Clerk
  const wallets = loadWallets();
  const balance = wallets[userId] ?? 0;
  return NextResponse.json({ balance });
}

// POST: add money
export async function POST(req: Request) {
  const userId = "default-user"; // Replace with actual userId from auth if using Clerk
  const { amount } = await req.json();
  if (!amount || Number(amount) <= 0) return NextResponse.json({ error: "Invalid amount" });

  const wallets = loadWallets();
  wallets[userId] = (wallets[userId] ?? 0) + Number(amount);
  saveWallets(wallets);

  return NextResponse.json({ balance: wallets[userId] });
}
