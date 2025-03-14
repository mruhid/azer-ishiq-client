"use server";
import { logout } from "@/app/(auth)/action";
import { validateRequest } from "@/lib/session";
import { substationSchema, SubstationValues } from "@/lib/validation";

export default async function addSubstation(
  credentials: SubstationValues,
): Promise<{ success?: boolean; id?: string; error?: string }> {
  try {
    const formData = new FormData();

    formData.append("name", credentials.name);
    formData.append("regionId", String(credentials.regionId));
    formData.append("districtId", String(credentials.districtId));
    formData.append("latitude", credentials.latitude.toString());
    formData.append("longitude", credentials.longitude.toString());
    formData.append("address", credentials.address);

    if (credentials.image) {
      formData.append("image", credentials.image);
    }

    const token = await validateRequest();
    if (!token.session) {
      return { error: "Unauthorized" };
    }

    console.log("Sending FormData:", formData);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/substation`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.session}`,
        },
        body: formData,
      },
    );

    const data = await response.json();
    console.log("Response Data:", data);

    if (!response.ok) {
      if (
        data.message ==
        "An error occurred while saving the entity changes. See the inner exception for details."
      ) {
        logout();
      }
      return {
        error: data.message || "Add substation failed. Please try again.",
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
          : "Substation add operation failed. Please try again."),
    };
  }
}
