using IdentityModel.Client;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace TheWebMvc.Controllers
{
    [Route("mobileauth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpGet("login")]
        public async Task Login()
        {
            var auth = await Request.HttpContext.AuthenticateAsync("oidc");

            if (!auth.Succeeded
                || auth?.Principal == null
                || !auth.Principal.Identities.Any(id => id.IsAuthenticated)
                || string.IsNullOrEmpty(auth.Properties.GetTokenValue("access_token")))
            {
                // Not authenticated, challenge
                await Request.HttpContext.ChallengeAsync("oidc");
            }
            else
            {
                var ref_id = User?.Claims?.Where(it => it.Type == "refid")?.FirstOrDefault()?.Value ?? null;
                var ba_id = User?.Claims?.Where(it => it.Type == "baid")?.FirstOrDefault()?.Value ?? null;
                var qs = new Dictionary<string, string>();
                if (!string.IsNullOrWhiteSpace(ref_id) && !string.IsNullOrWhiteSpace(ba_id))
                {
                    // Get parameters to send back to the callback
                    qs = new Dictionary<string, string>
                        {
                            { "status", "success" },
                            { "access_token", auth.Properties.GetTokenValue("access_token") },
                            { "refresh_token", auth.Properties.GetTokenValue("refresh_token") ?? string.Empty },
                            { "ref_id", User?.Claims?.Where(it => it.Type == "refid")?.FirstOrDefault()?.Value ?? ""},
                            { "ba_id", User?.Claims?.Where(it=>it.Type=="baid")?.FirstOrDefault()?.Value ?? "" },
                            { "display_name", User?.Claims?.Where(it=>it.Type=="displayname")?.FirstOrDefault()?.Value ?? "" },
                            { "profile_image_url", User?.Claims?.Where(it=>it.Type=="profileimageurl")?.FirstOrDefault()?.Value ?? "" },
                            { "ba_has_subscribed", User?.Claims?.Where(it=>it.Type=="bahassubscribed")?.FirstOrDefault()?.Value ?? "" },
                            { "login_as", User?.Claims?.Where(it=>it.Type=="loginas")?.FirstOrDefault()?.Value ?? "" },
                        };
                }
                else
                {
                    qs = new Dictionary<string, string>
                    {
                        { "status", "fail" }
                    };
                }

                // Build the result url
                var url = "mauth" + "://#" + string.Join(
                    "&",
                    qs.Where(kvp => !string.IsNullOrEmpty(kvp.Value) && kvp.Value != "-1")
                    .Select(kvp => $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}"));

                // Redirect to final url
                Request.HttpContext.Response.Redirect(url);
            }
        }

        [HttpGet("refreshtoken/{refreshToken}")]
        public async Task<RefreshTokenResponse> RefreshToken(string refreshToken)
        {
            using (var http = new HttpClient())
            {
                var disco = await http.GetDiscoveryDocumentAsync("https://pilotdeli-idp.azurewebsites.net");
                var tokenClientOptions = new TokenClientOptions
                {
                    Address = disco.TokenEndpoint,
                    ClientId = "mvc",
                    ClientSecret = "secret"
                };
                var tokenClient = new TokenClient(new HttpClient(), tokenClientOptions);
                var tokenResponse = await tokenClient.RequestRefreshTokenAsync(refreshToken);
                return new RefreshTokenResponse { AccessToken = tokenResponse.AccessToken ?? "", RefreshToken = tokenResponse.RefreshToken ?? "" };
            }
        }

        [HttpGet("logout")]
        public IActionResult Logout()
        {
            var url = "mauth" + "://#";

            return SignOut(
                new AuthenticationProperties { RedirectUri = url },
                "Cookies", "oidc");
        }

        public class RefreshTokenResponse
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
        }
    }
}
