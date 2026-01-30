import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verifyToken: string;
}

export default function VerificationEmail({
  username,
  verifyToken: otp,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Here&apos;s your verification code: {otp}</Preview>

      <Body>
        <Container>
          <Section>
            <Row>
              <Heading as="h2">Hello {username}</Heading>
            </Row>

            <Row>
              <Text>
                Thank you for registering. Please use the following verification
                code to complete your registration.
              </Text>
            </Row>

            <Row>
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  letterSpacing: "4px",
                }}
              >
                {otp}
              </Text>
            </Row>

            <Row>
              <Text>
                If you did not request this code, please ignore this email.
              </Text>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
