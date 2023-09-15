"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
import { Textarea } from "@/ui/new-york/textarea"
import { toast } from "@/ui/new-york/use-toast"
import { Separator } from "@/ui/new-york/separator"

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
    })
    .min(1),
  site: z
    .string()
    .optional(),
  cpf_cnpj: z.string({required_error: "Informação necessária"}).min(8),
  personType: z.string({required_error: "Informação necessária"}).min(1),
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
  personType: "",
  razaoSocial: "",
  address_cep: "",
  address_road: "",
  address_number: "",
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="nome" {...field}/>
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
                  <Input placeholder="lastname" {...field}/>
                </FormControl>
                {/* <FormDescription>
                  This is your public display name. It can be your real name or a
                  pseudonym. You can only change this once every 30 days.
                </FormDescription> */}
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
                <Input placeholder="(11) 91234-5678" {...field} />
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
                <Input placeholder="https://meu-site-pessoal.com" {...field} />
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
                  <SelectTrigger>
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
                    <Input placeholder="Razão social em caso de pessoa juridica" {...field} />
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
                <Input placeholder="cpf ou cnpj" {...field} />
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
                <Input placeholder="00000-000" {...field}/>
              </FormControl>
              <FormDescription>
                Não sabe seu CEP? verifique <Link className="underline" href={"https://buscacepinter.correios.com.br/app/endereco/index.php"} target="_blank">aqui</Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_road"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  )
}
