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
    <Breadcrumb className="p-4">
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
