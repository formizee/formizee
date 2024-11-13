import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@formizee/ui';

import type {Route} from './pages';

interface Props {
  route: Route;
}

export const SettingsBreadcrumb = (props: Props) => {
  const routes = props.route.split('.');

  return (
    <Breadcrumb className="absolute bg-neutral-50/40 backdrop-blur dark:bg-neutral-950/40 top-0 left-0 w-full p-4">
      <BreadcrumbList>
        {routes.map((route, index) => {
          const name = route.charAt(0).toUpperCase() + route.slice(1);

          if (routes.length - 1 > index) {
            return (
              <>
                <BreadcrumbItem
                  className="text-neutral-600 dark:text-neutral-400"
                  key={name}
                >
                  {name}
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
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
