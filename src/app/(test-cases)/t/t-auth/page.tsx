'use client'

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data, status, update } = useSession();

    return (
        <div className="d-flex flex-col space-y-4">
            <p>{status}</p>
            <button onClick={() => {
                signOut();
            }}>Signout</button>
            <button onClick={() => {
                update();
            }}>Update</button>
            <p>{JSON.stringify(data)}</p>
        </div>
    );
}
