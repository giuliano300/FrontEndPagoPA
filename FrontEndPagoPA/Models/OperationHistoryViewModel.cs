namespace FrontEndPagoPA.Models
{
    public class OperationHistoryViewModel
    {
        public int operationId { get; set; }
        public DateTime date { get; set; }
        public string operationType { get; set; }
        public bool? bollettino { get; set; }
        public bool? downloadableFile { get; set; }
        public int workedInstallmentsPercentage { get; set; }
    }
}
