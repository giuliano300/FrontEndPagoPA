namespace FrontEndPagoPA.Models
{
    public class OperationHistoryViewModel
    {
        public int id { get; set; }
        public DateTime? insertDate { get; set; }
        public string? title { get; set; }
        public string? typeName { get; set; }
        public bool? bollettino { get; set; }
        public int? debtPositionCount { get; set; }
        public bool downloadableFile { get; set; }
        public int? workedInstallments { get; set; }
        public int? workedInstallmentsPercentage { get; set; }
    }
}
