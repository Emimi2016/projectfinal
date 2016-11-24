// Medical Records
// Doctor: write / read on all patients medical record
// Patient: read - but write on Vaccinations, Notes in progress, Allergies
// 1. Patients problems
// 2. Active Medications
// 3. Vaccinations
// 4. Surgical history
// 5. Notes in progress
// 6. vitals data
// 7. Other documents (txt, pdf, word, etc...)
// 8. Clinical notes (txt, pdf, word, etc...)
// 9. Allergies
// 10. Radiology results


Meteor.publish('medicalRecords', function() {
    return MedicalRecords.find(
        {$or: [
        {'patient.patientId': this.userId},
        {'doctor.doctorId': this.userId}
    ]}
);
});
