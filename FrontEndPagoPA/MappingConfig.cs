using AutoMapper;
using FrontEndPagoPA.Models;

namespace FrontEndPagoPA
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var mappingConfig = new MapperConfiguration(config =>
            {
                config.CreateMap<CsvDtoOut, CsvDtoIn>();
                config.CreateMap<CsvDtoIn, CsvDtoOut>();
            });
            return mappingConfig;
        }
    }
}

