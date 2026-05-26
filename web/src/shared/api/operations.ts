// All GraphQL operation strings live here. One source of truth for backend surface.
// Mirrors src/core/graphql/shema.gql exactly.

// --- Fragments ------------------------------------------------------------

export const USER_CORE_FRAGMENT = /* GraphQL */ `
  fragment UserCore on UserModel {
    id
    username
    displayName
    avatar
    bio
    email
    isVerified
    isEmailVerified
    isTotpEnabled
    isDeactivated
    telegramId
    createdAt
  }
`;

export const STREAM_CORE_FRAGMENT = /* GraphQL */ `
  fragment StreamCore on StreamModel {
    id
    title
    thumbnailUrl
    isLive
    isChatEnabled
    isChatFollowersOnly
    isChatPremiumFollowersOnly
    userId
    categoryId
    createdAt
  }
`;

// --- Queries --------------------------------------------------------------

export const QUERY_PROFILE = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  ${STREAM_CORE_FRAGMENT}
  query FindProfile {
    findProfile {
      ...UserCore
      stream {
        ...StreamCore
        category {
          id
          title
          slug
        }
      }
      socialLinks {
        id
        title
        url
        position
      }
      notificationSettings {
        id
        siteNotifications
        telegramNotifications
      }
    }
  }
`;

export const QUERY_FIND_ALL_CATEGORIES = /* GraphQL */ `
  query FindAllCategories {
    findAllCategories {
      id
      title
      slug
      description
      thumbnailUrl
    }
  }
`;

export const QUERY_FIND_RANDOM_CATEGORIES = /* GraphQL */ `
  query FindRandomCategories {
    findRandomCategories {
      id
      title
      slug
      thumbnailUrl
    }
  }
`;

export const QUERY_FIND_CATEGORY_BY_SLUG = /* GraphQL */ `
  ${STREAM_CORE_FRAGMENT}
  ${USER_CORE_FRAGMENT}
  query FindCategoryBySlug($slug: String!) {
    findCategoryBySlug(slug: $slug) {
      id
      title
      slug
      description
      thumbnailUrl
      streams {
        ...StreamCore
        user {
          ...UserCore
        }
      }
    }
  }
`;

export const QUERY_FIND_ALL_STREAMS = /* GraphQL */ `
  ${STREAM_CORE_FRAGMENT}
  ${USER_CORE_FRAGMENT}
  query FindAllStreams($filters: FiltersInput!) {
    findAllStreams(filters: $filters) {
      ...StreamCore
      user {
        ...UserCore
      }
      category {
        id
        title
        slug
        thumbnailUrl
      }
    }
  }
`;

export const QUERY_FIND_RANDOM_STREAMS = /* GraphQL */ `
  ${STREAM_CORE_FRAGMENT}
  ${USER_CORE_FRAGMENT}
  query FindRandomStreams {
    findRandomStreams {
      ...StreamCore
      user {
        ...UserCore
      }
      category {
        id
        title
        slug
      }
    }
  }
`;

export const QUERY_FIND_RECOMMENDED_CHANNELS = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  ${STREAM_CORE_FRAGMENT}
  query FindRecommendedChannels {
    findRecommendedChannels {
      ...UserCore
      stream {
        ...StreamCore
      }
    }
  }
`;

export const QUERY_FIND_CHANNEL_BY_USERNAME = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  ${STREAM_CORE_FRAGMENT}
  query FindChannelByUsername($username: String!) {
    findChannelByUsername(username: $username) {
      ...UserCore
      stream {
        ...StreamCore
        category {
          id
          title
          slug
        }
      }
      socialLinks {
        id
        title
        url
        position
      }
    }
  }
`;

export const QUERY_FIND_FOLLOWERS_COUNT_BY_CHANNEL = /* GraphQL */ `
  query FindFollowersCountByChannel($channelId: String!) {
    findFollowersCountByChannel(channelId: $channelId)
  }
`;

export const QUERY_FIND_SPONSORS_BY_CHANNEL = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  query FindSponsorsByChannel($channelId: String!) {
    findSponsorsByChannel(channelId: $channelId) {
      id
      expiresAt
      user {
        ...UserCore
      }
      plan {
        id
        title
        price
      }
    }
  }
`;

export const QUERY_FIND_CHAT_MESSAGES = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  query FindChatMessageByStream($streamId: String!) {
    findChatMessageByStream(streamId: $streamId) {
      id
      text
      streamId
      createdAt
      user {
        ...UserCore
      }
    }
  }
