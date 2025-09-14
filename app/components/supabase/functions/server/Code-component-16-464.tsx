import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-69821625/health", (c) => {
  return c.json({ status: "ok" });
});

// Check management endpoints
app.get("/make-server-69821625/checks", async (c) => {
  try {
    const checks = await kv.getByPrefix("check:");
    return c.json({ checks: checks || [] });
  } catch (error) {
    console.log("Error fetching checks:", error);
    return c.json({ error: "Failed to fetch checks" }, 500);
  }
});

app.post("/make-server-69821625/checks", async (c) => {
  try {
    const checkData = await c.req.json();
    const checkId = `check:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const check = {
      id: checkId,
      checkNo: checkData.checkNo || await getNextCheckNumber(),
      date: checkData.date,
      payee: checkData.payee,
      amount: checkData.amount,
      amountWords: checkData.amountWords,
      memo: checkData.memo || "",
      bankAccount: checkData.bankAccount,
      status: "created",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(checkId, check);
    
    return c.json({ success: true, check });
  } catch (error) {
    console.log("Error creating check:", error);
    return c.json({ error: "Failed to create check" }, 500);
  }
});

app.put("/make-server-69821625/checks/:id", async (c) => {
  try {
    const checkId = c.req.param("id");
    const updateData = await c.req.json();
    
    const existingCheck = await kv.get(checkId);
    if (!existingCheck) {
      return c.json({ error: "Check not found" }, 404);
    }
    
    const updatedCheck = {
      ...existingCheck,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(checkId, updatedCheck);
    
    return c.json({ success: true, check: updatedCheck });
  } catch (error) {
    console.log("Error updating check:", error);
    return c.json({ error: "Failed to update check" }, 500);
  }
});

app.delete("/make-server-69821625/checks/:id", async (c) => {
  try {
    const checkId = c.req.param("id");
    await kv.del(checkId);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting check:", error);
    return c.json({ error: "Failed to delete check" }, 500);
  }
});

// Bank accounts endpoints
app.get("/make-server-69821625/bank-accounts", async (c) => {
  try {
    const accounts = await kv.getByPrefix("bank_account:");
    return c.json({ accounts: accounts || [] });
  } catch (error) {
    console.log("Error fetching bank accounts:", error);
    return c.json({ error: "Failed to fetch bank accounts" }, 500);
  }
});

app.post("/make-server-69821625/bank-accounts", async (c) => {
  try {
    const accountData = await c.req.json();
    const accountId = `bank_account:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const account = {
      id: accountId,
      name: accountData.name,
      routingNumber: accountData.routingNumber,
      accountNumber: accountData.accountNumber,
      address: accountData.address || "",
      startingCheckNo: accountData.startingCheckNo || 1001,
      nextCheckNo: accountData.startingCheckNo || 1001,
      createdAt: new Date().toISOString()
    };
    
    await kv.set(accountId, account);
    
    return c.json({ success: true, account });
  } catch (error) {
    console.log("Error creating bank account:", error);
    return c.json({ error: "Failed to create bank account" }, 500);
  }
});

// Vendors endpoints  
app.get("/make-server-69821625/vendors", async (c) => {
  try {
    const vendors = await kv.getByPrefix("vendor:");
    return c.json({ vendors: vendors || [] });
  } catch (error) {
    console.log("Error fetching vendors:", error);
    return c.json({ error: "Failed to fetch vendors" }, 500);
  }
});

app.post("/make-server-69821625/vendors", async (c) => {
  try {
    const vendorData = await c.req.json();
    const vendorId = `vendor:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    
    const vendor = {
      id: vendorId,
      name: vendorData.name,
      address: vendorData.address || "",
      email: vendorData.email || "",
      defaultMemo: vendorData.defaultMemo || "",
      createdAt: new Date().toISOString()
    };
    
    await kv.set(vendorId, vendor);
    
    return c.json({ success: true, vendor });
  } catch (error) {
    console.log("Error creating vendor:", error);
    return c.json({ error: "Failed to create vendor" }, 500);
  }
});

// Helper function to get next check number
async function getNextCheckNumber(): Promise<number> {
  try {
    const accounts = await kv.getByPrefix("bank_account:");
    if (!accounts || accounts.length === 0) {
      return 1001; // Default starting number
    }
    
    // Get the first account and increment its check number
    const account = accounts[0];
    const nextNo = account.nextCheckNo || 1001;
    
    // Update the account with the next check number
    await kv.set(account.id, {
      ...account,
      nextCheckNo: nextNo + 1
    });
    
    return nextNo;
  } catch (error) {
    console.log("Error getting next check number:", error);
    return 1001;
  }
}

Deno.serve(app.fetch);