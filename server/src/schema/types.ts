import gql from "graphql-tag";

export default gql`
  type User {
    id: ID!
    email: String!
    roles: [Role!]!
  }
  type Role {
    id: ID!
    name: String!
    users: [User!]!
    subroles: [Subrole!]!
  }
  type Host {
    id: ID!
    name: String!
    hostname: String!
    subroles: [Subrole!]!
    fingerprint: String
  }
  type Subrole {
    id: ID!
    username: String!
    role: Role!
    host: Host!
  }
  input SubroleInput {
    username: String!
    hostId: ID!
  }
  type AuthPayload {
    id: String!
  }
  type DeletionReturn {
    id: ID!
  }
  type HostVerification {
    createdAt: Float!
    fingerprint: ID!
  }
  type HostPrincipal {
    username: String!
    id: ID!
  }
  type Query {
    allRoles: [Role!]!
    allHosts: [Host!]!
    allUsers: [User!]!
    user(id: ID!): User
    role(id: ID!): Role
    host(id: ID!): Host
    hostVerificationStatus(id: ID!): HostVerification!
    isFirstUser: Boolean!
    key: String!
    hostPrincipals(key: String!): [HostPrincipal!]!
  }
  type Mutation {
    generateKey(key: String!): String!
    generateHostKey(key: String!): String!
    requestHostVerification(key: String!): ID!
    completeHostVerification(id: ID!, hostId: ID!, accepted: Boolean!): ID!
    login(email: String!, password: String!): AuthPayload
    firstUser(email: String!, password: String!): AuthPayload
    createHost(name: String!, hostname: String!): Host
    createUser(email: String!, password: String!): User
    createRole(name: String!, subroles: [SubroleInput!]!): Role
    deleteHost(id: ID!): DeletionReturn
    deleteUser(id: ID!): DeletionReturn
    deleteRole(id: ID!): DeletionReturn
    editUserRoles(id: ID!, roleIds: [ID!]!): User
    editRoleUsers(id: ID!, userIds: [ID!]!): Role
  }
`;
