import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("admin.login.store"), {
      onFinish: () => reset("password"),
    });
  };

  return (
    <AuthLayout
      title="Masuk ke Admin"
      description="Masukkan email dan password di bawah untuk masuk"
    >
      <Head title="Log in • Admin" />

      <Card>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={submit}
          >
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  tabIndex={1}
                  autoComplete="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                />
                <InputError message={errors.email} />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {canResetPassword && (
                    <TextLink
                      href={route("password.request")}
                      className="ml-auto text-sm"
                      tabIndex={5}
                    >
                      Lupa password?
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
                />
                <InputError message={errors.password} />
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={data.remember}
                  onClick={() => setData("remember", !data.remember)}
                  tabIndex={3}
                />
                <Label htmlFor="remember">Ingat saya</Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                tabIndex={4}
                disabled={processing}
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                Log in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
