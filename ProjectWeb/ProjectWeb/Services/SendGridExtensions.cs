using Microsoft.Extensions.DependencyInjection;
using ProjectWeb.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Services
{
    public static class SendGridExtensions
    {
        public static IServiceCollection AddSendGridEmailSender(this IServiceCollection services)
        {
            services.AddTransient<EmailSenderInterface, SendGridEmailSender>();

            return services;
        }
    }
}
