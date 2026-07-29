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
        public string? dataScadenzaBollettaRataUnica { get; set; }

        public string numeroRatei { get; set; }

        public string? dataScadenzaRata1 { get; set; }
        public string? dataScadenzaBollettaRata1 { get; set; }

        public string? dataScadenzaRata2 { get; set; }
        public string? dataScadenzaBollettaRata2 { get; set; }

        public string? dataScadenzaRata3 { get; set; }
        public string? dataScadenzaBollettaRata3 { get; set; }

        public string? dataScadenzaRata4 { get; set; }
        public string? dataScadenzaBollettaRata4 { get; set; }

        public string? dataScadenzaRata5 { get; set; }
        public string? dataScadenzaBollettaRata5 { get; set; }

        public string? dataScadenzaRata6 { get; set; }
        public string? dataScadenzaBollettaRata6 { get; set; }

        public string? dataScadenzaRata7 { get; set; }
        public string? dataScadenzaBollettaRata7 { get; set; }

        public string? dataScadenzaRata8 { get; set; }
        public string? dataScadenzaBollettaRata8 { get; set; }

        public string? dataScadenzaRata9 { get; set; }
        public string? dataScadenzaBollettaRata9 { get; set; }

        public string? dataScadenzaRata10 { get; set; }
        public string? dataScadenzaBollettaRata10 { get; set; }

        public string? dataScadenzaRata11 { get; set; }
        public string? dataScadenzaBollettaRata11 { get; set; }

        public string? dataScadenzaRata12 { get; set; }
        public string? dataScadenzaBollettaRata12 { get; set; }
        public string? nomeFile { get; set; }

        public string indirizzo { get; set; }
        public string cap { get; set; }
        public string provincia { get; set; }
        public string comune { get; set; }
    }
}
