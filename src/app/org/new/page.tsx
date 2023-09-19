'use client'

import { APIResponse } from "@/constants/api/responses"
import { Button } from "@/ui/new-york/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/new-york/card"
import { Input } from "@/ui/new-york/input"
import { Label } from "@/ui/new-york/label"
import { Toaster } from "@/ui/new-york/toaster"
import { toast } from "@/ui/new-york/use-toast"
import { useSession } from "next-auth/react"
import { useState } from "react"
import {
    ORG_OWNER_EXCEEDS as err_code_org_owner_exceeds,
    ORG_NAME_EXISTS as err_code_org_name_exists,
} from "@/constants/api/errors";
import { Alert, AlertDescription, AlertTitle } from "@/ui/new-york/alert"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"
import { useRouter } from "next/navigation"

export default function NewOrg() {
    const router = useRouter();
    const { update } = useSession();
    const [ name, setName ] = useState<string>("");
    const [ nameAlreadyExists, setNameAlreadyExists ] = useState<-1 | 0 | 1>(-1);
    const [ creating, setCreating ] = useState<boolean>(false);

    const onSubmit = async() => {
        setCreating(true);
        
        try {
            const res = await fetch("/api/orgs/", {
                method: "POST",
                body: JSON.stringify({
                    "name": name
                  }),
                  headers: {
                    "Content-Type": "application/json"
                  }
            })
            const json: APIResponse<{id: string}> = await res.json();

            if (json.error_code) {
                if (json.error_code === err_code_org_owner_exceeds){
                    toast({
                        title: "Ocorreu um erro!",
                        description: (
                            <Alert>
                                <AlertTitle>Detalhes do problema</AlertTitle>
                                <AlertDescription>
                                    Você já é proprietário de 1 organização. Você não pode ter mais do que isso.
                                </AlertDescription>
                            </Alert>
                        ),
                        variant: "destructive"
                    });
                } else if (json.error_code === err_code_org_name_exists){
                    toast({
                        title: "Ocorreu um erro!",
                        description: (
                            <Alert>
                                <AlertTitle>Detalhes do problema</AlertTitle>
                                <AlertDescription>
                                    Uma organização com esse nome já existe
                                </AlertDescription>
                            </Alert>
                        ),
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Ocorreu um erro!",
                        variant: "destructive"
                    });
                }

                throw new Error(`ERROR CODE: ${json.error_code}`, {cause: json.message})
            }

            await update({'org': json.id});

            toast({
                title: "Criado com sucesso!",
            });
        } catch (error) {
            console.error(error);
        }
        
        setCreating(false);
        router.replace("/?newUser=Y");
    }

    return (
        <main className="flex h-screen flex-col items-center justify-center">
            <Toaster />
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Crie uma organização</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="pb-8">
                        <Label htmlFor="org_name" className={nameAlreadyExists === 1 ? "text-destructive" : ""}>Nome da organização</Label>
                        <Input
                            className="mt-2"
                            id="org_name"
                            type="text"
                            value={name}
                            autoComplete="off"
                            autoFocus
                            disabled={creating}
                            onChange={(e) => {
                                e.preventDefault();
                                setName(e.target.value);

                                if (e.target.value.length > 2) {
                                    fetch(`/api/orgs/name-available?name=${e.target.value}`)
                                    .then(async(res) => {
                                        const body: APIResponse<string> = await res.text();

                                        if (body === "1") {
                                            setNameAlreadyExists(0);
                                        } else if (body === "0") {
                                            setNameAlreadyExists(1);
                                        }
                                    })
                                }
                            }}
                        />
                        {
                            name.length > 2 && nameAlreadyExists != -1 ? (
                                <CardDescription className={`text-[0.8rem] mt-2 font-medium ${nameAlreadyExists == 1 ? "text-destructive" : "text-green-400"}`}>
                                    {
                                        nameAlreadyExists ? (
                                            "Nome já existe"
                                        ) : (
                                            "Nome disponível"
                                        )
                                    }
                                </CardDescription>
                            ) : (
                                <CardDescription className="mt-2">
                                    e.g: Sua empresa
                                </CardDescription>
                            )
                        }
                    </div>
                    <Button className="w-full" disabled={nameAlreadyExists != 0 || creating} onClick={onSubmit}>Continuar</Button>
                </CardContent>
            </Card>
        </main>
    );
}
