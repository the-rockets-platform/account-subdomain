"use client";

export default async function Error() {

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <p>Algum erro aconteceu!</p>
            <Retry/>
        </main>
    );
}

function Retry() {
    return (
        <button onClick={() => window.location.reload()}>
            Tentar novamente
        </button>
    )
}