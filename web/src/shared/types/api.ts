// Hand-typed mirror of src/core/graphql/shema.gql.
// Regenerate by hand when schema changes; codegen optional later.

export type ID = string;
export type DateTimeISO = string;

export enum NotificationType {
  ENABLE_TWO_FACTOR = 'ENABLE_TWO_FACTOR',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_SPONSORSHIP = 'NEW_SPONSORSHIP',
  STREAM_START = 'STREAM_START',
  VERIFIED_CHANNEL = 'VERIFIED_CHANNEL',
}

export enum TransactionStatus {
  EXPIRES = 'EXPIRES',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
}

// --- Models ---------------------------------------------------------------

export interface UserModel {
  id: ID;
  email: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  isDeactivated: boolean;
  deactivatedAt: DateTimeISO | null;
  isEmailVerified: boolean;
  isTotpEnabled: boolean;
  isVerified: boolean;
  telegramId: string | null;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
  stream?: StreamModel | null;
  socialLinks?: SocialLinkModel[];
  followers?: FollowModel[];
  followings?: FollowModel[];
  notifications?: NotificationModel[];
  notificationSettings?: NotificationSettingsModel;
}

export interface CategoryModel {
  id: ID;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
  streams?: StreamModel[];
}

export interface StreamModel {
  id: ID;
  title: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  isChatPremiumFollowersOnly: boolean;
  ingressId: string | null;
  serverUrl: string | null;
  streamKey: string | null;
  userId: ID;
  user: UserModel;
  categoryId: ID;
  category: CategoryModel;
  chatMessages?: ChatMessageModel[];
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface ChatMessageModel {
  id: ID;
  text: string;
  userId: ID;
  user: UserModel;
  streamId: ID;
  stream?: StreamModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface FollowModel {
  id: ID;
  followerId: ID;
  follower: UserModel;
  followingId: ID;
  following: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface SocialLinkModel {
  id: ID;
  title: string;
  url: string;
  position: number;
  userId: ID;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface NotificationModel {
  id: ID;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: ID;
  user: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface NotificationSettingsModel {
  id: ID;
  siteNotifications: boolean;
  telegramNotifications: boolean;
  userId: ID;
  user: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface ChangeNotificationsSettingsResponse {
  notificationSettings: NotificationSettingsModel;
  telegramAuthToken: string | null;
}

export interface PlanModel {
  id: ID;
  title: string;
  description: string | null;
  price: number;
  stripeProductId: string;
  stripePlanId: string;
  channelId: ID;
  channel: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface SubscriptionModel {
  id: ID;
  expiresAt: DateTimeISO;
  planId: ID;
  plan: PlanModel;
  userId: ID;
  user: UserModel;
  channelId: ID;
  channel: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface TransactionModel {
  id: ID;
  amount: number;
  currency: string;
  stripeSubscriptionId: string;
  status: TransactionStatus;
  userId: ID;
  user: UserModel;
  createdAt: DateTimeISO;
  updatedAt: DateTimeISO;
}

export interface MakePaymentModel {
  url: string;
}

export interface DeviceModel {
  browser: string;
  os: string;
  type: string;
}

export interface LocationModel {
  city: string;
  country: string;
  latidute: number;
  longitude: number;
}

export interface SessionMetadataModel {
  device: DeviceModel;
  ip: string;
  location: LocationModel;
}

export interface SessionModel {
  id: ID;
  userId: ID;
  createdAt: string;
  metadata: SessionMetadataModel;
}

export interface TotpModel {
  qrcodeUrl: string;
  secret: string;
}

export interface GenerateStreamTokenModel {
  token: string;
}

export interface AuthModel {
  message: string | null;
  user: UserModel | null;
}

// --- Inputs ---------------------------------------------------------------

export interface CreateUserInput {
  email: string;
  password: string;
  username: string;
}

export interface LoginInput {
  login: string;
  password: string;
  pin?: string | null;
}

export interface ChangeEmailInput {
  email: string;
}

export interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeInfoInput {
  bio: string;
  displayName: string;
  username: string;
}

export interface ChangeStreamInfoInput {
  title: string;
  categoryId: string;
}

export interface ChangeChatSettingsInput {
  isChatEnabled: boolean;
  isChatFollowersOnly: boolean;
  isChatPremiumFollowersOnly: boolean;
}

export interface ChangeNotificationsSettingsInput {
  siteNotifications: boolean;
  telegramNotifications: boolean;
}

export interface CreatePlanInput {
  title: string;
  description?: string | null;
  price: number;
}

export interface DeactivateAccountInput {
  email: string;
  password: string;
  pin?: string | null;
}

export interface EnableTotpInput {
  secret: string;
  pin: string;
}

export interface FiltersInput {
  searchTerm?: string | null;
  skip?: number | null;
  take?: number | null;
}

export interface NewPasswordInput {
  token: string;
  password: string;
  passwordRepeat: string;
}

export interface ResetPasswordInput {
  email: string;
}

export interface SendMessageInput {
  streamId: string;
  text: string;
}

export interface SocialLinkInput {
  title: string;
  url: string;
}

export interface SocialLinkOrderInput {
  id: string;
  position: number;
}

export interface VerificationInput {
  token: string;
}

export interface GenerateStreamTokenInput {
  channelId: string;
  userId: string;
}
