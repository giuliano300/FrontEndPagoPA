using System.ComponentModel.DataAnnotations.Schema;

namespace FrontEndPagoPA.Models
{
    public class GetRendicontazioniResult
    {
        public int idOperazione { get; set; }
        public string anagraficaPagatore { get; set; }
        public string codiceFiscale { get; set; }
        public string iuv { get; set; }
        [Column("prezzo", TypeName = "decimal(12,2)")]
        public decimal? prezzo { get; set; }
        public int numeroRata { get; set; }
        public string tipoOperazione { get; set; }
        public bool? pagabile { get; set; }
        public string descrizione { get; set; }
        public DateTime dataScadenza { get; set; }
        public DateTime? dataCreazione { get; set; }
        public DateTime? paymentDate { get; set; }
        public bool? pagato { get; set; }
    }
}