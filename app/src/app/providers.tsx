import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
      {children}
    </GoogleOAuthProvider>
  );
}
