using FrontEndPagoPA.Models;

namespace FrontEndPagoPA.ViewModel
{
    public class OperationViewModel
    {
        public string title { get; set; }
        public string userId { get; set; }
        public int senderUserId { get; set; }
        public int operationType { get; set; }
        public bool bollettino { get; set; }
        public List<DebtPositionDto>? debtPositions { get; set; } = new List<DebtPositionDto>();
    }
}
