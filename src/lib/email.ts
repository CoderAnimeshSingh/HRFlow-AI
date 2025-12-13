import emailjs from "@emailjs/browser";

export async function sendInterviewEmail({
  serviceId,
  templateId,
  publicKey,
  templateParams,
}: {
  serviceId: string;
  templateId: string;
  publicKey: string;
  templateParams: Record<string, string | number | undefined>;
}) {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("Missing EmailJS configuration");
  }

  // initialize
  try {
    emailjs.init(publicKey);
  } catch (e) {
    // already initialized is fine
  }

  const result = await emailjs.send(serviceId, templateId, templateParams);
  return result;
}

export default sendInterviewEmail;
