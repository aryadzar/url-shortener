"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  createLinkSchemeForm,
  updateLinkSchemeForm,
} from "@/validations/auth-validation";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function getLinks({
  page,
  pageSize,
  q,
}: {
  page: number;
  pageSize: number;
  q: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      links: [],
      total: 0,
    };
  }

  const offset = (page - 1) * pageSize;

  const where = {
    userId: session.user.id,
    OR: [
      {
        key: {
          contains: q,
        },
      },
      {
        url: {
          contains: q,
        },
      },
    ],
  };

  const [links, total] = await db.$transaction([
    db.link.findMany({
      where,
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
      skip: offset,
      take: pageSize,
    }),
    db.link.count({
      where,
    }),
  ]);

  return {
    links,
    total,
  };
}

// ... other code

export async function getLinkAndLogClick(key: string) {
  const headersList = await headers();

  // ===== USER AGENT =====
  const userAgent = headersList.get("user-agent") ?? "";
  const parser = new UAParser(userAgent);

  const browser = parser.getBrowser().name ?? "Unknown";
  const os = parser.getOS().name ?? "Unknown";
  const device = parser.getDevice().type ?? "desktop";

  // ===== IP ADDRESS =====
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "127.0.0.1";

  // ===== GEOLOCATION (Vercel) =====
  const country = headersList.get("x-vercel-ip-country") ?? "local";
  const city = headersList.get("x-vercel-ip-city") ?? "local";

  // ===== GET LINK =====
  const link = await db.link.findUnique({
    where: { key },
  });

  if (!link) return null;

  // ===== LOG CLICK (NON-BLOCKING) =====
  db.clickEvent
    .create({
      data: {
        linkId: link.id,
        ip,
        country,
        city,
        browser,
        os,
        device,
      },
    })
    .catch(console.error); // jangan block redirect

  return link;
}

export async function createLink(values: z.infer<typeof createLinkSchemeForm>) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields = createLinkSchemeForm.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { url, title, description, key } = validatedFields.data;

  let finalKey = key;

  if (key) {
    const existingLink = await db.link.findUnique({
      where: { key },
    });
    if (existingLink) {
      return {
        error: "Key already in use. Please choose another.",
      };
    }
  } else {
    finalKey = nanoid(7);
  }

  try {
    await db.link.create({
      data: {
        url,
        title,
        description,
        key: finalKey!,
        userId: session.user.id,
        workspaceId: "", // TODO: Add workspace id
      },
    });

    revalidatePath("/dashboard");

    return {
      success: "Link created successfully",
    };
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function deleteLink(linkId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const link = await db.link.findUnique({
      where: {
        id: linkId,
      },
    });

    if (!link) {
      return {
        error: "Link not found",
      };
    }

    if (link.userId !== session.user.id) {
      return {
        error: "Forbidden",
      };
    }

    await db.link.delete({
      where: {
        id: linkId,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: "Link deleted successfully",
    };
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function getLinkDetails(key: string) {
  const link = await db.link.findUnique({
    where: { key },
    include: {
      user: true,
      clicks: true,
    },
  });

  return link;
}

export async function updateLink(values: z.infer<typeof updateLinkSchemeForm>) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    };
  }

  const validatedFields = updateLinkSchemeForm.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { id, ...data } = validatedFields.data;

  try {
    const link = await db.link.findUnique({
      where: {
        id,
      },
    });

    if (!link) {
      return {
        error: "Link not found",
      };
    }

    if (link.userId !== session.user.id) {
      return {
        error: "Forbidden",
      };
    }

    await db.link.update({
      where: {
        id,
      },
      data,
    });

    revalidatePath("/dashboard");
    revalidatePath(`/${link.key}/detail`);

    return {
      success: "Link updated successfully",
    };
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
