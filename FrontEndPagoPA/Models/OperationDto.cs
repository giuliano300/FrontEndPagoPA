namespace FrontEndPagoPA.Models
{
    public class OperationDto
    {
        public int id { get; set; }
        public int operationTypeId { get; set; }
        public string userId { get; set; }
        public int senderUserId { get; set; }
        public DateTime insertDate { get; set; }
        public bool bollettino { get; set; }
        public string code { get; set; }
        public int serviceIdentifier { get; set; }
        public OperationDto()
        {
            id = 0;
            userId = "";
            operationTypeId = 0;
            senderUserId = 0;
            bollettino = false;
            code = "";
            serviceIdentifier = 0;
        }
    }
}
