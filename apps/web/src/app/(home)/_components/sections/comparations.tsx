import {BlurFade} from '@/components/blur-fade';
import {cn} from '@formizee/ui';

export const Comparations = () => {
  return (
    <BlurFade delay={0.4} inView>
      <section className="flex flex-col items-center justify-between gap-16">
        <h3 className="text-neutral-900 dark:text-neutral-50 font-bold text-3xl text-center select-none">
          The cheapest alternative by far...
        </h3>
        <span className="flex flex-col items-center gap-4">
          <span>
            <span className="text-6xl font-bold font-secondary">250</span>
            <span className="font-medium font-secondary">/mo</span>
          </span>
          <span className="font-bold text-xl font-secondary">
            Free Submissions
          </span>
        </span>
        <div className="flex flex-col sm:flex-row gap-12 my-4 w-full justify-center">
          <ComparationItem
            name="Formspree"
            submissions="50 Submissions"
            plan="Free Plan"
          >
            <svg
              width="30"
              height="32"
              viewBox="0 0 30 32"
              fill="none"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="currentColor"
                d="M0.804504 2.66666C0.804504 1.19391 1.99617 0 3.46615 0H26.5339C28.0037 0 29.1955 1.19391 29.1955 2.66666V6.4762C29.1955 7.94895 28.0037 9.14286 26.5339 9.14286H3.46615C1.99617 9.14286 0.804504 7.94895 0.804504 6.4762V2.66666ZM0.804505 14.0953C0.804505 12.6225 1.99617 11.4286 3.46615 11.4286H26.5339C28.0037 11.4286 29.1955 12.6225 29.1955 14.0953V17.9048C29.1955 19.3776 28.0037 20.5715 26.5339 20.5715H3.46615C1.99617 20.5715 0.804505 19.3776 0.804505 17.9048V14.0953ZM3.46615 22.8571C1.99617 22.8571 0.804505 24.0511 0.804505 25.524V29.3333C0.804505 30.8062 1.99616 32 3.46615 32H14.1128C15.5828 32 16.7744 30.8062 16.7744 29.3333V25.524C16.7744 24.0511 15.5828 22.8571 14.1128 22.8571H3.46615Z"
              />
            </svg>
          </ComparationItem>
          <ComparationItem
            name="Formester"
            submissions="100 Submissions"
            plan="Free Plan"
          >
            <svg
              width="24"
              height="32"
              viewBox="0 0 24 32"
              fill="none"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <path
                d="M10.4132 11.4135C10.4132 12.493 9.466 13.3681 8.29752 13.3681C7.12905 13.3681 6.18182 12.493 6.18182 11.4135C6.18182 10.334 7.12905 9.48926 8.29752 9.48926C9.466 9.48926 10.4132 10.334 10.4132 11.4135Z"
                fill="currentColor"
              />
              <path
                d="M17.8182 11.4287C17.8182 12.4998 16.871 13.3681 15.7024 13.3681C14.534 13.3681 13.5868 12.4998 13.5868 11.4287C13.5868 10.3576 14.534 9.48926 15.7024 9.48926C16.871 9.48926 17.8182 10.3576 17.8182 11.4287Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.27274 0C1.66609 0 0.363647 1.36447 0.363647 3.04761V28.9524C0.363647 30.6356 1.66609 32 3.27274 32H20.7272C22.3339 32 23.6363 30.6356 23.6363 28.9524V3.04761C23.6363 1.36447 22.3339 0 20.7272 0H3.27274ZM6.9091 7.61905C4.90079 7.61905 3.27274 9.32463 3.27274 11.4286C3.27274 13.5325 4.90079 15.2381 6.9091 15.2381H17.091C19.0992 15.2381 20.7272 13.5325 20.7272 11.4286C20.7272 9.32463 19.0992 7.61905 17.091 7.61905H6.9091Z"
                fill="currentColor"
              />
            </svg>
          </ComparationItem>
          <ComparationItem
            name="Formcarry"
            submissions="50 Submissions"
            plan="Baby Plan"
          >
            <svg
              width="28"
              height="32"
              fill="none"
              viewBox="0 0 28 32"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <path
                d="M13.3155 8.94547C10.4451 8.94479 7.57995 8.69918 4.75127 8.2114C4.67322 8.19746 4.59871 8.16817 4.53204 8.12526C4.46537 8.08233 4.40787 8.02661 4.36287 7.96133C4.31786 7.89606 4.28623 7.8225 4.26982 7.74494C4.25342 7.66736 4.25254 7.5873 4.26726 7.50938L5.3593 1.63724C5.3885 1.48239 5.47745 1.34524 5.60694 1.25541C5.73642 1.16559 5.89604 1.13032 6.0513 1.15722C11.0562 2.00587 16.171 1.97067 21.1637 1.05321C22.6023 0.786642 24.0258 0.443486 25.4278 0.0251873C25.5798 -0.0202835 25.7436 -0.00374622 25.8834 0.0712185C26.0233 0.14617 26.1277 0.273452 26.1739 0.425199L27.9738 6.12136C27.9976 6.19711 28.0061 6.27683 27.9988 6.3559C27.9915 6.43495 27.9685 6.51176 27.9313 6.5819C27.8942 6.65204 27.8435 6.71409 27.7821 6.76447C27.7207 6.81484 27.6499 6.85254 27.5739 6.87537C25.8949 7.38057 24.1897 7.79387 22.4658 8.11341C19.4474 8.66884 16.3846 8.94738 13.3155 8.94547Z"
                fill="currentColor"
              />
              <path
                d="M13.3155 20.4737C9.72983 20.4759 6.15078 20.1647 2.61926 19.5436C2.54121 19.5297 2.4667 19.5004 2.40003 19.4574C2.33336 19.4145 2.27585 19.3588 2.23084 19.2935C2.18583 19.2283 2.15422 19.1547 2.13781 19.0772C2.12141 18.9995 2.12052 18.9194 2.13524 18.8415L3.23727 12.9715C3.26645 12.8158 3.35598 12.6779 3.48637 12.588C3.61675 12.498 3.77741 12.4633 3.9333 12.4915C10.142 13.5654 16.4891 13.5654 22.6979 12.4915C22.8537 12.4633 23.0144 12.498 23.1448 12.588C23.2752 12.6779 23.3647 12.8158 23.3938 12.9715L24.4918 18.8415C24.5066 18.9194 24.5056 18.9995 24.4892 19.0772C24.4728 19.1547 24.4413 19.2283 24.3963 19.2935C24.3512 19.3588 24.2938 19.4145 24.2271 19.4574C24.1604 19.5004 24.0859 19.5297 24.0079 19.5436C20.4776 20.1645 16.9 20.4757 13.3155 20.4737Z"
                fill="currentColor"
              />
              <path
                d="M12.7115 32C8.61383 31.9666 4.52614 31.5906 0.491161 30.876C0.413288 30.8618 0.338994 30.8324 0.272552 30.7893C0.206111 30.7463 0.148834 30.6905 0.104029 30.6253C0.0592253 30.56 0.0277694 30.4866 0.0114854 30.4091C-0.00479861 30.3316 -0.00558357 30.2518 0.00915379 30.174L1.10518 24.3038C1.13437 24.1486 1.22362 24.0111 1.35355 23.9212C1.48348 23.8314 1.64362 23.7964 1.79919 23.8238C5.4041 24.458 9.05535 24.7924 12.7155 24.8239C12.8746 24.8239 13.0273 24.887 13.1398 24.9996C13.2523 25.1121 13.3155 25.2648 13.3155 25.4239V31.396C13.316 31.4754 13.3008 31.5543 13.2706 31.6278C13.2404 31.7014 13.196 31.7681 13.1398 31.8244C13.0836 31.8805 13.0168 31.9249 12.9433 31.9552C12.8697 31.9854 12.791 32.0005 12.7115 32Z"
                fill="currentColor"
              />
            </svg>
          </ComparationItem>
          <ComparationItem
            name="FormBold"
            plan="Free Plan"
            className="hidden md:flex"
            submissions="100 Submissions"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 32 32"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <path
                d="M32 0V32H12.3464V25.4967H25.9273V19.1656H12.3464V12.9206H25.9273V6.67563H6.15881V32H0V0H32Z"
                fill="currentColor"
              />
            </svg>
          </ComparationItem>
          <ComparationItem
            name="SlapForm"
            plan="Free Plan"
            className="hidden md:flex"
            submissions="50 Submissions"
          >
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 32 32"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <path
                d="M14.7544 31.6491L14.3333 31.4386V31.5088V31.5789L14.2632 31.4386C14.2632 31.3684 13.3509 30.9474 11.2456 29.7544C10.9649 29.614 9.35088 28.7719 7.66667 27.7895C5.91228 26.8772 4.22807 26.0351 3.94737 25.8246C3.59649 25.6842 3.24561 25.4737 3.17544 25.4035C3.10526 25.3333 2.96491 25.2632 2.89474 25.2632C2.61404 25.2632 1.70175 24.0702 1.5614 23.6491C1.5614 23.5789 1.49123 23.2982 1.49123 23.1579C1.42105 23.0175 1.42105 21.614 1.35088 20.0702V17.3333H1.2807V16.9825V16.5614H1.35088C1.35088 16.5614 1.77193 16.7719 2.19298 16.9825C2.61404 17.2632 3.59649 17.7544 4.29825 18.1053C5 18.5263 5.63158 18.8772 5.70175 18.8772C5.77193 18.9474 5.91228 19.0175 6.05263 19.0877L6.33333 19.2281V19.1579L6.40351 19.2281C6.47368 19.3684 7.73684 20 7.80702 19.9298H7.87719V20L7.80702 20.0702L8.50877 20.4211C8.92982 20.6316 9.2807 20.8421 9.35088 20.8421C9.35088 20.8421 9.70175 21.0526 10.1228 21.2632C11.386 21.9649 12.5789 22.5965 12.7193 22.6667C12.7895 22.7368 13.9123 23.2982 15.6667 24.2807L15.9474 24.4211V24.3509L16.0175 24.4211C16.0175 24.4211 16.2281 24.5614 16.4386 24.7018L16.8596 24.9123V24.8421L16.9298 24.9123C16.9298 24.9123 17.1404 25.0526 17.3509 25.193L17.7719 25.4035V25.3333L17.8421 25.4035C17.8421 25.4035 18.193 25.614 18.614 25.8246C19.4561 26.3158 19.807 26.5965 20.0877 27.1579C20.2281 27.5088 20.2982 27.6491 20.2982 28.1404C20.2982 28.7719 20.2281 29.1228 20.1579 29.2632C20.0175 29.4035 19.7368 29.8246 19.7368 29.8947C19.7368 29.8947 19.5263 30.1053 19.2456 30.2456C18.9649 30.386 18.6842 30.5965 18.6842 30.6667C18.614 30.6667 18.5439 30.7368 18.5439 30.7368C18.4737 30.7368 18.193 30.8772 17.8421 31.0877C17 31.6491 16.6491 31.7193 15.8772 31.7895C15.3158 31.7895 15.1053 31.7193 14.7544 31.6491ZM23.7368 27.2982C23.8772 27.0877 23.9474 26.8772 23.9474 26.807L23.8772 26.7368L23.9474 26.6667H24.0175V26.5965L23.9474 26.5263H24.0175C24.0877 26.4561 24.0877 25.6842 24.0175 25.2632L23.9474 24.9825H23.8772H23.807V24.9123C23.8772 24.8421 23.4561 24.2105 23.1754 24C22.9649 23.7895 20.5088 22.4561 20.3684 22.4561C20.2982 22.4561 20.2281 22.386 20.2281 22.386C20.1579 22.3158 19.0351 21.6842 18.0526 21.193C16.9298 20.5614 15.7368 19.9298 15.5965 19.8596C15.5263 19.7895 15.2456 19.6491 14.9649 19.5088C14.6842 19.3684 14.3333 19.1579 14.3333 19.1579L14.193 19.0175L15.3158 18.386C15.8772 17.9649 16.4386 17.614 16.5088 17.5439C16.5088 17.4737 16.5789 17.4737 16.6491 17.4737C16.6491 17.4737 17.2807 17.0526 20.2281 15.2982C20.9298 14.8772 20.9298 14.8772 21.2807 15.0877C21.4912 15.1579 23.1754 16.0702 25 17.0526C28.0877 18.7368 28.3684 18.8772 28.7895 19.2982C29.5614 20.0702 29.9825 21.1228 29.9123 22.1754C29.8421 22.807 29.8421 22.807 29.5614 23.2982C29.3509 23.7895 28.7895 24.3509 28.4386 24.5614C28.2982 24.7018 28.0175 24.8421 27.807 24.9825L27.386 25.2632L27.4561 25.3333H27.386C27.2456 25.3333 25.4211 26.4561 25.3509 26.5263V26.5965H25.2807C25.2105 26.5965 24.8596 26.807 24.4386 27.0877C23.9474 27.3684 23.5965 27.5789 23.5263 27.5789L23.4561 27.6491L23.7368 27.2982ZM8.92982 16.2807L8.15789 15.8596V15.9298V16L8.08772 15.8596C8.01754 15.7895 7.52632 15.4386 6.89474 15.1579C6.12281 14.7368 3.66667 13.4737 3.24561 13.193L2.89474 12.9825V13.0526L2.68421 12.9123C1.98246 12.3509 1.49123 11.7193 1.2807 11.0175C1.14035 10.5965 1.14035 10.386 1.14035 9.68421C1.21053 8.91228 1.21053 8.77193 1.35088 8.42105C1.63158 7.85965 2.05263 7.4386 2.47368 7.15789C2.68421 7.08772 2.82456 6.94737 2.82456 6.94737V6.87719H2.89474C2.96491 6.87719 3.31579 6.66667 3.66667 6.38596C4.4386 5.96491 4.4386 5.96491 5.14035 6.31579C5.5614 6.52632 5.91228 6.73684 5.91228 6.66667H5.98246V6.73684H5.91228L8.7193 8.2807C10.2632 9.12281 12.1579 10.1053 12.9298 10.5263C13.6316 10.9474 14.2632 11.2281 14.3333 11.2281H14.4035V11.2982C14.4035 11.2982 14.614 11.4386 14.8246 11.5789L15.2456 11.7895V11.7193L15.386 11.8596C15.5263 12 15.5965 12 15.7368 12C15.7368 12 15.807 12 15.807 12.0702C15.807 12.0702 16.0175 12.2105 16.2281 12.2807L16.5789 12.4912L16.5088 12.5614C16.5088 12.5614 15.3158 13.3333 13.9825 14.1754C10.2632 16.4211 9.8421 16.7018 9.77193 16.7018C9.77193 16.7018 9.35088 16.4912 8.92982 16.2807ZM28.5789 14.5965C28.0175 14.3158 27.4561 14.0351 27.4561 14.0351C27.386 14.0351 27.3158 13.9649 27.3158 13.9649C27.3158 13.9649 27.1053 13.8246 26.9649 13.7544C26.3333 13.4035 22.1228 11.0877 20.2982 10.1053C19.2456 9.54386 18.2632 9.05263 18.193 8.98246C18.1228 8.98246 17.2807 8.49123 16.4386 8.07018C9.42105 4.2807 9.70175 4.42105 8.29825 4.42105C7.66667 4.42105 7.31579 4.42105 7.03509 4.49123C6.82456 4.5614 6.61404 4.63158 6.61404 4.63158L7.03509 4.35088C7.31579 4.21053 8.08772 3.64912 8.85965 3.22807C9.63158 2.73684 10.2632 2.31579 10.2632 2.31579C10.2632 2.31579 10.3333 2.24561 10.4035 2.24561C10.4737 2.17544 10.9649 1.89474 11.4561 1.61404L12.4386 0.982456L12.3684 0.912281H12.4386C12.4386 0.982456 12.7895 0.77193 13.1404 0.561404C13.9825 0.0701754 14.2632 0 15.2456 0C16.1579 0.0701754 16.1579 0.0701754 16.7895 0.421053C17.1404 0.561404 17.4912 0.701754 17.5614 0.701754H17.6316V0.77193L17.5614 0.842105L20.3684 2.31579C21.9123 3.15789 23.1754 3.78947 23.2456 3.78947L23.3158 3.85965C23.3158 3.85965 23.9474 4.21053 24.7193 4.63158C25.4211 5.05263 26.0526 5.40351 26.1228 5.40351C26.193 5.47368 26.4035 5.54386 26.5439 5.61404L26.8947 5.82456V5.75439H26.9649V5.82456V5.89474H27.0351H27.1754V5.96491C27.1754 5.96491 27.4561 6.10526 27.7368 6.24561C28.0175 6.38596 28.3684 6.73684 28.5789 6.94737C28.9298 7.29825 29.3509 8 29.4912 8.35088C29.4912 8.5614 29.6316 11.0175 29.6316 13.3333L29.7018 15.1579H29.6316C29.6316 15.1579 29.1404 14.8772 28.5789 14.5965ZM1 10.0351V9.96491L1.07018 10.0351V10.1053V10.1754H1V10.0351Z"
                fill="currentColor"
              />
            </svg>
          </ComparationItem>
        </div>
      </section>
    </BlurFade>
  );
};

interface ItemProps {
  children: React.ReactNode;
  submissions: string;
  className?: string;
  name: string;
  plan: string;
}

export const ComparationItem = (props: ItemProps) => (
  <div className={cn('flex flex-col items-center', props.className)}>
    {props.children}
    <h4 className="mt-4 font-semibold text-lg">{props.name}</h4>
    <p className="mt-2 font-secondary font-medium text-neutral-600 dark:text-neutral-400">
      {props.submissions}
    </p>
    <p className="mt-1 font-secondary text-neutral-600 dark:text-neutral-400">
      {props.plan}
    </p>
  </div>
);
