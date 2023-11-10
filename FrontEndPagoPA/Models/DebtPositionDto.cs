namespace FrontEndPagoPA.Models
{
    public class DebtPositionDto
    {
        public int id { get; set; }
        public int operationId { get; set; }
        public string tipoIdentificativoUnivocoPagatore { get; set; }
        public string codiceIdentificativoUnivocoPagatore { get; set; }
        public string anagraficaPagatore { get; set; }
        public decimal importoTotaleDaVersare { get; set; }
        public int installmentNumber { get; set; }
        public string expirationInstallmentDate { get; set; }
        public DateTime uniqueInstallementExpirationDate { get; set; }
        public string nomeFile { get; set; }
        public bool? bollettino { get; set; }
        public string title { get; set; }
    }
}
