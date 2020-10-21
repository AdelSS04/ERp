using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string ProfilePicture { get; set; } = "dist/img/user1-128x128.jpg";
        [NotMapped]
        public IFormFile File { get; set; }

    }
}
