using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TheAuthIdp.Hubs
{
    public class SendStatusHub : Hub
    {
        private readonly IConfiguration configuration;

        public SendStatusHub(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task<LoginSessionResponse> GetLoginUrl(string svcId, string flowId, string cId)
        {
            var loginHost = configuration["Login:HostUrl"];
            var dataTxt = JsonSerializer.Serialize(new { svcId, cId, flowId });
            var reqBody = new StringContent(dataTxt, Encoding.UTF8, "application/json");
            var client = new HttpClient();
            var url = $"{loginHost}/auth/login";
            var content = await client.PostAsync(url, reqBody);

            if (false == content.IsSuccessStatusCode)
            {
                return null;
            }

            var rspTxt = await content.Content.ReadAsStringAsync();
            var rsp = JsonSerializer.Deserialize<LoginSessionResponse>(rspTxt, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });
            return rsp;
        }
    }

    public class LoginSessionResponse
    {
        public string QrUrl { get; set; }
        public string LinkUrl { get; set; }
    }
}
