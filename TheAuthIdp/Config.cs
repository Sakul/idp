// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using IdentityServer4;
using IdentityServer4.Models;
using System.Collections.Generic;

namespace TheAuthIdp
{
    public static class Config
    {
        public static IEnumerable<IdentityResource> IdentityResources =>
            new IdentityResource[]
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResource("mana3rd", new[] { "refid" }),
            };

        public static IEnumerable<ApiScope> ApiScopes =>
            new ApiScope[]
            {
                new ApiScope("scope1"),
                new ApiScope("scope2"),
                new ApiScope("api1"),
            };

        public static IEnumerable<Client> Clients =>
            new Client[]
            {
                // m2m client credentials flow client
                new Client
                {
                    ClientId = "m2m.client",
                    ClientName = "Client Credentials Client",

                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets = { new Secret("511536EF-F270-4058-80CA-1C89C192F69A".Sha256()) },

                    AllowedScopes = { "scope1" }
                },

                // interactive client using code flow + pkce
                new Client
                {
                    ClientId = "interactive",
                    ClientSecrets = { new Secret("49C1A7E1-0C79-4A89-A3D6-A37998FB86B0".Sha256()) },

                    AllowedGrantTypes = GrantTypes.Code,

                    RedirectUris = { "https://localhost:44300/signin-oidc" },
                    FrontChannelLogoutUri = "https://localhost:44300/signout-oidc",
                    PostLogoutRedirectUris = { "https://localhost:44300/signout-callback-oidc" },

                    AllowOfflineAccess = true,
                    AllowedScopes = { "openid", "profile", "scope2" }
                },

                // web api access via web app (mvc)
                new Client
                {
                    ClientId = "mvc",
                    ClientSecrets = { new Secret("secret".Sha256()) },

                    AllowedGrantTypes = GrantTypes.Code,

                    // where to redirect to after login
                    RedirectUris = 
                    {
                        "https://localhost:44364/signin-oidc",
                        "https://aumvc.azurewebsites.net/signin-oidc",
                        "https://sandapim.azurewebsites.net/signin-oidc",
                        "https://localhost:44382/signin-oidc",
                        "https://localhost:5000/signin-oidc",
                    },

                    // where to redirect to after logout
                    PostLogoutRedirectUris = 
                    { 
                        "https://localhost:44364/signout-callback-oidc",
                        "https://aumvc.azurewebsites.net/signout-callback-oidc",
                        "https://sandapim.azurewebsites.net/signout-callback-oidc",
                        "https://localhost:44382/signout-callback-oidc",
                        "https://localhost:5000/signout-callback-oidc",
                    },

                    AllowOfflineAccess = true,

                    AlwaysIncludeUserClaimsInIdToken = true,

                    //RefreshTokenUsage = TokenUsage.OneTimeOnly,
                    //AccessTokenLifetime = 3600,
                    //AbsoluteRefreshTokenLifetime = 7200,

                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        "api1",
                        "mana3rd",
                    }
                }
            };
    }
}