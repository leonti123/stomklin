using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaumovStomKlin.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentTable123 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "password_hash",
                table: "Users");
        }
    }
}
