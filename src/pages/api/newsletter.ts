export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import { sendEmail } from "@lib/api";
import md5 from 'crypto-js/md5';
const NEWSLETTER_EMAIL = import.meta.env.NEWSLETTER_EMAIL ?? 'digital@somosexperiences.com';
const MAILCHIMP_SERVER_PREFIX = import.meta.env.MAILCHIMP_SERVER_PREFIX ?? '481cb616dd8511324d1fbf075606cab5';
const AUDIENCE_ID = import.meta.env.MAILCHIMP_LIST_ID ?? '1d6553a9cd';
const MAILCHIMP_API_KEY = import.meta.env.MAILCHIMP_API_KEY ?? '481cb616dd8511324d1fbf075606cab5-us20';
const MAILCHIMP_TAGS = import.meta.env.MAILCHIMP_TAGS ?? 'somosweb-newsletter';

const sendNewsletterEmail = (email: string) => {
  let message = "<html><body>";
  message += "<h1>Newsletter Submission from SOMOS Web</h1>";
  message += "<p>Email: " + email + "</p>";
  message += "</body></html>";

  sendEmail({
    to: [{ name: "SOMOS Experiences", email: NEWSLETTER_EMAIL }],
    subject: "Newsletter Submission from SOMOS Web",
    message
  }).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const subscribeToMailchimpList = async (email: string, tags: string[]) => {
  const baseUrl = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
  const authHeader = 'anystring ' + MAILCHIMP_API_KEY

  const subscribeUrl = `${baseUrl}/lists/${AUDIENCE_ID}/members`

  const data = {
    email_address: email,
    status: 'subscribed'
  };

  const response = await fetch(subscribeUrl, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok && response.status !== 400) {
    const error = await response.json();
    console.error('❌ Error al suscribir:', error);
    return false;
  }

  const subscriberHash = md5(email.toLowerCase()).toString()
  const tagsUrl = `${baseUrl}/lists/${AUDIENCE_ID}/members/${subscriberHash}/tags`;

  const tagPayload = {
    tags: tags.map(tag => ({
      name: tag,
      status: 'active'
    }))
  };

  const tagsRes = await fetch(tagsUrl, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tagPayload)
  })

  return true;
}

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();

  if (!validateEmail(data.email)) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid email"
      }),
      { status: 400 }
    );
  }

  subscribeToMailchimpList(data.email, [MAILCHIMP_TAGS]);
  sendNewsletterEmail(data.email);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Success!"
    }),
    { status: 200 }
  );
}