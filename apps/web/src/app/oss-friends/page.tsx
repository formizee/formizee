import {ProductCard} from './_components';
import {Transition} from '@/components';

export default function Page() {
  return (
    <Transition className="flex flex-grow items-center flex-col mt-32">
      <h1 className="font-bold text-2xl sm:text-4xl">
        Our Open Source Friends
      </h1>
      <p className="font-secondary max-w-96 text-center mt-4">
        Formizee is highly inspired in some open-source projects. Here is a sort
        list:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-[auto,auto] gap-6 mt-12">
        <ProductCard name="Cal.com" href="https://cal.com">
          A scheduling tool that helps you schedule mettings without the
          back-and-forth emails.
        </ProductCard>
        <ProductCard name="Crowd.dev" href="https://crowd.dev">
          Centralize community, product, and customer data to understand which
          companies are engaging with your open source project.
        </ProductCard>
        <ProductCard name="GitWonk" href="https://gitwonk.com">
          GitWonk is an open-source technical documentation tool, designed and
          built focusing on the developer experience.
        </ProductCard>
        <ProductCard name="Langfuse" href="https://langfuse.com">
          Open source LLM engineering platform. Debug, analyze and iterate
          together.
        </ProductCard>
        <ProductCard name="OpenAlternative" href="https://openalternative.co">
          A curated collection of the best open source alternatives to every day
          SaaS products.
        </ProductCard>
        <ProductCard name="OpenStatus" href="https://openstatus.dev">
          Open-Source monitoring platform with beautiful status pages.
        </ProductCard>
        <ProductCard name="Papermark" href="https://papermark.io">
          Open-Source Docsend Alternative to securely share documents with
          real-time analytics.
        </ProductCard>
        <ProductCard name="Plunk" href="https://useplunk.com">
          affordable email platform that brings together marketing,
          transactional and broadcast emails.
        </ProductCard>
        <ProductCard name="Supabase" href="https://supabase.com">
          The open source Firebase alternative. Supabase gives you a dedicated
          Postgres database to build your web, mobile, and AI applications.
        </ProductCard>
        <ProductCard name="Trigger.dev" href="https://trigger.dev">
          Create long-running Jovs directly in your codebase with features like
          API integrations, webhooks, scheduling and delays.
        </ProductCard>
        <ProductCard name="Turso" href="https://turso.tech">
          A fully managed database platform that you can use to create hundreds
          of thousands of databases.
        </ProductCard>
        <ProductCard name="Unkey" href="https://unkey.com">
          An API authentication and authorization platform for scaling user
          facing APIs.
        </ProductCard>
      </div>
    </Transition>
  );
}
