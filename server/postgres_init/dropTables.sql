DROP TABLE
appointment,
component,
department,
diagnosis,
disease,
disease_symptoms,
doctor,
laboratorian,
medicine,
patient,
patient_symptoms,
person,
pharmacist,
prescribed_by,
prescribed_in,
prescription,
result,
symptom,
test,
test_performed_by,
doctor_off_days    ;

DROP  type
app_status,
test_status,
person_type;

drop function insert1();

DROP TRIGGER  IF EXISTS  addition ON person