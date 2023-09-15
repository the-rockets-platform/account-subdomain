"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/ui/new-york/button"
import { Input } from "@/ui/new-york/input"
import { Label } from "@/ui/new-york/label"
import { Alert, AlertDescription, AlertTitle } from "@/ui/new-york/alert"
import { ExclamationTriangleIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { signIn } from "next-auth/react"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserLoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [verifyEmail, setVerifyEmail] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string|null>(null)
  
  const [email, setEmail] = React.useState<string>("")

  async function onSubmitEmail() {
    setIsLoading(true)
    setError(null);
    setVerifyEmail(false);

    if (!email){
      setIsLoading(false);
      setError("Digite seu email");
      return;
    }
    
    const response = await signIn("email", {redirect: false, callbackUrl: "/", "email": email});

    setError(response?.error || null);
    setVerifyEmail(!response?.error);
    setIsLoading(false);
  }
  async function onGoogleSignUp() {
    setIsLoading(true);
    setError(null);
    setVerifyEmail(false);

    await signIn("google", {redirect: false, callbackUrl: "/"});

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
          />
        </div>
        <Button disabled={isLoading} onClick={onSubmitEmail}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Confirmar Email
        </Button>
        {
          error ? (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>
                { error == "EmailSignin" ? (
                  "Ocorreu um erro ao enviar o email de login. Tente novamente mais tarde."
                ) : (
                  error
                ) }
              </AlertDescription>
            </Alert>
          ) : null
        }
        {
          verifyEmail ? (
            <Alert>
              <EnvelopeClosedIcon className="h-4 w-4" />
              <AlertTitle>Verifique seu email</AlertTitle>
              <AlertDescription>
                Um email com o link para fazer login deve chegar em instantes
              </AlertDescription>
            </Alert>
          ) : null
        }
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continue com
          </span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={onGoogleSignUp}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}
