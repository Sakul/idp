using Microsoft.AspNetCore.SignalR;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TheAuthIdp.Hubs
{
    public class SendStatusHub : Hub
    {
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task<string> GetLoginUrl(string svcId, string flowId, string cId)
        {
            var dataTxt = JsonSerializer.Serialize(new { cId, flowId });
            var reqBody = new StringContent(dataTxt, Encoding.UTF8, "application/json");
            var client = new HttpClient();
            var url = $"http://mana-facing-devtesting.azurewebsites.net/auth3rd/{svcId}/login";
            var content = await client.PostAsync(url, reqBody);

            var qrLink = string.Empty;
            if (content.IsSuccessStatusCode)
            {
                var rspTxt = await content.Content.ReadAsStringAsync();
                var rsp = JsonSerializer.Deserialize<LoginSessionResponse>(rspTxt);
                qrLink = rsp.url;
            }

            return qrLink;
        }
    }

    public class LoginSessionResponse
    {
        public string url { get; set; }
    }
}
