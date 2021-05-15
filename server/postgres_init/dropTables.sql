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
test_result,
symptom,
test,
test_assigned_to,
doctor_off_days,
comp_result,
prescription_assigned_to;

DROP  type
app_status,
test_status,
presc_type,
person_type,
comp_status;

drop function insert1(), insert2(), insert3(), delete1(), update_status1(), update_status2(), update_status3();

DROP TRIGGER  IF EXISTS  addition1 ON person;
DROP TRIGGER  IF EXISTS  addition2 ON test_assigned_to;
DROP TRIGGER  IF EXISTS  addition3 ON test_result;
DROP TRIGGER  IF EXISTS  deletion1 ON test_assigned_to;
DROP TRIGGER  IF EXISTS  update_status1 ON comp_result;
DROP TRIGGER  IF EXISTS  update_status2 ON comp_result;
DROP TRIGGER  IF EXISTS  update_status3 ON prescribed_in;