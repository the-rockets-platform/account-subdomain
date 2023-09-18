export function phoneNumber(value: string): string {
    console.log(value);

    const cleanedPhoneNumber = value.replace(/\D/g, '');

    // Verifica se é um celular (9 dígitos) ou um telefone fixo (8 dígitos)
    const isCellPhone = cleanedPhoneNumber.length === 11;

    // Formatação com base no tipo de número
    const formattedPhoneNumber = isCellPhone
        ? cleanedPhoneNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
        : cleanedPhoneNumber.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');

    console.log(formattedPhoneNumber);
    return formattedPhoneNumber;
}

export function url(value: string): string | null {
    if (!value.match(/^https?:\/\//i)) {
        value = 'https://' + value;
    }

    try {
        const url = new URL(value);
        return url.href;
    } catch (error) {
        return null;
    }
}

export function cpf_cnpj(value: string): string {
    // Remove todos os caracteres que não são dígitos
    const cleanedCPFCNPJ = value.replace(/\D/g, '');
    
    // Verifica se é um CPF (11 dígitos) ou um CNPJ (14 dígitos)
    const isCPF = cleanedCPFCNPJ.length === 11;
    
    // Formatação com base no tipo de documento
    const formattedCPFCNPJ = isCPF
        ? cleanedCPFCNPJ.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')
        : cleanedCPFCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    
    return formattedCPFCNPJ;
}

export function cep(value: string): string {
    // Remove todos os caracteres que não são dígitos
    const cleanedCEP = value.replace(/\D/g, '');

    // Formatação "XXXXX-XXX"
    const formattedCEP = cleanedCEP.replace(/^(\d{5})(\d{3})$/, '$1-$2');

    return formattedCEP;
}