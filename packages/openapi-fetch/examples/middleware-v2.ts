import createClient from "openapi-fetch";

// Mock token store
let token = "expired-token";
let refreshToken = "valid-refresh-token";

const client = createClient({
  baseUrl: "https://httpbin.org",
});

// Middleware for token refresh
client.use(async (context, next) => {
  // Check if the token is expired (simplified for this example)
  if (token === "expired-token") {
    console.log("Token expired, refreshing...");
    // In a real app, you would make a request to your auth server
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
    token = "new-valid-token";
    refreshToken = "new-refresh-token";
    console.log("Token refreshed!");
  }

  // Add the token to the request header
  context.request.headers.set("Authorization", `Bearer ${token}`);

  // Continue to the next middleware or the fetch call
  const response = await next();

  // You can also inspect the response
  if (response.status === 401) {
    console.log("Server responded with 401, maybe the refresh token is also expired.");
    // Here you might want to redirect to a login page
  }

  return response;
});

// Example API call
async function getUser() {
  console.log("Making API call...");
  const { data, error } = await client.GET("/get");
  if (error) {
    console.error("API Error:", error);
  } else {
    console.log("API Success:", data);
  }
}

getUser();
