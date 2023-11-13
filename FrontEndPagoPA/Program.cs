using FrontEndPagoPA.Service;
using FrontEndPagoPA.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Hosting;
using AspNetCore.Unobtrusive.Ajax;
using AutoMapper;
using FrontEndPagoPA;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
{
    options.ExpireTimeSpan = TimeSpan.FromHours(1);
    options.LoginPath = "/Home/index";
    options.AccessDeniedPath = "/auth/AccessDenied";
});


// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddMemoryCache();
builder.Services.AddHttpContextAccessor();
builder.Services.AddRazorPages().AddViewOptions(options =>
{
    options.HtmlHelperOptions.ClientValidationEnabled = true;
});

builder.Services.AddHttpClient();
builder.Services.AddHttpClient<BaseService>();
builder.Services.AddHttpClient<ActionService>();
builder.Services.AddHttpClient<AuthService>();
builder.Services.AddHttpClient<HomeService>();
builder.Services.AddHttpClient<IuvService>();

Globals.apiPagoPABase = builder.Configuration["Url:ApiPagoPA"]!;

builder.Services.AddScoped<TokenProvider>();
builder.Services.AddScoped<BaseService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ActionService>();
builder.Services.AddScoped<HomeService>();
builder.Services.AddScoped<IuvService>();

builder.Services.AddUnobtrusiveAjax();

//Automapper creation and configuration for adding it to Services.
IMapper mapper = MappingConfig.RegisterMaps().CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseUnobtrusiveAjax();

IMemoryCache cache = (IMemoryCache)app.Services.GetRequiredService(typeof(IMemoryCache));

app.MapRazorPages();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
