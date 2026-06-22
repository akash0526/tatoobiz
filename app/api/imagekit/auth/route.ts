import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export async function GET() {
	try {
		const authParams = imagekit.getAuthenticationParameters();

		// Validate that auth params were generated properly
		if (!authParams.token || !authParams.signature || !authParams.expire) {
			console.error("ImageKit auth params incomplete:", authParams);
			return NextResponse.json(
				{
					error:
						"Failed to generate complete auth params. Check your ImageKit credentials.",
				},
				{ status: 500 },
			);
		}

		return NextResponse.json(authParams);
	} catch (error) {
		console.error("ImageKit auth error:", error);
		return NextResponse.json(
			{
				error:
					"Failed to generate auth params. Ensure IMAGEKIT_PRIVATE_KEY is set.",
			},
			{ status: 500 },
		);
	}
}
