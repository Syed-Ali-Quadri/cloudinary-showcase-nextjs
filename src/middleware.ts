import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoutes = createRouteMatcher(["/", "/signup", "/signin", "/home"]);

const isPublicApiRoutes = createRouteMatcher(["/api/videos"]);

export default clerkMiddleware(async (auth, req) => {
	const { userId } = await auth();
	const currentUrl = new URL(req.url);
	const isAccessingDashboard = currentUrl.pathname === "/home";
	const isApiRequest = currentUrl.pathname.startsWith("/api");

	// If user is logged in and accessing a public route but not the dashboard
	if (userId && isPublicRoutes(req) && !isAccessingDashboard) {
		return NextResponse.redirect(new URL("/home", req.url));
	}

	if (!userId) {
		// If user is not logged in and trying to access a protected route
		if (!isPublicRoutes(req) && !isPublicApiRoutes(req)) {
			return NextResponse.redirect(new URL("/signin", req.url));
		}

		// If the request is for a protected API and the user is not logged in
		if (isApiRequest && !isPublicApiRoutes(req)) {
			return NextResponse.redirect(new URL("/signin", req.url));
		}
	}
	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)"
	]
};
