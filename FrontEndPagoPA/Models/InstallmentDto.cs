namespace FrontEndPagoPA.Models
{
    public class InstallmentDto
    {
        public int id { get; set; }
        public int debtPositionId { get; set; }
        public DateTime expirationDate { get; set; }
        public decimal? price { get; set; }
        public bool valid { get; set; }
        public bool worked { get; set; }
        public bool? paid { get; set; }
        public string codiceAvviso { get; set; }
        public int numeroRata { get; set; }
        public string iuv { get; set; }
        public string title { get; set; }
        public string description { get; set; }
    }
}
