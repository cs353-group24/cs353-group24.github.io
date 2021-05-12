

INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES
(1, 'mannan', 'abdul', 'mannan@gmail.com', 112233, 'patient', '+905536644231', '2000-07-01'),
(2, 'mohlaroyim', 'raupova', 'mohi@sucks.com', 223344, 'doctor', '+925984569115', '2000-07-01'),
(3, 'arnisa', 'fazla', 'fazla@gmail.com', 334455, 'laboratorian', '+905536644233', '2000-12-01'),
(4, 'atakan', 'aray', 'atakan@gmail.com', 445566, 'doctor', '+905325425145', '2000-12-01'),
(5, 'joyner', 'lucas', 'joyner@outlook.com', 556677, 'pharmacist', '+906451354875', '2000-12-01'),
(6, 'david', 'davenport', 'david@outlook.com', 667788, 'laboratorian', '+906451354875', '2000-12-01');

INSERT INTO department (name, date_est, building) VALUES
('Computer Science','2021-03-01', 'A' ),
('Cardiology','2021-03-01', 'B' );


INSERT INTO pharmacist (national_id) VALUES
(5);


INSERT INTO doctor (national_id, room_no, department) VALUES
(2, 489, 'Computer Science'),
(4, 302, 'Cardiology');

INSERT INTO laboratorian (national_id, department) VALUES
(3, 'Computer Science'),
(6, 'Cardiology');

INSERT INTO test (test_name) VALUES
('blood'),
('stones'),
('x-ray');

INSERT INTO prescription (prescription_no, prescription_type, date) VALUES
(1, 'A','2021-04-01' ),
(2, 'B', '2021-04-01');


INSERT INTO appointment (date, patient_id, doctor_id) VALUES
    ('2030-04-01',  1, 2),
    ('2030-04-03',  1, 4),
    ('2030-04-02',  1, 2);

INSERT INTO component (test_name, comp_name, upper_normality_interval, lower_normality_interval) VALUES
    ('blood', 'calcium', 0, 25),
    ('blood', 'Iron', 0, 50),
    ('blood', 'type', NULL, NULL),
    ('stones', 'blood in urine', 0, 2),
    ('stones', 'protien', 0, 3),
    ('x-ray', 'x-ray', NULL, NULL);


INSERT INTO prescribed_by (prescription_no, appointment_id) VALUES
    (1, 1),
    (2, 2);

INSERT INTO symptom (name, description) VALUES
('chronic cough', 'can be result of: smoking, chronic bronchitis, common colds, flu, emphysema, dry mouth, asthma, allergies.'),
('heartburn', 'Heartburn occurs when stomach acid backs up into the tube that carries food from your mouth to your stomach (esophagus).'),
('nausea', 'gastrointestinal disorders, food poisoning, motion sickness, dizziness, migraine, fainting, low blood sugar ');

INSERT INTO test_assigned_to (appointment_id, laboratorian_id, test_name) VALUES
(1, 3, 'blood'),
(1, 3, 'stones'),
(1, 3, 'x-ray'),
(2, 3, 'blood');

INSERT INTO disease (name, description) VALUES
('flu', 'infectious disease caused by influenza viruses'),
('GERD', 'Gastroesophageal reflux, a digestive disorder that affects the ring of muscle between your esophagus and your stomach');

INSERT INTO disease_symptoms (disease_name, symptom_name) VALUES
('flu', 'chronic cough'),
('GERD', 'chronic cough'),
('GERD', 'heartburn');

INSERT INTO diagnosis (appointment_id, disease_name, description) VALUES
('1', 'GERD','need to drink less coke'),
('2', 'flu', 'weak immunity');

INSERT INTO patient_symptoms (appointment_id, symptom_name) VALUES
('1', 'heartburn'),
('2', 'chronic cough'),
('1', 'nausea');

INSERT INTO doctor_off_day (doctor_id, date) VALUES
('2', '2021-05-18')
/*

INSERT INTO result (test_name, comp_name, result_id, result_date, appointment_id, test_comp_value, test_comp_result, status) VALUES
    ('blood', 'calcium', 1, '2021-04-02 00:08:11', 1, '5', 'Normal', 'finalized'),
    ('blood', 'Iron', 2, '2021-04-02 00:08:47', 1, '5', 'Normal', 'finalized'),
    ('blood', 'type', 3, '2021-04-02 00:09:21', 1, 'A-', NULL, 'finalized'),
    ('stones', 'blood in urine', 4, '2021-04-02 00:10:02', 1, '5', 'High', 'finalized'),
    ('stones', 'protien', 5, '2021-04-02 00:10:26', 1, '35', 'You should be dead', 'finalized'),
    ('x-ray', 'x-ray', 6, '2021-04-02 00:10:44', 1, 'Clean', NULL, 'finalized'),
    ('blood', 'calcium', 7, '2021-04-02 00:11:14', 2, '15', 'High', 'finalized'),
    ('blood', 'Iron', 8, '2021-04-02 00:11:39', 2, '35', 'You should be dead', 'finalized'),
    ('blood', 'type', 9, '2021-04-02 00:11:51', 2, 'A-', NULL, 'finalized');


 */