import { Prisma } from "@prisma/client";

const linkWithClicks = Prisma.validator<Prisma.LinkDefaultArgs>()({
  include: { clicks: true },
});

export type TLink = Prisma.LinkGetPayload<typeof linkWithClicks>;

export type AuthFormState = {
  status?: string;
  errors?: {
    description?: string[];
    email?: string[];
    password?: string[];
    name?: string[];
    _form?: string[];
  };
};