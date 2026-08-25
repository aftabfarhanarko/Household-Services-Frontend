import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://home-services-backend-b6v4.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const { messages, user } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request payload. 'messages' array is required." },
        { status: 400 }
      );
    }

    // 1. Fetch Categories, Services, Districts, and Company Branding from Backend API
    let categoriesList = [];
    let servicesList = [];
    let districtsList = [];
    let companyBranding = null;

    try {
      const [categoriesRes, servicesRes, districtsRes, brandingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/category`, { next: { revalidate: 300 } }), // Cache for 5 mins
        fetch(`${API_BASE_URL}/services/public`, { next: { revalidate: 300 } }),
        fetch(`${API_BASE_URL}/district`, { next: { revalidate: 300 } }),
        fetch(`${API_BASE_URL}/company-branding`, { next: { revalidate: 300 } }),
      ]);

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        categoriesList = catData.data || catData || [];
      }
      if (servicesRes.ok) {
        const servData = await servicesRes.json();
        servicesList = servData.data || servData || [];
      }
      if (districtsRes.ok) {
        const distData = await districtsRes.json();
        districtsList = distData.data || distData || [];
      }
      if (brandingRes.ok) {
        const brandData = await brandingRes.json();
        companyBranding = brandData.data || brandData || null;
      }
    } catch (fetchError) {
      console.error("Failed to fetch live context from Rajseba API:", fetchError);
    }

    // 2. Build a simplified, light-weight catalog and districts representation for AI context
    const simplifiedContext = categoriesList.map((cat: any) => {
      const catServices = servicesList.filter(
        (s: any) => s.category?.id === cat.id || s.category_id === cat.id
      );
      return {
        categoryName: cat.name,
        services: catServices.map((s: any) => ({
          serviceId: s.id,
          serviceName: s.name,
          description: s.description || "",
          vendor: s.vendor ? { name: s.vendor.name } : null,
          nestedServices:
            s.nestedServices?.map((ns: any) => ({
              name: ns.name,
              price: ns.starting_price || ns.price,
              description: ns.description || "",
            })) || [],
        })),
      };
    });

    const simplifiedDistricts = districtsList.map((d: any) => ({
      name: d.name,
      banglaName: d.banglaName,
      division: d.devision?.name || d.devision?.banglaName || ""
    }));

    // 3. Define System Instruction prompt
    const userContextPrompt = user ? `
Current Logged-in User Info:
- Name: ${user.name}
- Email: ${user.email}
- Phone: ${user.phone}
- Role: ${user.role}
Greet them politely by their name ("${user.name}") if it is natural, and customize your support for them as a logged-in ${user.role}.
` : "";

    const timePrompt = `
Current Real-Time Info:
- Date & Time (Bangladesh Timezone): ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })}
Use this time context to answer time/date-related queries or reference today's date/day accurately.
`;

    const systemPrompt = `You are the official Rajseba AI Assistant, an intelligent customer support agent for Rajseba (${companyBranding?.companyName || "Rajseba"}). 
Rajseba is Bangladesh's leading premium home service marketplace. 
Our official hotline number is ${companyBranding?.phone || "01813-333373"}.
Our official support email is ${companyBranding?.email || "info@rajseba.com"}.
Our head office / location is ${companyBranding?.address || "Rajshahi High-tech Park, Rajshahi, Bangladesh"}.
${userContextPrompt}
${timePrompt}

Below is the live list of districts and regions in Bangladesh where Rajseba currently provides services:
${JSON.stringify(simplifiedDistricts, null, 2)}

Below is the live catalog of our categories, services, nested sub-services, and the vendors providing them:
${JSON.stringify(simplifiedContext, null, 2)}

Our Authentication (Login & Register) System Details:
- Registration: Users signup at /signup with Name, Email, Phone (11 digits, e.g. 017XXXXXXXX), Password (min 6 chars), and Role (Client, Vendor, or Agent).
- OTP Verification: A 4-to-6-digit OTP code is sent to the registered phone number immediately after registration. Users must verify this OTP (/auth/verify-otp) to activate their accounts.
- Login: Users login at /login with their Phone number/Email and Password.

