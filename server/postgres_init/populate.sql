
-- 2 pharmacist, 4 patient, 3 doctors, 3 laboratorian
INSERT INTO person (national_id, name, surname, email, password, person_type, phone, birthday) VALUES
(1, 'mannan', 'abdul', 'mannan@gmail.com', 112233, 'patient', '+905536644231', to_date('2000-07-01', 'YYYY-MM-DD')),
(2, 'mohlaroyim', 'raupova', 'mohi@sucks.com', 223344, 'doctor', '+925984569115', to_date('2000-07-01', 'YYYY-MM-DD')),
(3, 'arnisa', 'fazla', 'fazla@gmail.com', 334455, 'laboratorian', '+905536644233', to_date('2000-07-01', 'YYYY-MM-DD')),
(4, 'atakan', 'aray', 'atakan@gmail.com', 445566, 'doctor', '+905325425145', to_date('2000-07-01', 'YYYY-MM-DD')),
(5, 'joyner', 'lucas', 'joyner@outlook.com', 556677, 'pharmacist', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(6, 'david', 'davenport', 'david@outlook.com', 667788, 'laboratorian', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(7, 'name', 'surname', 'admin@gmail.com', 667788, 'admin', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD')),
(8, 'james', 'smith', 'smith@gmail.com', 113355, 'patient', '+905536684331', to_date('2000-07-01', 'YYYY-MM-DD')),
(9, 'jane', 'doe', 'janedoe@gmail.com', 335577, 'patient', '+905585694231', to_date('2000-07-01', 'YYYY-MM-DD')),
(10, 'john', 'doe', 'johndoe@gmail.com', 557799, 'patient', '+904536424231', to_date('2000-07-01', 'YYYY-MM-DD')),
(11, 'james', 'bond', '007@outlook.com', 224466, 'pharmacist', '+906456374875', to_date('2000-07-01', 'YYYY-MM-DD')),
(12, 'nathan', 'drake', 'drake@gmail.com', 446688, 'doctor', '+905627485145', to_date('2000-07-01', 'YYYY-MM-DD')),
(13, 'solid', 'snake', 'snake@gmail.com', 668800, 'laboratorian', '+906451354875', to_date('2000-07-01', 'YYYY-MM-DD'));




INSERT INTO department (name, date_est, building) VALUES
('Oncology',to_date('2021-03-01','YYYY-MM-DD') , 'A' ),
('Cardiology',to_date('2021-03-01','YYYY-MM-DD'), 'B' ),
('Gastroenterology', to_date('2021-03-01','YYYY-MM-DD'), 'C'),
('Radiology',to_date('2021-03-01','YYYY-MM-DD'), 'B' ),
('Otolaryngology',to_date('2021-03-01','YYYY-MM-DD'), 'B' );



INSERT INTO pharmacist (national_id) VALUES
(5);


INSERT INTO doctor (national_id, room_no, department) VALUES
(2, 489, 'Oncology'),
(4, 302, 'Cardiology'),
(12, 432, 'Otolaryngology');

INSERT INTO laboratorian (national_id, department) VALUES
(3, 'Oncology'),
(6, 'Cardiology'),
(13, 'Radiology');

INSERT INTO test (test_name, department) VALUES
('blood', 'Cardiology'),
('stones', 'Gastroenterology'),
('x-ray', 'Radiology');

INSERT INTO prescription (prescription_no, prescription_type, date) VALUES
(1, 'A','2021-04-01' ),
(2, 'B', '2021-04-01');


INSERT INTO appointment (date, patient_id, doctor_id) VALUES
    (to_date('2030-04-01', 'YYYY-MM-DD'),  1, 2),
    (to_date('2030-04-03', 'YYYY-MM-DD'),  1, 4),
    (to_date('2030-04-02', 'YYYY-MM-DD'),  1, 2);

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

INSERT INTO doctor_off_days (doctor_id, date) VALUES
('2', to_date('2021-05-18', 'YYYY-MM-DD'));

INSERT INTO medicine (name, manufacturer,  stock) VALUES
('asprin', 'eczacibasi',  50),
('parol', 'eczacibasi',  50),
('paracetamol', 'ezcacibasi',  50);


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