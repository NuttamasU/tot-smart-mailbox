const supabase = require("../config/supabase");

// Create or update LINE user
async function upsertLineUser(userData) {
  const { lineUserId, displayName } = userData;

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        line_user_id: lineUserId,
        display_name: displayName,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "line_user_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to upsert LINE user:", error.message);
    throw error;
  }

  return data;
}

// Deactivate LINE user
async function deactivateLineUser(lineUserId) {
  const { error } = await supabase
    .from("users")
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("line_user_id", lineUserId);

  if (error) {
    console.error("Failed to deactivate LINE user:", error.message);
    throw error;
  }
}

module.exports = {
  upsertLineUser,
  deactivateLineUser,
};