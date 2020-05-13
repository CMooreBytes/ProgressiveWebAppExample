using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace PWA
{
    public class Startup
    {
        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        private async Task DataObjectsAPIHandler(HttpContext context)
        {
            context.Response.ContentType = "application/json";
            var dataObjects = JsonSerializer.Serialize(new List<DataObject>{
                new DataObject{Name = "Name 01", Description = "01"},
                new DataObject{Name = "Name 02", Description = "02"},
                new DataObject{Name = "Name 03", Description = "03"},
                new DataObject{Name = "Name 04", Description = "04"},
                new DataObject{Name = "Name 05", Description = "05"}
            });
            await context.Response.WriteAsync(dataObjects);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseHsts();

            app.UseStaticFiles(new StaticFileOptions{
                ServeUnknownFileTypes = true
            });
            app.UseRouting();

            app.UseEndpoints(endpoints =>
            { 
                endpoints.MapPost("/Step01/form", async context => await context.Response.WriteAsync("Form Submitted"));
                endpoints.MapPost("/Step02/form", async context => await context.Response.WriteAsync("Form Submitted"));
                endpoints.MapPost("/Step03/form", async context => await context.Response.WriteAsync("Form Submitted"));
                endpoints.MapPost("/Step04/form", async context => await context.Response.WriteAsync("Form Submitted"));
                endpoints.MapPost("/Step05/form", async context => await context.Response.WriteAsync("Form Submitted"));
                endpoints.MapGet("/Step01/api/data", DataObjectsAPIHandler);
                endpoints.MapGet("/Step02/api/data", DataObjectsAPIHandler);
                endpoints.MapGet("/Step03/api/data", DataObjectsAPIHandler);
                endpoints.MapGet("/Step04/api/data", DataObjectsAPIHandler);
                endpoints.MapGet("/Step05/api/data", DataObjectsAPIHandler);
            });
        }
    }
}
