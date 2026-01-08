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
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLinkSchemeForm } from "@/validations/auth-validation";
import { createLink } from "@/actions/links";
import { useState, useTransition } from "react";
import { nanoid } from "nanoid";
import { useQueryClient } from "@tanstack/react-query";

export function FormCreateLink() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof createLinkSchemeForm>>({
    resolver: zodResolver(createLinkSchemeForm),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      key: "",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      utm_term: "",
      utm_content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createLinkSchemeForm>) {
    startTransition(async () => {
      try {
        const urlObject = new URL(values.url);
        const utmParams: (keyof typeof values)[] = [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "utm_content",
        ];

        utmParams.forEach((param) => {
          if (values[param]) {
            urlObject.searchParams.set(param, values[param]!);
          }
        });

        const finalUrl = urlObject.toString();
        const result = await createLink({ ...values, url: finalUrl });

        if (result.success) {
          toast.success(result.success);
          setOpen(false);
          await queryClient.invalidateQueries({ queryKey: ["links"] });
          form.reset();
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
      <DialogTrigger asChild>
        <Button>Create Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>
            Enter the details for your new short link.
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
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Key (Optional)</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="my-custom-link"
                        {...field}
                        disabled={isPending}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.setValue("key", nanoid(7))}
                        disabled={isPending}
                      >
                        Generate
                      </Button>
                    </div>
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
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