`;

export const QUERY_FIND_MY_FOLLOWERS = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  query FindMyFollowers {
    findMyFollowers {
      id
      createdAt
      follower {
        ...UserCore
      }
    }
  }
`;

export const QUERY_FIND_MY_FOLLOWINGS = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  ${STREAM_CORE_FRAGMENT}
  query FindMyFollowings {
    findMyFollowings {
      id
      createdAt
      following {
        ...UserCore
        stream {
          ...StreamCore
        }
      }
    }
  }
`;

export const QUERY_IS_FOLLOWING = /* GraphQL */ `
  query IsFollowing($channelId: String!) {
    isFollowing(channelId: $channelId)
  }
`;

export const QUERY_FIND_MY_PLANS = /* GraphQL */ `
  query FindMySponsorshipPlans {
    findMySponsorshipPlans {
      id
      title
      description
      price
      createdAt
    }
  }
`;

export const QUERY_FIND_MY_SPONSORS = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  query FindMySponsors {
    findMySponsors {
      id
      expiresAt
      user {
        ...UserCore
      }
      plan {
        id
        title
        price
      }
    }
  }
`;

export const QUERY_FIND_MY_TRANSACTIONS = /* GraphQL */ `
  query FindMyTransactions {
    findMyTransactions {
      id
      amount
      currency
      status
      stripeSubscriptionId
      createdAt
    }
  }
`;

export const QUERY_FIND_NOTIFICATIONS = /* GraphQL */ `
  query FindNotificationsByUser {
    findNotificationsByUser {
      id
      message
      type
      isRead
      createdAt
    }
  }
`;

export const QUERY_FIND_NOTIFICATIONS_UNREAD_COUNT = /* GraphQL */ `
  query FindNotificationsUnreadCount {
    findNotificationsUnreadCount
  }
`;

export const QUERY_FIND_SOCIAL_LINKS = /* GraphQL */ `
  query FindSocialLinks {
    findSocialLinks {
      id
      title
      url
      position
    }
  }
`;

export const QUERY_FIND_SESSIONS = /* GraphQL */ `
  query FindSessionsByUser {
    findSessionsByUser {
      id
      userId
      createdAt
      metadata {
        ip
        device {
          browser
          os
          type
        }
        location {
          city
          country
          latidute
          longitude
        }
      }
    }
  }
`;

export const QUERY_FIND_CURRENT_SESSION = /* GraphQL */ `
  query FindCurrentSession {
    findCurrentSession {
      id
      userId
      createdAt
      metadata {
        ip
        device {
          browser
          os
          type
        }
        location {
          city
          country
          latidute
          longitude
        }
      }
    }
  }
`;

export const QUERY_GENERATE_TOTP_SECRET = /* GraphQL */ `
  query GenerateTotpSecret {
    generateTotpSecret {
      secret
      qrcodeUrl
    }
  }
`;

// --- Mutations ------------------------------------------------------------

export const MUT_CREATE_USER = /* GraphQL */ `
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data)
  }
`;

export const MUT_LOGIN_USER = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  mutation LoginUser($data: LoginInput!) {
    loginUser(data: $data) {
      message
      user {
        ...UserCore
      }
    }
  }
`;

export const MUT_LOGOUT_USER = /* GraphQL */ `
  mutation LogoutUser {
    logoutUser
  }
`;

export const MUT_CLEAR_SESSION = /* GraphQL */ `
  mutation ClearSessionCookie {
    clearSessionCookie
  }
`;

export const MUT_REMOVE_SESSION = /* GraphQL */ `
  mutation RemoveSession($id: String!) {
    removeSession(id: $id)
  }
`;

export const MUT_VERIFY_ACCOUNT = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  mutation VerifyAccount($data: VerificationInput!) {
    verifyAccount(data: $data) {
      ...UserCore
    }
  }
`;

export const MUT_CHANGE_EMAIL = /* GraphQL */ `
  mutation ChangeEmail($data: ChangeEmailInput!) {
    changeEmail(data: $data)
  }
`;

export const MUT_CHANGE_PASSWORD = /* GraphQL */ `
  mutation ChangePassword($data: ChangePasswordInput!) {
    changePassword(data: $data)
  }
`;

export const MUT_CHANGE_PROFILE_INFO = /* GraphQL */ `
  mutation ChangeProfileInfo($data: ChangeInfoInput!) {
    changeProfileInfo(data: $data)
  }
`;

export const MUT_RESET_PASSWORD = /* GraphQL */ `
  mutation ResetPassword($data: ResetPasswordInput!) {
    resetPassword(data: $data)
  }
`;

