
import liff from "@line/liff";

export async function initializeLiff() {
  const liffId = process.env.NEXT_PUBLIC_LIFF_ID;

  if (!liffId) {
    console.warn("LIFF ID is not configured");
    return null;
  }

  try {
    await liff.init({ liffId });

    if (!liff.isLoggedIn()) {
      liff.login();
      return null;
    }

    const profile = await liff.getProfile();

    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    };
  } catch (error) {
    console.error("LIFF initialization failed:", error);
    return null;
  }
}
