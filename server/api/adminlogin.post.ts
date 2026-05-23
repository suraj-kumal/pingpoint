import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

export default defineEventHandler(async (event) => {
  try {
    // Validate request body
    const body = await readValidatedBody(event, bodySchema.parse);
    const { email, password } = body;

    // Check environment variables
    const EMAIL = process.env.EMAIL;
    const PASSWORD = process.env.PASSWORD;

    if (!EMAIL || !PASSWORD) {
      console.error("Missing EMAIL or PASSWORD environment variables");

      throw createError({
        statusCode: 500,
        statusMessage: "Server configuration error",
      });
    }

    // Validate credentials
    if (email !== EMAIL || password !== PASSWORD) {
      throw createError({
        statusCode: 401,
        statusMessage: "Invalid credentials",
      });
    }

    // Create session
    await setUserSession(event, {
      user: {
        name: "Admin",
        email,
      },
      loggedInAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Login successful",
    };
  } catch (error: any) {
    // Zod validation errors
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation failed",
        data: error.flatten(),
      });
    }

    // Already handled HTTP errors
    if (error.statusCode) {
      throw error;
    }

    // Unexpected errors
    console.error("Login error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
