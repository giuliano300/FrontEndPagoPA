using System.ComponentModel.DataAnnotations.Schema;

namespace FrontEndPagoPA.Models
{
    public partial class GetInstallmentsResult
    {
        public int id { get; set; }
        public string? anagraficaPagatore { get; set; }
        public string? codiceIdentificativoUnivocoPagatore { get; set; }
        public string? iuv { get; set; }
        public decimal? price { get; set; }
        public bool? valid { get; set; }
        public int numeroRata { get; set; }
        public DateTime expirationDate { get; set; }
        public bool? paid { get; set; }
        public int operationTypeId { get; set; }
        public string description { get; set; }
    }
}
