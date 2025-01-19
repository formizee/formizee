import {
  BellIcon,
  CalendarIcon,
  ChatIcon,
  CheckIcon,
  CreditCardIcon,
  DocumentChartIcon,
  DocumentIcon,
  FlagIcon,
  GiftIcon,
  GridIcon,
  HomeIcon,
  KeyIcon,
  LinkIcon,
  LockIcon,
  MailIcon,
  MapsIcon,
  MoonIcon,
  RocketIcon,
  StackIcon,
  UserGroupIcon,
  UserIcon
} from '@formizee/ui/icons';

export const Icon = (props: {icon: unknown; className?: string}) => {
  if (typeof props.icon !== 'string') {
    return <></>;
  }

  let value = '';
  try {
    value = String(props.icon).toLowerCase();
  } catch {}

  switch (value) {
    case 'id':
      return <KeyIcon className={props.className} />;

    // User Information common fields
    case 'name':
      return <UserIcon className={props.className} />;
    case 'first_name':
      return <UserIcon className={props.className} />;
    case 'last_name':
      return <UserIcon className={props.className} />;
    case 'full_name':
      return <UserIcon className={props.className} />;
    case 'username':
      return <UserIcon className={props.className} />;
    case 'password':
      return <LockIcon className={props.className} />;
    case 'email':
      return <MailIcon className={props.className} />;
    case 'phone':
      return <ChatIcon className={props.className} />;
    case 'phone_number':
      return <ChatIcon className={props.className} />;
    case 'alternate_phone':
      return <ChatIcon className={props.className} />;
    case 'contact_method':
      return <ChatIcon className={props.className} />;
    case 'dob':
      return <CalendarIcon className={props.className} />;
    case 'address':
      return <HomeIcon className={props.className} />;
    case 'gender':
      return <UserGroupIcon className={props.className} />;

    // Contact Information common fields
    case 'street_address':
      return <HomeIcon className={props.className} />;
    case 'city':
      return <MapsIcon className={props.className} />;
    case 'state':
      return <MapsIcon className={props.className} />;
    case 'zip_code':
      return <MapsIcon className={props.className} />;
    case 'country':
      return <MapsIcon className={props.className} />;
    case 'company':
      return <StackIcon className={props.className} />;
    case 'company_name':
      return <StackIcon className={props.className} />;
    case 'website':
      return <LinkIcon className={props.className} />;
    case 'website_url':
      return <LinkIcon className={props.className} />;
    case 'url':
      return <LinkIcon className={props.className} />;

    // Payment Details common fields
    case 'credit_card_number':
      return <CreditCardIcon className={props.className} />;
    case 'cardholder_name':
      return <CreditCardIcon className={props.className} />;
    case 'expiration_date':
      return <CalendarIcon className={props.className} />;
    case 'cvv':
      return <LockIcon className={props.className} />;
    case 'billing_address':
      return <HomeIcon className={props.className} />;
    case 'payment_method':
      return <CreditCardIcon className={props.className} />;
    case 'paypal_email':
      return <MailIcon className={props.className} />;
    case 'bank_account':
      return <CreditCardIcon className={props.className} />;
    case 'routing_number':
      return <CreditCardIcon className={props.className} />;
    case 'invoice_number':
      return <DocumentChartIcon className={props.className} />;

    // Preferences common fields
    case 'currency':
      return <CreditCardIcon className={props.className} />;
    case 'subscription_plan':
      return <GiftIcon className={props.className} />;
    case 'newsletter_opt_in':
      return <MailIcon className={props.className} />;
    case 'communication_preference':
      return <ChatIcon className={props.className} />;
    case 'notification_settings':
      return <BellIcon className={props.className} />;
    case 'dark_mode':
      return <MoonIcon className={props.className} />;

    // Business Forms common fields
    case 'job_title':
      return <UserIcon className={props.className} />;
    case 'department':
      return <GridIcon className={props.className} />;
    case 'employee_id':
      return <CheckIcon className={props.className} />;
    case 'manager_name':
      return <UserIcon className={props.className} />;
    case 'project_name':
      return <RocketIcon className={props.className} />;
    case 'budget':
      return <CreditCardIcon className={props.className} />;
    case 'start_date':
      return <CalendarIcon className={props.className} />;
    case 'end_date':
      return <CalendarIcon className={props.className} />;
    case 'priority_level':
      return <FlagIcon className={props.className} />;
    case 'comments':
      return <ChatIcon className={props.className} />;
    case 'message':
      return <ChatIcon className={props.className} />;

    // Other common fields
    case 'terms_agreed':
      return <CheckIcon className={props.className} />;
    case 'captcha':
      return <LockIcon className={props.className} />;

    // File fields
    case 'attachment':
      return <DocumentIcon className={props.className} />;
    case 'file':
      return <DocumentIcon className={props.className} />;

    default:
      return <></>;
  }
};
