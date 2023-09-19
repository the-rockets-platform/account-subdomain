import { prisma } from "@/clients/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import {
    BAD_REQUEST as err_code_bad_request,
    UNKNOWN as err_code_unknown
} from "@/constants/api/errors";

export async function GET(request: NextApiRequest) {
    try {
        const URLParams = new URLSearchParams(new URL(request.url || "").search);
        const name = URLParams.get("name");
        
        if (!name) {
            return NextResponse.json({ error_code: err_code_bad_request, message: '\'name\' expected in querystring' }, {status: 400})
        }

        try {
            prisma.$connect();
            await prisma.organization.findFirstOrThrow({
                select: {_count: true},
                where: {name: {mode: "insensitive", equals: name}}
            });

            prisma.$disconnect();
            return new NextResponse("0");
        } catch(e) {
            prisma.$disconnect();
            return new NextResponse("1");
        }
    } catch (error) {
        prisma.$disconnect();
        return NextResponse.json({ error_code: err_code_unknown, message: 'server error' }, {status: 500})
    }
}