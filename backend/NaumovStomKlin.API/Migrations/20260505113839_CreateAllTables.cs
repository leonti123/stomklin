using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaumovStomKlin.API.Migrations
{
    /// <inheritdoc />
    public partial class CreateAllTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Procedurs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Procedurs", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Rols",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rols", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Appointment_procedurs",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    appointment_id = table.Column<int>(type: "int", nullable: false),
                    appointmentId = table.Column<int>(type: "int", nullable: false),
                    procedure_id = table.Column<int>(type: "int", nullable: false),
                    procedureid = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointment_procedurs", x => x.id);
                    table.ForeignKey(
                        name: "FK_Appointment_procedurs_Appointments_appointmentId",
                        column: x => x.appointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Appointment_procedurs_Procedurs_procedureid",
                        column: x => x.procedureid,
                        principalTable: "Procedurs",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_role_id",
                table: "Users",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_doctor_id",
                table: "Appointments",
                column: "doctor_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_user_id",
                table: "Appointments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_procedurs_appointmentId",
                table: "Appointment_procedurs",
                column: "appointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointment_procedurs_procedureid",
                table: "Appointment_procedurs",
                column: "procedureid");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_doctor_id",
                table: "Appointments",
                column: "doctor_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_user_id",
                table: "Appointments",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Rols_role_id",
                table: "Users",
                column: "role_id",
                principalTable: "Rols",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_doctor_id",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_user_id",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Rols_role_id",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Appointment_procedurs");

            migrationBuilder.DropTable(
                name: "Rols");

            migrationBuilder.DropTable(
                name: "Procedurs");

            migrationBuilder.DropIndex(
                name: "IX_Users_role_id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_doctor_id",
                table: "Appointments");

            migrationBuilder.DropIndex(
                name: "IX_Appointments_user_id",
                table: "Appointments");
        }
    }
}
