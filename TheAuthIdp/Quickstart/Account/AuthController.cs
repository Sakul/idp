using IdentityServerHost.Quickstart.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TheAuthIdp.Hubs;
using static IdentityServerHost.Quickstart.UI.AccountController;

namespace TheAuthIdp.Quickstart.Account
{
    [SecurityHeaders]
    [AllowAnonymous]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly IHubContext<SendStatusHub> hubContext;

        public AuthController(IHubContext<SendStatusHub> hubContext)
        {
            this.hubContext = hubContext;
        }

        [HttpPost]
        public async Task<ActionResult> UpdateSession([FromBody] UpdateLoginSession req)
        {
            var isRequestValid = null != req
                //&& false == string.IsNullOrWhiteSpace(req.FlowId)
                //&& false == string.IsNullOrWhiteSpace(req.SvcId)
                && false == string.IsNullOrWhiteSpace(req.SId)
                && false == string.IsNullOrWhiteSpace(req.UId)
                && false == string.IsNullOrWhiteSpace(req.BaId);
            if (false == isRequestValid)
            {
                return BadRequest("Some parameters are invalid.");
            }

            await hubContext.Clients.Client(req.SId).SendAsync("LoginStateChanged", req.IsAgree, req.IsAgree ? req : null);

            return Ok();
        }

        [HttpGet]
        public ActionResult Get()
        {
            return Content("OK");
        }
    }

    public class UpdateLoginSession
    {
        public string UId { get; set; }
        public string SId { get; set; }
        public bool IsAgree { get; set; }
        public string DisplayName { get; set; }
        public string ProfileImageUrl { get; set; }
        public string LoginAs { get; set; }
        public string RefId { get; set; }
        public string BaId { get; set; }
        public bool BaHasSubscribed { get; set; }
        public string ServiceId { get; set; }
        public string JobTitle { get; set; }
    }
}
