using System.ComponentModel.DataAnnotations;
using System.Xml.Linq;

namespace FrontEndPagoPA.Models
{
    public class CsvDto
    {
        public string nominativo { get; set; }

        public string codicefiscale { get; set; }

        public string totale { get; set; }

        public string? dataScadenzaRataUnica { get; set; }

        public string numeroRatei { get; set; }

        public string? dataScadenzaRata1 { get; set; }

        public string? dataScadenzaRata2 { get; set; }

        public string? dataScadenzaRata3 { get; set; }

        public string? dataScadenzaRata4 { get; set; }

        public string? dataScadenzaRata5 { get; set; }

        public string? dataScadenzaRata6 { get; set; }

        public string? dataScadenzaRata7 { get; set; }

        public string? dataScadenzaRata8 { get; set; }

        public string? dataScadenzaRata9 { get; set; }

        public string? dataScadenzaRata10 { get; set; }

        public string? dataScadenzaRata11 { get; set; }

        public string? dataScadenzaRata12 { get; set; }
        public string? nomeFile { get; set; }

    }
}
