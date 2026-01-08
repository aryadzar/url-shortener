"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateLinkSchemeForm } from "@/validations/auth-validation";
import { updateLink } from "@/actions/links";
import { useState, useTransition } from "react";
import { Link as PrismaLink } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

type FormEditLinkProps = {
  link: PrismaLink;
  children: React.ReactNode;
};

export function FormEditLink({ link, children }: FormEditLinkProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Parse original URL to separate base URL and UTM params
  const urlObject = new URL(link.url);
  const utmParams = {
    utm_source: urlObject.searchParams.get("utm_source") || "",
    utm_medium: urlObject.searchParams.get("utm_medium") || "",
    utm_campaign: urlObject.searchParams.get("utm_campaign") || "",
    utm_term: urlObject.searchParams.get("utm_term") || "",
    utm_content: urlObject.searchParams.get("utm_content") || "",
  };

  // Remove UTM params from the display URL
  Object.keys(utmParams).forEach((key) => {
    urlObject.searchParams.delete(key);
  });
  const baseUrl = urlObject.toString();

  const form = useForm<z.infer<typeof updateLinkSchemeForm>>({
    resolver: zodResolver(updateLinkSchemeForm),
    defaultValues: {
      id: link.id,
      url: baseUrl,
      title: link.title || "",
      description: link.description || "",
      ...utmParams,
    },
  });

  async function onSubmit(values: z.infer<typeof updateLinkSchemeForm>) {
    startTransition(async () => {
      try {
        const newUrlObject = new URL(values.url!);
        const utmKeys: (keyof typeof values)[] = [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
        ];

        // Clear any existing UTM params from the base URL field
        utmKeys.forEach((key) => {
          newUrlObject.searchParams.delete(key);
        });

        // Add new UTM params from the form
        utmKeys.forEach((param) => {
          if (values[param]) {
            newUrlObject.searchParams.set(param, values[param]!);
          }
        });

        const finalUrl = newUrlObject.toString();
        const result = await updateLink({ ...values, url: finalUrl });

        if (result.success) {
          await queryClient.invalidateQueries({
            queryKey: ["links"],
          });
          setOpen(false);
          toast.success(result.success);
        } else if (result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Invalid URL provided.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the details for your short link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="My Example Website"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A short description"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <fieldset className="border p-4 rounded-md">
              <legend className="text-sm font-medium px-1">
                UTM Builder (Optional)
              </legend>
              <div className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="utm_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTM Source</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., google"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_medium"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTM Medium</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., cpc"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_campaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTM Campaign</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., summer_sale"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_term"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTM Term</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., running+shoes"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="utm_content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTM Content</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., logolink"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
