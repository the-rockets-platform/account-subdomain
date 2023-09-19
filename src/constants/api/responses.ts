import error_codes from "@/constants/api/errors";

export type APIResponse<T> = T & Partial<Error>;

export interface Profile {
    id: string,
    user_id: string,
    name: string | null,
    last_name: string | null,
    phone: string | null,
    site: string | null,
    person_type: string | null,
    cpf_cnpj: string | null,
    razao_social: string | null,
    address_cep: string | null,
    address_road: string | null,
    address_number: string | null,
}

export interface Error {
    error_code: typeof error_codes[keyof typeof error_codes], message: string
}