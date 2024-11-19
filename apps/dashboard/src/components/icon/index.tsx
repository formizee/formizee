import {
  BeakerIcon,
  BellIcon,
  BoltIcon,
  BookIcon,
  BookmarkIcon,
  BugIcon,
  CalendarIcon,
  CartIcon,
  ChatIcon,
  CheckIcon,
  CloudIcon,
  CodeIcon,
  ConsoleIcon,
  CreditCardIcon,
  CubeIcon,
  DatabaseIcon,
  DocumentChartIcon,
  DocumentIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FlagIcon,
  GiftIcon,
  GridIcon,
  HeartIcon,
  InboxIcon,
  LightbulbIcon,
  MailIcon,
  MapsIcon,
  MoonIcon,
  MusicIcon,
  PaintIcon,
  RocketIcon,
  SchoolIcon,
  ServerIcon,
  StackIcon,
  StarIcon,
  SunIcon,
  ToolsIcon,
  UserGroupIcon,
  VideoIcon
} from '@formizee/ui/icons';
import {cn} from '@formizee/ui';
import {type Color, getColor} from '@/lib/colors';

export const Icon = (props: {
  icon: string;
  color: Color;
  selected: boolean;
  className?: string;
}) => {
  const color = getColor(props.color, props.selected).fill;

  switch (props.icon) {
    case 'sun':
      return <SunIcon className={cn(props.className, color)} />;
    case 'bug':
      return <BugIcon className={cn(props.className, color)} />;
    case 'flag':
      return <FlagIcon className={cn(props.className, color)} />;
    case 'bolt':
      return <BoltIcon className={cn(props.className, color)} />;
    case 'bell':
      return <BellIcon className={cn(props.className, color)} />;
    case 'cube':
      return <CubeIcon className={cn(props.className, color)} />;
    case 'mail':
      return <MailIcon className={cn(props.className, color)} />;
    case 'book':
      return <BookIcon className={cn(props.className, color)} />;
    case 'chat':
      return <ChatIcon className={cn(props.className, color)} />;
    case 'grid':
      return <GridIcon className={cn(props.className, color)} />;
    case 'moon':
      return <MoonIcon className={cn(props.className, color)} />;
    case 'cart':
      return <CartIcon className={cn(props.className, color)} />;
    case 'gift':
      return <GiftIcon className={cn(props.className, color)} />;
    case 'code':
      return <CodeIcon className={cn(props.className, color)} />;
    case 'maps':
      return <MapsIcon className={cn(props.className, color)} />;
    case 'start':
      return <StarIcon className={cn(props.className, color)} />;
    case 'heart':
      return <HeartIcon className={cn(props.className, color)} />;
    case 'stack':
      return <StackIcon className={cn(props.className, color)} />;
    case 'inbox':
      return <InboxIcon className={cn(props.className, color)} />;
    case 'tools':
      return <ToolsIcon className={cn(props.className, color)} />;
    case 'cloud':
      return <CloudIcon className={cn(props.className, color)} />;
    case 'music':
      return <MusicIcon className={cn(props.className, color)} />;
    case 'video':
      return <VideoIcon className={cn(props.className, color)} />;
    case 'paint':
      return <PaintIcon className={cn(props.className, color)} />;
    case 'lightbulb':
      return <LightbulbIcon className={cn(props.className, color)} />;
    case 'server':
      return <ServerIcon className={cn(props.className, color)} />;
    case 'beaker':
      return <BeakerIcon className={cn(props.className, color)} />;
    case 'school':
      return <SchoolIcon className={cn(props.className, color)} />;
    case 'rocket':
      return <RocketIcon className={cn(props.className, color)} />;
    case 'console':
      return <ConsoleIcon className={cn(props.className, color)} />;
    case 'bookmark':
      return <BookmarkIcon className={cn(props.className, color)} />;
    case 'database':
      return <DatabaseIcon className={cn(props.className, color)} />;
    case 'calendar':
      return <CalendarIcon className={cn(props.className, color)} />;
    case 'file-chart':
      return <DocumentChartIcon className={cn(props.className, color)} />;
    case 'user-group':
      return <UserGroupIcon className={cn(props.className, color)} />;
    case 'face-smile':
      return <FaceSmileIcon className={cn(props.className, color)} />;
    case 'face-frown':
      return <FaceFrownIcon className={cn(props.className, color)} />;
    case 'credit-card':
      return <CreditCardIcon className={cn(props.className, color)} />;
    case 'checkcircle':
      return (
        <CheckIcon variant="outline" className={cn(props.className, color)} />
      );
    default:
      return <DocumentIcon className={cn(props.className, color)} />;
  }
};
