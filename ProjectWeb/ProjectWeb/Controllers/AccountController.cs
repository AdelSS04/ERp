using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ProjectWeb.Data;
using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using ProjectWeb.Reposite;

namespace ProjectWeb.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {



        private readonly AccountInterface _context;
        private readonly AppSettings _appSettings;


        public AccountController(AccountInterface accountReposite, IOptions<AppSettings> appSettings)
        {
            _context = accountReposite;
            _appSettings = appSettings.Value;


        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Register(RegisterViewModel registerViewModel)
        {
            List<string> errorList = new List<string>();

            var result = await _context.Register(registerViewModel);
            if (result.Succeeded)
            {
                return Ok(new { UserName = registerViewModel.UserName, email = registerViewModel.UserEmail, status = 1, message = "Registration Successful" });

            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error.Description);
                    errorList.Add(error.Description);
                }
            }

            return BadRequest(new JsonResult(errorList));


        }

        [HttpPost("[action]/{id}")]
        public async Task<IActionResult> UpdateUser(string id)
        {
            var filess = Request.Form.Files[0];

            try
            {
                ApplicationUser user = await _context.UpdateUser(id, filess);
                if (user != null)
                    return Ok(new{profilpic = user.ProfilePicture});
                else
                    return BadRequest(new JsonResult("Bad Request !"));


            }
            catch (Exception)
            {
                return BadRequest(new JsonResult("Bad Request !"));

            }



        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Login(LoginModel registerViewModel)
        {
            var user = await _context.UserExis(registerViewModel);


            if (user != null && await _context.LoginValid(user, registerViewModel.PassWord))
            {
                if (!await _context.IsEmailConfirmed(user))
                {
                    ModelState.AddModelError(string.Empty, "User Has not Confirmed Email.");

                    return Unauthorized(new { LoginError = "We sent you an Confirmation Email. Please Confirm Your Registration With Techhowdy.com To Log in." });
                }

                var roles = await _context.GetRole(user);

                var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_appSettings.Secret));

                double tokenExpiryTime = Convert.ToDouble(_appSettings.ExpireTime);
                // Confirmation of email
                var tokenHandler = new JwtSecurityTokenHandler();

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim(JwtRegisteredClaimNames.Sub, registerViewModel.UserName),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.NameIdentifier, user.Id),
                        new Claim(ClaimTypes.Role, roles.FirstOrDefault()),
                        new Claim("LoggedOn", DateTime.Now.ToString()),

                     }),

                    SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                    Issuer = _appSettings.Site,
                    Audience = _appSettings.Audience,
                    Expires = DateTime.UtcNow.AddMinutes(tokenExpiryTime)
                };

                // Generate Token

                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { token = tokenHandler.WriteToken(token), expiration = token.ValidTo, NameUser = user.UserName, userRole = roles.FirstOrDefault(), ProfilePicture = user.ProfilePicture });

            }


            return Unauthorized(new { LoginError = "Please Check the Login Credentials - Ivalid Username/Password was entered" });



        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(code))
            {
                ModelState.AddModelError("", "User Id and Code are required");
                return BadRequest(ModelState);

            }

            var user = await _context.UserByID(userId);

            if (user == null)
            {
                return new JsonResult("ERROR");
            }

            if (user.EmailConfirmed)
            {
                return Redirect("https://angularappadel.azurewebsites.net/");
            }

            var result = await _context.ConfirmEmail(user, code);

            if (result.Succeeded)
            {
                return Redirect("https://angularappadel.azurewebsites.net/");
                //  return RedirectToAction("EmailConfirmed", "Notifications", new { userId, code });

            }
            else
            {
                List<string> errors = new List<string>();
                foreach (var error in result.Errors)
                {
                    errors.Add(error.ToString());
                }
                return new JsonResult(errors);
            }


        }
    }
}