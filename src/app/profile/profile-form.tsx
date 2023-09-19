"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/ui/new-york/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/new-york/form"
import { Input } from "@/ui/new-york/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/new-york/select"
import { Separator } from "@/ui/new-york/separator"
import {
  cep as normalize_CEP,
  cpf_cnpj as normalize_cpf_cnpj,
  phoneNumber as normalizePhoneNumber,
  url as normalizeURL
} from "@/lib/normalizers"
import { useEffect, useState } from "react"
import { APIResponse, Profile } from "@/constants/api/responses"
import { captureException } from "@sentry/nextjs";
import { toast } from "@/ui/new-york/use-toast"
import { Toaster } from "@/ui/new-york/toaster"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/ui/default/alert";
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  name: z
    .string({
      required_error: "Informação necessária",
    })
    .min(2, {
      message: "Muito curto.",
    })
    .max(30, {
      message: "Muito longo.",
    }),
  lastName: z
    .string({
      required_error: "Informação necessária",
    })
    .min(2, {
      message: "Muito curto.",
    })
    .max(30, {
      message: "Muito longo.",
    }),
  phone: z
    .string({
      required_error: "Informação necessária",
    }),
  site: z
    .string()
    .optional(),
  cpf_cnpj: z.string({ required_error: "Informação necessária" }).min(8),
  personType: z.string({ required_error: "Informação necessária" }).min(1),
  razaoSocial: z.string().optional(),
  address_cep: z.string().optional(),
  address_road: z.string().optional(),
  address_number: z.string().optional(),

})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  name: "",
  lastName: "",
  phone: "",
  site: "",
  cpf_cnpj: "",
  personType: "f",
  razaoSocial: "",
  address_cep: "",
  address_road: "",
  address_number: "",
}


export function ProfileForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<"loading" | "error" | "success" | "submit-success" | "submit-fail">("loading");
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/profile/");
        const json: APIResponse<Profile> = await res.json();

        if (json.error_code) {
          throw new Error(`ERROR CODE: ${json.error_code}`, {cause: json.message})
        }

        form.setValue("address_cep", normalize_CEP(json.address_cep || ""));
        form.setValue("address_number", json.address_number || "");
        form.setValue("address_road", json.address_road || "");
        form.setValue("cpf_cnpj", normalize_cpf_cnpj(json.cpf_cnpj || ""));
        form.setValue("lastName", json.last_name || "");
        form.setValue("name", json.name || "");
        form.setValue("personType", json.person_type || "");
        form.setValue("phone", normalizePhoneNumber(json.phone || "") || "");
        form.setValue("razaoSocial", json.razao_social || "");
        form.setValue("site", json.site || "");

        setFormState("success");
      } catch (error) {
        console.error(error);
        captureException(error);
        
        setFormState("error");
      }
    })();
  }, []);

  async function onSubmit(data: ProfileFormValues) {
    setFormState("loading");

    fetch("/api/user/profile/", {
      method: "POST", 
      body: JSON.stringify({
        "address_cep": data.address_cep,
        "address_number": data.address_number,
        "address_road": data.address_road,
        "cpf_cnpj": data.cpf_cnpj,
        "last_name": data.lastName,
        "name": data.name,
        "person_type": data.personType,
        "phone": data.phone,
        "razao_social": data.razaoSocial,
        "site": data.site,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(async(res) => {
      const json: APIResponse<{id: string}> = await res.json();

      if (json.error_code) {
        throw new Error(`ERROR CODE: ${json.error_code}`, {cause: json.message})
      }
      setFormState("submit-success");
      
      toast({
        title: "Atualizado com sucesso!",
      });

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("completeProfile") === "Y") {
        router.push("/orgs/new")
      }
    })
    .catch(res => {
      console.error(res);
      toast({
        title: "Ocorreu um erro!",
        variant: "destructive"
      });
      setFormState("submit-fail");
    })

  }

  if (formState === "error") {
    return <ProfileFormError />
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Toaster />
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState === "loading"}/>
                </FormControl>
                {/* <FormDescription>
                  This is your public display name. It can be your real name or a
                  pseudonym. You can only change this once every 30 days.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Sobrenome</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState === "loading"}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="(**) *****-****"
                  autoComplete="tel"
                  onChange={(e) => {
                    if (e.target.value.replace(/\D/g, '').length <= 11) {
                      form.setValue("phone", normalizePhoneNumber(e.target.value))
                    }
                  }}
                  disabled={formState === "loading"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="site"
          render={({ field }) => (
            <FormItem >
              <FormLabel>Site pessoal</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="https://meu-site-pessoal.com"
                  onBlur={(e) => {
                    const normalizedURL = normalizeURL(e.target.value);
                    form.setValue("site", normalizedURL || e.target.value);

                    if (normalizedURL === null && e.target.value.length > 0) {
                      form.setError("site", { type: "pattern", "message": "URL inválida" })
                    } else {
                      form.clearErrors("site");
                    }
                  }}
                  disabled={formState === "loading"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="personType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pessoa</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={formState === "loading"}>
                    <SelectValue placeholder="Você é pessoa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="f">Física</SelectItem>
                  <SelectItem value="j">Jurídica</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {
          form.watch().personType == "j" ? (
            <FormField
              control={form.control}
              name="razaoSocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão Social</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Razão social em caso de pessoa juridica" disabled={formState === "loading"}/>
                  </FormControl>
                </FormItem>
              )}
            />
          ) : null
        }
        <FormField
          control={form.control}
          name="cpf_cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.value.replace(/\D/g, '').length <= 14) {
                      form.setValue("cpf_cnpj", normalize_cpf_cnpj(e.target.value))
                    }
                  }}
                  disabled={formState === "loading"}
                />
              </FormControl>
              <FormDescription>
                Essa informação é privada e ninguém além de você poderá vê-la. Ela é importante para prevenir abusos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <p className="text-sm text-muted-foreground">
          Seu endereço pessoal ou de sua empresa não são públicas e apenas você pode vê-las. Elas são necessárias para confirmação de identidade.
        </p>
        <FormField
          control={form.control}
          name="address_cep"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="*****-***"
                  onChange={(e) => {
                    if (e.target.value.replace(/\D/g, '').length <= 8) {
                      form.setValue("address_cep", normalize_CEP(e.target.value))
                    }
                  }}
                  onBlur={async(e) => {
                    try {
                      const res = await fetch(`https://viacep.com.br/ws/${e.target.value.replace(/\D/g, '')}/json/`);
                      const json: {logradouro: string} = await res.json();
                      form.setValue("address_road", json.logradouro);
                    } catch (error) {
                      captureException(error);
                    }
                  }}
                  disabled={formState === "loading"}
                />
              </FormControl>
              <FormDescription>
                Não sabe seu CEP? verifique <Link className="underline" href={"https://buscacepinter.correios.com.br/app/endereco/index.php"} target="_blank">aqui</Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="address_road"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Rua</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState === "loading"}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address_number"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Número</FormLabel>
                <FormControl>
                  <Input {...field} disabled={formState === "loading"}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />

        <Button
          type="submit"
          disabled={formState === "loading"}
        >
          Salvar
        </Button>
      </form>
    </Form>
  )
}

function ProfileFormLoading() {
  return <></>;
}

function ProfileFormError() {
  return (
    <div className="mx-auto flex w-full h-full flex-col justify-center items-center sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center my-24">
        <p className="text-md text-muted-foreground">
          Não foi possível obter as informações de seu perfil
        </p>
      </div>
    </div>)
}