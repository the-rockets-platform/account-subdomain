import { prisma } from '@/clients/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import {
    not_found as err_code_not_found,
    unknown as err_code_unknown
} from "@/types/api/errors";
import { Profile } from '@/types/api/responses';

export async function GET(request: NextApiRequest) {
    try {
        const token = await getToken({req: request});
    
        prisma.$connect();
        const profile = await prisma.userProfile.findUnique({
            where: {id: token?.profile?.id, OR: [{userId: token?.sub}]}
        });
        prisma.$disconnect();

        if (profile) {
            if (profile.userId === token?.sub) {
                const response: Profile = {
                    id: profile.id,
                    user_id: profile.userId,
                    name: profile.name,
                    last_name: profile.lastName,
                    phone: profile.phone,
                    site: profile.site,
                    person_type: profile.personType,
                    cpf_cnpj: profile.cpf_cnpj,
                    razao_social: profile.razaoSocial,
                    address_cep: profile.address_cep,
                    address_road: profile.address_road,
                    address_number: profile.address_number,
                }

                return NextResponse.json(response);
            }
        }
        
        return NextResponse.json({ error_code: err_code_not_found, message: 'not found' }, {status: 404})
    } catch (error) {
        return NextResponse.json({ error_code: err_code_unknown, message: 'server error' }, {status: 500})
    }
}

export async function POST(request: Request) {
    try {
        //@ts-ignore
        const token = await getToken({req: request});
        
        const profile: Partial<Profile> = await request.json();
        
        prisma.$connect();
        const { id } = await prisma.userProfile.update({
            select: {id: true},
            where: {id: token?.profile?.id, OR: [{userId: token?.sub}]},
            data: {
                "name": profile.name?.trim() || null,
                "lastName": profile.last_name?.trim() || null,
                "phone": profile.phone?.trim()?.replace(/\D/g, '') || null,
                "site": profile.site?.trim() || null,
                "personType": (profile.person_type === "f" || profile.person_type === "j") ? profile.person_type : null,
                "cpf_cnpj": profile.cpf_cnpj?.trim()?.replace(/\D/g, '') || null,
                "razaoSocial": profile.razao_social?.trim() || null,
                "address_cep": profile.address_cep?.trim()?.replace(/\D/g, '') || null,
                "address_road": profile.address_road?.trim() || null,
                "address_number": profile.address_number?.trim() || null,
            }
        });
        prisma.$disconnect();

        return NextResponse.json({ id }, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error_code: err_code_unknown, message: 'server error' }, {status: 500})
    }
}