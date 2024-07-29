# Contributing to Formizee

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change. 

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.

2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, new packages, useful file locations and container parameters.

3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

## Specific Guides

### Updating the domain of Formizee

To make sure that all the packages and apps are aware of new changes on the domain level, please
follow the next steps.

**`packages/domain`**
- Make your change on the domain package.

**`apps/api`**
- If the change affects to the domain models, update the `openapi` schemas.
- If the change affects to the database, update the `drizzle` schemas.
- Check the `lib/models`, which contains the transformer code for the models.
- Update the affected `data` and `useCases` implementation by domain
- If the change affects to a current Api route, update the `routes` schemas and definitions.
