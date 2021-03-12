using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace TheAuthIdp.Hubs
{
    public class SendStatusHub : Hub
    {
        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public async Task<string> RequestLoginSessionQRUrl(string svcId, string baId, string flowId, string cId)
        {
            var dataTxt = JsonSerializer.Serialize(new { cId, flowId });
            var requestData = new StringContent(dataTxt, Encoding.UTF8, "application/json");

            var client = new HttpClient();
            //client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Content-Type", "application/json");
            var url = $"http://mana-facing-devtesting.azurewebsites.net/Auth3rd/{svcId}/{baId}/loginsession";
            var content = await client.PostAsync(url, requestData);

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
