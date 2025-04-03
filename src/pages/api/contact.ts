export const prerender = false; // Not needed in 'server' mode
import type { APIRoute } from "astro";
import { sendEmail } from "@lib/api";

const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL ?? 'digital@somosexperiences.com';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();


  let message = "<html><body>";
  message += "<h1>New Contact Form Submission from SOMOS Web</h1>";
  message += "<p>Name: " + data.name + "</p>";
  message += "<p>Email: " + data.email + "</p>";
  if (data.phone) {
    message += "<p>Phone: " + data.phone + "</p>";
  }
  message += "<p>Company: " + data.company + "</p>";
  message += "<p>Message: " + data.message + "</p>";
  message += "</body></html>";

  sendEmail({
    to: [{ name: "SOMOS Experiences", email: CONTACT_EMAIL }],
    subject: "New Contact Form Submission from SOMOS Web",
    message
  }).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function (error) {
    console.error(error);
  });

  return new Response(
    JSON.stringify({
      success: true,
      message: "Success!"
    }),
    { status: 200 }
  );
};