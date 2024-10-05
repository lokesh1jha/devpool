import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Protected Page</h1>
      <div>
        Nothing is here
      </div>
    </div>
  );
}
