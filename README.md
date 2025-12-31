# Coffee Support App (Next.js 15 + React 19)

A high-performance, animated donation platform built with the latest web technologies.

## The Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe API
- **Animations:** LottieFiles (DotLottie)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel 

## Key Features 
- **Real-time Donations:** Users can leave a name and a custom message.
- **Secure Checkout:** Integrated with Stripe Checkout for PCI-compliant payments.
- **Live Feed:** Displays the most recent supporters directly from the database. 
- **Responsive Design:** Fully styled with Tailwind CSS for mobile and desktop.  


## Lessons Learned
During the development of this project, I encountered and resolved several real-world engineering challenges. Key takeaways include:
- **Dependency Management:** Navigated the transition between experimental (v16/Tailwind 4) and stable (v15/Tailwind 3) versions to ensure production reliability.
- **Environment Security:** Debugged complex "Server-side exceptions" related to Environment Variable mapping and API key authentication.
- **Next.js Server Actions:** Optimized server-side logic by managing the redirect() lifecycle outside of try/catch blocks to prevent internal framework errors.
- **CSS Pipelines:** Configured PostCSS and Autoprefixer from scratch to ensure cross-browser compatibility.
- **Library Migration:** Faced severe `ERRESOLVE` errors due to React 19's new peer-dependency requirements. Successfully pivoted from `@dotlottie/react-player` to the more modern `@lottiefiles/dotlottie-react` to ensure future-proof compatibility.
- **Vercel Build Optimization:** Mastered the use of `.npmrc` configurations and Vercel deployment overrides to bypass build-environment conflicts.
- **Production Debugging:** Learned to identify the difference between code logic errors (local) and environment/cache errors (Vercel).


##  Installation
1. Clone the repo
2. Run `npm install`
3. Set up your `.env` with Stripe and Supabase keys.
4. Run `npm run dev`

