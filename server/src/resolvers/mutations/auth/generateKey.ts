import { AuthenticationError } from "apollo-server-express";
import prisma from "../../../prisma";
import { verifyAuth } from "../../../verifyauth";
import sshpk, { SSHBuffer } from "sshpk";

export const generateKey = async (
  _: any,
  {
    key,
  }: {
    key: string;
  },
  { user }: { user: { id?: string } }
) => {
  if (!verifyAuth(user)) {
    throw new AuthenticationError("Invalid Auth");
  }
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: { roles: { include: { subroles: true } } },
  });
  if (!userData) {
    throw new AuthenticationError("Invalid Auth");
  }
  const principals = userData.roles
    .map((r) =>
      r.subroles.map((s) => sshpk.identityForUser(`sshca_subrole_${s.id}`))
    )
    .flat();
  if (principals.length === 0) {
    throw new AuthenticationError("User has no roles");
  }
  const privateKey = sshpk.parsePrivateKey(process.env.SSH_KEY, "ssh");
  const userKey = sshpk.parseKey(key, "ssh");
  const cert = sshpk.createCertificate(
    principals,
    userKey,
    sshpk.identityForUser("sshca"),
    privateKey,
    { lifetime: 60 * 10 }
  );
  cert.signatures.openssh.exts = [
    "permit-X11-forwarding",
    "permit-agent-forwarding",
    "permit-port-forwarding",
    "permit-pty",
    "permit-user-rc",
  ].map((r) => ({ name: r, critical: false, data: Buffer.from("") }));
  const signer = privateKey.createSign("sha512");
  // @ts-expect-error
  const blob = sshpk.Certificate.formats.openssh.toBuffer(cert, true);
  signer.write(blob);
  // @ts-expect-error
  cert.signatures.openssh.signature = signer.sign();
  return cert.toString("openssh");
};
