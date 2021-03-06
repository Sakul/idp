// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.


using System.ComponentModel.DataAnnotations;

namespace IdentityServerHost.Quickstart.UI
{
    public class LoginInputModel
    {
        [Required]
        public string Username { get; set; }
        //[Required]
        //public string Password { get; set; }
        [Required]
        public string BizAccountId { get; set; }
        [Required]
        public string DisplayName { get; set; }
        [Required]
        public string ProfileImageUrl { get; set; }
        [Required]
        public string BaHasSubscribed { get; set; }
        public string RefId { get; set; }
        [Required]
        public string LoginAs { get; set; }
        public bool RememberLogin { get; set; }
        public string ReturnUrl { get; set; }
    }
}