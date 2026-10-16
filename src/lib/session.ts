import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserOrDemo() {
  try {
    const session = await auth();
    if (session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (dbUser) return dbUser;
    }
  } catch {
    // Fallback to default seeded enterprise admin user if called outside request context
  }

  const fallback =
    (await prisma.user.findUnique({ where: { id: "user-alex" } })) ??
    (await prisma.user.findFirst());

  return fallback!;
}
