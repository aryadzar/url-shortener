import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function DashboardLayout() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex flex-col space-y-3">
      {session.user?.image && (
        <Image
          src={session.user.image}
          alt="Profile"
          width={100}
          height={100}
        />
      )}
      {JSON.stringify(session)}
      <Button
        variant="destructive"
        onClick={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
      >
        SignOut
      </Button>
    </div>
  );
}
