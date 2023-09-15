import { UserLoginForm } from "@/components/user-login-form";
import Link from "next/link";
import Image from "next/image";
import img_logo from "@/assets/logo.png";

export default function SignUp() {
    return (
        <div className="mx-auto flex w-full h-full min-h-[100vh] flex-col justify-center items-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
                <div className="flex justify-center">
                    <Image src={img_logo} alt="The Rockets Logo" className="w-16"/>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                    The Rockets
                </h1>
                <p className="text-sm text-muted-foreground">
                    Digite seu email abaixo para criar ou entrar na sua conta
                </p>
            </div>
            <UserLoginForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
                Ao continuar você aceita nossos{" "}
                <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Termos de serviço
                </Link>{" "}
                e{" "}
                <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                >
                    Privacidade
                </Link>
                .
            </p>
        </div>
    );
}
