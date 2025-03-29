"use server";
import { validateRequest } from "@/lib/session";
import { UpSubstationValues } from "@/lib/validation";

export default async function updateSubstation(
  credentials: UpSubstationValues,
): Promise<{ success?: boolean; id?: string; error?: string }> {
  try {
    const formData = new FormData();

    formData.append("name", credentials.name);
    formData.append(
      "latitude",
      String(Number(credentials.latitude).toFixed(6)),
    );
    formData.append(
      "longitude",
      String(Number(credentials.longitude).toFixed(6)),
    );
    formData.append("regionId", String(credentials.regionId));
    formData.append("districtId", String(credentials.districtId));

    if (credentials.image) {
      formData.append("image", credentials.image);
    }
    if (credentials.image) {
      formData.append("image", credentials.image);
    }

    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation/${credentials.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token.session}`,
        },
        body: formData,
      },
    );
    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      return {
        error: data.message || "Update substation failed. Please try again.",
      };
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error("Server error:", error);

    return {
      error:
        error?.response?.data?.message ||
        (error?.response?.status === 400
          ? "Invalid operation."
          : "Substation update operation failed. Please try again."),
    };
  }
}
