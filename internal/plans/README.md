# Billing

Here is defined all the plans and pricing of Formizee.
This package is inspired by the `@openstatus/plans` package from our OSS friend [OpenStatus](https://openstatus.dev).

## Usage

### Get a single property
```typescript
import {getLimit} from '@formizee/billing';

const submissionsHobbyPlanLimit = getLimit("hobby", "submissions");
```

### Get all the plan properties
```typescript
import {getLimits} from '@formizee/billing';

const hobbyPlanLimits = getLimits("hobby");
```

### Get the metadata also
```typescript
import {getPlanConfig} from '@formizee/billing';

const hobbyPlan = getPlanConfig("hobby");
```
