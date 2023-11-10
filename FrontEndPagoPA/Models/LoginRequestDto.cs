using System.ComponentModel.DataAnnotations;

namespace FrontEndPagoPA.Models
{
    public class LoginRequestDto
    {
        //[Required]
        public string userName { get; set; }
        //[Required(ErrorMessage = "La password deve essere almeno di 8 lettere.")]
        public string password { get; set; }
    }
}
