using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NaumovStomKlin.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAppointmentTable1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_procedurs_Appointments_appointmentId",
                table: "Appointment_procedurs");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_user_id",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Appointments",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "Appointments",
                newName: "patient_id");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Appointments",
                newName: "appointment_date");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_user_id",
                table: "Appointments",
                newName: "IX_Appointments_patient_id");

            migrationBuilder.RenameColumn(
                name: "appointmentId",
                table: "Appointment_procedurs",
                newName: "appointmentid");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_procedurs_appointmentId",
                table: "Appointment_procedurs",
                newName: "IX_Appointment_procedurs_appointmentid");

            migrationBuilder.AlterColumn<int>(
                name: "appointmentid",
                table: "Appointment_procedurs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_procedurs_Appointments_appointmentid",
                table: "Appointment_procedurs",
                column: "appointmentid",
                principalTable: "Appointments",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_patient_id",
                table: "Appointments",
                column: "patient_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointment_procedurs_Appointments_appointmentid",
                table: "Appointment_procedurs");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_Users_patient_id",
                table: "Appointments");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Appointments",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "patient_id",
                table: "Appointments",
                newName: "user_id");

            migrationBuilder.RenameColumn(
                name: "appointment_date",
                table: "Appointments",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_patient_id",
                table: "Appointments",
                newName: "IX_Appointments_user_id");

            migrationBuilder.RenameColumn(
                name: "appointmentid",
                table: "Appointment_procedurs",
                newName: "appointmentId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointment_procedurs_appointmentid",
                table: "Appointment_procedurs",
                newName: "IX_Appointment_procedurs_appointmentId");

            migrationBuilder.AlterColumn<int>(
                name: "appointmentId",
                table: "Appointment_procedurs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointment_procedurs_Appointments_appointmentId",
                table: "Appointment_procedurs",
                column: "appointmentId",
                principalTable: "Appointments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_Users_user_id",
                table: "Appointments",
                column: "user_id",
                principalTable: "Users",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
