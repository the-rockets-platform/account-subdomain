export default function AuthError({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    return (
        <div className="mx-auto flex w-full h-full min-h-[100vh] flex-col justify-center items-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <p className="text-md text-muted-foreground">
                    {searchParams['error'] == 'Configuration' ? (
                        "Estamos com problemas internos. Por favor tente novamente mais tarde ou entre em contato conosco."
                    ) : null}
                    {searchParams['error'] == 'AccessDenied' ? (
                        "Você não está permitido a fazer login."
                    ) : null}
                    {searchParams['error'] == 'Verification' ? (
                        "O link que você usou já expirou pelo tempo. Por favor tente novamente."
                    ) : null}
                    {searchParams['error'] == 'Default' ? (
                        "Ocorreu um erro inesperado. Por favor tente novamente mais tarde ou entre em contato conosco."
                    ) : null}
                </p>
            </div>
        </div>
    );
}