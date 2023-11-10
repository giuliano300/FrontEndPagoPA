using System.ComponentModel.DataAnnotations;

namespace FrontEndPagoPA.Models
{
    public class SenderUserDto
    {
        public int id { get; set; }
        public string? userId { get; set; }
        public string businessName { get; set; }
        public string identificativoDominio { get; set; }
        public string identificativoBU { get; set; }
        public string city { get; set; }
        public string cap { get; set; }
        public string province { get; set; }
        public string address { get; set; }
        public string logo { get; set; }
        public bool? contoPoste { get; set; }
        public bool? contoBanca { get; set; }
    }
}
