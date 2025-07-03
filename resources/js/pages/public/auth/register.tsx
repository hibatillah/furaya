import { useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useState } from "react";

import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DetailsAccount from "./details";

type RegisterForm = {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function PublicRegister({
  children,
  state,
}: {
  children?: React.ReactNode;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}) {
  const [dialogOpen, setDialogOpen] = state ?? useState(false);

  const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    toast.loading("Membuat akun...", {
      id: "create-account",
    });

    post(route("public.register"), {
      onSuccess: () => {
        toast.success("Akun berhasil dibuat", {
          id: "create-account",
          description: "Login berhasil.",
        });
        reset();
        setDialogOpen(false);
      },
      onError: () => {
        toast.error("Akun gagal dibuat", {
          id: "create-account",
          description: "Terjadi kesalahan saat membuat akun.",
        });
      },
    });
  };

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(value) => {
        setDialogOpen(value);
        if (!value) reset();
      }}
    >
      {children}
      <DialogContent
        className="grid md:w-200 md:!max-w-none md:grid-cols-2 md:gap-x-8 md:gap-y-5"
        tabIndex={-1}
        forceMount
        noClose
      >
        <form
          className="flex flex-col gap-6 py-2"
          onSubmit={submit}
        >
          <DialogHeader className="col-span-full">
            <DialogTitle className="text-xl">Register</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                autoFocus
                tabIndex={1}
                autoComplete="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                disabled={processing}
                placeholder="Full name"
              />
              <InputError
                message={errors.name}
                className="mt-2"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                required
                tabIndex={2}
                autoComplete="tel"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                disabled={processing}
                placeholder="Input your phone number"
                inputMode="tel"
              />
              <InputError message={errors.phone} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                tabIndex={2}
                autoComplete="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                disabled={processing}
                placeholder="email@example.com"
              />
              <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                tabIndex={3}
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                disabled={processing}
                placeholder="Password"
                autoComplete="off"
              />
              <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation"
                type="password"
                required
                tabIndex={4}
                value={data.password_confirmation}
                onChange={(e) => setData("password_confirmation", e.target.value)}
                disabled={processing}
                placeholder="Confirm password"
                autoComplete="off"
              />
              <InputError message={errors.password_confirmation} />
            </div>

            <Button
              type="submit"
              className="mt-2 w-full"
              tabIndex={5}
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </div>

          {/* <div className="text-muted-foreground text-center text-sm">
            Already have an account?{" "}
            <TextLink
              href={route("login")}
              tabIndex={6}
            >
              Log in
            </TextLink>
          </div> */}
        </form>

        {/* details */}
        <DetailsAccount />
      </DialogContent>
    </Dialog>
  );
}
