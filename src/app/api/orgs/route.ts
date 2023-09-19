import { prisma } from "@/clients/prisma";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import {
    ORG_OWNER_EXCEEDS as err_code_org_owner_exceeds,
    ORG_NAME_EXISTS as err_code_org_name_exists,
    BAD_REQUEST as err_code_bad_request,
    UNKNOWN as err_code_unknown,
    UNAUTHORIZED as err_code_unauthorized,
} from "@/constants/api/errors";
import { ORG_ACCESS_OWNER } from "@/constants/constants";

export async function POST(request: Request) {
    try {
        //@ts-ignore
        const token = await getToken({req: request});
        
        const org: Partial<{name: string}> = await request.json();
        
        if (!org.name) {
            return NextResponse.json({ error_code: err_code_bad_request, message: '\'name\' expected in querystring' }, {status: 400})
        }

        if (!token?.sub) {
            return NextResponse.json({ error_code: err_code_unauthorized, message: 'user not found in token' }, {status: 401})
        }

        prisma.$connect();
        
        const orgs_with_requested_name = await prisma.organization.aggregate({
            _count: {
                _all: true
            },
            where: {name: {mode: "insensitive", equals: org.name}},
        });

        if (orgs_with_requested_name._count._all > 0) {
            prisma.$disconnect();
            return NextResponse.json({ error_code: err_code_org_name_exists, message: `organization with name ${org.name} already exists` }, {status: 500})
        }

        const orgs_with_user_as_owner = await prisma.organizationUser.aggregate({
            _count: {
                _all: true
            },
            where: {userAccess: ORG_ACCESS_OWNER, userId: token.sub},
        });

        if (orgs_with_user_as_owner._count._all > 1) {
            prisma.$disconnect();
            return NextResponse.json({ error_code: err_code_org_owner_exceeds, message: `You cannot be owner of more than 1 organization` }, {status: 500})
        }

        const created_org = await prisma.organization.create({
            data: {
                name: org.name.trim(),
                OrganizationUser: {
                    create: {
                        userId: token.sub,
                        userAccess: ORG_ACCESS_OWNER
                    }
                },
            },
            select: {id: true}
        });

        await prisma.user.update({
            data: {currentOrganizationId: created_org.id},
            where: {id: token.sub}
        });

        prisma.$disconnect();
        return NextResponse.json({ id: created_org.id }, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error_code: err_code_unknown, message: 'server error' }, {status: 500})
    }
}