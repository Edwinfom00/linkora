import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getAllUsers } from "@/modules/admin/server/actions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Utilisateurs — Admin",
};

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    redirect("/");
  }

  const usersList = await getAllUsers();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Utilisateurs ({usersList.length})
      </h2>

      <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Inscrit le</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersList.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === "admin"
                        ? "destructive"
                        : u.role === "entreprise"
                          ? "default"
                          : "secondary"
                    }
                    className="rounded-lg"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
