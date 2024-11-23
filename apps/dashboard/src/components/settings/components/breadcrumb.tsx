import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@formizee/ui';

import type {Route} from '../pages';

interface Props {
  route: Route;
}

export const SettingsBreadcrumb = (props: Props) => {
  const routes = props.route.split('.');

  return (
    <Breadcrumb className="z-50 absolute h-12 items-center flex backdrop-blur bg-white/70 dark:bg-neutral-950/50 top-0 px-4 w-[80%]">
      <BreadcrumbList className="no-wrap">
        {routes.map((route, index) => {
          const name = route.charAt(0).toUpperCase() + route.slice(1);

          if (routes.length - 1 > index) {
            return (
              <div className="flex flex-row gap-2 items-center" key={name}>
                <BreadcrumbItem className="text-neutral-600 dark:text-neutral-400">
                  {name}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </div>
            );
          }

          return (
            <BreadcrumbItem className="font-medium" key={name}>
              {name}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
