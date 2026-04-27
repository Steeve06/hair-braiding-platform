// functions/api/submit-booking.js

export async function onRequestPost(context) {
  const data = await context.request.json();

  // 1. You can send this data to a database (D1 or KV)
  // 2. Or forward it to your Django API
  const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}