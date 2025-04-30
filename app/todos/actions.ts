"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTodo(fromData: FormData) {
  const supabase = createClient();
  const text = fromData.get("todo") as string | null;

  if (!text) {
    throw new Error("Todo text is required");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not logged");
  }
  const { error } = await supabase.from("todos").insert({
    task: text,
    user_id: user.id,
  });

  if (error) {
    throw new Error("Error creating todo");
  }

  revalidatePath("/todos");
}
