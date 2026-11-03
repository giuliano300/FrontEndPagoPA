namespace FrontEndPagoPA.Models
{
    public class EntityContractSummaryDto
    {
        public int id { get; set; }
        public string entityUserId { get; set; } = string.Empty;
        public string? entityBusinessName { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public int purchasedIuvCount { get; set; }
        public int totalPurchasedIuvCount { get; set; }
        public decimal? price { get; set; }
        public decimal? totalPrice { get; set; }
        public int totalIuvCount { get; set; }
        public int paidIuvCount { get; set; }
        public int remainingIuvCount { get; set; }
        public bool active { get; set; }
        public bool exhausted { get; set; }
        public int supplementCount { get; set; }
    }

    public class DashboardViewModel
    {
        public UserDto User { get; set; } = new();
        public EntityContractSummaryDto? Contract { get; set; }
        public bool ContractSummaryAvailable { get; set; } = true;
    }
}
