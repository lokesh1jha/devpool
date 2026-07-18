import Hero from "@/components/hero";
import JobSeekerHomepage from "@/components/jobseeker-landing-page";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Index() {
  return (
    <>
      {/* <Hero /> */}
      {/* className="flex-1 flex flex-col gap-6 px-4" */}
      <main >
        {hasEnvVars ? <JobSeekerHomepage /> : <JobSeekerHomepage />}
      </main>
    </>
  );
}
