import { SBclients } from "@/clients/sendblue";

async function sendVerificationRequest({
    identifier,
    url,
    provider,
}: {
    identifier: string;
    url: string;
    provider: { server: string; from: string };
}) {
    const { host } = new URL(url);
    /* const emailBody: string = await getEmailTemplate(
        'sendVerificationRequest',
        { host, url, url_link: url }
    ); */
    const emailBody = `
        <a href="${url}" target="_blank">
            <span>Entrar</span>
        </a>
    `;

    try {
        await send_email({
            to: [{ email: identifier }],
            sender: { email: "therockets.brasil@gmail.com", name: "The Rockets" },
            content: emailBody,
            subject: 'Entre em sua conta The Rockets'
        });
    } catch (error: any) {
        console.error(error);
    }
}
interface send_email_params {
    sender: {
        email: string,
        name?: string,
    },
    to: Array<{ email: string, name?: string }>,
    cc?: Array<{ email: string, name?: string }>,
    bcc?: Array<{ email: string, name?: string }>,
    content?: string,
    subject?: string,
}

async function send_email(params: send_email_params) {
    const {
        sender,
        to = [],
        cc = [],
        bcc = [],
        content = "",
        subject = "",
    } = params;

    if (!sender || !to) {
        console.log({ "error": "missing field or incorrect format" });
        return false;
    }

    try {
        await SBclients.tEmails.sendTransacEmail({
            sender: {
                email: sender.email,
                name: sender.name,
            },
            to: to.map((item) => ({ email: item.email })),
            subject: subject,
            htmlContent: decodeURIComponent(content)
        });
    } catch (error) {
        console.log({ "error": error });
        return false;
    }

}
export { sendVerificationRequest, send_email };

