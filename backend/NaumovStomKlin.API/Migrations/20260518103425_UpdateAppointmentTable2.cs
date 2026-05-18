using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaumovStomKlin.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date_of_birth",
                table: "Users",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_of_birth",
                table: "Users");
        }
    }
}
