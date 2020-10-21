using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Options;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ProjectWeb.Reposite
{
    public class AccountReposite : AccountInterface
    {
      
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly SignInManager<ApplicationUser> _signManager;
        private readonly AppSettings _appSettings;
        private EmailSenderInterface _emailsender;
        private IHostingEnvironment host;

        public AccountReposite(UserManager<ApplicationUser> userManager, IHostingEnvironment hostEnv, SignInManager<ApplicationUser> signInManager, IOptions<AppSettings> appSettings, EmailSenderInterface emailsender)
        {
            _userManager = userManager;
            _signManager = signInManager;
            _appSettings = appSettings.Value;
            _emailsender = emailsender;
            host = hostEnv;
        }
      async  public Task<ApplicationUser > UpdateUser(string  id, IFormFile file)
        {
            // _userManager.Entry(formdata).State = EntityState.Modified;
            ApplicationUser user = UserByID(id).Result;
            uploadphoto(user,file);
            IdentityResult result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            return user;
            else 
            return null ;

        }
        public void uploadphoto(ApplicationUser ApplicationUser, IFormFile file)
        {
            if (ApplicationUser.File == null)
            {
                string upFlod = Path.Combine(host.WebRootPath);
                string uniqname = Guid.NewGuid() + ".jpg";
                string filapath = Path.Combine(upFlod, uniqname);
                using (var fileS = new FileStream(filapath, FileMode.Create))
                {
                    file.CopyTo(fileS);
                }
                ApplicationUser.ProfilePicture = uniqname;
            }
        }
        public async Task<IdentityResult> Register(RegisterViewModel registerViewModel)
        {
            var user = new ApplicationUser
            {
                Email = registerViewModel.UserEmail,
                UserName = registerViewModel.UserName,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, registerViewModel.PassWord);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Customer");

                // Sending Confirmation Email
                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                var codeEncoded = HttpUtility.UrlEncode(code);

                var callbackUrl = "https://angularappadel.azurewebsites.net/api/account/ConfirmEmail?userId=" + user.Id + "&code=" + codeEncoded;


                await _emailsender.SendEmailAsync(user.Email, "AdelERP- Confirm Your Email", "Please confirm your e-mail by clicking this link: <a href=\"" + callbackUrl + "\">click here</a>");

                return result;

            }
            return result;

        }

        public async Task<ApplicationUser> UserExis(LoginModel registerViewModel)
        {
            var user = await _userManager.FindByNameAsync(registerViewModel.UserName);
            return user;
        }
        public async Task<ApplicationUser> UserByID(string id)
        {
            var user = await _userManager.FindByNameAsync(id);
            return user;
        }

        public async Task<IdentityResult> ConfirmEmail(ApplicationUser user ,string code)
        {
            var userr = await _userManager.ConfirmEmailAsync(user,code);
            return userr;
        }

        public async Task<Boolean> IsEmailConfirmed(ApplicationUser user)
        {
            var userr = await _userManager.IsEmailConfirmedAsync(user);
            return userr;
        }
        public async Task<IList<String>>  GetRole(ApplicationUser ApplicationUser)
        {
            var roles = await _userManager.GetRolesAsync(ApplicationUser);
            return roles;
        }

        public async Task<bool> LoginValid(ApplicationUser registerViewModel, string pass)
        {
            var IsUserValide = await _userManager.CheckPasswordAsync(registerViewModel, pass);
            return IsUserValide;
        }
    }

}