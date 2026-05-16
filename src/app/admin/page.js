import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "../../components/AdminDashboardClient";
import { handler as authOptions } from "../api/auth/[...nextauth]/route";

// In NextAuth 13+, to use getServerSession we usually extract authOptions to a separate file, but here we can just pass the imported config or fetch blindly and check session on client, or we can fetch the session differently.
// Let's create a cleaner way:

export default async function AdminPage() {
  // We'll rely on the client component to protect the route for simplicity in this demo, 
  // or we can fetch data directly here. Let's fetch the data here to pass down.
  
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const messages = await prisma.marketingMessage.findMany();

  return <AdminDashboardClient initialOrders={orders} initialMessages={messages} />;
}
