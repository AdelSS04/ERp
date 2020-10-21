using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Mailjet.Client;
using ProjectWeb.Models;

namespace ProjectWeb.Interfaces
{
    public interface EmailSenderInterface
    {
        Task SendEmailAsync(string userEmail, string emailSubject, string message);

    }
}
