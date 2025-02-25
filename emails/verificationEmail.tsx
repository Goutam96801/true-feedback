import { Html } from "@react-email/components";


interface VerificationEmailProps {
    username: string;
    otp: string;
}

export default function VerificationEmail({username, otp} : VerificationEmailProps) {
     return (
        <Html lang="en" dir="ltr">

        </Html>
     )
}