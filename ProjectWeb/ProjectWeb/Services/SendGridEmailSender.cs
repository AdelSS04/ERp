using ProjectWeb.Interfaces;
using ProjectWeb.Models;
using SendGrid.Helpers.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using SendGrid;
using ProjectWeb.Data;
using Microsoft.Extensions.Configuration;
using Mailjet.Client;
using Mailjet.Client.Resources;
using System;
using Newtonsoft.Json.Linq;

namespace ProjectWeb.Services
{
    public class SendGridEmailSender : EmailSenderInterface
    {
        private readonly AppSettings _appSettings;
        private IConfiguration _configuration;

        public SendGridEmailSender(IOptions<AppSettings> appSettings, IConfiguration configuration)
        {
            _appSettings = appSettings.Value;
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            
            MailjetClient client = new MailjetClient("34c1193f9b7cb62a83538984912b536b", "9defca4f456902995eb5f0f8df13c6a6")
            {
                Version = ApiVersion.V3_1,
            };
            MailjetRequest request = new MailjetRequest
            {
                Resource = Send.Resource,
            }
             .Property(Send.Messages, new JArray {
     new JObject {
      {
       "From",
       new JObject {
        {"Email", "lajiladel@enicar.u-carthage.tn"},
        {"Name", "Adel Lajil"}
       }
      }, {
       "To",
       new JArray {
        new JObject {
         {
          "Email",
          userEmail
         }, {
          "Name",
          "Adel"
         }
        }
       }
      }, {
       "Subject",
       emailSubject
      }, {
       "TextPart",
emailSubject
         }, {
       "HTMLPart",
message      }, {
       "CustomID",
       "AppGettingStartedTest"
      }
     }
             });
            MailjetResponse response = await client.PostAsync(request);
         

            /*  var apiKey = _configuration["SendGridApiKey"];
              var client = new SendGridClient(apiKey);
              var from = new EmailAddress("testmail@gmail.com", "Management Web Application");
              var subject = emailSubject;
              var to = new EmailAddress(userEmail, "Test Email");
              var plainTextContent = message;
              var htmlContent = message;
              var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
              var response = await client.SendEmailAsync(msg);
              return new SendEmailResponse();*/
        }

    }
}
