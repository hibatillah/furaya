import { router, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler, useState } from "react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import DetailsAccount from "./details";

type LoginForm = {
  phone?: string;
  email?: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
  children?: React.ReactNode;
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export default function PublicLogin({ status, canResetPassword = true, children, state }: LoginProps) {
  const [dialogOpen, setDialogOpen] = state ?? useState(false);

  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    toast.loading("Membuat akun...", {
      id: "login",
    });

    post(route("public.login"), {
      onFinish: () => reset("password"),
      onSuccess: (page: any) => {
        const username = page.props.auth.user.name;

        toast.success("Berhasil login", {
          id: "login",
          description: `Login sebagai ${username}`,
        });
        reset();
        setDialogOpen(false);
        router.reload();
      },
      onError: () => {
        toast.error("Gagal login", {
          id: "login",
          description: "Terjadi kesalahan saat login.",
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
        noClose
      >
        <form
          className="flex flex-col gap-6 py-2"
          onSubmit={submit}
        >
          <DialogHeader className="col-span-full">
            <DialogTitle className="text-xl">Log in</DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            <Tabs
              defaultValue="email"
              className="w-full"
            >
              <TabsList className="mb-5 w-full *:w-full">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>
              <TabsContent value="email">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                  <InputError message={errors.email} />
                </div>
              </TabsContent>
              <TabsContent value="phone">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    autoFocus
                    tabIndex={1}
                    autoComplete="phone"
                    value={data.phone}
                    onChange={(e) => setData("phone", e.target.value)}
                    placeholder="Input your phone number"
                  />
                  <InputError message={errors.phone} />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                {canResetPassword && (
                  <TextLink
                    href={route("password.request")}
                    className="ml-auto text-sm"
                    tabIndex={5}
                  >
                    Forgot password?
                  </TextLink>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                tabIndex={2}
                autoComplete="current-password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
                placeholder="Password"
              />
              <InputError message={errors.password} />
            </div>

            <Label
              htmlFor="remember"
              className="flex w-fit items-center space-x-3"
            >
              <Checkbox
                id="remember"
                name="remember"
                checked={data.remember}
                onClick={() => setData("remember", !data.remember)}
                tabIndex={3}
              />
              Remember me
            </Label>

            <Button
              type="submit"
              className="mt-4 w-full"
              tabIndex={4}
              disabled={processing}
            >
              {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </div>
        </form>

        {/* details */}
        <DetailsAccount />
      </DialogContent>
    </Dialog>
  );
}
