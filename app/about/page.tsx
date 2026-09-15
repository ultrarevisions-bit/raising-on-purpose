import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/newsletter-signup";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet the writer behind Raising On Purpose. Why this blog exists: honest motherhood, purposeful parenting, and no highlight reel.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      <section aria-labelledby="about-heading" className="py-12">
        <h1 id="about-heading" className="font-heading text-3xl sm:text-4xl">
          About Raising On Purpose
        </h1>

        <div className="prose mt-8">
          <p>
            This site started the same way most of my parenting days do: with a plan that
            lasted about four minutes. I wanted to raise kids with actual values, not just
            survive the afternoons. Then my toddler threw a shoe at my head in the cereal
            aisle, and I stood there wondering what chapter of the parenting book covers
            this part.
          </p>
          <p>
            None of them do. That is why this blog exists.
          </p>
          <p>
            Raising On Purpose is a space for honest, unfiltered motherhood. You will find
            real essays about the days that do not go as planned, and practical,
            values-driven parenting help for the ones that almost do. Connection-based
            discipline. Family routines that hold up. Age-and-stage guidance for the toddler
            years. And free printables, because sometimes a chore chart does more than a
            pep talk.
          </p>
          <p>Here is what you can expect.</p>
          <ul>
            <li>
              No pretending. If something did not work for our family, I will say so.
            </li>
            <li>
              No shaming. Different families, different calls. We are all doing our best
              with the cups we have.
            </li>
            <li>
              Small, doable shifts. Not a twelve-step philosophy you need a binder to
              follow.
            </li>
            <li>
              Real talk with a backbone. Comfort that does not flinch from the hard parts.
            </li>
          </ul>
          <p>
            I believe in connection before correction, routines over rigidity, and a
            feelings chart on the fridge as much as the next honest parent. I also believe
            my kids are not a corrective action plan. They are people, and so am I.
          </p>
          <p>
            If you have ever sat in the car in the driveway for five extra minutes just to
            have one quiet moment before going inside, you are in the right place. Welcome.
          </p>
        </div>
      </section>

      <section aria-labelledby="about-newsletter" className="pb-12">
        <NewsletterSignup className="mx-auto max-w-xl" />
      </section>
    </div>
  );
}