using FrontEndPagoPA.Models;

namespace FrontEndPagoPA.ViewModel
{
    public class StoricoOperazioniViewModel
    {
        public string? iuv { get; set; }
        public DateTime expirationDate { get; set; }
        public int? numeroRata { get; set; }
        public string? anagraficaPagatore { get; set; }
        public string? codiceIdentificativoUnivocoPagatore { get; set; }
        public double? price { get; set; }
        public string? capPagatore { get; set; }
        public string? provinciaPagatore { get; set; }
        public string? comunePagatore { get; set; }
        public string? indirizzoPagatore { get; set; }
        public string? title { get; set; }
        public int operationTypeId { get; set; }
        public string? description { get; set; }
    }
}