export const MUT_NEW_PASSWORD = /* GraphQL */ `
  mutation NewPassword($data: NewPasswordInput!) {
    newPassword(data: $data)
  }
`;

export const MUT_ENABLE_TOTP = /* GraphQL */ `
  mutation EnableTotp($data: EnableTotpInput!) {
    enableTotp(data: $data)
  }
`;

export const MUT_DISABLE_TOTP = /* GraphQL */ `
  mutation DisableTotp {
    disableTotp
  }
`;

export const MUT_DEACTIVATE_ACCOUNT = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  mutation DeactivateAccount($data: DeactivateAccountInput!) {
    deactivateAccount(data: $data) {
      message
      user {
        ...UserCore
      }
    }
  }
`;

export const MUT_FOLLOW_CHANNEL = /* GraphQL */ `
  mutation FollowChannel($channelId: String!) {
    followChannel(channelId: $channelId)
  }
`;

export const MUT_UNFOLLOW_CHANNEL = /* GraphQL */ `
  mutation UnfollowChannel($channelId: String!) {
    unfollowChannel(channelId: $channelId)
  }
`;

export const MUT_SEND_CHAT_MESSAGE = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  mutation SendChatMessage($data: SendMessageInput!) {
    sendChatMessage(data: $data) {
      id
      text
      streamId
      createdAt
      user {
        ...UserCore
      }
    }
  }
`;

export const MUT_CHANGE_CHAT_SETTINGS = /* GraphQL */ `
  mutation ChangeChatSettings($data: ChangeChatSettingsInput!) {
    changeChatSettings(data: $data)
  }
`;

export const MUT_CHANGE_STREAM_INFO = /* GraphQL */ `
  mutation ChangeStreamInfo($data: ChangeStreamInfoInput!) {
    changeStreamInfo(data: $data)
  }
`;

export const MUT_GENERATE_STREAM_TOKEN = /* GraphQL */ `
  mutation GenerateStreamToken($data: GenerateStreamTokenInput!) {
    generateStreamToken(data: $data) {
      token
    }
  }
`;

export const MUT_CREATE_INGRESS = /* GraphQL */ `
  mutation CreateIngress($ingressType: Float!) {
    createIngress(ingressType: $ingressType)
  }
`;

export const MUT_CREATE_PLAN = /* GraphQL */ `
  mutation CreateSponsorshipPlan($data: CreatePlanInput!) {
    createSponsorshipPlan(data: $data)
  }
`;

export const MUT_REMOVE_PLAN = /* GraphQL */ `
  mutation RemoveSponsorshipPlan($planId: String!) {
    removeSponsorshipPlan(planId: $planId)
  }
`;

export const MUT_MAKE_PAYMENT = /* GraphQL */ `
  mutation MakePayment($planId: String!) {
    makePayment(planId: $planId) {
      url
    }
  }
`;

export const MUT_CHANGE_NOTIFICATIONS_SETTINGS = /* GraphQL */ `
  mutation ChangeNotificationsSettings($data: ChangeNotificationsSettingsInput!) {
    changeNotificationsSettings(data: $data) {
      notificationSettings {
        id
        siteNotifications
        telegramNotifications
      }
      telegramAuthToken
    }
  }
`;

export const MUT_CREATE_SOCIAL_LINK = /* GraphQL */ `
  mutation CreateSocialLink($data: SocialLinkInput!) {
    createSocialLink(data: $data)
  }
`;

export const MUT_UPDATE_SOCIAL_LINK = /* GraphQL */ `
  mutation UpdateSocialLink($id: String!, $data: SocialLinkInput!) {
    updateSocialLink(id: $id, data: $data)
  }
`;

export const MUT_REMOVE_SOCIAL_LINK = /* GraphQL */ `
  mutation RemoveSocialLink($id: String!) {
    removeSocialLink(id: $id)
  }
`;

export const MUT_REORDER_SOCIAL_LINKS = /* GraphQL */ `
  mutation ReorderSocialLink($list: [SocialLinkOrderInput!]!) {
    reorderSocialLink(list: $list)
  }
`;

// --- Subscriptions --------------------------------------------------------

export const SUB_CHAT_MESSAGE_ADDED = /* GraphQL */ `
  ${USER_CORE_FRAGMENT}
  subscription ChatMessageAdded($streamId: String!) {
    chatMessageAdded(streamId: $streamId) {
      id
      text
      streamId
      createdAt
      user {
        ...UserCore
      }
    }
  }
`;
