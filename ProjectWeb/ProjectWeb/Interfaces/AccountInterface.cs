using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Interfaces
{
   public interface AccountInterface
    {
        Task<IdentityResult> Register(RegisterViewModel registerViewModel);
        Task<ApplicationUser> UserExis(LoginModel registerViewModel);
        Task<IList<String>> GetRole(ApplicationUser ApplicationUser);
        Task<bool> LoginValid(ApplicationUser registerViewModel,string pass);
        Task<ApplicationUser> UserByID(string id);
        Task<IdentityResult> ConfirmEmail(ApplicationUser user, string code);
        Task<Boolean> IsEmailConfirmed(ApplicationUser user);
        Task<ApplicationUser> UpdateUser(string id,IFormFile file);
        void uploadphoto(ApplicationUser ApplicationUser, IFormFile file);
    }
}
