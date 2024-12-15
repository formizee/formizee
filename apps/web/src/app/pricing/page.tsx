import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@formizee/ui';
import {PricingCard, TeamsPricingCard} from './_components';
import {Transition} from '@/components';

export default function PricingPage() {
  return (
    <Transition className="flex flex-grow flex-col">
      <section className="flex flex-col w-full items-center px-2 mt-32">
        <h1 className="font-bold text-xl sm:text-3xl mb-12">
          Choose your plan, start building
        </h1>
        <div className="flex flex-col sm:flex-row gap-8">
          <PricingCard plan="hobby" />
          <PricingCard plan="pro" />
        </div>
        <TeamsPricingCard />
      </section>
      <section className="flex flex-col w-full items-center px-2 mt-24 mb-4">
        <h1 className="font-bold text-xl sm:text-3xl mb-12">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="w-[50rem]">
          <AccordionItem value="item-0">
            <AccordionTrigger>How does the Hobby plan works?</AccordionTrigger>
            <AccordionContent>
              The Hobby plan allows you to start using our service without any
              upfront costs. You can create up to 100 forms and receive up to
              250 submissions per month. It’s great for testing and small-scale
              projects.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What happens if i exceed my submissions limit
            </AccordionTrigger>
            <AccordionContent>
              If you exceed your plan’s submission limit, we’ll notify you via
              email. Submissions may stop being processed until you upgrade your
              plan or the limit resets at the start of the next billing cycle.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I switch plans at any time?</AccordionTrigger>
            <AccordionContent>
              Yes! You can upgrade, downgrade, or cancel your subscription
              anytime from your account settings. Changes will take effect
              immediately, and we’ll prorate your billing accordingly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I cancel my subscription and get a refund?
            </AccordionTrigger>
            <AccordionContent>
              You can cancel your subscription at any time. While we don’t offer
              refunds for unused time in the current billing cycle, you’ll
              retain access to premium features until the end of the billing
              period.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Do you charge per account or per workspace?
            </AccordionTrigger>
            <AccordionContent>
              Our pricing is based on workspace usage (e.g., number of
              submissions and features). You can add multiple team members to
              your workspace for no additional cost, (depending on your plan).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>How secure is my data?</AccordionTrigger>
            <AccordionContent>
              We encrypt all the data with AES-256 for maximum security, Also
              your account and workspace data is totally isolated from the
              submissions data.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              Do you offer custom plans for large organizations
            </AccordionTrigger>
            <AccordionContent>
              No, at the moment we only offer the Hobby and the Pro plans.
              Anyway, stay tunned since we have planned to add that feature.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="mt-8 flex items-center justify-center w-full">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            If you have further questions, don’t hesitate to reach out to{' '}
            <a className="underline" href="mailto:support@formizee.com">
              support@formizee.com
            </a>
            .
          </span>
        </div>
      </section>
    </Transition>
  );
}
