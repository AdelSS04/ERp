using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectWeb.Models
{
    public class ContactUs
    {
        public int ContactUsID { get; set; }
        public string Sender { get; set; }
        public string SenderMail { get; set; }
        public string Message { get; set; }
        public Boolean NewStatut { get; set; } = true;
    }
}
