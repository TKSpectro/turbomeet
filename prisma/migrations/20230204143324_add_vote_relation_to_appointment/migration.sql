-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