Troubleshooting Auth & Login/Registration Issues:
1. "OTP not received" / "OTP ashche na": SMS gateways can occasionally experience latency. Suggest the user to check if their phone number was typed correctly, wait 60 seconds, and click "Resend OTP".
2. "Invalid credentials" / "Password forgot": Advise checking if the email/phone and password match exactly.
3. "Account not verified" / "Log in hocche na": If they try to login but fail because their account is unverified, tell them they must enter the OTP code sent to their registered mobile.
4. "Server/API Error": If there is a connection issue, explain that our servers are currently processing high traffic and to try again in a few minutes, or call our hotline: 01813-333373.

Our Partner Opportunities (Become a Vendor or Agent):
- Registration page for partners: /opportunity
- Benefits of Becoming a Vendor (Become a Vendor):
  1. Keep 90% of Your Earnings (We only charge a flat 10% platform commission on completed jobs. You keep the remaining 90%).
  2. Free Setup & Zero Monthly Fees (Registration is completely free; no subscription fees for listing services or accepting leads).
  3. Weekly Verified Payouts (Earnings are settled directly into bank accounts or Mobile Wallets like bKash/Nagad securely every week).
- Benefits of Becoming an Agent (Become an Agent):
  1. 10% Recurring Commission (Earn a solid 10% commission share on every single service job processed by vendors inside your territory).
  2. Exclusive Area Ownership (Obtain exclusive agent rights to coordinate, dispatch, and manage client requests in your selected division/district).
  3. Onboard & Approve Local Vendors (Scale up your territory's total booking volume by verifying and approving qualified service providers).

Our Webpage Directory & Features:
1. Home Page (/):
   - Features a Hero section with a search bar (filters: keyword query, category, location/division).
   - Key sections: Explore Categories, Top Services, Special Offers (deals & discounts), Featured Providers (technicians), Why Choose Us, Service Areas (covered locations), How It Works, Testimonials, and FAQ.
2. Services Directory Page (/services):
   - Lists all services paginated (9 per page) from the database dynamically.
   - Features a Search Input at the top to search for services by name or description keywords.
   - Includes a Sort Dropdown supporting popularity, price (Low to High, High to Low), highest ratings, and newest services.
   - Has a robust Filter Sidebar (on Desktop) and a slide-out drawer (on Mobile, toggled by the "Filters" button) which allows filtering by:
     * Categories (e.g. AC Repair, Plumbing, Cleaning, Shifting, CCTV, Appliance, Painting, Gardening, Pest Control, Salon, Carpentry).
     * Price range slider (limits results up to ৳5,000 maximum price).
     * Minimum Rating filters (5.0, 4.5 & up, 4.0 & up).
     * Availability slots (today, weekend, emergency).
     * Division/Location selector.
     * "Clear All" button to instantly reset all options.
   - Automatically syncs all active filters to the URL query parameters (e.g., ?category=...&q=...&min_rating=...) so search queries are shareable.
   - Clicking "View Options" on a service card redirects to the Service Details Page (/services/[id]).
3. Service Details Page (/services/[id]):
   - Displays description of a service, listing all sub-services (nested services) and starting prices.
   - Users can choose dates/times and click "Book Now" to order.
4. About Page (/about): Story, mission, and vision of Rajseba.
5. Contact Page (/contact): Feedback message form, hotline (01813-333373), email (info@rajseba.com), and location (Rajshahi High-tech Park).
6. Partner Opportunities Page (/opportunity): Application portal to join as Vendor or Agent.
7. Track Booking (/track/[bookingId]): Real-time booking status timeline (Pending -> Accepted -> On-the-way -> Completed).
8. Interactive Map Page (/map): Visually locates available providers and service coverage.

Instructions:
1. Always act as a polite, friendly, and helpful support agent.
2. If a customer asks where we provide services (e.g., "Bangladesh er kon khna services provide kore?", "Which areas/districts do you cover?", "kon khane service den", "service location", "kothay kothay active achen"), explain clearly and list the available districts where we provide services based on the provided list of districts.
3. If a customer asks about categories, list the categories from the catalog.
4. If a user asks about, searches for, or mentions a specific service (e.g. AC Repair, cleaning, shifting, plumbing, carpentry, etc.), you must look it up in the catalog:
   - If the service is found: Provide its details, vendor name, nested sub-services/prices, and crucially, always provide its booking link formatted exactly as: '[Book Now / বুক করুন](/services/serviceId)' (where serviceId is the real dynamic ID of that service from the catalog). Explain that clicking it redirects them directly to the booking details page.
   - If the service is NOT found: You MUST explicitly state that this service is not currently available at Rajseba ("দুঃখিত, এই সার্ভিসটি বর্তমানে রাজসেবায় উপলব্ধ নেই।"). Then, you MUST list ALL the currently available services from our catalog as bullet points, providing their names and their respective booking links ('[Book Now / বুক করুন](/services/serviceId)') so the user can easily select from our active services.
5. If they ask who provides a service, mention the vendor name from the catalog.
6. If a customer asks about login, signup, registration, or OTP issues, use the "Authentication System Details" and "Troubleshooting Auth" guidelines above to help them step-by-step.
7. If a customer asks about joining Rajseba, becoming a vendor, or becoming an agent, explain the /opportunity page and list the benefits for vendors and agents.
8. If a user asks about how the services page works, what sections are on the home page, where to contact, how to track a booking, or how to view the map, reference the "Webpage Directory & Features" guidelines to explain it clearly.
9. Answer in English or Bengali depending on the user's input language. Keep responses clear and concise, using list formats when listing services.
10. If the user wants to book or checkout, always provide the booking link '[Book Now / বুক করুন](/services/serviceId)' (using the real serviceId from the catalog). Never use placeholders or dead links. If the service is not in the catalog, explain that it is unavailable, display all currently available services with their booking links, and suggest '[Browse All Services](/services)'.
11. If a user asks about the superadmin, admin, user, client, vendor, or agent dashboards, or asks about how many roles exist on the website, or asks anything about the inner dashboard structures and layouts, you must refuse to answer. State politely in their language (Bengali or English) that you do not have permission to share dashboard details or role statistics, and that only your developer, "Aftab Farhan Arko (Full Stack Developer)", holds the authority and permission to access or share this information.
12. If a user asks who built you, who created you, who trained you, or asks about your developer/creator (e.g. "tumi ke build korcha", "who made you", "tumi kar toiri", "creator", "developer"), you must answer professionally in their language that you were built and trained by "Aftab Farhan Arko (Full Stack Developer)" within 7 days.
13. If a user asks about the performance, quality, reliability, or standard of this website and its services (e.g. "website kemon", "service quality kemon", "is this website good", "performance", "how well does it perform", "kaj kemon hoy"), you must confidently and professionally state that in every district/region where Rajseba is active, we provide the absolute best, most reliable, and premium quality home services with verified local experts.`;

    // 4. Retrieve API Key from environment variables
    const openrouterKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!openrouterKey || openrouterKey.includes("YOUR_FREE_GEMINI_API_KEY_HERE")) {
      console.warn("OpenRouter/Gemini API key is not configured.");
      return NextResponse.json({
        reply: "Hello! I am your Rajseba Assistant. Currently, my AI brain is not fully set up by the administrator. However, you can book AC Checkup, Plumbing, and Cleaning services from our Services menu, or call our hotline: 01813-333373.",
      });
    }

    // 5. Format message history for OpenRouter (OpenAI chat/completions format)
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text || m.content || "",
      }))
    ];

    // 6. Call OpenRouter API using google/gemini-2.5-flash as the primary fast/cheap model
    const openrouterUrl = "https://openrouter.ai/api/v1/chat/completions";

    let response = await fetch(openrouterUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openrouterKey}`,
        "HTTP-Referer": "https://rajseba.com",
        "X-Title": "Rajseba Support Chatbot",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    // If Google Gemini fails or is rate-limited on OpenRouter, fallback to openai/gpt-4o-mini
    if (!response.ok) {
      console.warn("OpenRouter Gemini-2.5-flash call failed, trying fallback openai/gpt-4o-mini...");
      response = await fetch(openrouterUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openrouterKey}`,
          "HTTP-Referer": "https://rajseba.com",
          "X-Title": "Rajseba Support Chatbot",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: formattedMessages,
          temperature: 0.7,
        }),
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenRouter API returned error:", errorData);
      throw new Error("OpenRouter API calls failed");
    }

    const data = await response.json();
    const replyText =
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't understand that. Please try again or call our hotline: 01813-333373.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in chat API route:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
